import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

const SECRET = process.env.JWT_SECRET || 'segredo123'

interface AuthenticatedRequest extends Request {
  user?: any
}

export const authMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization
  if (!authHeader) return res.status(401).json({ message: 'Token ausente' })

  const [, token] = authHeader.split(' ')
  try {
    const decoded = jwt.verify(token, SECRET)
    req.user = decoded
    next()
  } catch {
    return res.status(403).json({ message: 'Token inválido' })
  }
}
