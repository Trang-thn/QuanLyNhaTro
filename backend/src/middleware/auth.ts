import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { AuthUser } from '../types/auth';

declare global {
  namespace Express { interface Request { user?: AuthUser } }
}

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.replace(/^Bearer\\s+/i, '');
  if (!token || !process.env.JWT_SECRET) return res.status(401).json({ message: 'Unauthorized' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET) as AuthUser;
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

export function allowRoles(...roles: AuthUser['role'][]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) return res.status(403).json({ message: 'Forbidden' });
    next();
  };
}
