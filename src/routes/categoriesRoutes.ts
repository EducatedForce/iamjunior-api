import { Request, Response, Router } from "express";
import { schemaValidator } from "@middleware/schemaValidator";
import { categories } from "@lib/data";
import { ROUTES } from "@constants";

export const categoriesRoutes = Router();

const { path: rootPath, methods } = ROUTES.routes.categories.root;

categoriesRoutes.get(rootPath, (_req: Request, res: Response) => {
	res.status(200).send(categories);
});

categoriesRoutes.post(
	rootPath,
	schemaValidator(rootPath, methods),
	(req: Request, res: Response) => {
		const newCategory: Category = {
			id: categories.length + 1,
			...req.body,
		};
		categories.push(newCategory);
		res.status(201).send(newCategory);
	},
);
