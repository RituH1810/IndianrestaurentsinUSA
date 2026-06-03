/**
 * Script 10/10 — initial-publish.ts
 * Marks the top N restaurants by priority score as is_published = true.
 * Default: publish top 2000 (or all, if fewer exist).
 * Run with:  npx tsx scripts/initial-publish.ts
 *        or: npx tsx scripts/initial-publish.ts 500
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const N = parseInt(process.argv[2] ?? '2000', 10);

  const total = await prisma.restaurant.count();
  const toPublish = Math.min(N, total);

  console.log(`Publishing top ${toPublish} of ${total} restaurants by priority score…`);

  // Reset all
  await prisma.restaurant.updateMany({ data: { is_published: false } });

  // Publish top N
  const top = await prisma.restaurant.findMany({
    orderBy: { publish_priority: 'desc' },
    take: toPublish,
    select: { id: true },
    where: { business_status: 'OPERATIONAL' },
  });

  const ids = top.map(r => r.id);
  await prisma.restaurant.updateMany({
    where: { id: { in: ids } },
    data: { is_published: true },
  });

  const published = await prisma.restaurant.count({ where: { is_published: true } });
  console.log(`Done! ${published} restaurants are now published.`);
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
