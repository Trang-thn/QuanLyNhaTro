import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { AuthUser } from '../types/auth';

declare global {
  namespace Express { interface Request { user?: AuthUser } }
}

export function authenticate(req: Request, res: Response, next: NextFunction): void {
  const token = req.headers.authorization?.match(/^Bearer\s+(.+)$/i)?.[1];
  if (!token || !env.jwtSecret) {
    res.status(401).json({ message: 'Không tìm thấy Token xác thực' });
    return;
  }
  try {
    const payload = jwt.verify(token, env.jwtSecret);
    if (typeof payload !== 'object' || !payload || typeof payload.id !== 'string' ||
        typeof payload.username !== 'string' || (payload.role !== 'ADMIN' && payload.role !== 'TENANT')) {
      res.status(401).json({ message: 'Token không hợp lệ hoặc đã hết hạn' });
      return;
    }
    req.user = { id: payload.id, username: payload.username, role: payload.role };
    next();
  } catch {
    res.status(401).json({ message: 'Token không hợp lệ hoặc đã hết hạn' });
  }
}

export function allowRoles(...roles: AuthUser['role'][]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ message: 'Bạn không có quyền truy cập chức năng này' });
      return;
    }
    next();
  };
}
