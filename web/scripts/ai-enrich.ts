/**
 * Script 6/10 — ai-enrich.ts
 * Generates a short factual description for restaurants that are missing one.
 * Requires ANTHROPIC_API_KEY in .env.local.
 * Run with:  npx tsx scripts/ai-enrich.ts
 */

import Anthropic from '@anthropic-ai/sdk';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const client = new Anthropic();

async function generateDescription(
  name: string,
  city: string,
  state: string,
  cuisineTags: string | null,
): Promise<string> {
  const cuisine = cuisineTags ? ` specialising in ${cuisineTags.replace(/\|/g, ', ')} cuisine` : '';
  const prompt = `Write a single factual sentence (under 25 words) describing "${name}", an Indian restaurant in ${city}, ${state}${cuisine}. Be specific and informative. No fluff.`;
  const msg = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 80,
    messages: [{ role: 'user', content: prompt }],
  });
  const text = msg.content[0].type === 'text' ? msg.content[0].text.trim() : '';
  return text.replace(/^["']|["']$/g, '');
}

async function main() {
  const restaurants = await prisma.restaurant.findMany({
    where: { description: null },
    select: { id: true, name: true, city: true, state: true, cuisine_tags: true },
  });

  console.log(`Generating descriptions for ${restaurants.length} restaurants…`);

  let done = 0;
  for (const r of restaurants) {
    try {
      const description = await generateDescription(r.name, r.city, r.state, r.cuisine_tags);
      await prisma.restaurant.update({ where: { id: r.id }, data: { description } });
      console.log(`[${++done}/${restaurants.length}] ${r.name}`);
    } catch (e) {
      console.error(`Error on ${r.name}:`, e);
    }
    await new Promise(res => setTimeout(res, 200));
  }

  console.log('\nDone!');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
