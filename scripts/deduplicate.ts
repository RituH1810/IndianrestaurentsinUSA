/**
 * Script 2/10 — deduplicate.ts
 * Finds restaurants with the same normalised name + city and merges them,
 * keeping the row with the most non-null fields. Run with:
 *   npx tsx scripts/deduplicate.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function normalise(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function countNonNull(r: Record<string, unknown>): number {
  return Object.values(r).filter(v => v != null && v !== '').length;
}

async function main() {
  const all = await prisma.restaurant.findMany();
  console.log(`Total restaurants: ${all.length}`);

  const groups = new Map<string, typeof all>();
  for (const r of all) {
    const key = `${normalise(r.name)}-${normalise(r.city)}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(r);
  }

  let merged = 0;
  for (const [key, group] of Array.from(groups)) {
    if (group.length <= 1) continue;

    group.sort((a: Record<string, unknown>, b: Record<string, unknown>) => countNonNull(b) - countNonNull(a));
    const [keep, ...dupes] = group;

    const merged_data = Object.fromEntries(
      Object.keys(keep).map(k => {
        const kk = k as keyof typeof keep;
        if (keep[kk] != null) return [k, keep[kk]];
        for (const dupe of dupes) {
          if (dupe[kk] != null) return [k, dupe[kk]];
        }
        return [k, null];
      }),
    );

    await prisma.restaurant.update({
      where: { id: keep.id },
      data: {
        description: merged_data.description as string | null,
        cuisine_tags: merged_data.cuisine_tags as string | null,
        dietary_tags: merged_data.dietary_tags as string | null,
        photo: merged_data.photo as string | null,
        website: merged_data.website as string | null,
        phone: merged_data.phone as string | null,
      },
    });

    for (const dupe of dupes) {
      await prisma.restaurant.delete({ where: { id: dupe.id } });
    }

    console.log(`Merged ${group.length} duplicates for: ${key}`);
    merged += dupes.length;
  }

  console.log(`\nDone! Removed ${merged} duplicate rows.`);
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
