import express from 'express'
import * as ctrl from '../controllers/eventsController.js'
import { requireAuth } from '../middleware/auth.js'

const router = express.Router()
router.get('/', ctrl.getAll)
router.post('/', requireAuth, ctrl.create)
router.put('/:id', requireAuth, ctrl.update)
router.delete('/:id', requireAuth, ctrl.remove)
export default router
