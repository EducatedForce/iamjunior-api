import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

export interface IUser extends Document {
	_id: mongoose.Types.ObjectId;
	name: string;
	age?: number;
	email: string;
	password: string;

	isCorrectPassword(password: string): Promise<boolean>;
}

export const userSchema = new Schema<IUser>(
	{
		name: { type: String, required: true },
		age: { type: Number },
		email: { type: String, required: true },
		password: { type: String, required: true },
	},
	{
		timestamps: true,
		versionKey: false,
	},
);

userSchema.pre<IUser>("save", async function (next) {
	const user = this as typeof userSchema.methods;
	const salt = isNaN(Number(process.env.BCRYPT_SALT))
		? 8
		: Number(process.env.BCRYPT_SALT);
	if (user.isModified("password")) {
		user.password = await bcrypt.hash(this.password, salt);
	}
	next();
});

userSchema.methods.isCorrectPassword = function (password: string) {
	return bcrypt.compare(password, this.password);
};

export const User = mongoose.model<IUser>("User", userSchema);
