import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
    profilePicture?: string;
    phoneNumber?: string;
    isVerified?: boolean;
    isActive?: boolean;
    isAdmin?: boolean;
    isBlocked?: boolean;
    userId: string;
    country?: "NGN" | "GHS";
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
    {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        username: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        profilePicture: { type: String, default: "" },
        phoneNumber: { type: String, default: "" },
        isVerified: { type: Boolean, default: false },
        isActive: { type: Boolean, default: true },
        isAdmin: { type: Boolean, default: false },
        isBlocked: { type: Boolean, default: false },
        userId: { type: String, required: true, unique: true },
        country: {
            type: String,
            enum: [
                "NGN",
                "GHA",
                "ZAR",
                "TZA",
                "UGA",
                "RWA",
                "ZMB",
                "MWI",
                "BWA",
                "ZWE"],
            default: "NGN",
        }
    },
    {
        timestamps: true,
    }
);


const User = model<IUser>("User", UserSchema);

export {
    User,
    UserSchema,
};