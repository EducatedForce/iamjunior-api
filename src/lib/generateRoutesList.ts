import { ROUTES } from "@constants";

type RouteInfo = {
	path: string;
	methods: string[];
};

export const generateRoutesList = (routesData: typeof ROUTES): RouteInfo[] => {
	const { apiPrefix, routes } = routesData;
	const routeList: RouteInfo[] = [];

	// Helper function to push route paths to the list
	const addRoute = (path: string, methods: string[]) => {
		routeList.push({ path, methods });
	};

	// Loop through each top-level route (categories, businesses, bookings)
	Object.values(routes).forEach((routeGroup) => {
		const { root } = routeGroup;

		// Add the root path for the top-level route
		addRoute(`${apiPrefix}${root.path}`, root.methods);

		// Check if subRoutes exist and add them to the list
		if (Object.keys(root.subRoutes).length > 0) {
			Object.values(root.subRoutes).forEach((subRoute) => {
				addRoute(`${apiPrefix}${root.path}${subRoute.path}`, subRoute.methods);
			});
		}
	});

	return routeList;
};
