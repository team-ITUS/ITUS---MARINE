import fs from 'node:fs'
import { experienceOptions, expertiseOptions } from '../models/Application.js'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const phoneRegex = /^[0-9+()\- ]{7,20}$/
const urlRegex = /^https?:\/\/\S+\.\S+/i

const clean = (value) => (typeof value === 'string' ? value.trim() : '')

/** Copies the listed fields from req.body (trimmed) and marks the required ones that are empty. */
function pick(body, fields, required) {
  const data = {}
  const errors = {}
  for (const field of fields) {
    data[field] = clean(body[field])
    if (required.includes(field) && !data[field]) errors[field] = 'This field is required.'
  }
  return { data, errors }
}

export function validateContact(req, res, next) {
  const fields = ['name', 'organisation', 'phone', 'email', 'message']
  const { data, errors } = pick(req.body ?? {}, fields, fields)

  if (data.email && !emailRegex.test(data.email)) errors.email = 'Please enter a valid email address.'
  if (data.phone && !phoneRegex.test(data.phone)) errors.phone = 'Please enter a valid phone number.'

  if (Object.keys(errors).length) return res.status(400).json({ ok: false, errors })
  req.data = data
  next()
}

export function validateApplication(req, res, next) {
  const fields = ['fullName', 'email', 'phone', 'location', 'currentRole', 'experience', 'expertise', 'linkedin', 'message']
  const required = ['fullName', 'email', 'phone', 'location', 'experience', 'expertise']
  const { data, errors } = pick(req.body ?? {}, fields, required)

  if (data.email && !emailRegex.test(data.email)) errors.email = 'Please enter a valid email address.'
  if (data.phone && !phoneRegex.test(data.phone)) errors.phone = 'Please enter a valid phone number.'
  if (data.linkedin && !urlRegex.test(data.linkedin)) errors.linkedin = 'Please enter a valid URL, starting with https://'
  if (data.experience && !experienceOptions.includes(data.experience)) errors.experience = 'Please select a valid option.'
  if (data.expertise && !expertiseOptions.includes(data.expertise)) errors.expertise = 'Please select a valid option.'
  if (data.message.length > 2000) errors.message = 'Message must be 2000 characters or less.'
  if (!req.file) errors.cv = 'This field is required.'

  if (Object.keys(errors).length) {
    if (req.file) fs.unlink(req.file.path, () => {}) // don't keep the CV of a rejected form
    return res.status(400).json({ ok: false, errors })
  }
  req.data = data
  next()
}
