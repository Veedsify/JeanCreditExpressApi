import { Schema, model, Document } from "mongoose";


export interface INotification extends Document {
    userId: string;
    type: string;
    message: string;
    read: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const NotificationSchema = new Schema<INotification>(
    {
        userId: { type: String, required: true },
        type: { type: String, required: true },
        message: { type: String, required: true },
        read: { type: Boolean, default: false },
    },
    {
        timestamps: true,
    }
);


const Notification = model<INotification>("Notification", NotificationSchema);
export {
    Notification,
    NotificationSchema,
};