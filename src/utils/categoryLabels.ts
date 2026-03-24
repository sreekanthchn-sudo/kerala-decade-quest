import type { Module } from '@/types';

/** Short Malayalam | English labels (PSC-style) for category dropdown and titles */
const SLUG_BILINGUAL: Record<string, { ml: string; en: string }> = {
  'it-electronics': { ml: 'ഐടി', en: 'IT' },
  'planning-economy': { ml: 'സമ്പദ്\u200cവ്യവസ്ഥ', en: 'Economy' },
  'revenue-housing': { ml: 'റവന്യൂ', en: 'Revenue' },
  'water-resources': { ml: 'ജലം', en: 'Water Resources' },
  'electricity-power': { ml: 'ഊർജ്ജം', en: 'Energy' },
  'forest-wildlife': { ml: 'വനം', en: 'Forest' },
  'sports-registration': { ml: 'കായികം', en: 'Sports' },
  transport: { ml: 'ഗതാഗതം', en: 'Transport' },
  'food-civil-supplies': { ml: 'ഭക്ഷണം', en: 'Food & Civil Supplies' },
  finance: { ml: 'ധനം', en: 'Finance' },
  'higher-education-social-justice': { ml: 'വിദ്യാഭ്യാസം', en: 'Education' },
  'animal-husbandry': { ml: 'ക്ഷീരം', en: 'Dairy' },
  lsgd: { ml: 'തദ്ദേശഭരണം', en: 'Local Self Government' },
  'public-works-tourism': { ml: 'പൊതുമരാമത്ത്', en: 'Public Works (PWD)' },
  agriculture: { ml: 'കൃഷി', en: 'Agriculture' },
  'sc-st-welfare': { ml: 'ക്ഷേമം', en: 'Welfare' },
  'law-industries': { ml: 'നിയമവും തൊഴിൽ', en: 'Law & Labour' },
  'cooperation-ports': { ml: 'തുറമുഖം', en: 'Ports' },
  'health-family-welfare': { ml: 'ആരോഗ്യം', en: 'Health' },
  'fisheries-culture': { ml: 'മത്സ്യം', en: 'Fisheries' },
};

export function getCategoryBilingualLabel(mod: Module, categoryIndex: number, isMl: boolean): string {
  if (categoryIndex === 0 && mod.slug.includes('general')) {
    return isMl ? 'പൊതു ക്വിസ് | General Quiz' : 'General Quiz | പൊതു ക്വിസ്';
  }

  const pair = SLUG_BILINGUAL[mod.slug];
  if (pair) {
    return isMl ? `${pair.ml} | ${pair.en}` : `${pair.en} | ${pair.ml}`;
  }

  return isMl ? mod.title_ml : mod.title;
}
