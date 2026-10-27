import Contact from '../models/Contact.js'
import { sendContactMail } from '../services/mail.service.js'

export async function createContact(req, res) {
  let contact
  try {
    contact = await Contact.create(req.data)
  } catch (err) {
    console.error('Create contact failed:', err)
    return res.status(500).json({ ok: false, message: 'Something went wrong. Please try again.' })
  }

  // Saved: answer the visitor now, then email the enquiries inbox without making them wait.
  res.status(201).json({ ok: true, id: contact._id })
  notifyEnquiries(contact)
}

/** Sends the email and records the result in mailStatus. */
async function notifyEnquiries(contact) {
  try {
    const status = await sendContactMail(contact)
    contact.mailStatus = status
    console.log(`Contact email (${contact._id}) accepted for: ${status.accepted.join(', ') || 'nobody'}`)
    if (status.rejected.length) console.warn(`Contact email (${contact._id}) rejected for: ${status.rejected.join(', ')}`)
  } catch (err) {
    console.error(`Contact email failed (${contact._id}):`, err.message)
    contact.mailStatus = { sent: false, error: err.message }
  }
  await contact.save().catch((err) => console.error('Saving email status failed:', err.message))
}
