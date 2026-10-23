/**
 * Builds the gallery tile thumbnails: `npm run gallery:thumbs`.
 *
 * For every item in src/data/gallery.ts it resizes the item's `thumbnail` image (the photo, or the video poster)
 * to a few widths, never upscaling, and writes AVIF + WebP files to public/images/gallery/<id>-<width>.<ext>.
 * The widths and original size of each item go to src/data/gallery-thumbs.json, which the page uses for
 * srcset and width/height. Full-resolution files are left untouched; the lightbox loads them on open.
 * Existing thumbnails are skipped unless the source is newer, so re-running is quick.
 *
 * Needs Node 23.6+ (reads the TypeScript data file directly).
 */
import { mkdir, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import { galleryItems } from '../src/data/gallery.ts'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const outDir = path.join(root, 'public/images/gallery')
const manifestPath = path.join(root, 'src/data/gallery-thumbs.json')
const TARGET_WIDTHS = [640, 1280, 1920]
const FORMATS = [
  ['avif', (image) => image.avif({ quality: 50, effort: 4 })],
  ['webp', (image) => image.webp({ quality: 74 })],
]

const mtime = (file) => stat(file).then((info) => info.mtimeMs, () => 0)

await mkdir(outDir, { recursive: true })
const manifest = {}
let written = 0

for (const item of galleryItems) {
  const source = path.join(root, 'public', item.thumbnail)
  const { width, height } = await sharp(source).metadata()
  // Skip sizes within 15% of the original; the original width itself is the largest size when it is under 1920.
  const widths = TARGET_WIDTHS.filter((w) => w < width * 0.85)
  if (width <= TARGET_WIDTHS[TARGET_WIDTHS.length - 1]) widths.push(width)
  const sourceTime = await mtime(source)

  for (const w of widths) {
    for (const [ext, encode] of FORMATS) {
      const out = path.join(outDir, `${item.id}-${w}.${ext}`)
      if ((await mtime(out)) > sourceTime) continue
      await encode(sharp(source).resize({ width: w, withoutEnlargement: true })).toFile(out)
      written++
    }
  }
  manifest[item.id] = { width, height, widths }
}

await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`)
console.log(`Gallery thumbnails: ${galleryItems.length} items, ${written} files written.`)
