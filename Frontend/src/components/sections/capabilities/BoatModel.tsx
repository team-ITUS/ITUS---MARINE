import { useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef, type RefObject } from 'react'
import * as THREE from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import type { BoatHullFinish } from '@/types'

/*
 * The amphibious boat, drawn in code from the design renders (there is no exported 3D file yet).
 * Metres, x towards the bow, y up from the deck line, z to starboard. The transom is at x = -4, the stem at x = 4.2.
 * To use a real model later, export it as .glb, load it with drei's useGLTF and keep the same axes and scale so the
 * hotspots and camera views in src/data/amphibious.ts still line up.
 */

/** Height of the ground under the wheels when they are lowered. */
export const GROUND_Y = -2.02
/** Waterline when afloat. */
export const WATERLINE_Y = -0.42

/** Half-section cut: everything on the starboard side (z > 0) is clipped away. */
const SECTION_PLANE = new THREE.Plane(new THREE.Vector3(0, 0, -1), 0)

const STERN_X = -4
const LENGTH = 8.2
const CABIN_HALF = 0.95
const BEVEL = 0.05

/** Hull shape at t (0 = transom, 1 = stem): parallel aft body, then a rounded entry with rising sheer and forefoot. */
function station(t: number) {
  const f = t < 0.55 ? 0 : (t - 0.55) / 0.45
  return {
    x: STERN_X + t * LENGTH,
    half: Math.max(1.2 * Math.sqrt(1 - f * f), 0.03),
    gunwale: 0.25 * f * f,
    keel: -1.0 + 1.1 * f ** 1.8,
  }
}

/** Cross-section as [z, y] points from port gunwale, over the chines and keel, to starboard gunwale. */
function sectionPoints(s: ReturnType<typeof station>): [number, number][] {
  const chineY = s.gunwale + (s.keel - s.gunwale) * 0.55
  return [
    [-s.half, s.gunwale],
    [-0.82 * s.half, chineY],
    [0, s.keel],
    [0.82 * s.half, chineY],
    [s.half, s.gunwale],
  ]
}

/** The wheelhouse narrows linearly towards the bow, so every flat face stays flat after tapering. */
const cabinTaper = (x: number) => 1 - 0.1 * (x + 0.95)
/** z of the wheelhouse side face at x, plus a small offset for glazing laid on top of it. */
const cabinSide = (x: number, side: number, offset = 0.012) => side * ((CABIN_HALF + BEVEL) * cabinTaper(x) + offset)

function quad(points: THREE.Vector3Tuple[]) {
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(points.flat(), 3))
  geometry.setIndex([0, 1, 2, 0, 2, 3])
  geometry.computeVertexNormals()
  return geometry
}

function hullGeometry() {
  const count = 48
  const stations = Array.from({ length: count + 1 }, (_, i) => station(i / count))
  const positions: number[] = []
  const indices: number[] = []
  // Each of the four panels gets its own vertices, so the chines stay crisp while the run stays smooth.
  for (let panel = 0; panel < 4; panel++) {
    const base = positions.length / 3
    for (const s of stations) {
      const points = sectionPoints(s)
      positions.push(s.x, points[panel][1], points[panel][0], s.x, points[panel + 1][1], points[panel + 1][0])
    }
    for (let i = 0; i < count; i++) {
      const a = base + i * 2
      const b = a + 2
      indices.push(a, b, a + 1, a + 1, b, b + 1)
    }
  }
  const base = positions.length / 3
  for (const [z, y] of sectionPoints(stations[0])) positions.push(STERN_X, y, z)
  indices.push(base, base + 1, base + 2, base, base + 2, base + 3, base, base + 3, base + 4)

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geometry.setIndex(indices)
  geometry.computeVertexNormals()
  return geometry
}

function deckGeometry() {
  const count = 48
  const positions: number[] = []
  const indices: number[] = []
  for (let i = 0; i <= count; i++) {
    const s = station(i / count)
    positions.push(s.x, s.gunwale + 0.015, -0.97 * s.half, s.x, s.gunwale + 0.015, 0.97 * s.half)
    if (i < count) indices.push(i * 2, i * 2 + 1, i * 2 + 2, i * 2 + 1, i * 2 + 3, i * 2 + 2)
  }
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geometry.setIndex(indices)
  geometry.computeVertexNormals()
  return geometry
}

