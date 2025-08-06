import express from "express";
import cors from 'cors';
import { PrismaClient } from "@prisma/client";
import authRoutes from './routes/auth.routes'
import itemRoutes from './routes/item.routes'

const app = express()
const prisma = new PrismaClient()

app.use(cors())
app.use(express.json())
app.use('/uploads', express.static('uploads'))

app.use('/auth', authRoutes)
app.use('/items', itemRoutes)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`)
})
