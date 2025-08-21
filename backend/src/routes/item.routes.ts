import { Router } from 'express'
import multer from 'multer'
import path from 'path'
import { authMiddleware } from '../middleware/authMiddleware'
import {
  createItem,
  getItems,
  getPublicItems,
  updateItem,
  deleteItem,
  toggleItem,
} from '../controllers/itemController'

const router = Router()

// Configuração do Multer para upload em /uploads
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (_, file, cb) => {
    const ext = path.extname(file.originalname)
    const name = Date.now() + ext
    cb(null, name)
  },
})
const upload = multer({ storage })

// ROTA PÚBLICA (sem login)
router.get('/public', getPublicItems)

// Rotas protegidas (com JWT)
router.use(authMiddleware)
router.get('/', getItems)
router.post('/', upload.single('imagem'), createItem)     // POST multipart
router.put('/:id', upload.single('imagem'), updateItem)   // PUT multipart (imagem opcional)
router.delete('/:id', deleteItem)
router.patch('/:id/toggle', toggleItem)

export default router
