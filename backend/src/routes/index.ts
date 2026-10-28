<<<<<<< HEAD
﻿import { Router } from "express";
import { amenitiesRouter } from "./amenities";
import { roomsRouter } from "./rooms";
import { authRouter } from "./auth";
import { dashboardRouter } from "./dashboard";
import { usersRouter } from "./users";
import { tenantRouter } from "./tenant";
import { tenantContractRouter } from './tenantContract';
import { adminRouter } from "./admin";
import { maintenanceRouter } from "./maintenance";
import { notificationsRouter } from "./notifications";
import { contractRouter } from "./contract";
import { tenantsRouter } from './tenantqlkt';
export const apiRouter = Router();

apiRouter.get("/health", (_req, res) => res.json({ status: "ok" }));
apiRouter.use("/rooms", roomsRouter);
apiRouter.use("/contracts", contractRouter);
apiRouter.use("/tenant-contracts", tenantContractRouter);
apiRouter.use('/tenant', tenantRouter);
apiRouter.use("/maintenance-requests", maintenanceRouter);
apiRouter.use("/notifications", notificationsRouter);
// Feature routers: auth, users, rooms, tenants, contracts, billing, maintenance, notifications, dashboard.
apiRouter.use("/auth", authRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/dashboard", dashboardRouter);
apiRouter.use("/admin", adminRouter);
apiRouter.use(amenitiesRouter);
apiRouter.use("/tenantqlkt", tenantsRouter);
=======
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
>>>>>>> origin/develop
