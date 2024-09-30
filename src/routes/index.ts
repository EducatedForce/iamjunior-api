import { Router } from "express";
import { defaultRoute } from "./defaultRoute";
import { categoriesRoutes } from "./categoriesRoutes";
import { businessesRoutes } from "./businessesRoutes";
import { bookingsRoutes } from "./bookingsRoutes";
import { userRoutes } from "./userRoutes";
import { authRoutes } from "./authRoutes";

export const routes = Router();

routes.use(defaultRoute);
routes.use(categoriesRoutes);
routes.use(businessesRoutes);
routes.use(bookingsRoutes);
routes.use(userRoutes);
routes.use(authRoutes);
