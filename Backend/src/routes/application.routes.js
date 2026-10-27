import { Router } from 'express'
import uploadCv from '../middleware/upload.js'
import { validateApplication } from '../middleware/validate.js'
import { createApplication } from '../controllers/application.controller.js'

const router = Router()

// Order matters: multer must run first, because it is what fills req.body for multipart forms.
router.post('/', uploadCv, validateApplication, createApplication)

export default router
