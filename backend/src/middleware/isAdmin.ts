import { Request, Response, NextFunction } from 'express'

interface AuthenticatedRequest extends Request {
  user?: any
}

export function isAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.user?.isAdmin) {
    return res.status(403).json({ message: 'Acesso restrito a administradores.' })
  }
  next()
}
