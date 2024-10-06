import { RequestHandler } from "express";

export const methodMiddleware = (
	supportedMethods: string[],
): RequestHandler => {
	return (req, res, next) => {
		const method = req.method;

		if (supportedMethods.includes(method)) {
			return next();
		}
		//Return 405 if method is not in allowed methods
		return res.status(405).send({ message: "Method not allowed" });
	};
};
