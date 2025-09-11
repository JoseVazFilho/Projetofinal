// src/controllers/authController.ts
import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()
const SECRET = process.env.JWT_SECRET || 'segredo123'
const ADMIN_INVITE_CODE = process.env.ADMIN_INVITE_CODE || 'convite_admin' // defina no .env

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function signToken(payload: any) {
  return jwt.sign(payload, SECRET, { expiresIn: '1d' })
}

// -------------------- LOGIN --------------------
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body

  try {
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return res.status(401).json({ message: 'Credenciais inválidas' })
    }

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) {
      return res.status(401).json({ message: 'Credenciais inválidas' })
    }

    const token = signToken({ userId: user.id, isAdmin: user.isAdmin })
    return res.json({ token, isAdmin: user.isAdmin })
  } catch (err) {
    console.error('Erro no login:', err)
    return res.status(500).json({ message: 'Erro interno no login' })
  }
}

// -------------------- REGISTER (usuário comum) --------------------
export const register = async (req: Request, res: Response) => {
  const { email, password } = req.body

  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'Email e senha são obrigatórios.' })
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Email inválido.' })
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'A senha deve ter ao menos 6 caracteres.' })
    }

    const exists = await prisma.user.findUnique({ where: { email } })
    if (exists) return res.status(400).json({ message: 'Email já cadastrado.' })

    const hash = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: { email, password: hash, isAdmin: false },
      select: { id: true, email: true, isAdmin: true }
    })

    // opcional: já retornar token para logar após registrar
    const token = signToken({ userId: user.id, isAdmin: user.isAdmin })
    return res.status(201).json({ user, token, isAdmin: user.isAdmin })
  } catch (err) {
    console.error('Erro no registro:', err)
    return res.status(500).json({ message: 'Erro interno no registro' })
  }
}

// -------------------- REGISTER ADMIN (com código de convite) --------------------
export const registerAdmin = async (req: Request, res: Response) => {
  const { email, password, inviteCode } = req.body

  try {
    if (inviteCode !== ADMIN_INVITE_CODE) {
      return res.status(403).json({ message: 'Código de convite inválido.' })
    }
    if (!email || !password) {
      return res.status(400).json({ message: 'Email e senha são obrigatórios.' })
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Email inválido.' })
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'A senha deve ter ao menos 6 caracteres.' })
    }

    const exists = await prisma.user.findUnique({ where: { email } })
    if (exists) return res.status(400).json({ message: 'Email já cadastrado.' })

    const hash = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: { email, password: hash, isAdmin: true },
      select: { id: true, email: true, isAdmin: true }
    })

    const token = signToken({ userId: user.id, isAdmin: user.isAdmin })
    return res.status(201).json({ user, token, isAdmin: user.isAdmin })
  } catch (err) {
    console.error('Erro no registro admin:', err)
    return res.status(500).json({ message: 'Erro interno no registro admin' })
  }
}
