import { Transaction } from '@src/database/schemas/TransactionSchema';
import { User } from '@src/database/schemas/UserSchema';

async function GetAllTransactionsService(query: any): Promise<any> {
    try {
        const page = parseInt(query.page) || 1;
        const limit = parseInt(query.limit) || 20;
        const skip = (page - 1) * limit;

        const filter: any = {};

        if (query.status && ['pending', 'completed', 'failed'].includes(query.status)) {
            filter.status = query.status;
        }

        if (query.type && ['deposit', 'withdrawal', 'conversion', 'transfer'].includes(query.type)) {
            filter.transaction_type = query.type;
        }

        if (query.currency && ['NGN', 'GHS'].includes(query.currency)) {
            filter.currency = query.currency;
        }

        if (query.userId) {
            filter.userId = query.userId;
        }

        if (query.fromDate && query.toDate) {
            filter.createdAt = {
                $gte: new Date(query.fromDate),
                $lte: new Date(query.toDate),
            };
        }

        const transactions = await Transaction.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        // Get user details for each transaction
        const transactionsWithUsers = await Promise.all(
            transactions.map(async (transaction) => {
                const user = await User.findOne({ userId: transaction.userId }, 'firstName lastName email').lean();
                return {
                    ...transaction,
                    user: user || null,
                };
            })
        );

        const total = await Transaction.countDocuments(filter);

        return {
            error: false,
            data: {
                transactions: transactionsWithUsers,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit),
                },
            },
        };
    } catch (error) {
        console.error('Error in GetAllTransactionsService:', error);
        return {
            error: true,
            message: 'Failed to get transactions',
        };
    }
}

async function GetUserTransactionHistoryService(userId: string, query: any): Promise<any> {
    try {
        const page = parseInt(query.page) || 1;
        const limit = parseInt(query.limit) || 10;
        const skip = (page - 1) * limit;

        const filter: any = { userId };

        if (query.status && ['pending', 'completed', 'failed'].includes(query.status)) {
            filter.status = query.status;
        }

        if (query.type && ['deposit', 'withdrawal', 'conversion', 'transfer'].includes(query.type)) {
            filter.transaction_type = query.type;
        }

        if (query.fromDate && query.toDate) {
            filter.createdAt = {
                $gte: new Date(query.fromDate),
                $lte: new Date(query.toDate),
            };
        }

        const transactions = await Transaction.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        const total = await Transaction.countDocuments(filter);

        return {
            error: false,
            data: {
                transactions,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit),
                },
            },
        };
    } catch (error) {
        console.error('Error in GetUserTransactionHistoryService:', error);
        return {
            error: true,
            message: 'Failed to get transaction history',
        };
    }
}

async function GetTransactionDetailsService(transactionId: string, userId: string): Promise<any> {
    try {
        const transaction = await Transaction.findOne({
            transactionId,
            userId
        }).lean();

        if (!transaction) {
            return {
                error: true,
                message: 'Transaction not found',
            };
        }

        // Get user details
        const user = await User.findOne({ userId }, 'firstName lastName email phoneNumber').lean();

        return {
            error: false,
            data: {
                transaction,
                user,
            },
        };
    } catch (error) {
        console.error('Error in GetTransactionDetailsService:', error);
        return {
            error: true,
            message: 'Failed to get transaction details',
        };
    }
}

async function UpdateTransactionStatusService(
    transactionId: string,
    updateData: any,
    adminId: string
): Promise<any> {
    try {
        const { status, reason } = updateData;

        if (!['pending', 'completed', 'failed'].includes(status)) {
            return {
                error: true,
                message: 'Invalid status',
            };
        }

        const transaction = await Transaction.findOne({ transactionId });

        if (!transaction) {
            return {
                error: true,
                message: 'Transaction not found',
            };
        }

        // Update transaction
        transaction.status = status;
        if (reason) {
            transaction.description += ` | Admin note: ${reason}`;
        }
        await transaction.save();

        // Log admin action (implement AdminLog later)
        // await AdminLog.create({
        //     adminId,
        //     action: 'update_transaction_status',
        //     target: 'transaction',
        //     targetId: transactionId,
        //     details: { status, reason },
        // });

        return {
            error: false,
            message: 'Transaction status updated successfully',
            data: {
                transactionId,
                status,
                updatedAt: new Date(),
            },
        };
    } catch (error) {
        console.error('Error in UpdateTransactionStatusService:', error);
        return {
            error: true,
            message: 'Failed to update transaction status',
        };
    }
}

export {
    GetAllTransactionsService,
    GetUserTransactionHistoryService,
    GetTransactionDetailsService,
    UpdateTransactionStatusService,
};
