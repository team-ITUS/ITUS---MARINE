import multer from 'multer'
import fs from 'node:fs'
import path from 'node:path'

const uploadDir = 'uploads/'
const allowedExtensions = ['.pdf', '.doc', '.docx']
const cvError = 'Please upload your CV in PDF, DOC or DOCX format within the permitted file-size limit.'

/** "Rahul Sharma" -> "Rahul-Sharma". Keeps letters and numbers only, so the name is safe on any system. */
const slug = (text) => text.trim().replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 50)

/** Local date and time, e.g. "2026-10-27_11-30-45". */
function timestamp() {
  const d = new Date()
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}_${pad(d.getHours())}-${pad(d.getMinutes())}-${pad(d.getSeconds())}`
}

/**
 * Readable name: "<Applicant-Name>_CV_<date>_<time>.pdf". fullName comes before the cv field in the form, so multer
 * has already read it. Falls back to the original file name, and adds "-2", "-3"... if the name is already taken.
 */
function cvFileName(req, file) {
  const ext = path.extname(file.originalname).toLowerCase()
  const name = slug(req.body?.fullName ?? '') || slug(path.basename(file.originalname, ext)) || 'Applicant'
  const base = `${name}_CV_${timestamp()}`
  let fileName = base + ext
  for (let n = 2; fs.existsSync(path.join(uploadDir, fileName)); n++) fileName = `${base}-${n}${ext}`
  return fileName
}

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => cb(null, cvFileName(req, file)),
})

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase()
    if (allowedExtensions.includes(ext)) cb(null, true)
    else cb(new Error(cvError))
  },
})

const single = upload.single('cv')

/** Runs multer and turns its errors (wrong type, too big) into a normal field error for the form. */
export default function uploadCv(req, res, next) {
  single(req, res, (err) => {
    if (err) return res.status(400).json({ ok: false, errors: { cv: cvError } })
    next()
  })
}
