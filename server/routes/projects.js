import express from 'express'
import * as ctrl from '../controllers/projectsController.js'
import { requireAuth } from '../middleware/auth.js'

const router = express.Router()
router.get('/', ctrl.getAll)
router.get('/:id', ctrl.getById)
router.post('/', requireAuth, ctrl.create)
router.put('/:id', requireAuth, ctrl.update)
router.delete('/:id', requireAuth, ctrl.remove)
export default router
