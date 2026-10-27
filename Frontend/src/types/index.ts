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
