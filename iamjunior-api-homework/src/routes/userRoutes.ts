import { Request, Response, Router } from "express";
import { ROUTES } from "@constants";
import { User } from "@models/User";
import { authMiddleware } from "@middleware/authMiddleware";

export const userRoutes = Router();

const { path: rootPath } = ROUTES.routes.users.root;

userRoutes.get(
	rootPath,
	authMiddleware,
	async (_req: Request, res: Response) => {
		try {
			const users = await User.find().select(["-password"]);
			if (users.length === 0) {
				return res.status(404).send({ message: "No users found in database" });
			}
			return res.status(200).send(users);
		} catch (err) {
			return res.status(400).send(err);
		}
	},
);
