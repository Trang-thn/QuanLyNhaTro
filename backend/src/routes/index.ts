import { Router } from 'express';
import { authRouter } from './auth';
import { dashboardRouter } from './dashboard';
import { usersRouter } from './users';
import { tenantRouter } from './tenant';
import { adminRouter } from './admin';
import { contractRouter } from './contractRoutes';
export const apiRouter = Router();

apiRouter.get('/health', (_req, res) => res.json({ status: 'ok' }));
apiRouter.use('/auth', authRouter);
apiRouter.use('/users', usersRouter);
apiRouter.use('/dashboard', dashboardRouter);
apiRouter.use('/tenant', tenantRouter);
apiRouter.use('/admin', adminRouter);
apiRouter.use('/contracts', contractRouter);