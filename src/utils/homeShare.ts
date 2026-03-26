export type HomeShareLevel = 'general' | 'department';

export function buildHomeShareTitle(isMl: boolean): string {
  return isMl ? 'KNOW-KERALAM' : 'KNOW-KERALAM · Kerala decade quiz';
}

/**
 * Rich share text with site URL and level context (WhatsApp / Web Share API).
 */
export function buildHomeShareText(params: {
  isMl: boolean;
  score: number;
  total: number;
  percentage: number;
  tierLabel: string;
  categoryTitle: string;
  siteUrl: string;
  level: HomeShareLevel;
  departmentCount: number;
}): string {
  const {
    isMl,
    score,
    total,
    percentage,
    tierLabel,
    categoryTitle,
    siteUrl,
    level,
    departmentCount,
  } = params;

  if (isMl) {
    const levelLine =
      level === 'general'
        ? 'ലെവൽ 0 · പൊതു റൗണ്ട് (10 ചോദ്യങ്ങൾ)'
        : `ലെവൽ 1 · വകുപ്പ് ക്വിസ് (${total} ചോദ്യങ്ങൾ)`;
    const extra =
      level === 'general'
        ? `ഇനി ${departmentCount} വകുപ്പ് വിഭാഗങ്ങളിൽ ഓരോന്നായി ലെവൽ 1 ക്വിസുകൾ തുറന്നിരിക്കുന്നു - മുകളിലെ വിഭാഗം തിരഞ്ഞെടുത്ത് തുടരാം.`
        : `മറ്റു വകുപ്പ് വിഭാഗങ്ങളും ലെവൽ 1 ൽ ലഭ്യമാണ് - മുകളിലെ ടാബിൽ നിന്ന് തിരഞ്ഞെടുക്കുക.`;

    return `🏛️ KNOW-KERALAM (2016-2026)
${levelLine}

${categoryTitle}

സ്കോർ: ${score}/${total} (${percentage}%)
നില: ${tierLabel}

${extra}

വെബ്സൈറ്റ് / മുഴുവൻ ക്വിസ്:
${siteUrl}`;
  }

  const levelLine =
    level === 'general'
      ? 'Level 0 · General round (10 questions)'
      : `Level 1 · Department quiz (${total} questions)`;
  const extra =
    level === 'general'
      ? `${departmentCount} department topics are open at Level 1 - pick a category tab above to continue.`
      : 'More department quizzes are available at Level 1 - choose another topic from the tabs above.';

  return `🏛️ KNOW-KERALAM (2016-2026)
${levelLine}

${categoryTitle}

Score: ${score}/${total} (${percentage}%)
Tier: ${tierLabel}

${extra}

Website / full quiz:
${siteUrl}`;
}
