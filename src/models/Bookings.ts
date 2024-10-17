import mongoose, { InferSchemaType, Schema, Document } from "mongoose";
import { EMAIL_REGEX, TIME_REGEX } from "@constants";

const BookingSchema = new mongoose.Schema({
	businessId: {
		type: Schema.Types.ObjectId,
		ref: "Business",
		required: true,
	},
	date: {
		type: Date,
		required: true,
	},
	time: {
		type: String,
		required: true,
		match: TIME_REGEX,
	},
	userEmail: {
		type: String,
		required: true,
		match: EMAIL_REGEX,
	},
	userName: {
		type: String,
		required: true,
	},
	status: {
		type: String,
		required: true,
	},
});

export type BookingSchemaType = InferSchemaType<typeof BookingSchema>;

export const Booking = mongoose.model<BookingSchemaType & Document>(
	"Booking",
	BookingSchema,
);
