import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export const listAdmins = async (_req: Request, res: Response) => {
  const admins = await prisma.user.findMany({
    where: { isAdmin: true },
    select: { id: true, email: true, isAdmin: true }
  })
  res.json(admins)
}

export const createAdmin = async (req: Request, res: Response) => {
  const { email, password } = req.body
  if (!email || !password) return res.status(400).json({ message: 'Email e senha são obrigatórios.' })

  const exists = await prisma.user.findUnique({ where: { email } })
  if (exists) return res.status(400).json({ message: 'Email já cadastrado.' })

  const hash = await bcrypt.hash(password, 10)
  const admin = await prisma.user.create({
    data: { email, password: hash, isAdmin: true },
    select: { id: true, email: true, isAdmin: true }
  })
  res.status(201).json(admin)
}

export const deleteAdmin = async (req: Request, res: Response) => {
  const { id } = req.params
  try {
    const user = await prisma.user.findUnique({ where: { id: Number(id) } })
    if (!user || !user.isAdmin) return res.status(404).json({ message: 'Administrador não encontrado.' })

    await prisma.user.delete({ where: { id: Number(id) } })
    res.json({ message: 'Administrador removido.' })
  } catch (e) {
    res.status(500).json({ message: 'Erro ao remover administrador.' })
  }
}
