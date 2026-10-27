import { Router } from 'express';
import utilityRoutes from './Utility_Router';
import { roomsRouter } from './rooms';
import { authRouter } from './auth';
import { dashboardRouter } from './dashboard';
import { usersRouter } from './users';
import { tenantRouter } from './tenant';
import { adminRouter } from './admin';
import { amenitiesRouter } from './amenities';
import { maintenanceRouter } from './maintenance';
import { notificationsRouter } from './notifications';
import invoiceRouter from './invoice_router';

export const apiRouter = Router();

apiRouter.get('/health', (_req, res) => res.json({ status: 'ok' }));

// Router điện nước
apiRouter.use('/', utilityRoutes);

// Router phòng
apiRouter.use('/rooms', roomsRouter);

// Các Feature routers khác
apiRouter.use('/auth', authRouter);
apiRouter.use('/users', usersRouter);
apiRouter.use('/dashboard', dashboardRouter);
apiRouter.use('/tenant', tenantRouter);
apiRouter.use('/admin', adminRouter);
apiRouter.use('/maintenance-requests', maintenanceRouter);
apiRouter.use('/notifications', notificationsRouter);
apiRouter.use('/', invoiceRouter);
apiRouter.use(amenitiesRouter);
