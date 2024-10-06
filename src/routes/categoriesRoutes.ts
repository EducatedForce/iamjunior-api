import { Request, Response, Router } from "express";
import { schemaValidator } from "@middleware/schemaValidator";
import { ROUTES } from "@constants";
import { Category } from "@models/Category";
import mongoose from "mongoose";

export const categoriesRoutes = Router();

const { path: rootPath } = ROUTES.routes.categories.root;
const { path: searchPath } = ROUTES.routes.categories.root.subRoutes.id;

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

categoriesRoutes.get(
	`${rootPath}${searchPath}`,
	async (req: Request, res: Response) => {
		const searchString = req.params.id;
		const isObjectId = mongoose.Types.ObjectId.isValid(searchString);
		const query = isObjectId
			? { _id: searchString }
			: { name: { $regex: searchString, $options: "i" } };

		if (searchString) {
			try {
				const category = await Category.findOne(query);
				if (!category) {
					return res
						.status(404)
						.send({ message: "No category found in database" });
				}
				return res.status(200).send(category);
			} catch (err) {
				return res.status(400).send(err);
			}
		} else {
			return res.status(404).send({ message: "No category found in database" });
		}
	},
);

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
