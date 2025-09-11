// src/routes/auth.routes.ts
import { Router } from 'express'
import { login, register, registerAdmin } from '../controllers/authController'

const router = Router()

// autenticação
router.post('/login', login)

// registro de usuário comum
router.post('/register', register)

// registro de admin (com código de convite)
router.post('/register-admin', registerAdmin)

export default router
