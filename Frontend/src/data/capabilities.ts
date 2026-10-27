import { asset } from '@/utils/asset'
import type { CapabilityChapterData } from '@/types'

export const capabilityChapters: CapabilityChapterData[] = [
  {
    id: 'shipbuilding',
    title: 'Shipbuilding.',
    items: [
      'FRP construction',
      'Hull moulding',
      'Aluminium fabrication',
      'Structural assembly',
      'Lightweight construction',
      'Modular configurations',
    ],
    image: asset('/images/capabilities/shipbuilding.webp'),
  },
  {
    id: 'engineering-integration',
    title: 'Engineering & Integration.',
    items: [
      'Mechanical integration',
      'Electrical integration',
      'Navigation integration',
      'Propulsion integration',
      'Project-specific configuration',
    ],
    image: asset('/images/capabilities/engineering-integration.webp'),
  },
  {
    id: 'marine-systems',
    title: 'Marine Systems.',
   items: [
  'Outboard & Inboard Propulsion',
  'Stern Drives & Water Jets',
  'Yamaha & Tohatsu',
  'Navigation & Communication',
  'AIS & Vessel Monitoring',
  'Propeller Guards, Boat Trailers & Approved Marine Accessories',
],
    image: asset('/images/capabilities/marine-systems.webp'),
  },
  {
    id: 'testing-commissioning',
    title: 'Testing & Commissioning.',
    items: [
      'Inspection',
      'Sea trials',
      'Systems verification',
      'Commissioning',
      'Documentation',
      'Acceptance support',
    ],
    image: asset('/images/capabilities/testing-commissioning.webp'),
  },
  {
    id: 'lifecycle-support',
    title: 'Beyond Delivery.',
    items: [
      'Aftersales support',
      'Maintenance',
      'Repair',
      'Refit',
      'Dry docking',
      'Engine overhaul',
      'Water-jet overhaul',
      'Preventive maintenance',
    ],
    image: asset('/images/capabilities/lifecycle-support.webp'),
  },
]
