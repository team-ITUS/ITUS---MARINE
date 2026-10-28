import { useGLTF } from '@react-three/drei'
import { useFrame, useThree, type ThreeEvent } from '@react-three/fiber'
import { useEffect, useMemo, useState, type RefObject } from 'react'
import * as THREE from 'three'
import { boatMirroredPairs, boatModel, boatSteering, boatWheelLegs } from '@/data/amphibious'
import type { BoatFeature, BoatHinge, BoatViewMode } from '@/types'
import { asset } from '@/utils/asset'

export const BOAT_URL = asset(boatModel.url)

/** Model parts (CAD components) of each feature found in the model. */
export type BoatParts = Map<string, THREE.Object3D[]>

// Clipping planes keep what is below / on the port side of them. Open, they sit clear of the boat (3.5 m tall,
// 3.3 m beam) and nothing is cut; Interior and Cutaway modes slide them in.
const ROOF_OPEN = 4
const SECTION_OPEN = 2
const roofPlane = new THREE.Plane(new THREE.Vector3(0, -1, 0), ROOF_OPEN)
const sectionPlane = new THREE.Plane(new THREE.Vector3(0, 0, -1), SECTION_OPEN)

const SELECTED = new THREE.Color('#A94D42')
const AXES = { x: new THREE.Vector3(1, 0, 0), y: new THREE.Vector3(0, 1, 0), z: new THREE.Vector3(0, 0, 1) }

/** The feature a model part belongs to (set on each part when the model is prepared). */
export function featureOf(object: THREE.Object3D): BoatFeature | undefined {
  for (let node: THREE.Object3D | null = object; node; node = node.parent) {
    if (node.userData.feature) return node.userData.feature as BoatFeature
  }
  return undefined
}

/** True when a point on the model is shown: its part is visible and the point is not cut away. */
export function isShown(object: THREE.Object3D, point: THREE.Vector3) {
  for (let node: THREE.Object3D | null = object; node; node = node.parent) if (!node.visible) return false
  if (point.y > roofPlane.constant) return false
  return !(featureOf(object)?.shell && point.z > sectionPlane.constant)
}

interface Hinged {
  pivot: THREE.Group
  hinge: BoatHinge
  /** Cancels the assembly's rotation (the CAD model is Z-up), so the hinge turns about world axes. */
  base: THREE.Quaternion
  angle: number
}

interface PreparedBoat {
  parts: BoatParts
  materials: Map<string, THREE.MeshStandardMaterial[]>
  legs: Hinged[]
  engines: Hinged[]
}

const matches = (object: THREE.Object3D, prefixes: string[]) => {
  const name: string = object.userData.name ?? object.name
  return prefixes.some((prefix) => name.startsWith(prefix))
}

/**
 * Sorts the CAD components into features, gives each component its own materials (so one can be highlighted or
 * cut without touching the others) and puts wheel legs and outboards on hinge groups so they can turn in place.
 */
function prepare(scene: THREE.Object3D, features: BoatFeature[]): PreparedBoat {
  // The components are the children of the assembly node under the scene.
  let assembly = scene
  while (assembly.children.length === 1 && !(assembly as THREE.Mesh).isMesh) assembly = assembly.children[0]
  scene.updateMatrixWorld(true)

  // Fill in the missing side of a port/starboard pair with a mirror image (in world space, across z = 0).
  const mirror = new THREE.Matrix4().makeScale(1, 1, -1)
  const toAssembly = assembly.matrixWorld.clone().invert()
  for (const prefix of boatMirroredPairs) {
    const pair = assembly.children.filter((part) => matches(part, [prefix]))
    if (pair.length !== 1) continue
    const copy = pair[0].clone()
    copy.matrix.copy(toAssembly).multiply(mirror).multiply(assembly.matrixWorld).multiply(pair[0].matrix)
    copy.matrix.decompose(copy.position, copy.quaternion, copy.scale)
    assembly.add(copy)
  }
  scene.updateMatrixWorld(true)

  const parts: BoatParts = new Map()
  const materials = new Map<string, THREE.MeshStandardMaterial[]>()
  for (const part of [...assembly.children]) {
    const feature = features.find((item) => matches(part, item.parts))
    if (!feature) continue
    part.userData.feature = feature
    parts.set(feature.id, [...(parts.get(feature.id) ?? []), part])
    const own = new Map<THREE.Material, THREE.MeshStandardMaterial>()
    part.traverse((child) => {
      const mesh = child as THREE.Mesh
      if (!mesh.isMesh) return
      const swap = (material: THREE.Material) => {
        let copy = own.get(material)
        if (!copy) {
          copy = material.clone() as THREE.MeshStandardMaterial
          // Real transmission needs an extra render pass every frame; tinted see-through glass reads the same here.
          const glass = copy as THREE.MeshPhysicalMaterial
          if (glass.transmission > 0) {
            glass.transmission = 0
            glass.transparent = true
            glass.opacity = 0.35
            glass.depthWrite = false
          }
          copy.side = THREE.DoubleSide
          copy.clippingPlanes = feature.shell ? [roofPlane, sectionPlane] : [roofPlane]
          copy.userData.emissive = copy.emissive?.clone()
          copy.userData.emissiveIntensity = copy.emissiveIntensity
          own.set(material, copy)
          materials.set(feature.id, [...(materials.get(feature.id) ?? []), copy])
        }
        return copy
      }
      mesh.material = Array.isArray(mesh.material) ? mesh.material.map(swap) : swap(mesh.material)
    })
  }

  const hingeParts = (hinge: BoatHinge): Hinged[] =>
    assembly.children
      .filter((part) => matches(part, hinge.parts))
      .map((part) => {
        const box = new THREE.Box3().setFromObject(part)
        const size = box.getSize(new THREE.Vector3())
        const point = box.min.clone().add(size.multiply(new THREE.Vector3(...hinge.pivot)))
        const pivot = new THREE.Group()
        pivot.position.copy(assembly.worldToLocal(point))
        const base = assembly.getWorldQuaternion(new THREE.Quaternion()).invert()
        pivot.quaternion.copy(base)
        assembly.add(pivot)
        pivot.updateMatrixWorld(true)
        pivot.attach(part)
        return { pivot, hinge, base, angle: 0 }
      })

  return {
    parts,
    materials,
    legs: boatWheelLegs.flatMap(hingeParts),
    engines: hingeParts(boatSteering),
  }
}

