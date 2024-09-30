import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const tokenExpiresIn = { expiresIn: "30d" };

export const generateJwtToken = (payload: JwtPayload) => {
	return jwt.sign(payload, process.env.JWT_SECRET!, tokenExpiresIn);
};
