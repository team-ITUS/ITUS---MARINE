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

/** Exterior shows the whole boat, Interior lifts the wheelhouse roof off, Cutaway cuts the hull along the centreline. */
export type BoatViewMode = 'exterior' | 'interior' | 'cutaway'

/** A selectable group of parts in the boat model, shown as a hotspot, in the feature list and in the detail panel. */
export interface BoatFeature {
  id: string
  name: string
  description: string
  highlights: string[]
  /** Start of the names of the model's parts (the CAD assembly's top-level components) that belong to this feature. */
  parts: string[]
  /** Direction from the feature towards the camera when the feature is selected. */
  viewFrom: Vec3
  /** View mode the feature can be seen in; selecting it switches to that mode. */
  mode?: BoatViewMode
  /** Outer shell part: cut open in Cutaway mode. */
  shell?: boolean
}

/** Show/hide switch for a set of features. */
export interface BoatLayer {
  id: string
  label: string
  features: string[]
}

/** Parts that swing about a hinge: each matching part turns about its own hinge point. */
export interface BoatHinge {
  parts: string[]
  /** Hinge position inside each part's bounding box, as fractions of its size on x, y and z (0 = min, 1 = max). */
  pivot: Vec3
  /** Turning axis. */
  axis: 'x' | 'y' | 'z'
  /** Largest turn, in radians: the raised position for wheel legs, full lock for steering. */
  angle: number
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
