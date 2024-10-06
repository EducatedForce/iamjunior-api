import jwt, { JwtPayload } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();

interface UserAuthRequest extends Request {
	currentUser?: JwtPayload;
}

export const authMiddleware = (
	req: UserAuthRequest,
	res: Response,
	next: NextFunction,
) => {
	const authHeader = req.headers.authorization;
	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		res.status(401).send({ error: "Not authenticated" });
		return;
	}
	const token = authHeader.split(" ")[1];
	try {
		req.currentUser = <JwtPayload>jwt.verify(token, process.env.JWT_SECRET!);
		next();
	} catch (err) {
		console.error(err);
		res.status(401).send({ error: "Not authenticated" });
	}
};
