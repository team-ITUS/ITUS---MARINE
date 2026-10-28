import type { BoatCameraPreset, BoatFeature, BoatHinge, BoatLayer, BoatViewMode, GalleryItem } from '@/types'

/*
 * Content for the 3D boat configurator on the Capabilities page.
 * The model is the SOLIDWORKS assembly of the 10.2 m amphibious luxury boat, converted for the web by
 * `npm run boat:model`. Positions are in metres with x towards the bow, y up from the ground under the wheels and
 * z to starboard. Features find their parts by the start of the CAD component names; a feature whose parts are not
 * in the model is left out of the viewer. Highlights are kept descriptive: add confirmed figures (speeds,
 * capacities) once they are signed off.
 */

export const boatModel = {
  url: '/models/boat/amphibious-10-2m.glb',
  /** Water surface when the wheels are raised. */
  waterlineY: 0.8,
  /** Height the Interior mode cuts the wheelhouse at. */
  interiorCutY: 2.6,
}

export const boatCameraPresets: BoatCameraPreset[] = [
  { id: 'three-quarter', label: '3/4', position: [8.2, 4.6, 9], target: [0, 1.3, 0] },
  { id: 'front', label: 'Front', position: [12, 2.4, 0], target: [0, 1.3, 0] },
  { id: 'side', label: 'Side', position: [0, 2, 12.5], target: [0, 1.3, 0] },
  { id: 'rear', label: 'Rear', position: [-12, 3.2, 0], target: [0, 1.3, 0] },
  { id: 'top', label: 'Top', position: [0, 15, 0.01], target: [0, 1, 0] },
]

/** Camera for each view mode; changing mode flies the camera here. */
export const boatModeViews: Record<BoatViewMode, BoatCameraPreset> = {
  exterior: boatCameraPresets[0],
  interior: { id: 'interior', label: 'Interior', position: [-5.8, 8.2, 5.6], target: [0.8, 1.4, 0] },
  cutaway: { id: 'cutaway', label: 'Cutaway', position: [1.5, 3.2, 12.5], target: [0.6, 1.3, 0] },
}

export const boatFeatures: BoatFeature[] = [
  {
    id: 'hull',
    name: 'Hull & Collar',
    description:
      'Deep-V planing hull with a full-length fendering collar and a transom that carries the outboards and stern wheel legs.',
    highlights: ['Deep-V planing hull', 'Full-length fendering collar', 'Transom for twin outboards'],
    parts: ['10.2m amphi luxury-cabine', 'new Transom'],
    viewFrom: [0.6, 0.15, 1],
    shell: true,
  },
  {
    id: 'wheelhouse',
    name: 'Wheelhouse',
    description: 'Enclosed wheelhouse with all-round tinted glazing and twin windscreen wipers over the helm.',
    highlights: ['All-round tinted glazing', 'Twin windscreen wipers', 'Roof-mounted lights and antenna'],
    parts: ['stream cab', 'wiper'],
    viewFrom: [1, 0.5, 0.8],
    shell: true,
  },
  {
    id: 'helm',
    name: 'Helm Console',
    description:
      'Helm with steering wheel, throttle, display screen, gauges and speedometer, switch panels and a VHF marine radio.',
    highlights: ['Steering wheel and throttle', 'Display, gauges and switch panels', 'VHF marine radio'],
    parts: ['Steering Wheel', 'THROTAL', 'screen', 'button assembly', 'Gauge', 'dial speedo', 'vhf radio', 'IC-M330G'],
    viewFrom: [-1, 0.9, 0.35],
    mode: 'interior',
  },
  {
    id: 'seating',
    name: 'Seating & Lounge',
    description: 'Helm and navigator seats, bench seating behind them and an aft lounge with a telescopic table.',
    highlights: ['Helm and navigator seats', 'Bench seating', 'Aft lounge with telescopic table'],
    parts: ['3d seat', 'back seat', 'luxury seat', 'MirrorCouch', 'teliscopic table', 'IC engine box'],
    viewFrom: [-0.5, 1, 0.6],
    mode: 'interior',
  },
  {
    id: 'head',
    name: 'Marine Head',
    description: 'Below the foredeck, a marine toilet compartment reached from the wheelhouse. The cutaway shows it.',
    highlights: ['Marine toilet', 'Below-deck compartment', 'Access from the wheelhouse'],
    parts: ['toilet', 'bathroom toilet roll'],
    viewFrom: [0.2, 0.25, 1],
    mode: 'cutaway',
  },
  {
    id: 'deck',
    name: 'Side Decks',
    description: 'Walkways along both sides of the wheelhouse, laid with timber-finish pads, run from the cockpit to the bow.',
    highlights: ['Walkways on both sides', 'Timber-finish pads', 'Cockpit-to-bow access'],
    parts: ['waking pad'],
    viewFrom: [0.3, 1, 1],
  },
  {
    id: 'engines',
    name: 'Twin Outboards',
    description:
      'Twin Yamaha 250 hp outboards on the transom give redundancy for patrol and rescue work. Steer them with the slider.',
    highlights: ['Twin 250 hp outboards', 'Engine redundancy', 'Steering shown in the viewer'],
    parts: ['yamaha 250 hp'],
    viewFrom: [-1, 0.45, 0.7],
  },
  {
    id: 'stern-legs',
    name: 'Stern Wheel Legs',
    description:
      'A wheel leg on each side of the transom carries the stern on land and swings up clear of the water when afloat.',
    highlights: ['Port and starboard legs', 'Swing up for water operation', 'Off-road tyres'],
    parts: ['S45 STERN'],
    viewFrom: [-0.8, 0.2, 1],
  },
  {
    id: 'bow-leg',
    name: 'Bow Wheel Leg',
    description: 'A single bow leg completes the three-point undercarriage and steers the boat across the beach.',
    highlights: ['Steerable nose leg', 'Folds up when afloat', 'Three-point stance on land'],
    parts: ['S45 BOW LEG'],
    viewFrom: [1, 0.2, 0.8],
  },
  {
    id: 'ground-tackle',
    name: 'Anchoring',
    description: 'Foredeck anchor windlass with the anchor and a chain guide at the bow.',
    highlights: ['Anchor windlass', 'Bow anchor', 'Chain guide'],
    parts: ['Anchor Windlass', 'anchor-1', 'chain guid'],
    viewFrom: [0.8, 1, 0.5],
  },
  {
    id: 'navigation',
    name: 'Lights & Antenna',
    description: 'Port and starboard navigation lights, LED deck lights, an antenna and speakers inside and out.',
    highlights: ['Navigation lights', 'LED deck lights', 'Antenna and speakers'],
    parts: ['m6 light', 'GREEN light', 'red light', 'Antenna', 'speaker'],
    viewFrom: [0.6, 1, 0.8],
  },
]

