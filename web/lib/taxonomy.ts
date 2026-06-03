export const CUISINES = [
  { tag: 'north-indian', label: 'North Indian', keywords: ['butter chicken', 'naan', 'tikka', 'curry', 'palak', 'dal makhani', 'tandoor'] },
  { tag: 'south-indian', label: 'South Indian', keywords: ['dosa', 'idli', 'sambar', 'vada', 'uttapam', 'rasam', 'appam', 'chutney'] },
  { tag: 'indo-chinese', label: 'Indo-Chinese', keywords: ['manchurian', 'hakka', 'schezwan', 'chilli chicken', 'fried rice', 'noodles'] },
  { tag: 'punjabi', label: 'Punjabi', keywords: ['chole', 'paratha', 'lassi', 'tandoori', 'sarson', 'makki', 'amritsari'] },
  { tag: 'gujarati', label: 'Gujarati', keywords: ['thali', 'dhokla', 'farsan', 'undhiyu', 'handvo', 'khakhra', 'fafda'] },
  { tag: 'bengali', label: 'Bengali', keywords: ['fish curry', 'mishti', 'kosha mangsho', 'rosogolla', 'mustard', 'hilsa'] },
  { tag: 'hyderabadi', label: 'Hyderabadi', keywords: ['biryani', 'haleem', 'dum', 'hyderabadi', 'nizami', 'nawabi'] },
  { tag: 'mughlai', label: 'Mughlai', keywords: ['kebab', 'korma', 'rogan josh', 'nihari', 'shahi', 'seekh', 'galouti'] },
  { tag: 'kerala', label: 'Kerala / Malabar', keywords: ['appam', 'stew', 'malabar', 'coconut', 'fish molee', 'puttu', 'karimeen'] },
  { tag: 'chaat', label: 'Chaat / Street Food', keywords: ['pani puri', 'bhel', 'samosa', 'vada pav', 'pav bhaji', 'ragda'] },
  { tag: 'rajasthani', label: 'Rajasthani', keywords: ['dal baati', 'gatte', 'laal maas', 'churma', 'bajre', 'ker sangri'] },
  { tag: 'maharashtrian', label: 'Maharashtrian', keywords: ['vada pav', 'misal', 'puran poli', 'thalipeeth', 'poha', 'modak'] },
] as const;

export const DIETARY = [
  { tag: 'pure-veg', label: 'Pure Vegetarian', description: 'Entirely vegetarian kitchen — no meat at all' },
  { tag: 'vegan', label: 'Vegan', description: 'Dedicated vegan options or fully vegan menu' },
  { tag: 'jain', label: 'Jain', description: 'Jain-friendly options — no onion, garlic, or root vegetables' },
  { tag: 'halal', label: 'Halal', description: 'Halal-certified or explicitly halal meat' },
  { tag: 'gluten-free', label: 'Gluten-Free', description: 'Explicit gluten-free options available' },
] as const;

export type CuisineTag = (typeof CUISINES)[number]['tag'];
export type DietaryTag = (typeof DIETARY)[number]['tag'];

export function getCuisineLabel(tag: string): string {
  return CUISINES.find(c => c.tag === tag)?.label ?? tag;
}

export function getDietaryLabel(tag: string): string {
  return DIETARY.find(d => d.tag === tag)?.label ?? tag;
}
