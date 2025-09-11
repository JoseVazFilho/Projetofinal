import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface AuthenticatedRequest extends Request {
  user?: any
}

/**
 * POST /items
 * Cria um item (multipart) com imagem opcional
 */
export const createItem = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { objeto, local, achadoEm, descricao, numeroOcorrencia } = req.body
    const file = req.file
    const userPayload = req.user || {}
    const userId = userPayload.userId || userPayload.id

    if (!userId) return res.status(400).json({ message: 'Usuário não identificado.' })
    if (!objeto || !local) return res.status(400).json({ message: 'Campos "objeto" e "local" são obrigatórios.' })
    if (!achadoEm) return res.status(400).json({ message: 'Campo "achadoEm" (data) é obrigatório.' })

    const dt = new Date(achadoEm)
    if (isNaN(dt.getTime())) return res.status(400).json({ message: 'Data "achadoEm" inválida. Use YYYY-MM-DD.' })

    const imagem = file ? file.filename : null

    const item = await prisma.item.create({
      data: {
        objeto,
        local,
        achadoEm: dt,
        descricao: descricao || null,
        numeroOcorrencia: numeroOcorrencia || null,  // NOVO
        publicado: true,
        imagem,
        userId: Number(userId),
      },
    })
    res.status(201).json(item)
  } catch (error) {
    console.error('Erro ao criar item:', error)
    res.status(500).json({ message: 'Erro interno ao criar item' })
  }
}

/**
 * GET /items (protegida) - lista todos
 */
export const getItems = async (_req: Request, res: Response) => {
  const items = await prisma.item.findMany({ orderBy: { id: 'desc' } })
  res.json(items)
}

/**
 * GET /items/public (pública) - lista só publicados
 */
export const getPublicItems = async (_req: Request, res: Response) => {
  const items = await prisma.item.findMany({
    where: { publicado: true },
    orderBy: { achadoEm: 'desc' },
  })
  res.json(items)
}

/**
 * PUT /items/:id (multipart) - edita campos e imagem opcional
 */
export const updateItem = async (req: Request, res: Response) => {
  const { id } = req.params
  const body = req.body || {}
  const { objeto, local, achadoEm, descricao, numeroOcorrencia } = body
  const file = req.file

  try {
    const data: any = {}
    if (typeof objeto !== 'undefined') data.objeto = objeto
    if (typeof local !== 'undefined') data.local = local
    if (typeof descricao !== 'undefined') data.descricao = descricao
    if (typeof numeroOcorrencia !== 'undefined') data.numeroOcorrencia = numeroOcorrencia  // NOVO

    if (typeof achadoEm !== 'undefined') {
      const dt = new Date(achadoEm)
      if (isNaN(dt.getTime())) return res.status(400).json({ message: 'Data "achadoEm" inválida.' })
      data.achadoEm = dt
    }

    if (file) data.imagem = file.filename

    const updated = await prisma.item.update({
      where: { id: Number(id) },
      data,
    })
    res.json(updated)
  } catch (err) {
    console.error('Erro ao atualizar item:', err)
    res.status(500).json({ message: 'Erro ao atualizar item' })
  }
}

/**
 * DELETE /items/:id
 */
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

/**
 * PATCH /items/:id/toggle
 */
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
