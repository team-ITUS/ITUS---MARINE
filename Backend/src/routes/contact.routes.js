import { Router } from 'express'
import { validateContact } from '../middleware/validate.js'
import { createContact } from '../controllers/contact.controller.js'

const router = Router()

router.post('/', validateContact, createContact)

export default router
