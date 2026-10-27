import fs from 'node:fs'
import Application from '../models/Application.js'

export async function createApplication(req, res) {
  try {
    const { originalname, filename, path, size, mimetype } = req.file
    const application = await Application.create({
      ...req.data,
      cv: { originalName: originalname, fileName: filename, path, size, mimeType: mimetype },
    })
    res.status(201).json({ ok: true, id: application._id })
  } catch (err) {
    console.error('Create application failed:', err)
    fs.unlink(req.file.path, () => {}) // the save failed, so remove the uploaded file
    res.status(500).json({ ok: false, message: 'Something went wrong. Please try again.' })
  }
}
