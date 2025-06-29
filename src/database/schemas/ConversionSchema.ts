import { Schema, model, Document } from "mongoose";

export interface IConversion extends Document {
    userId: string;
    conversionId: string;
    transactionId: string;
    from_currency: string;
    to_currency: string;
    amount: number;
    converted_amount: number;
    fee: number;
    rate: number;
    source: string;
    status: "pending" | "completed" | "failed";
    estimatedArrival?: string;
    createdAt: Date;
    updatedAt: Date;
}

const ConversionSchema = new Schema<IConversion>(
    {
        userId: { type: String, required: true },
        conversionId: { type: String, required: true, unique: true },
        transactionId: { type: String, required: true },
        from_currency: { type: String, required: true },
        to_currency: { type: String, required: true },
        amount: { type: Number, required: true },
        converted_amount: { type: Number, required: true },
        fee: { type: Number, required: true },
        rate: { type: Number, required: true },
        source: { type: String, required: true },
        status: {
            type: String,
            enum: ["pending", "completed", "failed"],
            default: "pending",
        },
        estimatedArrival: { type: String },
    },
    {
        timestamps: true,
    }
);

const Conversion = model<IConversion>("Conversion", ConversionSchema);

export {
    Conversion,
    ConversionSchema,
};