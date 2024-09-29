import { Request, Response, Router } from "express";
import { bookings, categories } from "@lib/data";
import { EMAIL_REGEX, ROUTES } from "@constants";
import { schemaValidator } from "../middleware/schemaValidator";
import { getObjectById } from "@lib/getObjectById";

export const bookingsRoutes = Router();

const { path: rootPath, methods: rootMethods } = ROUTES.routes.bookings.root;
const { path: userEmailPath } = ROUTES.routes.bookings.root.subRoutes.user;
const { path: idPath } = ROUTES.routes.bookings.root.subRoutes.id;

//Get all bookings or add booking depending on request method
bookingsRoutes.all(
	rootPath,
	schemaValidator(rootPath, rootMethods),
	(req: Request, res: Response) => {
		if (!bookings) {
			return res.status(404).send("No bookings found in database");
		}
		//Depending on request method display booking or delete it
		switch (req.method) {
			case "GET":
				return res.status(200).send(bookings);
			case "POST": {
				const newBooking: Booking = {
					id: bookings.length + 1,
					...req.body,
				};
				bookings.push(newBooking);
				res.status(201).send(newBooking);
				break;
			}
			default:
				return res.status(405).send("Method not allowed");
		}
	},
);

// Get all bookings for specific user email
bookingsRoutes.get(
	`${rootPath}${userEmailPath}`,
	(req: Request, res: Response) => {
		const email = req.params.email;

		if (!email || !email.toLowerCase().match(EMAIL_REGEX)) {
			return res.status(400).send("No or incorrect email provided");
		}

		const filteredBookings = bookings.filter(
			(booking) => booking.userEmail.toLowerCase() === email.toLowerCase(),
		);

		if (filteredBookings.length > 0) {
			return res.status(200).send(filteredBookings);
		} else {
			return res
				.status(404)
				.send(`No bookings in database with user email: ${email}`);
		}
	},
);

//Get booking by id and display or delete it
bookingsRoutes.all(`${rootPath}${idPath}`, (req: Request, res: Response) => {
	const bId = Number(req.params.id);

	if (isNaN(bId)) {
		return res.status(404).send(`No booking found with id: ${req.params.id}`);
	}
	const { record: bookingById, recordIndex: bookingIndex } = getObjectById(
		bId,
		bookings,
	);

	if (!bookingById) {
		return res.status(404).send(`No booking found with id: ${req.params.id}`);
	}
	//Depending on request method display booking or delete it
	switch (req.method) {
		case "GET":
			return res.status(200).send(bookingById);
		case "DELETE":
			if (bookingIndex !== undefined) {
				bookings.splice(bookingIndex, 1);
				return res
					.status(200)
					.send(`Booking with ID:${bId} successfully deleted`);
			}
			break;
		default:
			return res.status(405).send("Method not allowed");
	}
});
