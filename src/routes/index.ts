import { Router } from "express";
import { defaultRoute } from "./defaultRoute";
import { categoriesRoutes } from "./categoriesRoutes";
import { businessesRoutes } from "./businessesRoutes";

export const routes = Router();

routes.use(defaultRoute);
routes.use(categoriesRoutes);
routes.use(businessesRoutes);
