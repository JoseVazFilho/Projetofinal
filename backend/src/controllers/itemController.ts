import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const getAll = async (req: Request, res: Response) => {
  const { objeto, local } = req.query

  const items = await prisma.item.findMany({
    where: {
      objeto: objeto ? { contains: String(objeto), mode: 'insensitive' } : undefined,
      local: local ? { contains: String(local), mode: 'insensitive' } : undefined,
    },
  })

  res.json(items)
}

export const createItem = async (req: Request, res: Response) => {
  const { objeto, local, atendimento, prateleira } = req.body
  const imagemUrl = req.file ? `/uploads/${req.file.filename}` : null

  const item = await prisma.item.create({
    data: { objeto, local, atendimento: Number(atendimento), prateleira, imagemUrl },
  })

  res.status(201).json(item)
}

export const updateItem = async (req: Request, res: Response) => {
  const { id } = req.params
  const { objeto, local, atendimento, prateleira } = req.body

  const item = await prisma.item.update({
    where: { id: Number(id) },
    data: { objeto, local, atendimento: Number(atendimento), prateleira },
  })

  res.json(item)
}

export const deleteItem = async (req: Request, res: Response) => {
  const { id } = req.params

  await prisma.item.delete({ where: { id: Number(id) } })
  res.status(204).send()
}
