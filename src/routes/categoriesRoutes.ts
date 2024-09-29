import { Request, Response, Router } from "express";
import { schemaValidator } from "@middleware/schemaValidator";
import { ROUTES } from "@constants";
import { Category } from "@models/Category";

export const categoriesRoutes = Router();

const { path: rootPath, methods: rootMethods } = ROUTES.routes.categories.root;

categoriesRoutes.get(rootPath, async (_req: Request, res: Response) => {
	try {
		const categories = await Category.find();
		if (categories.length === 0) {
			return res.status(404).send("No categories found in database");
		}
		return res.status(200).send(categories);
	} catch (err) {
		return res.status(400).send(err);
	}
});

categoriesRoutes.post(
	rootPath,
	schemaValidator(rootPath, rootMethods),
	async (req: Request, res: Response) => {
		//Return 405 if method is not in allowed methods
		if (!rootMethods.includes(req.method)) {
			return res.status(405).send("Method not allowed");
		}

		const newCategory = new Category(req.body);
		try {
			const savedCategory = await newCategory.save();
			return res.status(201).send(savedCategory);
		} catch (err) {
			return res.status(400).send(err);
		}
	},
);
