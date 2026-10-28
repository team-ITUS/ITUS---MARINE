import type { BoatCameraPreset, BoatFeature, BoatHullFinish, GalleryItem } from '@/types'

/*
 * Content for the interactive amphibious boat on the Capabilities page.
 * The 3D model is drawn in code (BoatModel.tsx) from the design renders; positions are in metres with x towards the
 * bow, y up from the deck line and z to starboard. Highlights are kept descriptive: add confirmed figures
 * (length, beam, power, speeds) here once they are signed off.
 */

export const boatCameraPresets: BoatCameraPreset[] = [
  { id: 'three-quarter', label: '3/4 View', position: [9, 4.2, 10.5], target: [0, -0.3, 0] },
  { id: 'profile', label: 'Profile', position: [0, 0.4, 15.5], target: [0, -0.3, 0] },
  { id: 'bow', label: 'Bow', position: [14, 1.6, 0], target: [0, -0.2, 0] },
  { id: 'stern', label: 'Stern', position: [-13.5, 2.6, 0], target: [0, -0.2, 0] },
  { id: 'top', label: 'Top', position: [0, 17, 0.01], target: [0, 0, 0] },
  { id: 'cockpit', label: 'Cockpit', position: [-6.8, 4.4, 4.2], target: [0.6, 0.6, 0] },
]

export const boatFeatures: BoatFeature[] = [
  {
    id: 'hull',
    name: 'Deep-V Hull',
    description:
      'Hard-chine deep-V planing hull that carries the boat offshore and runs it cleanly up beaches, ramps and riverbanks.',
    highlights: ['Hard-chine deep-V form', 'FRP or aluminium construction', 'Finish selectable in the viewer'],
    anchor: [0.6, -0.55, 1.05],
    view: { position: [3, -1.2, 9.5], target: [0.5, -0.5, 0] },
  },
  {
    id: 'collar',
    name: 'Fendering Collar',
    description:
      'A full-perimeter collar adds reserve buoyancy and stability, and protects the hull when coming alongside or landing.',
    highlights: ['Full-perimeter protection', 'Reserve buoyancy', 'Stable boarding platform'],
    anchor: [-1.6, 0.2, 1.45],
    view: { position: [-1, 2.2, 7.5], target: [-1.2, 0, 0.6] },
  },
  {
    id: 'rear-legs',
    name: 'Rear Wheel Legs',
    description:
      'Two transom-mounted legs with off-road tyres carry the stern on land and fold up clear of the water when afloat.',
    highlights: ['Transom-mounted pair', 'Fold clear for water operation', 'Off-road tyres'],
    anchor: [-4.15, -0.1, 1.6],
    view: { position: [-9, 0.4, 6.5], target: [-4, -0.8, 0.4] },
  },
  {
    id: 'bow-leg',
    name: 'Bow Wheel Leg',
    description:
      'A single forward leg with twin wheels completes the three-point undercarriage, steering the boat across the beach.',
    highlights: ['Twin-wheel nose leg', 'Folds forward when afloat', 'Three-point stance on land'],
    anchor: [4.2, -0.2, 0.4],
    view: { position: [8.5, 0.2, 5.5], target: [3.6, -0.8, 0] },
  },
  {
    id: 'outboards',
    name: 'Twin Outboards',
    description:
      'Twin outboards on the transom give redundancy for patrol and rescue work, under a stainless arch that guards the cockpit.',
    highlights: ['Twin-engine redundancy', 'Yamaha and Tohatsu options', 'Stainless stern arch'],
    anchor: [-4.45, 1.45, 0.45],
    view: { position: [-10, 3.2, 4.5], target: [-4, 0.3, 0] },
  },
  {
    id: 'wheelhouse',
    name: 'Enclosed Wheelhouse',
    description:
      'An enclosed, all-round-glazed wheelhouse with helm and navigator seats and an instrument console with a multifunction display.',
    highlights: ['Helm and navigator seats', 'Instrument console with MFD', 'All-round glazing'],
    anchor: [0.4, 1.2, 1.0],
    view: { position: [-6.8, 4.4, 4.2], target: [0.6, 0.6, 0] },
  },
  {
    id: 'navigation',
    name: 'Navigation & Lighting',
    description:
      'Roof-mounted antenna, dome, deck floodlights and port and starboard navigation lights, wired back to the helm.',
    highlights: ['Navigation lights', 'Deck floodlights', 'Antenna and roof dome'],
    anchor: [0.2, 2.35, 0],
    view: { position: [5, 6, 6], target: [0.4, 1.5, 0] },
  },
  {
    id: 'aft-cockpit',
    name: 'Aft Cockpit',
    description: 'An open aft cockpit with U-shaped seating around a central table, doubling as a working deck.',
    highlights: ['U-shaped seating', 'Central table', 'Open working deck'],
    anchor: [-2.4, 1, 0],
    view: { position: [-3, 7.5, 4.5], target: [-2.2, 0.2, 0] },
  },
  {
    id: 'forward-cabin',
    name: 'Forward Cabin',
    description:
      'Below the foredeck, a forward cabin with a marine head is reached from the wheelhouse. The viewer cuts the hull in half to show it.',
    highlights: ['Below-deck cabin', 'Marine head', 'Access from the wheelhouse'],
    anchor: [3.15, 0.5, 0],
    view: { position: [2.2, 0.8, 8.5], target: [1.6, 0, 0] },
    section: true,
  },
]

/** Hull colours offered in the viewer; the first is the default. */
export const boatHullFinishes: BoatHullFinish[] = [
  { id: 'gunmetal', label: 'Gunmetal', color: '#8a949a', metalness: 0.45, roughness: 0.38 },
  { id: 'copper', label: 'Copper', color: '#b8744f', metalness: 0.85, roughness: 0.3 },
  { id: 'arctic', label: 'Arctic White', color: '#e3e7e8', metalness: 0.1, roughness: 0.32 },
]

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
