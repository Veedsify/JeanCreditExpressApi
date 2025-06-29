import { Schema, model, Document } from "mongoose";

export interface IAdminLog extends Document {
    adminId: string;
    action: string;
    target: string;
    targetId: string;
    details: any;
    ipAddress?: string;
    userAgent?: string;
    createdAt: Date;
}

const AdminLogSchema = new Schema<IAdminLog>(
    {
        adminId: { type: String, required: true },
        action: { type: String, required: true },
        target: { type: String, required: true }, // e.g., 'transaction', 'user', 'rate'
        targetId: { type: String, required: true },
        details: { type: Schema.Types.Mixed },
        ipAddress: { type: String },
        userAgent: { type: String },
    },
    {
        timestamps: true,
    }
);

const AdminLog = model<IAdminLog>("AdminLog", AdminLogSchema);

export interface IExchangeRate extends Document {
    fromCurrency: string;
    toCurrency: string;
    rate: number;
    source: "manual" | "api";
    setBy?: string; // adminId if manual
    isActive: boolean;
    validFrom: Date;
    validTo?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const ExchangeRateSchema = new Schema<IExchangeRate>(
    {
        fromCurrency: { type: String, required: true },
        toCurrency: { type: String, required: true },
        rate: { type: Number, required: true },
        source: {
            type: String,
            enum: ["manual", "api"],
            default: "api"
        },
        setBy: { type: String }, // adminId
        isActive: { type: Boolean, default: true },
        validFrom: { type: Date, default: Date.now },
        validTo: { type: Date },
    },
    {
        timestamps: true,
    }
);

const ExchangeRate = model<IExchangeRate>("ExchangeRate", ExchangeRateSchema);

export {
    AdminLog,
    AdminLogSchema,
    ExchangeRate,
    ExchangeRateSchema,
};
