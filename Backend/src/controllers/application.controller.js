import fs from 'node:fs'
import Application from '../models/Application.js'
import { sendApplicationMail } from '../services/mail.service.js'

export async function createApplication(req, res) {
  let application
  try {
    const { originalname, filename, path, size, mimetype } = req.file
    application = await Application.create({
      ...req.data,
      cv: { originalName: originalname, fileName: filename, path, size, mimeType: mimetype },
    })
  } catch (err) {
    console.error('Create application failed:', err)
    fs.unlink(req.file.path, () => {}) // the save failed, so remove the uploaded file
    return res.status(500).json({ ok: false, message: 'Something went wrong. Please try again.' })
  }

  // Saved: answer the applicant now, then email the careers inbox without making them wait.
  res.status(201).json({ ok: true, id: application._id })
  notifyCareers(application)
}

/** Sends the email and records the result. Kept outside the try above, so a mail failure never deletes the CV. */
async function notifyCareers(application) {
  try {
    const status = await sendApplicationMail(application)
    application.mailStatus = status
    console.log(`Application email (${application._id}) accepted for: ${status.accepted.join(', ') || 'nobody'}`)
    if (status.rejected.length) console.warn(`Application email (${application._id}) rejected for: ${status.rejected.join(', ')}`)
  } catch (err) {
    console.error(`Application email failed (${application._id}):`, err.message)
    application.mailStatus = { sent: false, error: err.message }
  }
  await application.save().catch((err) => console.error('Saving email status failed:', err.message))
}
