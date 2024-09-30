interface Category {
	id: string | number;
	name: string;
	backgroundColor: string;
	iconUrl: string;
}

interface Business {
	id: string | number;
	name: string;
	description: string;
	address: string;
	category: string;
	contactPerson: string;
	email: string;
	images: { url: string }[];
}

interface Booking {
	id: string | number;
	businessId: number;
	date: Date;
	time: string;
	userEmail: string;
	userName: string;
	status: string;
}
