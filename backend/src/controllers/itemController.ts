// src/controllers/itemController.ts
import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface AuthenticatedRequest extends Request {
  user?: any
}

export const createItem = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { objeto, local, achadoEm, descricao } = req.body
    const file = req.file
    const userPayload = req.user || {}
    const userId = userPayload.userId || userPayload.id // dep. do payload do seu login

    // Validações simples
    if (!userId) {
      return res.status(400).json({ message: 'Usuário não identificado a partir do token.' })
    }
    if (!objeto || !local) {
      return res.status(400).json({ message: 'Campos "objeto" e "local" são obrigatórios.' })
    }
    if (!achadoEm) {
      return res.status(400).json({ message: 'Campo "achadoEm" (data) é obrigatório.' })
    }
    const dt = new Date(achadoEm)
    if (isNaN(dt.getTime())) {
      return res.status(400).json({ message: 'Data "achadoEm" inválida. Use YYYY-MM-DD.' })
    }

    const imagem = file ? file.filename : null

    const item = await prisma.item.create({
      data: {
        objeto,
        local,
        achadoEm: dt,
        descricao: descricao || null,
        publicado: true,
        imagem,
        userId: Number(userId),
      },
    })

    res.status(201).json(item)
  } catch (error) {
    console.error('Erro ao criar item:', error) // <- veja o terminal do backend
    res.status(500).json({ message: 'Erro interno ao criar item', error })
  }
}

// o resto pode ficar como já estava:
export const getItems = async (_req: Request, res: Response) => {
  const items = await prisma.item.findMany({ orderBy: { id: 'desc' } })
  res.json(items)
}

export const getPublicItems = async (_req: Request, res: Response) => {
  const items = await prisma.item.findMany({
    where: { publicado: true },
    orderBy: { achadoEm: 'desc' }
  })
  res.json(items)
}

export const updateItem = async (req: Request, res: Response) => {
  const { id } = req.params
  const { objeto, local, achadoEm, descricao } = req.body
  try {
    const data: any = { objeto, local, descricao }
    if (achadoEm) {
      const dt = new Date(achadoEm)
      if (isNaN(dt.getTime())) {
        return res.status(400).json({ message: 'Data "achadoEm" inválida.' })
      }
      data.achadoEm = dt
    }
    const item = await prisma.item.update({ where: { id: Number(id) }, data })
    res.json(item)
  } catch (err) {
    console.error('Erro ao atualizar item:', err)
    res.status(404).json({ message: 'Item não encontrado' })
  }
}

export const deleteItem = async (req: Request, res: Response) => {
  const { id } = req.params
  try {
    await prisma.item.delete({ where: { id: Number(id) } })
    res.json({ message: 'Item removido' })
  } catch (err) {
    console.error('Erro ao excluir item:', err)
    res.status(404).json({ message: 'Item não encontrado' })
  }
}

export const toggleItem = async (req: Request, res: Response) => {
  const { id } = req.params
  try {
    const item = await prisma.item.findUnique({ where: { id: Number(id) } })
    if (!item) return res.status(404).json({ message: 'Item não encontrado' })

    const updated = await prisma.item.update({
      where: { id: Number(id) },
      data: { publicado: !item.publicado },
    })
    res.json(updated)
  } catch (err) {
    console.error('Erro ao alternar publicação:', err)
    res.status(500).json({ message: 'Erro ao alternar publicação' })
  }
}
