import { Request, Response, Router } from "express";
import { businesses } from "@lib/data";
import { slugify } from "@lib/slugify";
import { deSlugify } from "@lib/deSlugify";
import { ROUTES } from "@constants";

export const businessesRoutes = Router();

const { path: rootPath } = ROUTES.routes.businesses.root;
const { path: categoryPath } = ROUTES.routes.businesses.root.subRoutes.category;
const { path: idPath } = ROUTES.routes.businesses.root.subRoutes.id;

// Get all businesses
businessesRoutes.get(rootPath, (_req: Request, res: Response) => {
	if (businesses.length > 0) {
		res.status(200).json(businesses);
	} else {
		res.status(404).send("No businesses in database");
	}
});

// Create new business
businessesRoutes.post(rootPath, (req: Request, res: Response) => {
	const newBusinessEntity: Business = {
		id: businesses.length + 1,
		...req.body,
	};
	businesses.push(newBusinessEntity);
	res.status(201).send(newBusinessEntity);
});

// Get businesses with certain category
businessesRoutes.get(
	`${rootPath}${categoryPath}`,
	(req: Request, res: Response) => {
		const { category } = req.params;
		const businessesToDisplay = businesses.filter(
			(business) => slugify(business.category) === category,
		);
		if (businessesToDisplay.length > 0) {
			res.status(200).json(businessesToDisplay);
		} else {
			res
				.status(404)
				.send(`No businesses found in category ${deSlugify(category)}`);
		}
	},
);

// Get business by ID
businessesRoutes.get(`${rootPath}${idPath}`, (req: Request, res: Response) => {
	const bId = Number(req.params.id);

	if (isNaN(bId)) {
		return res.status(404).send(`No business found with id: ${req.params.id}`);
	}

	const businessToDisplay = businesses.find((business) => business.id === bId);

	if (businessToDisplay) {
		return res.status(200).json(businessToDisplay);
	}

	return res.status(404).send(`No business found with id: ${req.params.id}`);
});
