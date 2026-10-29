/**
 * Builds the web model for the 3D boat configurator: `npm run boat:model [source.glb]`.
 *
 * Takes the SOLIDWORKS GLB export (default: public/10.2m_amphi_luxury_assembly-_kotal_modified.glb, git-ignored and
 * removed from the build) and writes public/models/boat/amphibious-10-2m.glb:
 *  - turns the model from Z-up to Y-up and moves it so the hull is centred on x/z and the wheels stand on y = 0
 *    (x towards the bow, y up, z to starboard, metres);
 *  - keeps every assembly part as its own named node, so the page can select, hide and animate parts by name;
 *  - welds and simplifies the CAD tessellation, resizes textures to WebP and compresses the geometry with meshopt.
 * The page reads part names from src/data/amphibious.ts; check those still match after a new export.
 */
import { open, mkdir, stat } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { NodeIO } from '@gltf-transform/core'
import { ALL_EXTENSIONS } from '@gltf-transform/extensions'
import { dedup, getBounds, meshopt, prune, simplify, textureCompress, weld } from '@gltf-transform/functions'
import { MeshoptEncoder, MeshoptSimplifier } from 'meshoptimizer'
import sharp from 'sharp'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const source = path.resolve(process.argv[2] ?? path.join(root, 'public/10.2m_amphi_luxury_assembly-_kotal_modified.glb'))
const output = path.join(root, 'public/models/boat/amphibious-10-2m.glb')
const HULL_NODE = '10.2m amphi luxury-cabine'

// A GLB states its full length in the header; a shorter file was cut off during export or copy.
const file = await open(source)
const header = Buffer.alloc(12)
await file.read(header, 0, 12, 0)
await file.close()
const { size } = await stat(source)
const declared = header.readUInt32LE(8)
if (declared > size) {
  const mb = (bytes) => (bytes / 1e6).toFixed(1)
  throw new Error(`${source} is incomplete (${mb(size)} of ${mb(declared)} MB). Export the GLB again and copy the whole file.`)
}

await MeshoptEncoder.ready
await MeshoptSimplifier.ready
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.encoder': MeshoptEncoder })
const document = await io.read(source)
const scene = document.getRoot().listScenes()[0]

for (const node of scene.listChildren()) if (node.getCamera()) node.dispose()
for (const camera of document.getRoot().listCameras()) camera.dispose()

const [assembly] = scene.listChildren()
assembly.setRotation([-Math.SQRT1_2, 0, 0, Math.SQRT1_2])
const hull = assembly.listChildren().find((node) => node.getName().startsWith(HULL_NODE))
if (!hull) throw new Error(`No "${HULL_NODE}" node: update HULL_NODE for the new export.`)
const hullBox = getBounds(hull)
const box = getBounds(scene)
assembly.setTranslation([-(hullBox.min[0] + hullBox.max[0]) / 2, -box.min[1], -(hullBox.min[2] + hullBox.max[2]) / 2])

await document.transform(
  dedup(),
  weld(),
  simplify({ simplifier: MeshoptSimplifier, ratio: 0.25, error: 0.0004 }),
  prune({ keepLeaves: false }),
  textureCompress({ encoder: sharp, targetFormat: 'webp', resize: [1024, 1024], quality: 80 }),
  meshopt({ encoder: MeshoptEncoder, level: 'medium' }),
)

let triangles = 0
for (const mesh of document.getRoot().listMeshes())
  for (const primitive of mesh.listPrimitives())
    triangles += (primitive.getIndices()?.getCount() ?? primitive.getAttribute('POSITION').getCount()) / 3

await mkdir(path.dirname(output), { recursive: true })
await io.write(output, document)
const done = getBounds(scene)
console.log(`Wrote ${path.relative(root, output)}: ${((await stat(output)).size / 1e6).toFixed(1)} MB, ${Math.round(triangles).toLocaleString()} triangles`)
console.log(`Size ${done.max.map((v, i) => (v - done.min[i]).toFixed(2)).join(' x ')} m (length x height x beam)`)
console.log(`Parts: ${assembly.listChildren().map((node) => node.getName()).join(', ')}`)
