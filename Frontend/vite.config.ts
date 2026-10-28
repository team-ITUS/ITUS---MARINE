import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'
import { existsSync, rmSync } from 'node:fs'

/**
 * Production-build housekeeping:
 *  - public/NewAssets and public/3D Boat Images hold original PNG exports
 *    (git-ignored). Vite copies all of /public into /dist, so remove those
 *    folders to keep the build small.
 *  - public/.htaccess (SPA routing, caching, security headers) must reach /dist
 *    on every build; fail loudly if it is missing instead of shipping a site
 *    that 404s on refresh.
 */
function productionHousekeeping(): Plugin {
  const dist = path.resolve(__dirname, 'dist')
  return {
    name: 'production-housekeeping',
    apply: 'build',
    closeBundle() {
      for (const folder of ['NewAssets', '3D Boat Images']) {
        rmSync(path.join(dist, folder), { recursive: true, force: true })
      }
      if (!existsSync(path.join(dist, '.htaccess'))) {
        throw new Error('dist/.htaccess is missing. Keep public/.htaccess in the project.')
      }
    },
  }
}

/** Normalises VITE_BASE to "/" or "/folder/". */
function resolveBase(value: string | undefined): string {
  const trimmed = (value ?? '').trim().replace(/^\/+|\/+$/g, '')
  return trimmed ? `/${trimmed}/` : '/'
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, __dirname, '')
  return {
    base: resolveBase(env.VITE_BASE),
    plugins: [react(), tailwindcss(), productionHousekeeping()],
    resolve: {
      alias: { '@': path.resolve(__dirname, './src') },
    },
    server: {
      host: true,
    },
  }
})
