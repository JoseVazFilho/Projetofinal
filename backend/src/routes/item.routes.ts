// src/routes/item.routes.ts
import { Router } from 'express'
import multer from 'multer'
import path from 'path'
import { authMiddleware } from '../middleware/authMiddleware'
import { createItem, getItems, getPublicItems, updateItem, deleteItem, toggleItem } from '../controllers/itemController'

const router = Router()

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (_, file, cb) => {
    const ext = path.extname(file.originalname)
    const name = Date.now() + ext
    cb(null, name)
  },
})
const upload = multer({ storage })

router.get('/public', getPublicItems)

// protegidas:
router.use(authMiddleware)
router.get('/', getItems)
router.post('/', upload.single('imagem'), createItem) // <- upload antes do controller
router.put('/:id', updateItem)
router.delete('/:id', deleteItem)
router.patch('/:id/toggle', toggleItem)

export default router