/** Collar running from the port quarter round the stem to the starboard quarter. */
function collarCurve() {
  const offset = 0.14
  const port: THREE.Vector3[] = [new THREE.Vector3(STERN_X - 0.25, 0.06, -1.2 - offset)]
  for (let i = 0; i <= 20; i++) {
    const s = station((i / 20) * 0.96)
    port.push(new THREE.Vector3(s.x, s.gunwale + 0.06, -(s.half + offset)))
  }
  const stem = station(1)
  const starboard = port.map((p) => new THREE.Vector3(p.x, p.y, -p.z)).reverse()
  return new THREE.CatmullRomCurve3(
    [...port, new THREE.Vector3(stem.x + offset, stem.gunwale + 0.06, 0), ...starboard],
    false,
    'centripetal',
  )
}

function wheelhouseGeometry() {
  const profile = new THREE.Shape()
  profile.moveTo(-0.7, 0)
  profile.lineTo(-0.7, 1.55)
  profile.lineTo(-0.95, 1.72)
  profile.lineTo(1.3, 1.78)
  profile.lineTo(1.6, 1.66)
  profile.lineTo(2.35, 0.95)
  profile.lineTo(2.75, 0.38)
  profile.lineTo(2.85, 0)
  profile.closePath()
  const geometry = new THREE.ExtrudeGeometry(profile, {
    depth: CABIN_HALF * 2,
    bevelEnabled: true,
    bevelThickness: BEVEL,
    bevelSize: BEVEL,
    bevelSegments: 2,
  })
  geometry.translate(0, 0, -CABIN_HALF)
  const position = geometry.attributes.position
  for (let i = 0; i < position.count; i++) position.setZ(i, position.getZ(i) * cabinTaper(position.getX(i)))
  geometry.computeVertexNormals()
  return geometry
}

function windshieldGeometry() {
  // Glass on the raked front face, from (1.6, 1.66) down to (2.35, 0.95), lifted clear of the bevelled wall.
  const along = (u: number): [number, number] => [1.6 + 0.75 * u + 0.045, 1.66 - 0.71 * u + 0.047]
  const [x0, y0] = along(0.1)
  const [x1, y1] = along(0.65)
  const half = (x: number) => 0.85 * cabinTaper(x)
  return quad([
    [x0, y0, -half(x0)],
    [x0, y0, half(x0)],
    [x1, y1, half(x1)],
    [x1, y1, -half(x1)],
  ])
}

function sideWindowGeometry(x0: number, x1: number, y0: number, y1: number, side: number) {
  return quad([
    [x0, y0, cabinSide(x0, side)],
    [x1, y0, cabinSide(x1, side)],
    [x1, y1, cabinSide(x1, side)],
    [x0, y1, cabinSide(x0, side)],
  ])
}

/** Off-road tread: staggered lugs round a tyre whose axle is the y axis. */
function treadGeometry(radius: number, width: number) {
  const lugs: THREE.BufferGeometry[] = []
  const count = 18
  for (let i = 0; i < count * 2; i++) {
    const angle = ((i % count) + (i < count ? 0 : 0.5)) * ((Math.PI * 2) / count)
    const lug = new THREE.BoxGeometry(0.06, width * 0.45, 0.11)
    lug.rotateY(-angle)
    lug.translate(Math.cos(angle) * radius, (i < count ? 1 : -1) * width * 0.24, Math.sin(angle) * radius)
    lugs.push(lug)
  }
  return mergeGeometries(lugs)
}

const WHEEL_RADIUS = 0.42
const WHEEL_WIDTH = 0.3

let geometryCache: ReturnType<typeof buildGeometries> | undefined

