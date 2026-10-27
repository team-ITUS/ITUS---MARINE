/**
 * Builds the case study cover images: `npm run case-studies:images`.
 *
 * For every case study in src/data/case-studies.ts it resizes the `coverImage` to a few widths, never upscaling,
 * and writes AVIF + WebP files to public/images/case-studies/<slug>-<width>.<ext>. The widths and original size
 * of each cover go to src/data/case-study-images.json, which the cards and detail hero use for srcset and
 * width/height. Existing files are skipped unless the source is newer, so re-running is quick.
 *
 * Needs Node 23.6+ (reads the TypeScript data file directly).
 */
import { mkdir, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import { caseStudies } from '../src/data/case-studies.ts'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const outDir = path.join(root, 'public/images/case-studies')
const manifestPath = path.join(root, 'src/data/case-study-images.json')
const TARGET_WIDTHS = [640, 1280, 1920]
const FORMATS = [
  ['avif', (image) => image.avif({ quality: 50, effort: 4 })],
  ['webp', (image) => image.webp({ quality: 76 })],
]

const mtime = (file) => stat(file).then((info) => info.mtimeMs, () => 0)

await mkdir(outDir, { recursive: true })
const manifest = {}
let written = 0

for (const study of caseStudies) {
  const source = path.join(root, 'public', study.coverImage)
  const { width, height } = await sharp(source).metadata()
  // Skip sizes within 15% of the original; the original width itself is the largest size when it is under 1920.
  const widths = TARGET_WIDTHS.filter((w) => w < width * 0.85)
  if (width <= TARGET_WIDTHS[TARGET_WIDTHS.length - 1]) widths.push(width)
  const sourceTime = await mtime(source)

  for (const w of widths) {
    for (const [ext, encode] of FORMATS) {
      const out = path.join(outDir, `${study.slug}-${w}.${ext}`)
      if ((await mtime(out)) > sourceTime) continue
      await encode(sharp(source).resize({ width: w, withoutEnlargement: true })).toFile(out)
      written++
    }
  }
  manifest[study.slug] = { width, height, widths }
}

await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`)
console.log(`Case study images: ${caseStudies.length} covers, ${written} files written.`)
