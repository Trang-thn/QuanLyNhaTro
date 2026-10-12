import { Router } from 'express';
import { amenitiesRouter } from './amenities';
import { maintenanceRouter } from './maintenance';
import { notificationsRouter } from './notifications';
import { roomsRouter } from './rooms';

export const apiRouter = Router();

apiRouter.get('/health', (_req, res) => res.json({ status: 'ok' }));
apiRouter.use('/rooms', roomsRouter);
apiRouter.use(amenitiesRouter);
apiRouter.use('/maintenance-requests', maintenanceRouter);
apiRouter.use('/notifications', notificationsRouter);
