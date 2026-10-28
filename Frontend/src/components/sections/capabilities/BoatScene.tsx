import { Bvh, CameraControls, ContactShadows, Environment, Grid, Html, Lightformer, useProgress } from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Suspense, useCallback, useEffect, useMemo, useRef, useState, type RefObject } from 'react'
import * as THREE from 'three'
import { boatModel } from '@/data/amphibious'
import type { BoatCameraView, BoatFeature, BoatViewMode } from '@/types'
import BoatModel, { featureOf, isShown, type BoatParts } from './BoatModel'

/** Where the camera goes: a fixed view, or framing a feature's parts. Applied whenever `key` changes. */
export interface BoatShot {
  key: number
  camera?: BoatCameraView
  featureId?: string
}

export interface BoatSceneProps {
  shot: BoatShot
  features: BoatFeature[]
  selectedId: string | null
  onSelect: (id: string) => void
  /** The model has loaded; lists the features that have parts in it. */
  onLoaded: (featureIds: string[]) => void
  mode: BoatViewMode
  deployed: boolean
  steering: number
  hiddenFeatures: Set<string>
  autoRotate: boolean
  /** The visitor started dragging or zooming; the viewer stops auto-rotating. */
  onInteract: () => void
  /** Render only while the viewer is on screen. */
  active: boolean
  reducedMotion: boolean
}

/** Real-time scene for the amphibious boat configurator. Loaded on demand (three.js is a large chunk). */
export default function BoatScene(props: BoatSceneProps) {
  const { active, deployed, onLoaded } = props
  const boat = useRef<THREE.Group>(null)
  const [parts, setParts] = useState<BoatParts | null>(null)

  const handleReady = useCallback(
    (found: BoatParts) => {
      setParts(found)
      onLoaded([...found.keys()])
    },
    [onLoaded],
  )

  return (
    <>
      <Canvas
        frameloop={active ? 'always' : 'never'}
        dpr={[1, 2]}
        camera={{ position: props.shot.camera?.position ?? [10, 5, 10], fov: 35, near: 0.1, far: 120 }}
        onCreated={({ gl }) => {
          gl.localClippingEnabled = true
        }}
        aria-hidden="true"
      >
        <hemisphereLight args={['#DDE4E6', '#2F4652', 0.8]} />
        <directionalLight position={[6, 10, 6]} intensity={1.4} />
        <directionalLight position={[-8, 4, -6]} intensity={0.5} color="#8FA6B2" />
        {/* Studio lighting built from light panels, so nothing is fetched from a CDN. The grey base keeps metal
            surfaces that face away from every panel from reflecting black. */}
        <Environment resolution={256} frames={1}>
          <color attach="background" args={['#4a5a63']} />
          <Lightformer form="rect" intensity={2.2} position={[0, 9, 0]} rotation-x={Math.PI / 2} scale={[14, 6, 1]} />
          <Lightformer form="rect" intensity={1.4} position={[10, 3, 0]} rotation-y={-Math.PI / 2} scale={[12, 3, 1]} />
          <Lightformer form="rect" intensity={1} position={[-10, 3, 4]} rotation-y={Math.PI / 2} scale={[12, 3, 1]} />
          <Lightformer form="ring" color="#DDE4E6" intensity={1.5} position={[0, 4, 10]} scale={4} />
        </Environment>

        <Suspense fallback={null}>
          <Bvh>
            <BoatModel
              groupRef={boat}
              features={props.features}
              mode={props.mode}
              deployed={deployed}
              steering={props.steering}
              hiddenFeatures={props.hiddenFeatures}
              selectedId={props.selectedId}
              onSelect={props.onSelect}
              onReady={handleReady}
              reducedMotion={props.reducedMotion}
            />
          </Bvh>
          {/* Re-render the shadow for a couple of seconds after the wheels move, then keep it still. */}
          {deployed && (
            <ContactShadows key={String(deployed)} position={[0, 0.005, 0]} opacity={0.6} scale={22} blur={2.4} far={4} resolution={512} frames={150} />
          )}
        </Suspense>

        <Water visible={!deployed} reducedMotion={props.reducedMotion} />
        <Grid
          position={[0, 0, 0]}
          infiniteGrid
          cellSize={0.5}
          sectionSize={2.5}
          cellColor="#2F4652"
          sectionColor="#42545D"
          fadeDistance={36}
          fadeStrength={1.6}
        />

        {parts && <Hotspots parts={parts} boat={boat} {...props} />}
        <Controls parts={parts} {...props} />
      </Canvas>
      {!parts && <LoadingOverlay />}
    </>
  )
}

