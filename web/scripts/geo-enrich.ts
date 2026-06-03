/**
 * Script 3/10 — geo-enrich.ts
 * Assigns metro area from city name and derives 2-letter state abbreviation.
 * Run with:  npx tsx scripts/geo-enrich.ts
 */

import { PrismaClient } from '@prisma/client';
import { METRO_LOOKUP } from '../lib/metro-lookup';
import { STATE_ABBREVIATIONS } from '../lib/utils';

const prisma = new PrismaClient();

async function main() {
  const restaurants = await prisma.restaurant.findMany({
    where: { OR: [{ metro: null }, { state_abbr: null }] },
    select: { id: true, city: true, state: true, metro: true, state_abbr: true },
  });

  console.log(`Enriching ${restaurants.length} restaurants…`);

  let enriched = 0;
  for (const r of restaurants) {
    const metro = METRO_LOOKUP[r.city] ?? null;
    const state_abbr = STATE_ABBREVIATIONS[r.state] ?? null;

    if (metro !== r.metro || state_abbr !== r.state_abbr) {
      await prisma.restaurant.update({
        where: { id: r.id },
        data: { metro, state_abbr },
      });
      enriched++;
    }
  }

  console.log(`Done! Enriched ${enriched} restaurants with metro/state_abbr.`);
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
