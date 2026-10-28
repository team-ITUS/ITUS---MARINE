import { CameraControls, ContactShadows, Environment, Grid, Html, Lightformer } from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef, type RefObject } from 'react'
import * as THREE from 'three'
import type { BoatCameraView, BoatFeature, BoatHullFinish } from '@/types'
import BoatModel, { GROUND_Y, WATERLINE_Y } from './BoatModel'

export interface BoatSceneProps {
  /** Camera move to make; it runs whenever `viewKey` changes (the first one jumps, later ones glide). */
  view: BoatCameraView
  viewKey: number
  features: BoatFeature[]
  selectedId: string | null
  onSelect: (id: string) => void
  finish: BoatHullFinish
  deployed: boolean
  section: boolean
  autoRotate: boolean
  /** The visitor started dragging or zooming; the viewer stops auto-rotating. */
  onInteract: () => void
  /** Render only while the viewer is on screen. */
  active: boolean
  reducedMotion: boolean
}

/** Real-time scene for the amphibious boat. Loaded on demand (three.js is a large chunk). */
export default function BoatScene(props: BoatSceneProps) {
  const { view, active, deployed, features, selectedId, onSelect } = props
  const boat = useRef<THREE.Group>(null)
  // Hotspots hide when the hull is between them and the camera.
  const occluders = useMemo(() => [boat as RefObject<THREE.Object3D>], [])

  return (
    <Canvas
      frameloop={active ? 'always' : 'never'}
      dpr={[1, 2]}
      camera={{ position: view.position, fov: 35, near: 0.1, far: 120 }}
      onCreated={({ gl }) => {
        gl.localClippingEnabled = true
      }}
      aria-hidden="true"
    >
      <hemisphereLight args={['#DDE4E6', '#2F4652', 0.7]} />
      <directionalLight position={[6, 10, 6]} intensity={1.4} />
      <directionalLight position={[-8, 4, -6]} intensity={0.5} color="#8FA6B2" />
      {/* Studio lighting built from light panels, so nothing is fetched from a CDN. The grey base keeps metal
          surfaces that face away from every panel from reflecting black. */}
      <Environment resolution={256} frames={1}>
        <color attach="background" args={['#4a5a63']} />
        <Lightformer form="rect" intensity={2.2} position={[0, 8, 0]} rotation-x={Math.PI / 2} scale={[14, 6, 1]} />
        <Lightformer form="rect" intensity={1.4} position={[10, 2, 0]} rotation-y={-Math.PI / 2} scale={[12, 3, 1]} />
        <Lightformer form="rect" intensity={1} position={[-10, 2, 4]} rotation-y={Math.PI / 2} scale={[12, 3, 1]} />
        <Lightformer form="ring" color="#DDE4E6" intensity={1.5} position={[0, 3, 10]} scale={4} />
      </Environment>

      <BoatModel
        groupRef={boat}
        finish={props.finish}
        deployed={deployed}
        section={props.section}
        reducedMotion={props.reducedMotion}
      />
      <Water visible={!deployed} />
      {deployed && <ContactShadows position={[0, GROUND_Y + 0.005, 0]} opacity={0.6} scale={22} blur={2.4} far={4} resolution={512} />}
      <Grid
        position={[0, GROUND_Y, 0]}
        infiniteGrid
        cellSize={0.5}
        sectionSize={2.5}
        cellColor="#2F4652"
        sectionColor="#42545D"
        fadeDistance={34}
        fadeStrength={1.6}
      />

      {features.map((feature, index) => (
        <Html
          key={feature.id}
          position={feature.anchor}
          center
          zIndexRange={[10, 0]}
          occlude={occluders}
        >
          <button
            type="button"
            tabIndex={-1}
            onClick={() => onSelect(feature.id)}
            title={feature.name}
            className={`grid h-7 w-7 cursor-pointer place-items-center rounded-full border text-[11px] font-semibold text-white shadow-[0_0_0_4px_rgba(14,20,24,.25)] transition-colors duration-200 ${
              selectedId === feature.id
                ? 'border-oxide-red bg-oxide-red'
                : 'border-white/70 bg-carbon-black/70 hover:border-oxide-red hover:bg-oxide-red'
            }`}
          >
            {index + 1}
          </button>
        </Html>
      ))}

      <Controls {...props} />
    </Canvas>
  )
}

function Controls({ view, viewKey, autoRotate, onInteract }: BoatSceneProps) {
  const ref = useRef<CameraControls>(null)
  const first = useRef(true)
  const { width, height } = useThree((state) => state.size)

  useEffect(() => {
    const controls = ref.current
    if (!controls) return
    // Views are framed for a landscape stage; on narrower (phone) stages, back the camera off so the boat still fits.
    const pullBack = Math.max(1, 1.3 / (width / height))
    const [px, py, pz] = view.position
    const [tx, ty, tz] = view.target
    void controls.setLookAt(
      tx + (px - tx) * pullBack,
      ty + (py - ty) * pullBack,
      tz + (pz - tz) * pullBack,
      tx,
      ty,
      tz,
      !first.current,
    )
    first.current = false
    // Only a new viewKey moves the camera; `view` changes with it.
  }, [viewKey])

  useFrame((_, delta) => {
    if (autoRotate && ref.current) ref.current.azimuthAngle += delta * 0.14
  })

  return (
    <CameraControls
      ref={ref}
      makeDefault
      minDistance={4}
      maxDistance={36}
      maxPolarAngle={Math.PI * 0.6}
      smoothTime={0.6}
      onControlStart={onInteract}
    />
  )
}

/** Translucent sea at the waterline, faded in when the wheels go up. */
function Water({ visible }: { visible: boolean }) {
  const material = useRef<THREE.MeshPhysicalMaterial>(null)

  useFrame((_, delta) => {
    const m = material.current
    if (!m) return
    m.opacity = THREE.MathUtils.damp(m.opacity, visible ? 0.55 : 0, 3, delta)
    m.visible = m.opacity > 0.01
  })

  return (
    <mesh position={[0, WATERLINE_Y, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <circleGeometry args={[16, 64]} />
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
