import Joi, { ObjectSchema } from "joi";
import { ROUTES } from "@constants";

const categorySchema = Joi.object().keys({
	name: Joi.string().required(),
	backgroundColor: Joi.string().required(),
	iconUrl: Joi.string().required(),
});

export const joiSchemas: { [key: string]: ObjectSchema } = {
	[ROUTES.routes.categories.root.path]: categorySchema,
};
