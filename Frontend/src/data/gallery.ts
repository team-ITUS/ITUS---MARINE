import type { GalleryItem } from '@/types'

/*
 * Gallery media, in display order. Only approved media goes in here.
 * Grouped by vessel in the Vessels page order (brochureOrder), then shipyard, systems and workshop photos.
 *
 * Paths are plain public paths (no asset() call): the page resolves them against the base path, and
 * `npm run gallery:thumbs` reads this file to build the tile thumbnails in public/images/gallery/
 * (AVIF + WebP at several widths) and src/data/gallery-thumbs.json. Run it after adding or changing items.
 *
 * The grid places items by position, not by a field on the item, in blocks of four (see GalleryGrid): a
 * full-width panoramic tile, then a tall feature tile beside two stacked tiles. With "All" selected the
 * full-width tiles are items 1, 5, 9, 13 ... (every fourth), so put wide 16:9 photos and videos there;
 * the feature and side tiles are close to square and suit 4:3 / 3:2 photos.
 *
 * Videos: local files play in an HTML5 player. For YouTube or Vimeo, set videoSource and use the embed URL
 * as src (https://www.youtube-nocookie.com/embed/<id> or https://player.vimeo.com/video/<id>).
 */
export const galleryItems: GalleryItem[] = [
  {
    id: 'amphibious-boat-beach-exit',
    type: 'photo',
    src: '/images/vessels/amphibious-boat/amphibious-boat-3.webp',
    thumbnail: '/images/vessels/amphibious-boat/amphibious-boat-3.webp',
    alt: 'Amphibious rigid inflatable boat with its wheels down, driving out of the sea onto a beach with crew aboard',
    aspect: '16:9',
  },
  {
    id: 'video-amphibious-boat',
    type: 'video',
    videoSource: 'local',
    src: '/videos/About/about-hero.mp4',
    thumbnail: '/videos/About/about-hero-poster.jpg',
    alt: 'Amphibious boat driving off a beach into the sea',
    aspect: '16:9',
  },
  {
    id: 'amphibious-boat-beach-team',
    type: 'photo',
    src: '/images/vessels/amphibious-boat/amphibious-boat-1.webp',
    thumbnail: '/images/vessels/amphibious-boat/amphibious-boat-1.webp',
    alt: 'Armed personnel taking position beside a black amphibious boat on a beach',
    aspect: '3:2',
  },
  {
    id: 'floating-bridge-aerial',
    type: 'photo',
    src: '/images/vessels/beb/bridge-erection-boat-2.webp',
    thumbnail: '/images/vessels/beb/bridge-erection-boat-2.webp',
    alt: 'Aerial view of a bridge erection boat pushing a floating bridge section',
    aspect: '3:2',
  },
    {
    id: 'bridge-erection-boat-river',
    type: 'photo',
    src: '/images/vessels/beb/bridge-erection-boat-1.webp',
    thumbnail: '/images/vessels/beb/bridge-erection-boat-1.webp',
    alt: 'Green bridge erection boat with crew aboard pushing through river water',
    aspect: '3:2',
  },
 
  {
    id: 'video-bridging-boat',
    type: 'video',
    videoSource: 'local',
    src: '/videos/Capabilties/capabilities-hero.mp4',
    thumbnail: '/videos/Capabilties/capabilities-hero-poster.jpg',
    alt: 'Bridging boat and pontoon ferry carrying a tank across a river',
    aspect: '16:9',
  },
   {
    id: 'bridge-erection-boat-aerial',
    type: 'photo',
    src: '/images/about/bridge-erection-boat-3.webp',
    thumbnail: '/images/about/bridge-erection-boat-3.webp',
    alt: 'Aerial view of a green bridge erection boat crossing open water and leaving a white wake',
    aspect: '16:9',
  },

    {
    id: 'swamp-boat-sunset',
    type: 'photo',
    src: '/images/vessels/swamp-boat-stern-drive-frp-aluminium/swamp-boat-stern-drive-1.webp',
    thumbnail: '/images/vessels/swamp-boat-stern-drive-frp-aluminium/swamp-boat-stern-drive-1.webp',
    alt: 'Swamp boat with a T-top console on a still lake at sunset',
    aspect: '16:9',
  },
  
 
  
  {
    id: 'airboat-river',
    type: 'photo',
    src: '/images/vessels/airboat/airboat-1.webp',
    thumbnail: '/images/vessels/airboat/airboat-1.webp',
    alt: 'Camouflaged enclosed airboat skimming across a river past reeds',
    aspect: '16:9',
  },
  {
    id: 'video-airboat',
    type: 'video',
    videoSource: 'local',
    src: '/videos/VesselHero/vessel-hero.mp4',
    thumbnail: '/videos/VesselHero/vessel-hero-poster.jpg',
    alt: 'Airboat speeding through wetland channels',
    aspect: '16:9',
  },
  
  {
    id: 'fibre-boat-passengers',
    type: 'photo',
    src: '/images/vessels/6-7m-fibre-boat/6-7m-fibre-boat-1.webp',
    thumbnail: '/images/vessels/6-7m-fibre-boat/6-7m-fibre-boat-1.webp',
    alt: 'Orange fibre boat with a canopy frame carrying passengers on open water',
    aspect: '16:9',
  },
 
  {
    id: 'armoured-cabin-boat-marina',
    type: 'photo',
    src: '/images/vessels/swamp-boat-obm-open-bulletproof/swamp-boat-obm-2.webp',
    thumbnail: '/images/vessels/swamp-boat-obm-open-bulletproof/swamp-boat-obm-2.webp',
    alt: 'Sand-coloured armoured cabin boat moored in a marina',
    aspect: '3:2',
  },
   {
    id: 'airboat-calm-water',
    type: 'photo',
    src: '/images/vessels/airboat/airboat-2.webp',
    thumbnail: '/images/vessels/airboat/airboat-2.webp',
    alt: 'Black airboat with red trim and passenger seating on calm water',
    aspect: '16:9',
  },

  {
    id: 'swamp-boat-tropical',
    type: 'photo',
    src: '/images/vessels/swamp-boat-obm-open-bulletproof/swamp-boat-obm-1.webp',
    thumbnail: '/images/vessels/swamp-boat-obm-open-bulletproof/swamp-boat-obm-1.webp',
    alt: 'Grey open swamp boat with a mounted gun on clear tropical water',
    aspect: '3:2',
  },
  {
    id: 'rib-on-trailer',
    type: 'photo',
    src: '/images/vessels/5-4m-rib/5-4m-rib-2.webp',
    thumbnail: '/images/vessels/5-4m-rib/5-4m-rib-2.webp',
    alt: 'Red and black rigid inflatable boat resting on a trailer',
    aspect: '3:2',
  },

  {
    id: 'ambulance-boat-bridge',
    type: 'photo',
    src: '/images/vessels/10m-ambulance/10m-ambulance-boat-1.webp',
    thumbnail: '/images/vessels/10m-ambulance/10m-ambulance-boat-1.webp',
    alt: 'White ambulance boat with a red fender and emergency lights on a river beside a bridge pier',
    aspect: '3:2',
  },
  {
    id: 'ambulance-boat-underway',
    type: 'photo',
    src: '/images/about/10m-ambulance-boat-2.webp',
    thumbnail: '/images/about/10m-ambulance-boat-2.webp',
    alt: 'Ten metre ambulance boat in red and white livery underway on a river',
    aspect: '16:9',
  },
  {
    id: 'catamaran-river',
    type: 'photo',
    src: '/images/vessels/catamaran/catamaran-1.webp',
    thumbnail: '/images/vessels/catamaran/catamaran-1.webp',
    alt: 'Blue and white catamaran vessel underway on a river',
    aspect: '3:2',
  },
  {
    id: 'wheelhouse-interior',
    type: 'photo',
    src: '/images/vessels/catamaran/catamaran-3.webp',
    thumbnail: '/images/vessels/catamaran/catamaran-3.webp',
    alt: 'Wood-finished wheelhouse interior with a helm station and navigation electronics',
    aspect: '3:2',
  },
  {
    id: 'patrol-boat-quay',
    type: 'photo',
    src: '/images/vessels/patrol-boat/patrol-boat-1.webp',
    thumbnail: '/images/vessels/patrol-boat/patrol-boat-1.webp',
    alt: 'White security patrol boat moored alongside a stone quay',
    aspect: '16:9',
  },
  {
    id: 'support-vessels-launch',
    type: 'photo',
    src: '/images/vessels/isv/immediate-support-vessel-1.webp',
    thumbnail: '/images/vessels/isv/immediate-support-vessel-1.webp',
    alt: 'Three immediate support vessels dressed with signal flags at a launch ceremony',
    aspect: '3:2',
  },
  {
    id: 'crew-boat-spray',
    type: 'photo',
    src: '/images/vessels/23-8m-crew-boat/23-8m-crew-boat-1.webp',
    thumbnail: '/images/vessels/23-8m-crew-boat/23-8m-crew-boat-1.webp',
    alt: 'Black-hulled 23.8 metre crew boat at speed, throwing spray from its bow',
    aspect: '16:9',
  },
  {
    id: 'video-crew-boat',
    type: 'video',
    videoSource: 'local',
    src: '/videos/home/define-your-next-vessel.mp4',
    thumbnail: '/images/home/define-your-next-vessel/23-8m-crew-boat-2.webp',
    alt: 'Crew boat underway at sea along a green coastline',
    aspect: '16:9',
  },
  {
    id: 'helm-console',
    type: 'photo',
    src: '/images/capabilities/marine-systems.webp',
    thumbnail: '/images/capabilities/marine-systems.webp',
    alt: 'Close view of a helm console with marine electronics, throttle and steering wheel',
    aspect: '16:9',
  },
  {
    id: 'shipyard-hull-construction',
    type: 'photo',
    src: '/images/capabilities/shipbuilding.webp',
    thumbnail: '/images/capabilities/shipbuilding.webp',
    alt: 'Bare aluminium hull under construction inside the shipyard hall',
    aspect: '3:2',
  },
  {
    id: 'cabin-vessel-fabrication',
    type: 'photo',
    src: '/images/capabilities/engineering-integration.webp',
    thumbnail: '/images/capabilities/engineering-integration.webp',
    alt: 'Technicians working on an aluminium cabin vessel in the fabrication hall',
    aspect: '3:2',
  },
  {
    id: 'rib-trailer-launch',
    type: 'photo',
    src: '/images/capabilities/testing-commissioning.webp',
    thumbnail: '/images/capabilities/testing-commissioning.webp',
    alt: 'Crew in orange shirts launching a red rigid inflatable boat from a trailer',
    aspect: '3:2',
  },
  {
    id: 'inflatable-boat-workshop',
    type: 'photo',
    src: '/images/capabilities/lifecycle-support.webp',
    thumbnail: '/images/capabilities/lifecycle-support.webp',
    alt: 'Orange inflatable boat with an outboard motor on a trailer inside a service workshop',
    aspect: '3:2',
  },
]
