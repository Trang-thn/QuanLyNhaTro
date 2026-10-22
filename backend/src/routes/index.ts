import { Router } from "express";
import { amenitiesRouter } from "./amenities";
import { roomsRouter } from "./rooms";
import { authRouter } from "./auth";
import { dashboardRouter } from "./dashboard";
import { usersRouter } from "./users";
import { tenantRouter } from "./tenant";
import { adminRouter } from "./admin";

export const apiRouter = Router();

apiRouter.get("/health", (_req, res) => res.json({ status: "ok" }));
apiRouter.use("/rooms", roomsRouter);
// Feature routers: auth, users, rooms, tenants, contracts, billing, maintenance, notifications, dashboard.
apiRouter.use("/auth", authRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/dashboard", dashboardRouter);
apiRouter.use("/tenant", tenantRouter);
apiRouter.use("/admin", adminRouter);
apiRouter.use(amenitiesRouter);
