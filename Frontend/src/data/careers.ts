/** Options and rules for the Contact page "Submit Your Profile" form (ProfileForm). */

export const experienceOptions = [
  'Less than 1 year',
  '1–3 years',
  '3–5 years',
  '5–10 years',
  '10–15 years',
  '15+ years',
]

export const expertiseOptions = [
  'Marine Engineering',
  'Naval Architecture',
  'Production & Fabrication',
  'Mechanical & Propulsion',
  'Electrical & Systems Integration',
  'Testing & Commissioning',
  'Service & Maintenance',
  'Project Management',
  'Sales & Business Development',
  'Operations',
  'Other',
]

/** CV / resume upload. The server must enforce the same rules (and sniff the file content); these only give fast feedback. */
export const resumeRules = {
  extensions: ['pdf', 'doc', 'docx'],
  mimeTypes: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ],
  maxBytes: 10 * 1024 * 1024,
}

export const profileMessages = {
  required: 'This field is required.',
  email: 'Please enter a valid email address.',
  phone: 'Please enter a valid phone number.',
  url: 'Please enter a valid URL, starting with https://',
  resume: 'Please upload your CV in PDF, DOC or DOCX format within the permitted file-size limit.',
  consent: 'Please tick the box to agree before submitting your profile.',
}
