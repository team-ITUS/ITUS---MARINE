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

/** World-space point in the 3D boat viewer: x towards the bow, y up, z to starboard (metres). */
export type Vec3 = [number, number, number]

/** Camera placement in the 3D boat viewer. */
export interface BoatCameraView {
  position: Vec3
  target: Vec3
}

export interface BoatCameraPreset extends BoatCameraView {
  id: string
  label: string
}

/** A selectable part of the amphibious boat, shown as a hotspot on the model and in the feature list. */
export interface BoatFeature {
  id: string
  name: string
  description: string
  highlights: string[]
  /** Where the hotspot sits on the model. */
  anchor: Vec3
  /** Camera move when the feature is selected. */
  view: BoatCameraView
  /** Switch the viewer to the half-section cut so the feature (inside the hull) is visible. */
  section?: boolean
}

/** Hull colour option in the 3D boat viewer (PBR values for the hull material). */
export interface BoatHullFinish {
  id: string
  label: string
  color: string
  metalness: number
  roughness: number
}

/** [label, value] pairs shown in spec rails and rows */
export type SpecEntry = [label: string, value: string]

export type GalleryAspect = '16:9' | '3:2' | '4:5'

export interface GalleryItem {
  id: string
  type: 'photo' | 'video'
  /** Full-resolution photo or video file (public path), or a YouTube/Vimeo embed URL. */
  src: string
  /** Public path of the image the tile thumbnails are generated from: the photo itself, or the video poster. */
  thumbnail: string
  /** Accessibility only; never shown on screen. */
  alt: string
  /** Shape of the original media. Phones keep it; larger screens use the grid slot's shape. */
  aspect: GalleryAspect
  videoSource?: 'youtube' | 'vimeo' | 'local'
}

/** Verified project facts shown on a case study page. Leave a field out when it is not confirmed. */
export interface CaseStudyData {
  client?: string
  vesselType?: string
  application?: string
  location?: string
  year?: string
  quantity?: string
  constructionMaterial?: string
  lengthOverall?: string
  speed?: string
  capacity?: string
  propulsion?: string
  keyConfiguration?: string
}

export interface CaseStudy {
  slug: string
  title: string
  /** One sentence, shown on the card and under the detail page title. */
  subtitle: string
  /** Public path of the approved cover photo (no asset() call). */
  coverImage: string
  coverAlt: string
  data: CaseStudyData
  /** Short verified write-up shown under the project data. Leave out to hide the section. */
  overview?: string
}
