import { Router } from 'express';
import { amenitiesRouter } from './amenities';
import { roomsRouter } from './rooms';

export const apiRouter = Router();

apiRouter.get('/health', (_req, res) => res.json({ status: 'ok' }));
apiRouter.use('/rooms', roomsRouter);
apiRouter.use(amenitiesRouter);
// Feature routers: auth, users, rooms, tenants, contracts, billing, maintenance, notifications, dashboard.
