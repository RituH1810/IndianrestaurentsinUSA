/**
 * keyword-tag.ts — Keyword-based cuisine & dietary tagging (no API key needed)
 * Scans name, description, and reviews_tags for known keywords.
 * Run: npx tsx scripts/keyword-tag.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const BATCH_SIZE = 200;

// ── Cuisine rules ─────────────────────────────────────────────────────────────
// Each rule: [tag, keywords[]] — first match wins for primary tag, multiple can match
const CUISINE_RULES: [string, string[]][] = [
  ['hyderabadi',    ['hyderabadi', 'hyderabad', 'haleem', 'dum biryani']],
  ['south-indian',  ['south indian', 'dosa', 'idli', 'sambar', 'vada', 'uttapam', 'rasam', 'appam', 'udupi', 'tamil', 'andhra', 'chettinad', 'kerala', 'malabar']],
  ['punjabi',       ['punjabi', 'chole bhature', 'chole bature', 'sarson', 'amritsari', 'makki', 'dhaba']],
  ['gujarati',      ['gujarati', 'kathiyawadi', 'dhokla', 'farsan', 'undhiyu', 'khakhra', 'thali']],
  ['bengali',       ['bengali', 'bengal', 'mishti', 'kosha mangsho', 'hilsa', 'rosogolla']],
  ['mughlai',       ['mughlai', 'rogan josh', 'nihari', 'awadhi', 'lucknowi', 'nawabi', 'galouti', 'seekh']],
  ['rajasthani',    ['rajasthani', 'rajasthan', 'dal baati', 'gatte', 'laal maas', 'ker sangri']],
  ['maharashtrian', ['maharashtrian', 'maharashtra', 'misal', 'puran poli', 'thalipeeth', 'kolhapuri']],
  ['indo-chinese',  ['indo chinese', 'indo-chinese', 'manchurian', 'hakka', 'schezwan', 'szechuan', 'chilli chicken', 'chili chicken']],
  ['chaat',         ['chaat', 'pani puri', 'bhel puri', 'bhel', 'vada pav', 'pav bhaji', 'ragda', 'street food', 'dabeli']],
  ['north-indian',  ['north indian', 'butter chicken', 'dal makhani', 'tikka masala', 'paneer', 'naan', 'tandoori', 'curry']],
];

// ── Dietary rules ─────────────────────────────────────────────────────────────
const DIETARY_RULES: [string, string[]][] = [
  ['pure-veg',     ['pure veg', 'pure vegetarian', '100% veg', '100 percent veg', 'all veg', 'only veg', 'strictly veg', 'no meat']],
  ['vegan',        ['vegan']],
  ['jain',         ['jain', 'no onion no garlic', 'no onion', 'no garlic', 'jain friendly', 'jain food']],
  ['halal',        ['halal', 'zabiha', 'zabeha', 'halaal']],
  ['gluten-free',  ['gluten free', 'gluten-free', 'gluten intolerance', 'coeliac', 'celiac']],
];

function normalise(s: string | null | undefined): string {
  return (s ?? '').toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
}

function matchTags(text: string, rules: [string, string[]][]): string[] {
  const matched: string[] = [];
  for (const [tag, keywords] of rules) {
    if (keywords.some(kw => text.includes(kw))) {
      matched.push(tag);
    }
  }
  return matched;
}

async function main() {
  const total = await prisma.restaurant.count();
  console.log(`Processing ${total} restaurants…\n`);

  let cuisineTagged = 0;
  let dietaryTagged = 0;
  let processed = 0;

  for (let offset = 0; offset < total; offset += BATCH_SIZE) {
    const rows = await prisma.restaurant.findMany({
      skip: offset,
      take: BATCH_SIZE,
      select: { id: true, name: true, description: true, reviews_tags: true, cuisine_tags: true, dietary_tags: true },
    });

    for (const row of rows) {
      const text = normalise([row.name, row.description, row.reviews_tags].join(' '));

      const cuisineTags = matchTags(text, CUISINE_RULES);
      const dietaryTags = matchTags(text, DIETARY_RULES);

      const newCuisine = cuisineTags.length > 0 ? cuisineTags.join('|') : null;
      const newDietary = dietaryTags.length > 0 ? dietaryTags.join('|') : null;

      // Only update if we found something new
      const cuisineChanged = newCuisine !== null && newCuisine !== row.cuisine_tags;
      const dietaryChanged = newDietary !== null && newDietary !== row.dietary_tags;

      if (cuisineChanged || dietaryChanged) {
        await prisma.restaurant.update({
          where: { id: row.id },
          data: {
            ...(cuisineChanged ? { cuisine_tags: newCuisine } : {}),
            ...(dietaryChanged ? { dietary_tags: newDietary } : {}),
          },
        });
        if (cuisineChanged) cuisineTagged++;
        if (dietaryChanged) dietaryTagged++;
      }
    }

    processed += rows.length;
    process.stdout.write(`\r  Progress: ${processed}/${total} | cuisine tagged: ${cuisineTagged} | dietary tagged: ${dietaryTagged}`);
  }

  console.log(`\n\nDone!`);
  console.log(`  Cuisine tags applied: ${cuisineTagged}`);
  console.log(`  Dietary tags applied: ${dietaryTagged}`);
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
