import { Router } from 'express'
import { authMiddleware } from '../middleware/authMiddleware'
import { isAdmin } from '../middleware/isAdmin'
import { listAdmins, createAdmin, deleteAdmin } from '../controllers/adminController'

const router = Router()

router.use(authMiddleware, isAdmin)
router.get('/', listAdmins)
router.post('/', createAdmin)
router.delete('/:id', deleteAdmin)

export default router
