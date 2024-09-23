interface Category {
	id: number;
	name: string;
	backgroundColor: string;
	iconUrl: string;
}

interface Business {
	id: string;
	name: string;
	description: string;
	address: string;
	category: string;
	contactPerson: string;
	email: string;
	images: string[];
}

interface Booking {
	id: string;
	businessId: string;
	date: string;
	time: string;
	userEmail: string;
	userName: string;
	status: string;
}
