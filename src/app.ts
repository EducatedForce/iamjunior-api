import express, { Express } from "express";
import dotenv from "dotenv";
import { CONSTANTS } from "./lib/constants";
import { routes } from "./routes";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(CONSTANTS.apiPrefix, routes);

app.listen(port, () => {
	console.log(`[server]: Server is running at http://localhost:${port}`);
});
