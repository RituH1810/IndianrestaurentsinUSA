/**
 * Script 4/10 — classify-cuisine.ts
 * Uses Claude Haiku to classify each restaurant's regional Indian cuisine from
 * name + description. Requires ANTHROPIC_API_KEY in .env.local.
 * Run with:  npx tsx scripts/classify-cuisine.ts
 */

import Anthropic from '@anthropic-ai/sdk';
import { PrismaClient } from '@prisma/client';
import { CUISINES } from '../lib/taxonomy';

const prisma = new PrismaClient();
const client = new Anthropic();

const VALID_TAGS = CUISINES.map(c => c.tag).join(', ');

const SYSTEM_PROMPT = `You are a culinary expert classifying Indian restaurants by regional cuisine.
Given a restaurant name and description, output ONLY pipe-separated cuisine tags from this list:
${VALID_TAGS}

Rules:
- Only assign a tag if there is clear evidence (name, description, menu keywords).
- An empty string is better than a wrong tag.
- A restaurant can have multiple tags (e.g. "north-indian|punjabi").
- Respond with ONLY the tags, nothing else. Example: "hyderabadi|mughlai"`;

async function classifyOne(name: string, description: string | null): Promise<string> {
  const userMsg = `Restaurant: ${name}\nDescription: ${description ?? 'N/A'}`;
  const msg = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 64,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: userMsg }],
  });
  const text = msg.content[0].type === 'text' ? msg.content[0].text.trim().toLowerCase() : '';
  const tags = text
    .split('|')
    .map(t => t.trim())
    .filter(t => CUISINES.some(c => c.tag === t));
  return tags.join('|');
}

async function main() {
  const restaurants = await prisma.restaurant.findMany({
    where: { cuisine_tags: null },
    select: { id: true, name: true, description: true },
  });

  console.log(`Classifying cuisine for ${restaurants.length} restaurants…`);

  let done = 0;
  for (const r of restaurants) {
    try {
      const tags = await classifyOne(r.name, r.description);
      await prisma.restaurant.update({ where: { id: r.id }, data: { cuisine_tags: tags || null } });
      console.log(`[${++done}/${restaurants.length}] ${r.name} → "${tags}"`);
    } catch (e) {
      console.error(`Error on ${r.name}:`, e);
    }
    // Respect rate limits
    await new Promise(res => setTimeout(res, 200));
  }

  console.log('\nDone!');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
