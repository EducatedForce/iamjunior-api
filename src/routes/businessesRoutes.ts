import { Request, Response, Router } from "express";
import mongoose from "mongoose";
import { DATE_REGEX, ROUTES } from "@constants";
import { deSlugify } from "@lib/deSlugify";
import { schemaValidator } from "@middleware/schemaValidator";
import { Business } from "@models/Business";
import { Category } from "@models/Category";
import { Booking } from "@models/Bookings";
import { methodMiddleware } from "@middleware/methodMiddleware";

export const businessesRoutes = Router();

const { path: rootPath, methods: rootMethods } = ROUTES.routes.businesses.root;
const { path: categoryPath } = ROUTES.routes.businesses.root.subRoutes.category;
const { path: idPath, methods: idMethods } =
	ROUTES.routes.businesses.root.subRoutes.id;
const { path: bookingsPath } = ROUTES.routes.businesses.root.subRoutes.bookings;

// Get all businesses or add new business
businessesRoutes.all(
	rootPath,
	methodMiddleware(rootMethods),
	schemaValidator(rootPath),
	async (req: Request, res: Response) => {
		//Depending on request method display all businesses or create new one in DB
		switch (req.method) {
			case "GET":
				try {
					const businesses = await Business.find();
					if (businesses.length > 0) {
						return res.status(200).send(businesses);
					}
					return res
						.status(404)
						.send({ message: "No businesses found in database" });
				} catch (err) {
					return res.status(400).send(err);
				}
			case "POST": {
				try {
					const categoryInDB = await Category.findOne({
						name: {
							$regex: new RegExp(`^${req.body.category}$`),
							$options: "i",
						},
					});
					if (!categoryInDB) {
						return res.status(400).send({
							message: `Cannot create a business as there is no category ${req.body.category} in the database`,
						});
					}
					const newBusiness = new Business({
						...req.body,
						category: categoryInDB._id,
					});
					try {
						const savedBusiness = await newBusiness.save();
						return res.status(201).send(savedBusiness);
					} catch (err) {
						return res.status(400).send(err);
					}
				} catch (err) {
					return res.status(400).send(err);
				}
			}
		}
	},
);

// Get businesses with certain category
businessesRoutes.get(
	`${rootPath}${categoryPath}`,
	async (req: Request, res: Response) => {
		const { category } = req.params;
		try {
			const categoryInDb = await Category.findOne({
				name: { $regex: new RegExp(`^${deSlugify(category)}$`), $options: "i" },
			});
			try {
				const businessesInDb = await Business.find({
					category: categoryInDb?._id,
				});
				if (businessesInDb.length > 0) {
					return res.status(200).send({
						category: categoryInDb?.name,
						businesses: businessesInDb,
					});
				} else {
					return res
						.status(404)
						.send(`No businesses found in category: ${deSlugify(category)}`);
				}
			} catch (err) {
				return res.status(400).send(err);
			}
		} catch (err) {
			return res.status(400).send(err);
		}
	},
);

// Get business by ID and either display it or update it
businessesRoutes.all(
	`${rootPath}${idPath}`,
	methodMiddleware(idMethods),
	schemaValidator(`${rootPath}${idPath}`),
	async (req: Request, res: Response) => {
		const bId = req.params.id;
		const validId = mongoose.Types.ObjectId.isValid(bId);
		if (!validId) {
			return res
				.status(404)
				.send({ message: `No business with ID:${bId} found in DB` });
		}
		//Depending on request method display business or update it
		switch (req.method) {
			case "GET":
				try {
					const businessToDisplay = await Business.findById(bId);
					if (businessToDisplay) {
						return res.status(200).send(businessToDisplay);
					}
					return res
						.status(400)
						.send({ message: `No business with ID:${bId} found in DB` });
				} catch (err) {
					return res.status(400).send(err);
				}

			case "PUT": {
				try {
					const categoryInDb = await Category.findOne({
						name: {
							$regex: new RegExp(`^${req.body.category}$`),
							$options: "i",
						},
					});

					if (categoryInDb) {
						const updatedBusiness = await Business.findByIdAndUpdate(
							bId,
							{
								...req.body,
								category: categoryInDb._id,
							},

							{ new: true },
						);
						if (updatedBusiness) {
							return res.status(200).send(updatedBusiness);
						}
						return res
							.status(404)
							.send({ message: `No business with ID:${bId} found in DB` });
					}
					return res.status(404).send({
						message: `Cannot update business as there is no such category in DB:${req.body.category}`,
					});
				} catch (err) {
					return res.status(400).send(err);
				}
			}
		}
	},
);

//Get bookings of specific business for specific date
businessesRoutes.get(
	`${rootPath}${bookingsPath}`,
	async (req: Request, res: Response) => {
		const bId = req.params.businessId;

		if (!mongoose.Types.ObjectId.isValid(bId)) {
			return res
				.status(404)
				.send({ message: `No business with ID:${bId} found in DB` });
		}
		if (!req.params.date.match(DATE_REGEX)) {
			return res.status(400).send({
				message: `Incorrect date format or date is not valid. Accepted format is YYYY-MM-DD.`,
			});
		}

		if (!Date.parse(req.params.date)) {
			return res.status(400).send({
				message: `Provided date ${req.params.date} is not a valid date.`,
			});
		}

		const bookingDate = new Date(req.params.date);

		try {
			const bookingsForBusiness = await Booking.find({
				date: bookingDate,
				businessId: bId,
			});
			if (bookingsForBusiness.length > 0) {
				try {
					const businessById = await Business.findById(bId);
					if (businessById) {
						return res.status(200).send({
							date: bookingDate.toLocaleDateString("lt-LT"),
							business: businessById.name,
							bookings: bookingsForBusiness,
						});
					}
					return res
						.status(404)
						.send({ message: `No business with ID:${bId} found in DB` });
				} catch (err) {
					return res.status(400).send(err);
				}
			}
			return res.status(404).send({ message: "No bookings found in DB" });
		} catch (err) {
			return res.status(400).send(err);
		}
	},
);
