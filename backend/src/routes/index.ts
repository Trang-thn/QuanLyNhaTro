import { Router } from "express";
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