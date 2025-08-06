// Controller de autenticação
import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const SECRET = process.env.JWT_SECRET || 'segredo123'

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body

  const user = await prisma.user.findUnique({ where: { email } })

  if (!user || user.password !== password) {
    return res.status(401).json({ message: 'Credenciais inválidas' })
  }

  const token = jwt.sign({ userId: user.id }, SECRET, { expiresIn: '1d' })
  return res.json({ token })
}