function buildGeometries() {
  const collar = collarCurve()
  return {
    hull: hullGeometry(),
    deck: deckGeometry(),
    collar: new THREE.TubeGeometry(collar, 220, 0.2, 14, false),
    collarEnds: [collar.getPoint(0), collar.getPoint(1)],
    wheelhouse: wheelhouseGeometry(),
    windows: mergeGeometries([
      windshieldGeometry(),
      ...[-1, 1].flatMap((side) => [
        sideWindowGeometry(-0.45, 0.75, 1.0, 1.48, side),
        sideWindowGeometry(0.95, 1.5, 1.0, 1.48, side),
      ]),
      // Aft door glazing, on the back wall of the wheelhouse.
      quad([
        [-0.765, 0.25, -0.55],
        [-0.765, 0.25, 0.55],
        [-0.765, 1.45, 0.55],
        [-0.765, 1.45, -0.55],
      ]),
    ]),
    arch: new THREE.TubeGeometry(
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-3.72, 0, -1.02),
        new THREE.Vector3(-3.72, 0.85, -0.98),
        new THREE.Vector3(-3.72, 1.15, -0.55),
        new THREE.Vector3(-3.72, 1.15, 0.55),
        new THREE.Vector3(-3.72, 0.85, 0.98),
        new THREE.Vector3(-3.72, 0, 1.02),
      ]),
      80,
      0.035,
      10,
      false,
    ),
    tread: treadGeometry(WHEEL_RADIUS, WHEEL_WIDTH),
  }
}

const geometries = () => (geometryCache ??= buildGeometries())

function createMaterials() {
  const shell = { side: THREE.DoubleSide }
  return {
    hull: new THREE.MeshStandardMaterial({ ...shell }),
    collar: new THREE.MeshStandardMaterial({ ...shell, color: '#1c2124', roughness: 0.62 }),
    deck: new THREE.MeshStandardMaterial({ ...shell, color: '#8a5a35', roughness: 0.75 }),
    cabin: new THREE.MeshStandardMaterial({ ...shell, color: '#e4e8e9', metalness: 0.15, roughness: 0.3 }),
    // Tinted, see-through glazing so the helm reads from outside.
    glass: new THREE.MeshStandardMaterial({
      ...shell,
      color: '#0b1114',
      metalness: 0.6,
      roughness: 0.08,
      transparent: true,
      opacity: 0.5,
      depthWrite: false,
    }),
    cushion: new THREE.MeshStandardMaterial({ color: '#c3cacd', roughness: 0.85 }),
    teak: new THREE.MeshStandardMaterial({ color: '#7a4d2c', roughness: 0.6 }),
    dark: new THREE.MeshStandardMaterial({ color: '#2a3136', metalness: 0.3, roughness: 0.5 }),
    porcelain: new THREE.MeshStandardMaterial({ color: '#f4f6f6', roughness: 0.2 }),
    screen: new THREE.MeshStandardMaterial({ color: '#0a2a44', emissive: '#2f7fd0', emissiveIntensity: 0.9 }),
    lamp: new THREE.MeshStandardMaterial({ color: '#ffffff', emissive: '#ffffff', emissiveIntensity: 1.2 }),
    portLight: new THREE.MeshStandardMaterial({ color: '#ff3b30', emissive: '#ff2a2a', emissiveIntensity: 1.4 }),
    starboardLight: new THREE.MeshStandardMaterial({ color: '#34ff6a', emissive: '#28ff6a', emissiveIntensity: 1.4 }),
    // Not clipped in section view: running gear stays whole.
    chrome: new THREE.MeshStandardMaterial({ color: '#d5dade', metalness: 1, roughness: 0.18 }),
    engine: new THREE.MeshStandardMaterial({ color: '#eef0f0', metalness: 0.1, roughness: 0.25 }),
    engineDark: new THREE.MeshStandardMaterial({ color: '#30363a', metalness: 0.4, roughness: 0.4 }),
    tire: new THREE.MeshStandardMaterial({ color: '#16191b', roughness: 0.92 }),
  }
}

type Materials = ReturnType<typeof createMaterials>

const UNCLIPPED: (keyof Materials)[] = ['chrome', 'engine', 'engineDark', 'tire']

interface BoatModelProps {
  groupRef: RefObject<THREE.Group | null>
  finish: BoatHullFinish
  /** Wheels lowered (on land) or raised (afloat, the boat bobs gently). */
  deployed: boolean
  /** Cut away the starboard half to show the interior. */
  section: boolean
  reducedMotion: boolean
}

