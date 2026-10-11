import { Router } from 'express';
import utilityRoutes from './Utility_Router';
import roomsRoutes from './rooms_Router';

export const apiRouter = Router();

apiRouter.get('/health', (_req, res) => res.json({ status: 'ok' }));

// Gắn router điện nước
apiRouter.use('/', utilityRoutes);

// Gắn router phòng
apiRouter.use('/', roomsRoutes);

// Feature routers khác sau này sẽ được thêm ở đây:
// auth, users, tenants, contracts, billing, maintenance, notifications...