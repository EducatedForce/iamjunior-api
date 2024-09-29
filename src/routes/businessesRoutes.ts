import { Request, Response, Router } from "express";
import { bookings, businesses } from "@lib/data";
import { slugify } from "@lib/slugify";
import { deSlugify } from "@lib/deSlugify";
import { DATE_REGEX, ROUTES } from "@constants";
import { schemaValidator } from "@middleware/schemaValidator";
import { getObjectById } from "@lib/getObjectById";

export const businessesRoutes = Router();

const { path: rootPath, methods: rootMethods } = ROUTES.routes.businesses.root;
const { path: categoryPath } = ROUTES.routes.businesses.root.subRoutes.category;
const { path: idPath, methods: idMethods } =
	ROUTES.routes.businesses.root.subRoutes.id;
const { path: bookingsPath } = ROUTES.routes.businesses.root.subRoutes.bookings;

// Get all businesses
businessesRoutes.get(rootPath, (_req: Request, res: Response) => {
	if (businesses.length > 0) {
		res.status(200).send(businesses);
	} else {
		res.status(404).send("No businesses in database");
	}
});

// Create new business
businessesRoutes.post(
	rootPath,
	schemaValidator(rootPath, rootMethods),
	(req: Request, res: Response) => {
		const newBusinessEntity: Business = {
			id: businesses.length + 1,
			...req.body,
		};
		businesses.push(newBusinessEntity);
		res.status(201).send(newBusinessEntity);
	},
);

// Get businesses with certain category
businessesRoutes.get(
	`${rootPath}${categoryPath}`,
	(req: Request, res: Response) => {
		const { category } = req.params;
		const businessesToDisplay = businesses.filter(
			(business) => slugify(business.category) === category,
		);
		if (businessesToDisplay.length > 0) {
			res.status(200).send(businessesToDisplay);
		} else {
			res
				.status(404)
				.send(`No businesses found in category ${deSlugify(category)}`);
		}
	},
);

// Get business by ID and either display it or update it
businessesRoutes.all(
	`${rootPath}${idPath}`,
	schemaValidator(`${rootPath}${idPath}`, idMethods),
	(req: Request, res: Response) => {
		const bId = Number(req.params.id);

		if (isNaN(bId)) {
			return res
				.status(404)
				.send(`No business found with id: ${req.params.id}`);
		}

		const { record: businessToDisplay, recordIndex: businessIndexToUpdate } =
			getObjectById(bId, businesses);

		if (!businessToDisplay) {
			return res
				.status(404)
				.send(`No business found with id: ${req.params.id}`);
		}

		//Depending on request method display business or update it
		switch (req.method) {
			case "GET":
				return res.status(200).send(businessToDisplay);
			case "PUT":
				if (businessIndexToUpdate !== undefined) {
					const updatedBusiness = {
						id: bId,
						...req.body,
					};
					businesses.splice(businessIndexToUpdate, 1, updatedBusiness);
					return res.status(201).send(updatedBusiness);
				}
				break;
			default:
				return res.status(405).send("Method not allowed");
		}

		if (businessToDisplay) {
			return res.status(200).send(businessToDisplay);
		}
	},
);

//Get bookings of specific business for specific date
businessesRoutes.get(
	`${rootPath}${bookingsPath}`,
	(req: Request, res: Response) => {
		const bId = Number(req.params.businessId);
		const bookingDate = new Date(req.params.date);

		if (isNaN(bId)) {
			return res
				.status(404)
				.send(`No business found with id: ${req.params.businessId}`);
		}

		if (!req.params.date.match(DATE_REGEX)) {
			return res
				.status(400)
				.send(
					`Incorrect date format or date is not valid. Accepted format is YYYY-MM-DD.`,
				);
		}

		if (Date.parse(req.params.date)) {
			return res
				.status(400)
				.send(`Provided date ${req.params.date} is not a valid date.`);
		}

		const bookingDateYear = bookingDate.getFullYear();
		const bookingDateMonthIndex = bookingDate.getMonth();
		const bookingDateDay = bookingDate.getDate();
		const dateString = bookingDate.toLocaleDateString("lt-LT");

		const filteredBookingsByDate = bookings.filter((booking) => {
			return (
				booking.date.getFullYear() === bookingDateYear &&
				booking.date.getMonth() === bookingDateMonthIndex &&
				booking.date.getDate() === bookingDateDay
			);
		});
		if (filteredBookingsByDate.length === 0) {
			return res
				.status(404)
				.send(`No bookings were found on specified date: ${dateString}`);
		}
		const { record: businessRecord } = getObjectById(bId, businesses);

		if (businessRecord) {
			const filteredBookingsByBusiness = filteredBookingsByDate.filter(
				(booking) => booking.businessId === bId,
			);
			if (filteredBookingsByBusiness.length > 0) {
				return res.status(200).send(filteredBookingsByBusiness);
			}
		}

		return res
			.status(404)
			.send(`No bookings were found for business ID: ${bId}, on ${dateString}`);
	},
);
