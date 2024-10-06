import { RequestHandler } from "express";
import { joiSchemas as schemas } from "@schemas/joiSchemas";

interface ValidationError {
	message: string;
	type: string;
}

interface JoiError {
	status: string;
	error: {
		original: unknown;
		details: ValidationError[];
	};
}

interface CustomError {
	status: string;
	error: string;
}

const validationOptions = {
	abortEarly: false,
	allowUnknown: false,
	stripUnknown: false,
};

export const schemaValidator = (
	path: string,
	useJoiError = true,
): RequestHandler => {
	const schema = schemas[path];

	if (!schema) {
		throw new Error(`Schema not found for path: ${path}`);
	}

	return (req, res, next) => {
		const { error, value } = schema.validate(req.body, validationOptions);
		const method = req.method;

		if (method === "GET") {
			return next();
		}

		if (error) {
			const customError: CustomError = {
				status: "failed",
				error: "Invalid request. Please review request and try again.",
			};

			const joiError: JoiError = {
				status: "failed",
				error: {
					original: error._original,
					details: error.details.map(({ message, type }: ValidationError) => ({
						message: message.replace(/['"]/g, ""),
						type,
					})),
				},
			};

			return res.status(422).json(useJoiError ? joiError : customError);
		}

		// validation successful
		req.body = value;
		return next();
	};
};
