/**
 * Script 1/10 — ingest.ts
 * Reads the Outscraper Excel file from the parent directory and upserts all
 * restaurants into the database via Prisma. Run with:
 *   npx tsx scripts/ingest.ts
 */

import * as XLSX from 'xlsx';
import * as path from 'path';
import * as fs from 'fs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const BATCH_SIZE = 100;

function findExcelFile(): string {
  // Look in data/ directory at the project root (alongside scripts/, app/, etc.)
  const dataDir = path.join(__dirname, '..', 'data');
  const rootDir = path.join(__dirname, '..');
  const searchDir = fs.existsSync(dataDir) ? dataDir : rootDir;
  const files = fs.readdirSync(searchDir);
  const xlsx = files.find(f => f.endsWith('.xlsx') || f.endsWith('.xls'));
  if (!xlsx) throw new Error(`No Excel file found in ${searchDir}`);
  const p = path.join(searchDir, xlsx);
  console.log(`Found data file: ${p}`);
  return p;
}

function normaliseRow(row: Record<string, unknown>) {
  return {
    name: String(row.name ?? '').trim(),
    address: String(row.address ?? '').trim(),
    street: row.street ? String(row.street).trim() : null,
    city: String(row.city ?? '').trim(),
    state: String(row.state ?? '').trim(),
    county: row.county ? String(row.county).trim() : null,
    latitude: row.latitude != null ? Number(row.latitude) : null,
    longitude: row.longitude != null ? Number(row.longitude) : null,
    phone: row.phone ? String(row.phone).trim() : null,
    website: row.website ? String(row.website).trim() : null,
    rating: row.rating != null ? Number(row.rating) : null,
    reviews: row.reviews != null ? Math.round(Number(row.reviews)) : null,
    photo: row.photo ? String(row.photo).trim() : null,
    street_view: row.street_view ? String(row.street_view).trim() : null,
    working_hours: row.working_hours ? String(row.working_hours) : null,
    business_status: row.business_status ? String(row.business_status).trim() : 'OPERATIONAL',
    description: row.description ? String(row.description).trim() : null,
    located_in: row.located_in ? String(row.located_in).trim() : null,
    reviews_tags: row.reviews_tags ? String(row.reviews_tags).trim() : null,
  };
}

function makeSlug(name: string, city: string): string {
  const clean = (s: string) =>
    s.toLowerCase().replace(/'/g, '').replace(/[^a-z0-9\s]/g, '').trim().replace(/\s+/g, '-');
  return `${clean(name)}-${clean(city)}`;
}

async function ensureUniqueSlug(base: string): Promise<string> {
  let slug = base;
  let counter = 1;
  while (await prisma.restaurant.findUnique({ where: { slug } })) {
    slug = `${base}-${counter++}`;
  }
  return slug;
}

async function main() {
  const filePath = findExcelFile();
  const workbook = XLSX.readFile(filePath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet);

  console.log(`Read ${rows.length} rows from Excel`);

  let inserted = 0;
  let updated = 0;
  let skipped = 0;

  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch = rows.slice(i, i + BATCH_SIZE);

    for (const row of batch) {
      const data = normaliseRow(row);

      if (!data.name || !data.city) {
        skipped++;
        continue;
      }

      const baseSlug = makeSlug(data.name, data.city);
      const existing = await prisma.restaurant.findFirst({
        where: { name: data.name, address: data.address },
      });

      if (existing) {
        await prisma.restaurant.update({ where: { id: existing.id }, data });
        updated++;
      } else {
        const slug = await ensureUniqueSlug(baseSlug);
        await prisma.restaurant.create({ data: { ...data, slug } });
        inserted++;
      }
    }

    console.log(`Progress: ${Math.min(i + BATCH_SIZE, rows.length)}/${rows.length}`);
  }

  console.log(`\nDone! Inserted: ${inserted}  Updated: ${updated}  Skipped: ${skipped}`);
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
