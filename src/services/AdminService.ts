import { User } from '@src/database/schemas/UserSchema';
import { Transaction } from '@src/database/schemas/TransactionSchema';
import { Wallet } from '@src/database/schemas/WalletSchema';
import { Conversion } from '@src/database/schemas/ConversionSchema';
import { AdminLog, ExchangeRate } from '@src/database/schemas/AdminSchema';
import { CompareHashedPassword } from '@src/libs/HashPassword';
import { Authenticate } from '@src/libs/Jwt';

interface AdminLoginData {
    email: string;
    password: string;
}

async function AdminLoginService(loginData: AdminLoginData): Promise<any> {
    try {
        const { email, password } = loginData;

        if (!email || !password) {
            return {
                error: true,
                message: 'Please provide email and password',
            };
        }

        // Find admin user
        const admin = await User.findOne({
            email,
            isAdmin: true,
            isActive: true
        });

        if (!admin) {
            return {
                error: true,
                message: 'Invalid admin credentials',
            };
        }

        // Check password
        const isPasswordValid = await CompareHashedPassword(password, admin.password);
        if (!isPasswordValid) {
            return {
                error: true,
                message: 'Invalid admin credentials',
            };
        }

        // Generate token
        const token = Authenticate({
            userId: admin.userId,
            email: admin.email,
            isAdmin: true,
        });

        return {
            error: false,
            message: 'Admin login successful',
            data: {
                token,
                admin: {
                    userId: admin.userId,
                    firstName: admin.firstName,
                    lastName: admin.lastName,
                    email: admin.email,
                    isAdmin: admin.isAdmin,
                },
            },
        };
    } catch (error) {
        console.error('Error in AdminLoginService:', error);
        return {
            error: true,
            message: 'Failed to login admin',
        };
    }
}

async function GetAdminDashboardService(): Promise<any> {
    try {
        // Get summary statistics
        const totalUsers = await User.countDocuments({ isActive: true });
        const totalTransactions = await Transaction.countDocuments();
        const pendingTransactions = await Transaction.countDocuments({ status: 'pending' });
        const completedTransactions = await Transaction.countDocuments({ status: 'completed' });
        const failedTransactions = await Transaction.countDocuments({ status: 'failed' });

        // Get transaction volumes
        const currentDate = new Date();
        const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

        const monthlyVolume = await Transaction.aggregate([
            {
                $match: {
                    createdAt: { $gte: startOfMonth },
                    status: 'completed',
                }
            },
            {
                $group: {
                    _id: '$direction',
                    total: { $sum: '$amount' },
                    count: { $sum: 1 }
                }
            }
        ]);

        // Get recent transactions
        const recentTransactions = await Transaction.find()
            .sort({ createdAt: -1 })
            .limit(10)
            .lean();

        return {
            error: false,
            data: {
                summary: {
                    totalUsers,
                    totalTransactions,
                    pendingTransactions,
                    completedTransactions,
                    failedTransactions,
                },
                monthlyVolume,
                recentTransactions,
            },
        };
    } catch (error) {
        console.error('Error in GetAdminDashboardService:', error);
        return {
            error: true,
            message: 'Failed to get admin dashboard',
        };
    }
}