export default function BoatModel({ groupRef, finish, deployed, section, reducedMotion }: BoatModelProps) {
  const g = geometries()
  const m = useMemo(createMaterials, [])

  useEffect(() => () => Object.values(m).forEach((material) => material.dispose()), [m])

  useEffect(() => {
    m.hull.color.set(finish.color)
    m.hull.metalness = finish.metalness
    m.hull.roughness = finish.roughness
  }, [m, finish])

  useEffect(() => {
    for (const [name, material] of Object.entries(m)) {
      if (UNCLIPPED.includes(name as keyof Materials)) continue
      material.clippingPlanes = section ? [SECTION_PLANE] : null
      material.needsUpdate = true
    }
  }, [m, section])

  useFrame(({ clock }, delta) => {
    const group = groupRef.current
    if (!group) return
    const afloat = !deployed && !reducedMotion
    const t = clock.elapsedTime
    group.position.y = THREE.MathUtils.damp(group.position.y, afloat ? Math.sin(t * 0.9) * 0.035 : 0, 4, delta)
    group.rotation.x = THREE.MathUtils.damp(group.rotation.x, afloat ? Math.sin(t * 0.7) * 0.014 : 0, 4, delta)
    group.rotation.z = THREE.MathUtils.damp(group.rotation.z, afloat ? Math.sin(t * 0.55) * 0.01 : 0, 4, delta)
  })

  return (
    <group ref={groupRef}>
      <mesh geometry={g.hull} material={m.hull} />
      <mesh geometry={g.deck} material={m.deck} />
      <mesh geometry={g.collar} material={m.collar} />
      {g.collarEnds.map((p, i) => (
        <mesh key={i} position={p} material={m.collar}>
          <sphereGeometry args={[0.2, 16, 12]} />
        </mesh>
      ))}

      <mesh geometry={g.wheelhouse} material={m.cabin} />
      <mesh geometry={g.windows} material={m.glass} />
      <RoofEquipment m={m} />
      <Interior m={m} />

      <mesh geometry={g.arch} material={m.chrome} />
      {/* Bow fitting */}
      <mesh position={[4.28, 0.32, 0]} material={m.chrome}>
        <boxGeometry args={[0.32, 0.08, 0.1]} />
      </mesh>

      {[-0.45, 0.45].map((z) => (
        <Outboard key={z} position={[-4.3, 0, z]} m={m} />
      ))}

      {/* Rear legs fold up and aft, the bow leg folds forward. */}
      {[-1, 1].map((side) => (
        <WheelLeg
          key={side}
          position={[-4.08, 0.1, side * 1.0]}
          length={1.7}
          wheels={[side * 0.24]}
          deployedAngle={0}
          raisedAngle={-1.5}
          deployed={deployed}
          m={m}
          tread={g.tread}
        />
      ))}
      <WheelLeg
        position={[4.0, 0.02, 0]}
        length={1.6}
        wheels={[-0.26, 0.26]}
        deployedAngle={-0.12}
        raisedAngle={1.75}
        deployed={deployed}
        m={m}
        tread={g.tread}
      />
    </group>
  )
}

function RoofEquipment({ m }: { m: Materials }) {
  return (
    <group>
      {/* Radar dome and antenna */}
      <mesh position={[0.25, 1.83, 0]} material={m.cabin}>
        <sphereGeometry args={[0.2, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2]} />
      </mesh>
      <mesh position={[-0.45, 2.22, 0.5]} rotation={[0, 0, 0.12]} material={m.dark}>
        <cylinderGeometry args={[0.012, 0.02, 0.8]} />
      </mesh>
      {/* Deck floodlights */}
      {[
        [-0.75, 0.72],
        [1.05, 0.62],
      ].flatMap(([x, z]) =>
        [-1, 1].map((side) => (
          <mesh key={`${x}${side}`} position={[x, 1.86, side * z]} material={m.lamp}>
            <boxGeometry args={[0.16, 0.06, 0.16]} />
          </mesh>
        )),
      )}
      {/* Navigation lights: red to port, green to starboard */}
      <mesh position={[1.25, 1.55, cabinSide(1.25, -1, 0.03)]} material={m.portLight}>
        <boxGeometry args={[0.14, 0.08, 0.04]} />
      </mesh>
      <mesh position={[1.25, 1.55, cabinSide(1.25, 1, 0.03)]} material={m.starboardLight}>
        <boxGeometry args={[0.14, 0.08, 0.04]} />
      </mesh>
      {/* Grab rails along the wheelhouse sides */}
      {[-1, 1].map((side) => (
        <mesh
          key={side}
          position={[0.35, 0.82, cabinSide(0.35, side, 0.06)]}
          rotation={[0, side * 0.1, Math.PI / 2]}
          material={m.chrome}
        >
          <cylinderGeometry args={[0.02, 0.02, 1.6]} />
        </mesh>
      ))}
    </group>
  )
}

