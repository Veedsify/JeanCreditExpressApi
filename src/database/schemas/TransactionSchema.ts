import { Schema, model, Document } from "mongoose";


export interface ITransaction extends Document {
    userId: string;
    transactionId: string;
    amount: number;
    currency: string;
    status: "pending" | "completed" | "failed";
    transaction_type: "deposit" | "withdrawal" | "conversion" | "transfer";
    refernce: string;
    direction: "NGN_GHS" | "GHS_NGN" | "DEPOSIT_NGN" | "DEPOSIT_GHS" | "WITHDRAWAL_NGN" | "WITHDRAWAL_GHS";
    description?: string;
    createdAt: Date;
    updatedAt: Date;
}


const TransactionSchema = new Schema<ITransaction>(
    {
        userId: { type: String, required: true },
        transactionId: { type: String, required: true, unique: true },
        amount: { type: Number, required: true },
        currency: { type: String, required: true },
        status: {
            type: String,
            enum: ["pending", "completed", "failed"],
            default: "pending",
        },
        transaction_type: {
            type: String,
            enum: ["deposit", "withdrawal", "conversion", "transfer"],
            required: true,
        },
        refernce: { type: String, required: true, unique: true },
        direction: {
            type: String,
            enum: [
                "NGN_GHS",
                "GHS_NGN",
                "DEPOSIT_NGN",
                "DEPOSIT_GHS",
                "WITHDRAWAL_NGN",
                "WITHDRAWAL_GHS",
            ],
            required: true,
        },
        description: { type: String, default: "" },
    },
    {
        timestamps: true,
    }
);

const Transaction = model<ITransaction>("Transaction", TransactionSchema);

export {
    Transaction,
    TransactionSchema,
};