import transporter from '../config/mailer.js'
import { applicationMail } from '../templates/application.template.js'
import { contactMail } from '../templates/contact.template.js'

// Sender display name. Keep the company name out of it while MAIL_FROM is on another domain: Microsoft 365 treats
// "ITUS ..." <someone@other-domain> as impersonation and quarantines it before it reaches an @itus.net.in inbox.
const from = () => ({ name: process.env.MAIL_FROM_NAME || 'Website Form', address: process.env.MAIL_FROM })

/**
 * What the SMTP server answered, for mailStatus. A recipient in `rejected` was refused straight away; one in
 * `accepted` was queued, but its own mail server can still bounce or quarantine it later.
 */
function result(info) {
  return {
    sent: info.accepted.length > 0,
    sentAt: new Date(),
    accepted: info.accepted,
    rejected: info.rejected,
    response: info.response,
  }
}

/** Emails a saved application, with the CV attached, to the careers inbox (CAREERS_TO). Throws if sending fails. */
export async function sendApplicationMail(application) {
  if (!process.env.CAREERS_TO) throw new Error('CAREERS_TO is not set in .env')

  const { subject, html, text } = applicationMail(application)
  const info = await transporter.sendMail({
    from: from(),
    to: process.env.CAREERS_TO,
    replyTo: { name: application.fullName, address: application.email }, // HR can reply straight to the applicant
    subject,
    html,
    text,
    attachments: [{ filename: application.cv.originalName, path: application.cv.path }],
  })
  return result(info)
}

/** Emails a saved contact enquiry to the enquiries inbox (ENQUIRY_TO). Throws if sending fails. */
export async function sendContactMail(contact) {
  if (!process.env.ENQUIRY_TO) throw new Error('ENQUIRY_TO is not set in .env')

  const { subject, html, text } = contactMail(contact)
  const info = await transporter.sendMail({
    from: from(),
    to: process.env.ENQUIRY_TO,
    replyTo: { name: contact.name, address: contact.email }, // the team can reply straight to the enquirer
    subject,
    html,
    text,
  })
  return result(info)
}
