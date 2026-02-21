import express from 'express'
import * as ctrl from '../controllers/siteController.js'
import { requireAuth } from '../middleware/auth.js'

const router = express.Router()
router.get('/', ctrl.get)
router.put('/', requireAuth, ctrl.update)
export default router