async function GetAllTransactionsAdminService(query: any): Promise<any> {
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

        if (query.search) {
            // Search by transaction ID, user email, or reference
            const searchRegex = new RegExp(query.search, 'i');
            const users = await User.find({
                $or: [
                    { email: searchRegex },
                    { firstName: searchRegex },
                    { lastName: searchRegex }
                ]
            }, 'userId').lean();

            const userIds = users.map(u => u.userId);

            filter.$or = [
                { transactionId: searchRegex },
                { refernce: searchRegex },
                { userId: { $in: userIds } }
            ];
        }

        const transactions = await Transaction.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        // Get user details for each transaction
        const transactionsWithUsers = await Promise.all(
            transactions.map(async (transaction) => {
                const user = await User.findOne(
                    { userId: transaction.userId },
                    'firstName lastName email phoneNumber'
                ).lean();
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
        console.error('Error in GetAllTransactionsAdminService:', error);
        return {
            error: true,
            message: 'Failed to get transactions',
        };
    }
}

async function GetTransactionDetailsAdminService(transactionId: string): Promise<any> {
    try {
        const transaction = await Transaction.findOne({ transactionId }).lean();

        if (!transaction) {
            return {
                error: true,
                message: 'Transaction not found',
            };
        }

        // Get user details
        const user = await User.findOne({ userId: transaction.userId }).lean();

        // Get wallet details
        const wallet = await Wallet.findOne({ userId: transaction.userId }).lean();

        // Get related conversion if it's a conversion transaction
        let conversion = null;
        if (transaction.transaction_type === 'conversion') {
            conversion = await Conversion.findOne({ transactionId }).lean();
        }

        return {
            error: false,
            data: {
                transaction,
                user,
                wallet,
                conversion,
            },
        };
    } catch (error) {
        console.error('Error in GetTransactionDetailsAdminService:', error);
        return {
            error: true,
            message: 'Failed to get transaction details',
        };
    }
}

async function ApproveTransactionService(transactionId: string, adminId: string): Promise<any> {
    try {
        const transaction = await Transaction.findOne({ transactionId });

        if (!transaction) {
            return {
                error: true,
                message: 'Transaction not found',
            };
        }

        if (transaction.status !== 'pending') {
            return {
                error: true,
                message: 'Transaction is not pending',
            };
        }

        // Update transaction status
        transaction.status = 'completed';
        await transaction.save();

        // Update wallet balance if it's a deposit
        if (transaction.transaction_type === 'deposit') {
            const wallet = await Wallet.findOne({ userId: transaction.userId });
            if (wallet) {
                if (transaction.currency === 'NGN') {
                    wallet.balanceNGN += transaction.amount;
                } else {
                    wallet.balanceGHS += transaction.amount;
                }
                wallet.totalDeposits += transaction.amount;
                await wallet.save();
            }
        }

        // Log admin action
        await AdminLog.create({
            adminId,
            action: 'approve_transaction',
            target: 'transaction',
            targetId: transactionId,
            details: { transactionId, previousStatus: 'pending', newStatus: 'completed' },
        });

        return {
            error: false,
            message: 'Transaction approved successfully',
            data: {
                transactionId,
                status: 'completed',
                approvedAt: new Date(),
                approvedBy: adminId,
            },
        };
    } catch (error) {
        console.error('Error in ApproveTransactionService:', error);
        return {
            error: true,
            message: 'Failed to approve transaction',
        };
    }
}

async function RejectTransactionService(transactionId: string, adminId: string, reason?: string): Promise<any> {
    try {
        const transaction = await Transaction.findOne({ transactionId });

        if (!transaction) {
            return {
                error: true,
                message: 'Transaction not found',
            };
        }

        if (transaction.status !== 'pending') {
            return {
                error: true,
                message: 'Transaction is not pending',
            };
        }

        // Update transaction status
        transaction.status = 'failed';
        if (reason) {
            transaction.description += ` | Rejection reason: ${reason}`;
        }
        await transaction.save();

        // Refund wallet balance if needed
        if (transaction.transaction_type === 'withdrawal' || transaction.transaction_type === 'conversion') {
            const wallet = await Wallet.findOne({ userId: transaction.userId });
            if (wallet) {
                if (transaction.currency === 'NGN') {
                    wallet.balanceNGN += transaction.amount;
                } else {
                    wallet.balanceGHS += transaction.amount;
                }
                await wallet.save();
            }
        }

        // Log admin action
        await AdminLog.create({
            adminId,
            action: 'reject_transaction',
            target: 'transaction',
            targetId: transactionId,
            details: { transactionId, reason, previousStatus: 'pending', newStatus: 'failed' },
        });

        return {
            error: false,
            message: 'Transaction rejected successfully',
            data: {
                transactionId,
                status: 'failed',
                rejectedAt: new Date(),
                rejectedBy: adminId,
                reason,
            },
        };
    } catch (error) {
        console.error('Error in RejectTransactionService:', error);
        return {
            error: true,
            message: 'Failed to reject transaction',
        };
    }
}

async function GetAllUsersAdminService(query: any): Promise<any> {
    try {
        const page = parseInt(query.page) || 1;
        const limit = parseInt(query.limit) || 20;
        const skip = (page - 1) * limit;

        const filter: any = {};

        if (query.status === 'active') {
            filter.isActive = true;
        } else if (query.status === 'inactive') {
            filter.isActive = false;
        }

        if (query.blocked === 'true') {
            filter.isBlocked = true;
        } else if (query.blocked === 'false') {
            filter.isBlocked = false;
        }

        if (query.search) {
            const searchRegex = new RegExp(query.search, 'i');
            filter.$or = [
                { email: searchRegex },
                { firstName: searchRegex },
                { lastName: searchRegex },
                { username: searchRegex }
            ];
        }

        const users = await User.find(filter, '-password')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        // Get wallet details for each user
        const usersWithWallets = await Promise.all(
            users.map(async (user) => {
                const wallet = await Wallet.findOne({ userId: user.userId }).lean();
                const transactionCount = await Transaction.countDocuments({ userId: user.userId });
                return {
                    ...user,
                    wallet,
                    transactionCount,
                };
            })
        );

        const total = await User.countDocuments(filter);

        return {
            error: false,
            data: {
                users: usersWithWallets,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit),
                },
            },
        };
    } catch (error) {
        console.error('Error in GetAllUsersAdminService:', error);
        return {
            error: true,
            message: 'Failed to get users',
        };
    }
}

async function BlockUserService(userId: string, adminId: string, reason?: string): Promise<any> {
    try {
        const user = await User.findOne({ userId });

        if (!user) {
            return {
                error: true,
                message: 'User not found',
            };
        }

        if (user.isBlocked) {
            return {
                error: true,
                message: 'User is already blocked',
            };
        }

        // Block user
        user.isBlocked = true;
        user.isActive = false;
        await user.save();

        // Log admin action
        await AdminLog.create({
            adminId,
            action: 'block_user',
            target: 'user',
            targetId: userId,
            details: { userId, reason },
        });

        return {
            error: false,
            message: 'User blocked successfully',
            data: {
                userId,
                blocked: true,
                blockedAt: new Date(),
                blockedBy: adminId,
                reason,
            },
        };
    } catch (error) {
        console.error('Error in BlockUserService:', error);
        return {
            error: true,
            message: 'Failed to block user',
        };
    }
}

// Export all the required functions
export {
    AdminLoginService,
    GetAdminDashboardService,
    GetAllTransactionsAdminService,
    GetTransactionDetailsAdminService,
    ApproveTransactionService,
    RejectTransactionService,
    GetAllUsersAdminService,
    BlockUserService,
};