function LoadingOverlay() {
  const { progress } = useProgress()
  return (
    <div className="pointer-events-none absolute inset-0 grid place-items-center">
      <div className="w-[220px] text-center" role="status">
        <div className="text-[12px] font-semibold uppercase tracking-ui text-ice-grey">
          Loading 3D model {Math.round(progress)}%
        </div>
        <div className="mt-3 h-px bg-dark-steel-border">
          <div className="h-px bg-oxide-red transition-[width] duration-300" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </div>
  )
}

function Controls({ shot, parts, features, autoRotate, onInteract }: BoatSceneProps & { parts: BoatParts | null }) {
  const ref = useRef<CameraControls>(null)
  // Key of the last shot the camera flew to; a refit of the same shot (the model just loaded) jumps instead.
  const lastKey = useRef<number | null>(null)
  const camera = useThree((state) => state.camera) as THREE.PerspectiveCamera
  const { width, height } = useThree((state) => state.size)

  useEffect(() => {
    const controls = ref.current
    if (!controls) return
    let view = shot.camera
    const feature = features.find((item) => item.id === shot.featureId)
    const featureParts = feature && parts?.get(feature.id)
    // Camera views give the direction to look from; the distance is worked out so the whole boat (or the selected
    // feature, with room around it) fills the stage at its current shape.
    if (feature && featureParts) {
      const box = new THREE.Box3()
      for (const part of featureParts) box.expandByObject(part)
      const target = box.getCenter(new THREE.Vector3())
      const direction = new THREE.Vector3(...feature.viewFrom).normalize()
      const distance = Math.max(3, fitDistance(box, target, direction, camera.fov, width / height, 1.6))
      view = { position: target.clone().addScaledVector(direction, distance).toArray(), target: target.toArray() }
    } else if (view && parts) {
      const box = new THREE.Box3()
      for (const featureParts of parts.values()) for (const part of featureParts) box.expandByObject(part)
      const target = box.getCenter(new THREE.Vector3())
      const direction = new THREE.Vector3(...view.position).sub(new THREE.Vector3(...view.target)).normalize()
      const distance = fitDistance(box, target, direction, camera.fov, width / height, 1.15)
      view = { position: target.clone().addScaledVector(direction, distance).toArray(), target: target.toArray() }
    }
    if (!view) return
    void controls.setLookAt(...view.position, ...view.target, lastKey.current !== null && lastKey.current !== shot.key)
    lastKey.current = shot.key
    // Only a new shot moves the camera (and the first fit once the model's parts are known).
  }, [shot.key, parts])

  useFrame((_, delta) => {
    if (autoRotate && ref.current) ref.current.azimuthAngle += delta * 0.14
  })

  return (
    <CameraControls
      ref={ref}
      makeDefault
      minDistance={2.5}
      maxDistance={36}
      maxPolarAngle={Math.PI * 0.6}
      smoothTime={0.6}
      onControlStart={onInteract}
    />
  )
}

/**
 * Distance from `target`, along `direction` (towards the camera), at which every corner of `box` is in view,
 * with `margin` (1 = touching the edges) of room around it.
 */
function fitDistance(box: THREE.Box3, target: THREE.Vector3, direction: THREE.Vector3, fov: number, aspect: number, margin: number) {
  const back = direction.clone().normalize()
  const right = new THREE.Vector3(0, 1, 0).cross(back)
  if (right.lengthSq() < 1e-8) right.set(1, 0, 0)
  right.normalize()
  const up = back.clone().cross(right)
  const tanV = Math.tan(THREE.MathUtils.degToRad(fov) / 2) / margin
  const tanH = tanV * aspect
  let distance = 0
  const corner = new THREE.Vector3()
  for (let i = 0; i < 8; i++) {
    corner.set(i & 1 ? box.max.x : box.min.x, i & 2 ? box.max.y : box.min.y, i & 4 ? box.max.z : box.min.z).sub(target)
    const depth = corner.dot(back)
    distance = Math.max(distance, depth + Math.abs(corner.dot(right)) / tanH, depth + Math.abs(corner.dot(up)) / tanV)
  }
  return distance
}

interface Anchor {
  feature: BoatFeature
  part: THREE.Object3D
  /** Hotspot position in the part's own space, so it follows the part as it moves. */
  local: THREE.Vector3
}

/**
 * Numbered markers on the features. Each sits on the outside of its feature (where a ray from the feature's camera
 * direction first meets it) and hides when something shown is in front of it, ignoring hidden and cut-away parts.
 */