interface BoatModelProps {
  groupRef: RefObject<THREE.Group | null>
  features: BoatFeature[]
  mode: BoatViewMode
  deployed: boolean
  /** Outboard steering, -1 (full port) to 1 (full starboard). */
  steering: number
  hiddenFeatures: Set<string>
  selectedId: string | null
  onSelect: (id: string) => void
  onReady: (parts: BoatParts) => void
  reducedMotion: boolean
}

/** The 10.2 m amphibious boat from the CAD assembly, with selectable parts, hinged wheel legs and outboards. */
export default function BoatModel({
  groupRef,
  features,
  mode,
  deployed,
  steering,
  hiddenFeatures,
  selectedId,
  onSelect,
  onReady,
  reducedMotion,
}: BoatModelProps) {
  const { scene } = useGLTF(BOAT_URL, false, true)
  // The loader caches the scene, so prepare it once even if this component mounts again.
  const boat = useMemo(() => (scene.userData.boat ??= prepare(scene, features)) as PreparedBoat, [scene, features])
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const canvas = useThree((state) => state.gl.domElement)

  useEffect(() => onReady(boat.parts), [boat, onReady])

  useEffect(() => {
    for (const [id, parts] of boat.parts) for (const part of parts) part.visible = !hiddenFeatures.has(id)
  }, [boat, hiddenFeatures])

  useEffect(() => {
    for (const [id, materials] of boat.materials) {
      const strength = id === selectedId ? 0.45 : id === hoveredId ? 0.2 : 0
      for (const material of materials) {
        if (!material.emissive) continue
        if (strength) {
          material.emissive.copy(SELECTED)
          material.emissiveIntensity = strength
        } else {
          material.emissive.copy(material.userData.emissive)
          material.emissiveIntensity = material.userData.emissiveIntensity
        }
      }
    }
  }, [boat, selectedId, hoveredId])

  useEffect(() => {
    canvas.style.cursor = hoveredId ? 'pointer' : ''
  }, [canvas, hoveredId])

  useEffect(
    () => () => {
      roofPlane.constant = ROOF_OPEN
      sectionPlane.constant = SECTION_OPEN
    },
    [],
  )

  useFrame((_, delta) => {
    const ease = (from: number, to: number, speed: number) =>
      reducedMotion ? to : THREE.MathUtils.damp(from, to, speed, delta)
    roofPlane.constant = ease(roofPlane.constant, mode === 'interior' ? boatModel.interiorCutY : ROOF_OPEN, 4)
    sectionPlane.constant = ease(sectionPlane.constant, mode === 'cutaway' ? 0 : SECTION_OPEN, 4)
    const turn = (hinged: Hinged, target: number, speed: number) => {
      hinged.angle = ease(hinged.angle, target, speed)
      hinged.pivot.quaternion.setFromAxisAngle(AXES[hinged.hinge.axis], hinged.angle).premultiply(hinged.base)
    }
    for (const leg of boat.legs) turn(leg, deployed ? 0 : leg.hinge.angle, 2.4)
    for (const engine of boat.engines) turn(engine, steering * engine.hinge.angle, 3)
  })

  /** The feature under the pointer, skipping hidden parts and the parts of the model that are cut away. */
  const pick = (event: ThreeEvent<PointerEvent | MouseEvent>) => {
    event.stopPropagation()
    const hit = event.intersections.find((item) => isShown(item.object, item.point))
    return hit ? featureOf(hit.object) : undefined
  }

  return (
    <group ref={groupRef}>
      <primitive
        object={scene}
        onPointerMove={(event: ThreeEvent<PointerEvent>) => setHoveredId(pick(event)?.id ?? null)}
        onPointerOut={() => setHoveredId(null)}
        onClick={(event: ThreeEvent<MouseEvent>) => {
          const feature = pick(event)
          // A drag that ends over the boat orbits the camera; only a click selects.
          if (feature && event.delta < 6) onSelect(feature.id)
        }}
      />
    </group>
  )
}
