import { Schema, model, Document } from "mongoose";


export interface IWebHookEvent extends Document {
    eventId: string;
    eventType: string;
    provider: string;
    payload: Record<string, any>;
    status: "pending" | "processed" | "failed";
    createdAt: Date;
    updatedAt: Date;
}

const WebHookEventSchema = new Schema<IWebHookEvent>(
    {
        eventId: { type: String, required: true, unique: true },
        eventType: { type: String, required: true },
        provider: { type: String, required: true },
        payload: { type: Object, required: true },
        status: {
            type: String,
            enum: ["pending", "processed", "failed"],
            default: "pending",
        },
    },
    {
        timestamps: true,
    }
);