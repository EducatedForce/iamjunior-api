import { defaultRoute } from "./defaultRoute";
import { categoriesRoute } from "./categoriesRoute";

import { Router } from "express";

export const routes = Router();

routes.use(defaultRoute);
routes.use(categoriesRoute);