function Hotspots({
  parts,
  boat,
  features,
  hiddenFeatures,
  selectedId,
  onSelect,
}: BoatSceneProps & { parts: BoatParts; boat: RefObject<THREE.Group | null> }) {
  const [anchors, setAnchors] = useState<Anchor[]>([])
  const groups = useRef<(THREE.Group | null)[]>([])
  const markers = useRef<(HTMLButtonElement | null)[]>([])
  const camera = useThree((state) => state.camera)
  const clock = useRef(0)
  const raycaster = useMemo(() => new THREE.Raycaster(), [])
  const world = useMemo(() => new THREE.Vector3(), [])

  useEffect(() => {
    const raycaster = new THREE.Raycaster()
    const found: Anchor[] = []
    for (const feature of features) {
      const featureParts = parts.get(feature.id)
      if (!featureParts) continue
      const box = new THREE.Box3()
      for (const part of featureParts) box.expandByObject(part)
      const center = box.getCenter(new THREE.Vector3())
      const direction = new THREE.Vector3(...feature.viewFrom).normalize()
      raycaster.set(center.clone().addScaledVector(direction, 30), direction.clone().negate())
      const hit = raycaster.intersectObjects(featureParts, true)[0]
      const point = hit?.point ?? center
      let part = hit?.object ?? featureParts[0]
      while (part.parent && !part.userData.feature) part = part.parent
      found.push({ feature, part, local: part.worldToLocal(point.clone()) })
    }
    setAnchors(found)
  }, [parts, features])

  useFrame((_, delta) => {
    clock.current += delta
    const check = clock.current > 0.12
    if (check) clock.current = 0
    anchors.forEach((anchor, index) => {
      const group = groups.current[index]
      const marker = markers.current[index]
      if (!group || !marker) return
      anchor.part.localToWorld(world.copy(anchor.local))
      group.position.copy(world)
      if (!check || !boat.current) return
      let shown = !hiddenFeatures.has(anchor.feature.id) && isShown(anchor.part, world)
      if (shown) {
        const toAnchor = world.clone().sub(camera.position)
        const distance = toAnchor.length()
        raycaster.set(camera.position, toAnchor.normalize())
        raycaster.far = distance
        const blocker = raycaster
          .intersectObject(boat.current, true)
          .find((hit) => isShown(hit.object, hit.point) && featureOf(hit.object)?.id !== anchor.feature.id)
        shown = !blocker || blocker.distance > distance - 0.2
      }
      marker.style.opacity = shown ? '1' : '0'
      marker.style.pointerEvents = shown ? 'auto' : 'none'
    })
  })

  return anchors.map((anchor, index) => (
    <group key={anchor.feature.id} ref={(node) => void (groups.current[index] = node)}>
      <Html center zIndexRange={[10, 0]}>
        <button
          ref={(node) => void (markers.current[index] = node)}
          type="button"
          tabIndex={-1}
          onClick={() => onSelect(anchor.feature.id)}
          title={anchor.feature.name}
          style={{ opacity: 0 }}
          className={`grid h-7 w-7 cursor-pointer place-items-center rounded-full border text-[11px] font-semibold text-white shadow-[0_0_0_4px_rgba(14,20,24,.25)] transition-[opacity,background-color,border-color] duration-200 ${
            selectedId === anchor.feature.id
              ? 'border-oxide-red bg-oxide-red'
              : 'border-white/70 bg-carbon-black/70 hover:border-oxide-red hover:bg-oxide-red'
          }`}
        >
          {features.indexOf(anchor.feature) + 1}
        </button>
      </Html>
    </group>
  ))
}

/** Translucent sea at the waterline, faded in when the wheels go up. */
function Water({ visible, reducedMotion }: { visible: boolean; reducedMotion: boolean }) {
  const material = useRef<THREE.MeshPhysicalMaterial>(null)

  useFrame((_, delta) => {
    const m = material.current
    if (!m) return
    const target = visible ? 0.55 : 0
    m.opacity = reducedMotion ? target : THREE.MathUtils.damp(m.opacity, target, 3, delta)
    m.visible = m.opacity > 0.01
  })

  return (
    <mesh position={[0, boatModel.waterlineY, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <circleGeometry args={[18, 64]} />
      <meshPhysicalMaterial
        ref={material}
        color="#2F4652"
        roughness={0.12}
        metalness={0.2}
        transparent
        opacity={0}
        depthWrite={false}
      />
    </mesh>
  )
}
