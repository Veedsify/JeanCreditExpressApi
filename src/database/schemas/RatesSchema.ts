import { Schema, model, Document } from "mongoose";

export interface IRate extends Document {
    from_currency: string;
    to_currency: string;
    rate: number;
    source: string;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const RatesSchema = new Schema<IRate>(
    {
        from_currency: { type: String, required: true },
        to_currency: { type: String, required: true },
        rate: { type: Number, required: true },
        source: { type: String, required: true },
        active: { type: Boolean, default: true },
    },
    {
        timestamps: true,
    }
);

const Rate = model<IRate>("Rate", RatesSchema);
export {
    Rate,
    RatesSchema,
}