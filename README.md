# ITUS Shipyard Website

React + TypeScript + Vite + Tailwind CSS v4, converted from the Figma Make file
"New Shipyard Website Design".

## Run

```bash
npm install
npm run dev        # development server
npm run typecheck  # TypeScript check
npm run build      # type-check + production build into dist/
npm run preview    # serve the production build
```

## Where things live

| What | Where |
| --- | --- |
| Pages (one file per route) | `src/pages/` — Home, Vessels, VesselDetail, Capabilities, About, Contact, RequestQuote, NotFound |
| Routes | `src/routes/AppRoutes.tsx` |
| Header / Footer / page shell | `src/components/layout/` |
| Reusable pieces (headings, form field, SEO, CTA) | `src/components/common/` |
| Home page sections | `src/components/sections/home/` |
| Home page styles (scoped under `.home-page`) | `src/styles/home.css` |
| Vessel catalogue (all text and specs) | `src/data/vessels.ts` |
| Nav links, filters, capability chapters | `src/data/navigation.ts`, `src/data/capabilities.ts` |
| Types | `src/types/index.ts` |
| Global styles and colour tokens | `src/index.css` |
| Images | `public/images/<section>/...` (WebP) |
| Apache config | `public/.htaccess` (copied into `dist/` on every build) |

## Images

Optimised WebP files live in `public/images/`, one folder per area: `home/`,
`about/`, `capabilities/`, `contact/` and `vessels/<vessel>/<vessel>-<n>.webp`
(`-1` is the main photo, the others are gallery images). `src/data/vessels.ts`
and `src/data/capabilities.ts` point to them.

`public/NewAssets/` holds the original PNG exports. It is git-ignored and is
removed from `dist/` automatically on every build, so it is never deployed.

## Deploying (Apache / cPanel)

1. Run `npm install`, then `npm run build`.
2. Upload the **contents** of `dist/` (including the hidden `.htaccess`) to the
   web root.
3. `.htaccess` sends every route (for example `/vessels/airboat`) to
   `index.html`, so refreshing a page does not return a 404. It also enables
   gzip, caching and security headers. If the site is served from a sub-folder,
   set `RewriteBase` in that file. Uncomment the HTTPS block once an SSL
   certificate is installed.
4. Before launch, replace the relative URLs in `public/sitemap.xml` and
   `public/robots.txt` with the full domain (for example
   `https://example.com/vessels`).

The build fails with a clear message if `public/.htaccess` is missing.

## Not connected

The Contact and Request a Quote forms validate in the browser but have no
backend; submitting does not send anything yet.
