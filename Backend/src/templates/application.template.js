// Email sent to the careers inbox (CAREERS_TO) for each new application.
import { colors, empty, escape, layout, link, mailLink, multiline, oneLine, phoneLink, receivedAt } from './helpers.js'

function fileSize(bytes) {
  if (!bytes) return ''
  return bytes < 1024 * 1024 ? `${Math.round(bytes / 1024)} KB` : `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function applicationMail(app) {
  const cvLine = `${app.cv.originalName}${app.cv.size ? ` (${fileSize(app.cv.size)})` : ''}`
  const received = receivedAt(app.createdAt)

  // Same labels and order as the form on the website (ProfileForm.tsx).
  const fields = [
    ['Full Name', escape(app.fullName)],
    ['Email Address', mailLink(app.email)],
    ['Phone Number', phoneLink(app.phone)],
    ['Current Location', escape(app.location)],
    ['Current Role / Designation', escape(app.currentRole)],
    ['Years of Experience', escape(app.experience)],
    ['Area of Expertise', escape(app.expertise)],
    ['LinkedIn Profile', app.linkedin ? link(app.linkedin, app.linkedin) : ''],
    ['CV / Resume', `${escape(cvLine)}<br><span style="font-size:12px;color:${colors.muted};">Attached to this email</span>`],
    ['Short Message', multiline(app.message)],
  ]

  const subject = oneLine(`New Application – ${app.fullName} · ${app.expertise}`)

  const html = layout({
    eyebrow: 'ITUS Marine · Careers',
    title: 'New Career Application',
    received,
    intro: `<strong>${escape(app.fullName)}</strong> has applied for <strong>${escape(app.expertise)}</strong>
              with <strong>${escape(app.experience)}</strong> of experience. Reply to this email to contact the applicant directly.`,
    fields,
    footer: `Application ID: ${escape(app._id)}<br>Sent automatically from the ITUS Marine website careers form.`,
  })

  const text = [
    'NEW CAREER APPLICATION – ITUS Marine',
    `Received: ${received}`,
    '',
    `Full Name: ${app.fullName}`,
    `Email Address: ${app.email}`,
    `Phone Number: ${app.phone}`,
    `Current Location: ${app.location}`,
    `Current Role / Designation: ${app.currentRole || empty}`,
    `Years of Experience: ${app.experience}`,
    `Area of Expertise: ${app.expertise}`,
    `LinkedIn Profile: ${app.linkedin || empty}`,
    `CV / Resume: ${cvLine} (attached)`,
    '',
    'Short Message:',
    app.message || empty,
    '',
    `Application ID: ${app._id}`,
  ].join('\n')

  return { subject, html, text }
}
