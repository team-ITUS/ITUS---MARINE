// Email sent to the enquiries inbox (ENQUIRY_TO) for each new contact-form enquiry.
import { escape, layout, mailLink, multiline, oneLine, phoneLink, receivedAt } from './helpers.js'

export function contactMail(contact) {
  const received = receivedAt(contact.createdAt)

  // Same labels and order as the form on the website (Contact.tsx).
  const fields = [
    ['Name', escape(contact.name)],
    ['Organisation', escape(contact.organisation)],
    ['Contact Number', phoneLink(contact.phone)],
    ['Email', mailLink(contact.email)],
    ['Message', multiline(contact.message)],
  ]

  const subject = oneLine(`New Enquiry – ${contact.name} (${contact.organisation})`)

  const html = layout({
    eyebrow: 'ITUS Marine · Enquiry',
    title: 'New Website Enquiry',
    received,
    intro: `<strong>${escape(contact.name)}</strong> from <strong>${escape(contact.organisation)}</strong> has sent an
              enquiry. Reply to this email to respond to them directly.`,
    fields,
    footer: `Enquiry ID: ${escape(contact._id)}<br>Sent automatically from the ITUS Marine website contact form.`,
  })

  const text = [
    'NEW WEBSITE ENQUIRY – ITUS Marine',
    `Received: ${received}`,
    '',
    `Name: ${contact.name}`,
    `Organisation: ${contact.organisation}`,
    `Contact Number: ${contact.phone}`,
    `Email: ${contact.email}`,
    '',
    'Message:',
    contact.message,
    '',
    `Enquiry ID: ${contact._id}`,
  ].join('\n')

  return { subject, html, text }
}
