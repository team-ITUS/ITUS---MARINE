import Contact from '../models/Contact.js'

export async function createContact(req, res) {
  try {
    const contact = await Contact.create(req.data)
    res.status(201).json({ ok: true, id: contact._id })
  } catch (err) {
    console.error('Create contact failed:', err)
    res.status(500).json({ ok: false, message: 'Something went wrong. Please try again.' })
  }
}
