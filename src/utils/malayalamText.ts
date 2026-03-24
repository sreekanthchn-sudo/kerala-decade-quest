const LEGACY_CHILLU_PATTERNS: Array<[RegExp, string]> = [
  [/ന്[\u200C\u200D]/g, 'ൻ'],
  [/ണ്[\u200C\u200D]/g, 'ൺ'],
  [/ര്[\u200C\u200D]/g, 'ർ'],
  [/ല്[\u200C\u200D]/g, 'ൽ'],
  [/ള്[\u200C\u200D]/g, 'ൾ'],
  [/ക്[\u200C\u200D]/g, 'ൿ'],
];

export function sanitizeMalayalamText(value: string): string {
  let normalized = value;

  for (const [pattern, replacement] of LEGACY_CHILLU_PATTERNS) {
    normalized = normalized.replace(pattern, replacement);
  }

  // Remove zero-width joiners that often break rendering for modern fonts.
  normalized = normalized.replace(/[\u200C\u200D]/g, '');

  return normalized.normalize('NFC');
}

export function sanitizeDeepMalayalam<T>(value: T): T {
  if (typeof value === 'string') {
    return sanitizeMalayalamText(value) as T;
  }

  if (Array.isArray(value)) {
    return value.map((item) => sanitizeDeepMalayalam(item)) as T;
  }

  if (value && typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>);
    const next = entries.map(([key, item]) => [key, sanitizeDeepMalayalam(item)]);
    return Object.fromEntries(next) as T;
  }

  return value;
}
