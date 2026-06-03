/**
 * Script 8/10 — build-search-index.ts
 * Adds a tsvector column and GIN index for full-text search.
 * This is POSTGRES-ONLY — it will skip gracefully on SQLite.
 * Run with:  npx tsx scripts/build-search-index.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Detect SQLite — tsvector is Postgres-only
  const url = process.env.DATABASE_URL ?? '';
  if (!url.startsWith('postgresql') && !url.startsWith('postgres')) {
    console.log('SQLite detected — skipping tsvector index (Postgres-only).');
    console.log('This script will run automatically after you switch to Supabase.');
    return;
  }

  console.log('Adding tsvector column and GIN index to Restaurant…');

  await prisma.$executeRawUnsafe(`
    ALTER TABLE "Restaurant"
    ADD COLUMN IF NOT EXISTS search_vector tsvector
    GENERATED ALWAYS AS (
      to_tsvector('english',
        coalesce(name, '') || ' ' ||
        coalesce(cuisine_tags, '') || ' ' ||
        coalesce(city, '') || ' ' ||
        coalesce(state, '') || ' ' ||
        coalesce(description, '')
      )
    ) STORED;
  `);

  await prisma.$executeRawUnsafe(`
    CREATE INDEX IF NOT EXISTS restaurant_search_idx
    ON "Restaurant" USING GIN (search_vector);
  `);

  console.log('Done! Full-text search index created.');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
