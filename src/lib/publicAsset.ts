/**
 * Build URL for files in `public/` when the app uses Next.js `basePath`
 * (e.g. GitHub Pages at /repo-name/). Plain `/file.png` would miss the prefix.
 */
export function publicAsset(path: string): string {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${base}${normalized}`;
}
