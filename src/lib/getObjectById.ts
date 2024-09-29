//Generic interface to make sure the object has property id
interface Identifiable {
	id: number;
}

// Helper function to get object by ID
export const getObjectById = <T extends Identifiable>(
	recordId: number,
	data: T[],
) => {
	let recordIndex: number | undefined;
	const record = data.find((record, index) => {
		recordIndex = index;
		return record.id === recordId;
	});
	return { record, recordIndex };
};
