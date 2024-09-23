import { Request, Response, Router } from "express";
import { categories } from "../lib/data";
import { CONSTANTS } from "../lib/constants";

export const categoriesRoute = Router();

categoriesRoute.get(
	CONSTANTS.routes.categories,
	(req: Request, res: Response) => {
		res.status(200).json(categories);
	},
);
