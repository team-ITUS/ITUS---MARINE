export type VesselCategory =
  | 'Rescue & SAR'
  | 'Defence & Security'
  | 'Patrol'
  | 'Patrolling & SAR'
  | 'Rescue & Emergency'
  | 'Utility & Workboats'
  | 'Special Craft';

export type VesselApplication =
  | 'Rescue & Emergency'
  | 'Government'
  | 'Defence & Security'
  | 'Patrol & Security'
  | 'Commercial & Utility'
  | 'Tourism & Leisure'
  | 'Ports & Harbours'
  | 'Special Craft';

export interface Vessel {
  id: string;
  slug: string;
  brochureOrder: number;
  featured?: boolean;
  heroFeatured?: boolean;
  priorityPlatform?: boolean;
  name: string;
  category: VesselCategory;
  applicationTags?: VesselApplication[];
  shortDescription: string;
  longDescription: string;
  heroImage: string;
  galleryImages: string[];
  length?: string;
  beam?: string;
  draft?: string;
  speed?: string;
  capacity?: string;
  propulsion?: string;
  hullMaterial?: string;
  missionApplications: string[];
  keyFeatures: string[];
  technicalSpecs: { label: string; value: string | string[] }[];
  optionalEquipment?: string[];
  sourceDocument?: string;
  sourcePage?: number;
}

export interface CapabilityChapterData {
  id: string
  title: string
  items: string[]
  /** Public path of the photo that illustrates the chapter */
  image: string
}

/** [label, value] pairs shown in spec rails and rows */
export type SpecEntry = [label: string, value: string]
