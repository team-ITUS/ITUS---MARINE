/**
 * Resolves a file in /public (for example "/images/home/hero/hero.webp") against
 * the site's base path, so images still load when the site is deployed in a
 * sub-folder such as https://example.com/demo/. The base comes from VITE_BASE
 * (see vite.config.ts and .env.production).
 */
export function asset(path: string): string {
  return import.meta.env.BASE_URL + path.replace(/^\/+/, '')
}
