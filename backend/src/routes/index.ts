import { Router } from 'express';
import { tenantRouter } from './tenantRoutes';
import { contractRouter } from './contractRoutes';
export const apiRouter = Router();

apiRouter.get('/health', (_req, res) => res.json({ status: 'ok' }));
// Feature routers: auth, users, rooms, tenants, contracts, billing, maintenance, notifications, dashboard.

apiRouter.use('/tenants', tenantRouter);
apiRouter.use('/contracts', contractRouter);
