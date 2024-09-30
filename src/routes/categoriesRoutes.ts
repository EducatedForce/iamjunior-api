import { Request, Response, Router } from "express";
import { schemaValidator } from "@middleware/schemaValidator";
import { ROUTES } from "@constants";
import { Category } from "@models/Category";

export const categoriesRoutes = Router();

const { path: rootPath } = ROUTES.routes.categories.root;

categoriesRoutes.get(rootPath, async (_req: Request, res: Response) => {
	try {
		const categories = await Category.find();
		if (categories.length === 0) {
			return res
				.status(404)
				.send({ message: "No categories found in database" });
		}
		return res.status(200).send(categories);
	} catch (err) {
		return res.status(400).send(err);
	}
});

categoriesRoutes.post(
	rootPath,
	schemaValidator(rootPath),
	async (req: Request, res: Response) => {
		const newCategory = new Category(req.body);
		try {
			const savedCategory = await newCategory.save();
			return res.status(201).send(savedCategory);
		} catch (err) {
			return res.status(400).send(err);
		}
	},
);