function Seat({ position, m }: { position: THREE.Vector3Tuple; m: Materials }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.02, 0]} material={m.dark}>
        <cylinderGeometry args={[0.2, 0.2, 0.04, 20]} />
      </mesh>
      <mesh position={[0, 0.25, 0]} material={m.chrome}>
        <cylinderGeometry args={[0.04, 0.04, 0.46, 12]} />
      </mesh>
      <mesh position={[0, 0.52, 0]} material={m.cushion}>
        <boxGeometry args={[0.5, 0.12, 0.5]} />
      </mesh>
      <mesh position={[-0.22, 0.86, 0]} material={m.cushion}>
        <boxGeometry args={[0.1, 0.6, 0.48]} />
      </mesh>
    </group>
  )
}

function Interior({ m }: { m: Materials }) {
  return (
    <group>
      {/* Wheelhouse: helm and navigator seats, console with display and wheel */}
      <Seat position={[0.15, 0, -0.48]} m={m} />
      <Seat position={[0.15, 0, 0.48]} m={m} />
      <mesh position={[1.35, 0.475, 0]} material={m.dark}>
        <boxGeometry args={[0.55, 0.95, 1.4]} />
      </mesh>
      <mesh position={[1.065, 0.8, 0]} rotation={[0, 0, -0.25]} material={m.screen}>
        <boxGeometry args={[0.02, 0.24, 0.42]} />
      </mesh>
      <mesh position={[0.98, 0.78, 0.45]} rotation={[0, Math.PI / 2, 0.35]} material={m.chrome}>
        <torusGeometry args={[0.16, 0.018, 8, 28]} />
      </mesh>

      {/* Forward cabin under the foredeck: sole and marine head */}
      <mesh position={[2.55, -0.42, -0.1]} material={m.teak}>
        <boxGeometry args={[1.1, 0.04, 0.6]} />
      </mesh>
      <mesh position={[2.6, -0.22, -0.18]} material={m.porcelain}>
        <cylinderGeometry args={[0.15, 0.12, 0.36, 20]} />
      </mesh>
      <mesh position={[2.42, -0.02, -0.18]} material={m.porcelain}>
        <boxGeometry args={[0.12, 0.3, 0.32]} />
      </mesh>

      {/* Aft cockpit: U-shaped lounge round a table */}
      <mesh position={[-3.38, 0.22, 0]} material={m.cushion}>
        <boxGeometry args={[0.42, 0.44, 2.0]} />
      </mesh>
      <mesh position={[-3.55, 0.62, 0]} material={m.cushion}>
        <boxGeometry args={[0.1, 0.36, 2.0]} />
      </mesh>
      {[-1, 1].map((side) => (
        <group key={side}>
          <mesh position={[-2.45, 0.22, side * 0.8]} material={m.cushion}>
            <boxGeometry args={[1.45, 0.44, 0.4]} />
          </mesh>
          <mesh position={[-2.45, 0.62, side * 0.97]} material={m.cushion}>
            <boxGeometry args={[1.45, 0.36, 0.08]} />
          </mesh>
        </group>
      ))}
      <mesh position={[-2.45, 0.68, 0]} material={m.teak}>
        <boxGeometry args={[1.0, 0.05, 0.62]} />
      </mesh>
      <mesh position={[-2.45, 0.34, 0]} material={m.chrome}>
        <cylinderGeometry args={[0.04, 0.04, 0.66, 12]} />
      </mesh>
    </group>
  )
}

