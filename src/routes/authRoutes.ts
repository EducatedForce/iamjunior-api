import { Request, Response, Router } from "express";
import { ROUTES } from "@constants";
import { IUser, User } from "@models/User";
import { generateJwtToken } from "@lib/generateJwtToken";
import { schemaValidator } from "@middleware/schemaValidator";

export const authRoutes = Router();
const { path: rootPath } = ROUTES.routes.auth.root;
const { path: loginPath } = ROUTES.routes.auth.root.subRoutes.login;
const { path: registerPath } = ROUTES.routes.auth.root.subRoutes.register;

authRoutes.post(
	`${rootPath}${loginPath}`,
	async (req: Request, res: Response) => {
		const { email, password } = req.body;
		if (!email || !password) {
			return res.status(400).send({ message: "No email or password provided" });
		}
		try {
			const user = (await User.findOne({ email: email })) as IUser | null;
			if (!user || !(await user.isCorrectPassword(password))) {
				return res.status(401).send({ message: "Incorrect email or password" });
			}
			const token = generateJwtToken({ id: user._id });
			return res.status(200).send({ token, user });
		} catch (err) {
			return res.status(400).send(err);
		}
	},
);

authRoutes.post(
	`${rootPath}${registerPath}`,
	schemaValidator(`${rootPath}${registerPath}`),
	async (req: Request, res: Response) => {
		const user = req.body as IUser;
		if (Object.keys(user).length === 0) {
			return res
				.status(400)
				.send({ message: "No or incorrect user data provided" });
		}
		try {
			const existingUser = await User.findOne({ email: user.email });
			if (existingUser) {
				return res.status(400).send({ message: "User already exists" });
			}
			const newUser = new User(user);
			await newUser.save();
			return res.status(201).json({ message: "User registered successfully" });
		} catch (err) {
			return res.status(500).send({
				message: "Error registering new user",
				error: (err as Error).message,
			});
		}
	},
);
