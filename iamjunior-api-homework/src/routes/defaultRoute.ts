import { Request, Response, Router } from "express";
import { generateRoutesList } from "@lib/generateRooutesList";
import { ROUTES } from "@constants";

export const defaultRoute = Router();

defaultRoute.get("/", (_req: Request, res: Response) => {
	res.send({
		title: "IAMJunior API server",
		routes: generateRoutesList(ROUTES),
	});
});
