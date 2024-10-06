import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
	name: { type: String, required: true, unique: true },
	backgroundColor: { type: String, required: true },
	iconUrl: { type: String, require: true },
});

CategorySchema.index({ name: 1 }, { unique: true });

export const Category = mongoose.model("Category", CategorySchema);

Category.syncIndexes()
	.then(() => {
		console.log("Category indexes synced successfully");
	})
	.catch((err) => {
		console.error("Error syncing indexes:", err);
	});
