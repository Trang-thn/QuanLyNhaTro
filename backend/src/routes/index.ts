import { Router } from 'express';

export const apiRouter = Router();

apiRouter.get('/health', (_req, res) => res.json({ status: 'ok' }));
// Feature routers: auth, users, rooms, tenants, contracts, billing, maintenance, notifications, dashboard.
