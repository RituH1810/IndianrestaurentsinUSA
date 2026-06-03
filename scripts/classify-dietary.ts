/**
 * Script 5/10 — classify-dietary.ts
 * Uses Claude Haiku to conservatively tag vegetarian / vegan / Jain / halal /
 * gluten-free. Requires ANTHROPIC_API_KEY in .env.local.
 * Run with:  npx tsx scripts/classify-dietary.ts
 */

import Anthropic from '@anthropic-ai/sdk';
import { PrismaClient } from '@prisma/client';
import { DIETARY } from '../lib/taxonomy';

const prisma = new PrismaClient();
const client = new Anthropic();

const VALID_TAGS = DIETARY.map(d => d.tag).join(', ');

const SYSTEM_PROMPT = `You are classifying Indian restaurants for dietary options.
Given a restaurant name and description, output ONLY pipe-separated dietary tags from:
${VALID_TAGS}

Definitions:
- pure-veg: Entirely vegetarian kitchen, no meat served at all.
- vegan: Has a dedicated vegan section or is fully vegan.
- jain: Explicitly mentions Jain food (no onion, garlic, root vegetables).
- halal: Explicitly halal-certified or states halal meat.
- gluten-free: Explicitly mentions gluten-free options.

Rules:
- Tag CONSERVATIVELY — only assign when there is explicit evidence in the name or description.
- An empty response is better than a wrong tag.
- Respond with ONLY the tags (pipe-separated) or an empty string.`;

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
    .filter(t => DIETARY.some(d => d.tag === t));
  return tags.join('|');
}

async function main() {
  const restaurants = await prisma.restaurant.findMany({
    where: { dietary_tags: null },
    select: { id: true, name: true, description: true },
  });

  console.log(`Classifying dietary tags for ${restaurants.length} restaurants…`);

  let done = 0;
  for (const r of restaurants) {
    try {
      const tags = await classifyOne(r.name, r.description);
      await prisma.restaurant.update({ where: { id: r.id }, data: { dietary_tags: tags || null } });
      console.log(`[${++done}/${restaurants.length}] ${r.name} → "${tags}"`);
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
