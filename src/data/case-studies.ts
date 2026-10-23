import type { CaseStudy, CaseStudyData } from '@/types'

/*
 * Case studies, in display order. Every project gets the same card, so order is the only ranking.
 * Only approved ITUS projects and verified facts go in here: leave a data field out rather than
 * guessing, and the detail page hides the whole row.
 *
 * Paths are plain public paths (no asset() call). `npm run case-studies:images` reads this file to
 * build the cover images in public/images/case-studies/ (AVIF + WebP at several widths) and
 * src/data/case-study-images.json. Run it after adding or changing a cover.
 */
export const caseStudies: CaseStudy[] = [
  // TODO before launch: placeholder copy from the Phase 3 brief. Replace with a verified project or remove.
  {
    slug: 'amphibious-rescue-platform',
    title: 'Amphibious Rescue Platform',
    subtitle: 'A specialised amphibious vessel programme developed for rescue and emergency-response environments.',
    coverImage: '/images/vessels/amphibious-boat/amphibious-boat-3.webp',
    coverAlt: 'Amphibious rescue boat with its wheels down, driving out of the sea onto a beach with crew aboard',
    data: {
      client: 'Government Agency',
      vesselType: 'Amphibious Boat',
      application: 'Rescue & Emergency',
      location: 'India',
      year: '2026',
      quantity: '02',
    },
    overview:
      'ITUS delivered two amphibious boats for rescue and emergency-response operations, built to launch from the shore, cross shallow water and reach people where conventional vessels cannot.',
  },
]

/** Project data rows, in display order. */
export const caseStudyFields: [key: keyof CaseStudyData, label: string][] = [
  ['client', 'Client'],
  ['vesselType', 'Vessel Type'],
  ['application', 'Application'],
  ['location', 'Location'],
  ['year', 'Year'],
  ['quantity', 'Quantity'],
  ['constructionMaterial', 'Construction Material'],
  ['lengthOverall', 'Length Overall'],
  ['speed', 'Speed'],
  ['capacity', 'Capacity'],
  ['propulsion', 'Propulsion'],
  ['keyConfiguration', 'Key Configuration'],
]

/** The [label, value] rows a case study has data for; blank or whitespace-only values are left out. */
export function caseStudyRows(data: CaseStudyData): [label: string, value: string][] {
  return caseStudyFields.flatMap(([key, label]) => {
    const value = data[key]?.trim()
    return value ? [[label, value]] : []
  })
}
