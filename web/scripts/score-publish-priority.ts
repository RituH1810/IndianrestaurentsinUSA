/**
 * Script 9/10 — score-publish-priority.ts
 * Computes a 0-100 publish priority score per restaurant (see Section 4.2 of
 * the playbook). Higher scores get published first.
 * Run with:  npx tsx scripts/score-publish-priority.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function computeScore(r: {
  rating: number | null;
  reviews: number | null;
  cuisine_tags: string | null;
  dietary_tags: string | null;
  is_hidden_gem: boolean;
  photo: string | null;
  description: string | null;
  working_hours: string | null;
  website: string | null;
}): number {
  let score = 0;

  // Rating (max 30)
  const rating = r.rating ?? 0;
  if (rating >= 4.7) score += 30;
  else if (rating >= 4.5) score += 24;
  else if (rating >= 4.3) score += 18;
  else if (rating >= 4.0) score += 10;

  // Review count (max 20)
  const reviews = r.reviews ?? 0;
  if (reviews >= 1000) score += 20;
  else if (reviews >= 500) score += 16;
  else if (reviews >= 200) score += 12;
  else if (reviews >= 100) score += 8;
  else if (reviews >= 50) score += 4;

  // Cuisine classified (15)
  if (r.cuisine_tags) score += 15;

  // Dietary tags (3 per tag, max 12)
  if (r.dietary_tags) {
    const tagCount = r.dietary_tags.split('|').filter(Boolean).length;
    score += Math.min(tagCount * 3, 12);
  }

  // Hidden gem bonus (8)
  if (r.is_hidden_gem) score += 8;

  // Data completeness (max 12)
  if (r.photo) score += 5;
  if (r.description) score += 3;
  if (r.working_hours) score += 2;
  if (r.website) score += 2;

  return Math.min(score, 100);
}

async function main() {
  const restaurants = await prisma.restaurant.findMany({
    select: {
      id: true, rating: true, reviews: true, cuisine_tags: true,
      dietary_tags: true, is_hidden_gem: true, photo: true,
      description: true, working_hours: true, website: true,
    },
  });

  console.log(`Scoring ${restaurants.length} restaurants…`);

  for (const r of restaurants) {
    const publish_priority = computeScore(r);
    await prisma.restaurant.update({ where: { id: r.id }, data: { publish_priority } });
  }

  // Show distribution
  const dist = await prisma.restaurant.groupBy({
    by: ['publish_priority'],
    _count: true,
    orderBy: { publish_priority: 'desc' },
  });

  console.log('\nTop scores:');
  dist.slice(0, 10).forEach(d => console.log(`  Score ${d.publish_priority}: ${d._count} restaurants`));
  console.log('\nDone!');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
