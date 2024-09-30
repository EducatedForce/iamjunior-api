import "module-alias/register.js";
import express, { Express } from "express";
import { ROUTES } from "@constants";
import { routes } from "./routes";
import { connectToDb, PORT } from "./database/Mongo.database";

const app: Express = express();

app.use(express.json());
app.use(ROUTES.apiPrefix, routes);

connectToDb().then(() => {
	app.listen(PORT, () => {
		console.log(`[server]: Server is running at http://localhost:${PORT}`);
	});
});
