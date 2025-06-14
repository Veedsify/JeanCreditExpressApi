import { ObjectId } from "mongoose";

export type CountryListType = "NGN" | "GHS";

export type RegisterUserData = {
    firstName: string;
    lastName: string;
    country: string;
    email: string;
    password: string;
    phoneNumber?: string;
}

export type SignupResponse = {
    error: boolean;
    message: string;
    payload?: {
        _id: ObjectId;
        userId: string;
        firstName: string;
        lastName: string;
        country: string;
        email: string;
        createdAt: Date;
    }
}

export type LoginData = {
    email: string;
    password: string;
}

export type LoginResponse = {
    error: boolean;
    message: string;
    accessToken?: string;
    payload?: {
        _id: ObjectId;
        userId: string;
        firstName: string;
        lastName: string;
        email: string;
        createdAt: Date;
    }
}