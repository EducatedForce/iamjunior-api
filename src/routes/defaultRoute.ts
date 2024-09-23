import { Request, Response, Router } from "express";

export const defaultRoute = Router();

defaultRoute.get("/", (req: Request, res: Response) => {
	res.send({ message: "Express JS & Node JS server" });
});
