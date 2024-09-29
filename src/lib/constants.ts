import dotenv from "dotenv";

dotenv.config();

export const ROUTES = {
	apiPrefix: process.env.DEFAULT_API_PREFIX ?? "/",
	routes: {
		categories: {
			root: {
				path: "/categories",
				methods: ["GET", "POST"],
				subRoutes: {},
			},
		},
		businesses: {
			root: {
				path: "/businesses",
				methods: ["GET", "POST"],
				subRoutes: {
					id: {
						path: "/:id",
						methods: ["GET", "PUT"],
					},
					category: {
						path: "/category/:category",
						methods: ["GET", "POST"],
					},
					bookings: {
						path: "/:businessId/bookings/date/:date",
						methods: ["GET"],
					},
				},
			},
		},
		bookings: {
			root: {
				path: "/bookings",
				methods: ["GET", "POST"],
				subRoutes: {
					user: {
						path: "/user/:email",
						methods: ["GET"],
					},
					id: {
						path: "/:id",
						methods: ["GET", "DELETE"],
					},
				},
			},
		},
	},
};

export const EMAIL_REGEX = new RegExp(
	"^\\w+([.-]?\\w+)*@\\w+([.-]?\\w+)*(\\.\\w{2,3})+$",
);

export const DATE_REGEX = new RegExp(
	"^\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01])$",
);

export const TIME_REGEX = new RegExp("^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$");
