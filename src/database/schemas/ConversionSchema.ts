import { Schema, model, Document } from "mongoose";


export interface IConversion {
    from_currency: { type: String, required: true },
    to_currency: { type: String, required: true },
    amount: { type: number, required: true },
    converted_amount: { type: number, required: true },
    fee: { type: number, required: true },
    rate: { type: number, required: true },
    source: { type: String, required: true },
    status: {
        type: String,
        enum: ["pending", "completed", "failed"],
        default: "pending",
    },
}

const ConversionSchema = new Schema<IConversion>(
    {
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