function Outboard({ position, m }: { position: THREE.Vector3Tuple; m: Materials }) {
  return (
    <group position={position}>
      {/* Transom bracket */}
      <mesh position={[0.2, 0.15, 0]} material={m.engineDark}>
        <boxGeometry args={[0.22, 0.45, 0.3]} />
      </mesh>
      {/* Cowling and midsection */}
      <mesh position={[0, 0.95, 0]} scale={[1.25, 1, 0.9]} material={m.engine}>
        <capsuleGeometry args={[0.3, 0.5, 8, 20]} />
      </mesh>
      <mesh position={[0, 0.25, 0]} scale={[1.3, 1, 1]} material={m.engine}>
        <cylinderGeometry args={[0.24, 0.16, 0.45, 20]} />
      </mesh>
      {/* Leg, cavitation plate, gearcase and skeg */}
      <mesh position={[0, -0.35, 0]} material={m.engineDark}>
        <boxGeometry args={[0.22, 0.85, 0.09]} />
      </mesh>
      <mesh position={[-0.05, -0.62, 0]} material={m.engineDark}>
        <boxGeometry args={[0.45, 0.02, 0.22]} />
      </mesh>
      <mesh position={[-0.02, -0.8, 0]} rotation={[0, 0, Math.PI / 2]} material={m.engineDark}>
        <capsuleGeometry args={[0.095, 0.32, 6, 14]} />
      </mesh>
      <mesh position={[0.05, -0.97, 0]} material={m.engineDark}>
        <boxGeometry args={[0.12, 0.2, 0.03]} />
      </mesh>
      {/* Three-blade propeller */}
      <group position={[-0.28, -0.8, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]} material={m.chrome}>
          <cylinderGeometry args={[0.05, 0.04, 0.12, 12]} />
        </mesh>
        {[0, 1, 2].map((k) => (
          <group key={k} rotation={[(k * Math.PI * 2) / 3, 0, 0]}>
            <mesh position={[0, 0.13, 0]} rotation={[0.5, 0, 0]} material={m.chrome}>
              <boxGeometry args={[0.025, 0.2, 0.11]} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  )
}

interface WheelLegProps {
  /** Hinge point on the hull. */
  position: THREE.Vector3Tuple
  length: number
  /** z offsets of the wheels from the leg. */
  wheels: number[]
  /** Swing about the z axis: lowered and raised. Positive swings the wheel forward. */
  deployedAngle: number
  raisedAngle: number
  deployed: boolean
  m: Materials
  tread: THREE.BufferGeometry
}

function WheelLeg({ position, length, wheels, deployedAngle, raisedAngle, deployed, m, tread }: WheelLegProps) {
  const ref = useRef<THREE.Group>(null)

  useFrame((_, delta) => {
    if (!ref.current) return
    ref.current.rotation.z = THREE.MathUtils.damp(ref.current.rotation.z, deployed ? deployedAngle : raisedAngle, 2.5, delta)
  })

  return (
    <group position={position}>
      <mesh material={m.engineDark}>
        <boxGeometry args={[0.2, 0.22, 0.24]} />
      </mesh>
      <group ref={ref} rotation={[0, 0, deployed ? deployedAngle : raisedAngle]}>
        {/* Strut and hydraulic ram */}
        <mesh position={[0, -length / 2, 0]} material={m.chrome}>
          <cylinderGeometry args={[0.06, 0.06, length, 14]} />
        </mesh>
        <mesh position={[0.11, -length * 0.4, 0]} material={m.chrome}>
          <cylinderGeometry args={[0.035, 0.035, length * 0.65, 10]} />
        </mesh>
        <mesh position={[0, -length, 0]} material={m.engineDark}>
          <boxGeometry args={[0.16, 0.18, Math.max(...wheels.map(Math.abs)) * 2 + 0.08]} />
        </mesh>
        {wheels.map((z) => (
          <group key={z} position={[0, -length, z]} rotation={[Math.PI / 2, 0, 0]}>
            <mesh material={m.tire}>
              <cylinderGeometry args={[WHEEL_RADIUS - 0.03, WHEEL_RADIUS - 0.03, WHEEL_WIDTH, 32]} />
            </mesh>
            <mesh geometry={tread} material={m.tire} />
            <mesh material={m.chrome}>
              <cylinderGeometry args={[0.24, 0.24, WHEEL_WIDTH + 0.02, 24]} />
            </mesh>
            <mesh material={m.engineDark}>
              <cylinderGeometry args={[0.08, 0.08, WHEEL_WIDTH + 0.04, 12]} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  )
}
