import mongoose, { Schema } from "mongoose";
import { EMAIL_REGEX } from "@constants";

const ImageSchema = new mongoose.Schema({
	url: {
		type: String,
		required: true,
	},
});

const BusinessSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
	address: {
		type: String,
		required: true,
	},
	categoryId: {
		type: Schema.Types.ObjectId,
		ref: "Category",
		required: true,
	},
	contactPerson: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		match: EMAIL_REGEX,
	},
	images: {
		type: [ImageSchema],
		required: true,
	},
});

export const Business = mongoose.model("Business", BusinessSchema);
