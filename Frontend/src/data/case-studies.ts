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
  {
    slug: 'maha-kumbh-mela-2025',
    title: 'ITUS Amphibious Boats at Maha Kumbh Mela 2025',
    subtitle:
      'Supporting security, rescue preparedness and emergency response across the Prayagraj riverfront during Maha Kumbh Mela 2025.',
    coverImage: '/images/case-studies/image.jpg',
    coverAlt: 'ITUS amphibious boat operating on the river during Maha Kumbh Mela 2025',
    data: {
      client: 'Uttar Pradesh Anti-Terrorism Squad (UP ATS)',
      vesselType: 'Amphibious Boat',
      application: 'Security, Rescue & Emergency Response',
      location: 'Prayagraj, Uttar Pradesh, India',
      year: '2025',
      quantity: '4 IRS HDPE Rescue Boats',
      constructionMaterial: 'HDPE',
      keyConfiguration: 'Ocean Blue',
    },
    overview:
      'ITUS marine platforms supported security, rescue and emergency-response operations across the Prayagraj riverfront during Maha Kumbh Mela 2025.',
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
