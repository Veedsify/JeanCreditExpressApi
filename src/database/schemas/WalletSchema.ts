import { Schema, model, Document } from "mongoose";

export interface IWallet extends Document {
    userId: string;
    balanceNGN: number;
    balanceGHS: number;
    totalDeposits: number;
    totalWithdrawals: number;
    totalConversions: number;
    isActive: boolean;
    lastTransactionAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const WalletSchema = new Schema<IWallet>(
    {
        userId: { type: String, required: true, unique: true },
        balanceNGN: { type: Number, required: true, default: 0 },
        balanceGHS: { type: Number, required: true, default: 0 },
        totalDeposits: { type: Number, default: 0 },
        totalWithdrawals: { type: Number, default: 0 },
        totalConversions: { type: Number, default: 0 },
        isActive: { type: Boolean, default: true },
        lastTransactionAt: { type: Date },
    },
    {
        timestamps: true,
    }
);

const Wallet = model<IWallet>("Wallet", WalletSchema);

export {
    Wallet,
    WalletSchema,
};