/** Show/hide switches in the viewer. */
export const boatLayers: BoatLayer[] = [
  { id: 'wheelhouse', label: 'Wheelhouse', features: ['wheelhouse'] },
  { id: 'hull', label: 'Hull', features: ['hull', 'deck', 'ground-tackle'] },
  { id: 'fittings', label: 'Fittings', features: ['helm', 'seating', 'head', 'navigation'] },
  { id: 'engines', label: 'Engines', features: ['engines'] },
  { id: 'wheels', label: 'Wheels', features: ['stern-legs', 'bow-leg'] },
]

/**
 * Parts fitted as a port and starboard pair. When the model has only one of a pair (a part dropped from the
 * export), the viewer mirrors it across the centreline to fill the other side.
 */
export const boatMirroredPairs: string[] = ['S45 STERN', 'yamaha 250 hp']

/** Wheel legs: the CAD model has them lowered; `angle` raises them for water. */
export const boatWheelLegs: BoatHinge[] = [
  { parts: ['S45 STERN'], pivot: [0.85, 0.95, 0.5], axis: 'z', angle: -1.6 },
  { parts: ['S45 BOW LEG'], pivot: [0.2, 0.95, 0.5], axis: 'z', angle: 1.6 },
]

/** Outboard steering: each engine turns about a vertical axis near its transom bracket, up to `angle` each way. */
export const boatSteering: BoatHinge = { parts: ['yamaha 250 hp'], pivot: [0.9, 0.5, 0.5], axis: 'y', angle: 0.5 }

const render = (id: string, alt: string): GalleryItem => ({
  id,
  type: 'photo',
  src: `/images/capabilities/amphibious/${id}.webp`,
  thumbnail: `/images/capabilities/amphibious/${id}-thumb.webp`,
  alt,
  aspect: '3:2',
})

/** Design renders shown under the viewer and opened in the lightbox. */
export const boatRenders: GalleryItem[] = [
  render('three-quarter-bow', 'Amphibious boat from the starboard bow with wheels lowered'),
  render('starboard-quarter', 'Amphibious boat from the starboard side'),
  render('stern-quarter', 'Stern view showing twin outboards and rear wheel legs'),
  render('profile', 'Port profile of the amphibious boat'),
  render('deck-overview', 'Aft cockpit and wheelhouse seen from above'),
  render('wheelhouse', 'Wheelhouse interior with helm seats and console'),
  render('bow', 'Bow view with the nose wheel leg lowered'),
  render('stern', 'Stern view with twin outboards'),
  render('deck-plan', 'Deck plan with the wheelhouse roof removed'),
  render('plan', 'Plan view of the boat'),
  render('bow-cabin-cutaway', 'Cutaway of the forward cabin and marine head'),
  render('section', 'Long section through the wheelhouse and forward cabin'),
  render('underside', 'Underside of the hull'),
  render('underside-stern', 'Underside at the stern with outboards and wheel legs'),
]
