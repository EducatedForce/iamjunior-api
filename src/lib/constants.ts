export const ROUTES = {
	apiPrefix: "/api",
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
				methods: ["POST"],
				subRoutes: {
					user: {
						path: "/user/:email",
						methods: ["GET"],
					},
					id: {
						path: "/:id",
						methods: ["DELETE"],
					},
				},
			},
		},
	},
};
