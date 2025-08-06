import { Router } from 'express'
import { getAll, createItem, updateItem, deleteItem } from '../controllers/itemController'
import { authMiddleware } from '../middleware/authMiddleware'
import multer from 'multer'
import path from 'path'

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

router.get('/', getAll)
router.post('/', authMiddleware, upload.single('imagem'), createItem)
router.put('/:id', authMiddleware, updateItem)
router.delete('/:id', authMiddleware, deleteItem)

export default router
