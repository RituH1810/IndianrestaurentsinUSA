/**
 * Script 7/10 — generate-slugs.ts
 * Re-generates clean URL slugs for all restaurants (strips apostrophes BEFORE
 * hyphenating, per the playbook). Also flags is_hidden_gem.
 * Run with:  npx tsx scripts/generate-slugs.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function makeSlug(name: string, city: string): string {
  const clean = (s: string) =>
    s.toLowerCase().replace(/'/g, '').replace(/[^a-z0-9\s]/g, '').trim().replace(/\s+/g, '-');
  return `${clean(name)}-${clean(city)}`;
}

async function ensureUniqueSlug(base: string, excludeId: string): Promise<string> {
  let slug = base;
  let counter = 1;
  while (true) {
    const conflict = await prisma.restaurant.findFirst({
      where: { slug, NOT: { id: excludeId } },
    });
    if (!conflict) return slug;
    slug = `${base}-${counter++}`;
  }
}

async function main() {
  const restaurants = await prisma.restaurant.findMany({
    select: { id: true, name: true, city: true, slug: true, rating: true, reviews: true, business_status: true },
  });

  console.log(`Processing ${restaurants.length} restaurants…`);

  let updated = 0;
  for (const r of restaurants) {
    const baseSlug = makeSlug(r.name, r.city);
    const slug = await ensureUniqueSlug(baseSlug, r.id);

    const is_hidden_gem =
      (r.rating ?? 0) >= 4.5 &&
      (r.reviews ?? 0) < 200 &&
      r.business_status === 'OPERATIONAL';

    if (slug !== r.slug || is_hidden_gem !== false) {
      await prisma.restaurant.update({ where: { id: r.id }, data: { slug, is_hidden_gem } });
      updated++;
    }
  }

  const gems = await prisma.restaurant.count({ where: { is_hidden_gem: true } });
  console.log(`Done! Updated ${updated} slugs. Hidden gems found: ${gems}`);
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
