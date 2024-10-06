import "module-alias/register.js";
import express, { Express } from "express";
import { ROUTES } from "@constants";
import { routes } from "./routes";
import { connectToDb, PORT } from "./database/Mongo.database";
import cors from "cors";

const app: Express = express();

app.use(express.json());
app.use(cors());
app.use(ROUTES.apiPrefix, routes);

connectToDb().then(() => {
	app.listen(PORT, () => {
		console.log(`[server]: Server is running at http://localhost:${PORT}`);
	});
});
