import Joi, { ObjectSchema } from "joi";
import { ROUTES, TIME_REGEX } from "@constants";

const { path: categoriesRootPath } = ROUTES.routes.categories.root;
const { path: businessesRootPath } = ROUTES.routes.businesses.root;
const { path: businessesIdPath } = ROUTES.routes.businesses.root.subRoutes.id;
const { path: bookingsPath } = ROUTES.routes.bookings.root;

const categorySchema = Joi.object().keys({
	name: Joi.string().required(),
	backgroundColor: Joi.string().required(),
	iconUrl: Joi.string().required(),
});

const businessSchema = Joi.object().keys({
	name: Joi.string().required(),
	description: Joi.string().required(),
	address: Joi.string().required(),
	category: Joi.string().required(),
	contactPerson: Joi.string().required(),
	email: Joi.string().email().required(),
	images: Joi.array().items({ url: Joi.string().required() }).min(1),
});

const bookingSchema = Joi.object().keys({
	businessId: Joi.string().required(),
	date: Joi.date().required(),
	time: Joi.string().pattern(TIME_REGEX).required(),
	userEmail: Joi.string().email().required(),
	userName: Joi.string().required(),
	status: Joi.string().required(),
});

export const joiSchemas: { [key: string]: ObjectSchema } = {
	[categoriesRootPath]: categorySchema,
	[businessesRootPath]: businessSchema,
	[`${businessesRootPath}${businessesIdPath}`]: businessSchema,
	[bookingsPath]: bookingSchema,
};
