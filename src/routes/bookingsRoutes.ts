import { Request, Response, Router } from "express";
import { EMAIL_REGEX, ROUTES } from "@constants";
import { schemaValidator } from "@middleware/schemaValidator";
import { Booking, BookingSchemaType } from "@models/Bookings";
import mongoose from "mongoose";
import { methodMiddleware } from "@middleware/methodMiddleware";
import { Business } from "@models/Business";

type ModifiedBooking = BookingSchemaType & {
	businessName: string;
};

export const bookingsRoutes = Router();

const { path: rootPath, methods: rootMethods } = ROUTES.routes.bookings.root;
const { path: userEmailPath } = ROUTES.routes.bookings.root.subRoutes.user;
const { path: idPath, methods: idPathMethods } =
	ROUTES.routes.bookings.root.subRoutes.id;

//Get all bookings or add booking depending on request method
bookingsRoutes.all(
	rootPath,
	methodMiddleware(rootMethods),
	schemaValidator(rootPath),
	async (req: Request, res: Response) => {
		//Depending on request method display all bookings or create new one in DB
		switch (req.method) {
			case "GET": {
				try {
					const bookings = await Booking.find();
					if (bookings.length > 0) {
						const modifiedBookings = await Promise.all(
							bookings.map(async (booking) => {
								const business = await Business.findById(booking.businessId);
								return {
									...booking.toObject(),
									businessName: business?.name,
								} as ModifiedBooking;
							}),
						);
						return res.status(200).json(modifiedBookings);
					} else {
						return res.status(404).send({ message: "No bookings found in DB" });
					}
				} catch (err) {
					return res.status(500).send({
						message: "Error fetching bookings",
						error: err,
					});
				}
			}
			case "POST": {
				try {
					const newBooking = new Booking({
						...req.body,
						userEmail: req.body.userEmail.toLowerCase(),
					});
					const savedBooking = await newBooking.save();
					return res.status(201).send(savedBooking);
				} catch (err) {
					return res.status(400).send(err);
				}
			}
		}
	},
);

// Get all bookings for specific user email
bookingsRoutes.get(
	`${rootPath}${userEmailPath}`,
	async (req: Request, res: Response) => {
		const email = req.params.email.toLowerCase();

		if (!email || !email.match(EMAIL_REGEX)) {
			return res
				.status(400)
				.send({ message: "No or incorrect email provided" });
		}

		try {
			const bookingsByEmail = await Booking.find({ userEmail: email });
			if (bookingsByEmail.length > 0) {
				const modifiedBookings = await Promise.all(
					bookingsByEmail.map(async (booking) => {
						const business = await Business.findById(booking.businessId);
						return {
							...booking.toObject(),
							businessName: business?.name,
						} as ModifiedBooking;
					}),
				);
				return res.status(200).send(modifiedBookings);
			} else {
				return res.status(404).send({
					message: `No bookings in database with user email: ${email}`,
				});
			}
		} catch (err) {
			return res.status(500).send({
				message: "Error fetching bookings",
				error: err,
			});
		}
	},
);

//Get booking by id and display it or delete it
bookingsRoutes.all(
	`${rootPath}${idPath}`,
	methodMiddleware(idPathMethods),
	async (req: Request, res: Response) => {
		const bookingId = req.params.id;
		const validId = mongoose.Types.ObjectId.isValid(bookingId);

		if (!validId) {
			return res
				.status(404)
				.send({ message: `No booking with ID:${bookingId} found in DB` });
		}
		//Depending on request method display booking or delete it
		switch (req.method) {
			case "GET": {
				try {
					const bookingById = await Booking.findById(bookingId);
					if (bookingById) {
						const business = await Business.findById(bookingById.businessId);
						return res.status(200).send({
							...bookingById.toObject(),
							businessName: business?.name,
						} as ModifiedBooking);
					}
					return res
						.status(404)
						.send({ message: `No booking with ID:${bookingId} found in DB` });
				} catch (err) {
					return res.status(500).send({
						message: "Error fetching booking",
						error: err,
					});
				}
			}
			case "DELETE": {
				try {
					const deletedBooking = await Booking.findByIdAndDelete(bookingId);
					if (deletedBooking) {
						return res
							.status(200)
							.send({ message: `Booking successfully deleted` });
					}
					return res
						.status(404)
						.send({ message: `No booking with ID:${bookingId} found in DB` });
				} catch (err) {
					return res.status(500).send({
						message: "Error deleting booking",
						error: err,
					});
				}
			}
		}
	},
);
