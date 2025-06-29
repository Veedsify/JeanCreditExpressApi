import { Wallet } from '@src/database/schemas/WalletSchema';
import { Transaction } from '@src/database/schemas/TransactionSchema';
import { Conversion } from '@src/database/schemas/ConversionSchema';

interface DashboardOverviewResponse {
    error: boolean;
    message?: string;
    data?: {
        wallet: {
            balanceNGN: number;
            balanceGHS: number;
            totalBalance: number;
        };
        recentTransactions: any[];
        exchangeRates: {
            ngnToGhs: number;
            ghsToNgn: number;
        };
        quickStats: {
            totalTransactions: number;
            pendingTransactions: number;
            completedTransactions: number;
        };
    };
}

interface DashboardStatsResponse {
    error: boolean;
    message?: string;
    data?: {
        monthlyStats: {
            deposits: number;
            withdrawals: number;
            conversions: number;
        };
        transactionVolume: {
            thisMonth: number;
            lastMonth: number;
            percentageChange: number;
        };
        conversionStats: {
            ngnToGhs: number;
            ghsToNgn: number;
        };
    };
}

async function GetDashboardOverviewService(userId: string): Promise<DashboardOverviewResponse> {
    try {
        // Get user wallet
        const wallet = await Wallet.findOne({ userId });
        if (!wallet) {
            return {
                error: true,
                message: 'Wallet not found',
            };
        }

        // Get recent transactions (last 5)
        const recentTransactions = await Transaction.find({ userId })
            .sort({ createdAt: -1 })
            .limit(5)
            .lean();

        // Get transaction counts
        const totalTransactions = await Transaction.countDocuments({ userId });
        const pendingTransactions = await Transaction.countDocuments({
            userId,
            status: 'pending'
        });
        const completedTransactions = await Transaction.countDocuments({
            userId,
            status: 'completed'
        });

        // Mock exchange rates (replace with actual API call)
        const exchangeRates = {
            ngnToGhs: 0.0053,
            ghsToNgn: 188.68,
        };

        return {
            error: false,
            data: {
                wallet: {
                    balanceNGN: wallet.balanceNGN,
                    balanceGHS: wallet.balanceGHS,
                    totalBalance: wallet.balanceNGN + (wallet.balanceGHS * exchangeRates.ghsToNgn),
                },
                recentTransactions,
                exchangeRates,
                quickStats: {
                    totalTransactions,
                    pendingTransactions,
                    completedTransactions,
                },
            },
        };
    } catch (error) {
        console.error('Error in GetDashboardOverviewService:', error);
        return {
            error: true,
            message: 'Failed to get dashboard overview',
        };
    }
}

async function GetDashboardStatsService(userId: string): Promise<DashboardStatsResponse> {
    try {
        const currentDate = new Date();
        const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const startOfLastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
        const endOfLastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);

        // Get monthly stats
        const monthlyDeposits = await Transaction.countDocuments({
            userId,
            transaction_type: 'deposit',
            createdAt: { $gte: startOfMonth },
        });

        const monthlyWithdrawals = await Transaction.countDocuments({
            userId,
            transaction_type: 'withdrawal',
            createdAt: { $gte: startOfMonth },
        });

        const monthlyConversions = await Transaction.countDocuments({
            userId,
            transaction_type: 'conversion',
            createdAt: { $gte: startOfMonth },
        });

        // Get transaction volume
        const thisMonthVolume = await Transaction.aggregate([
            {
                $match: {
                    userId,
                    createdAt: { $gte: startOfMonth },
                    status: 'completed',
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$amount' }
                }
            }
        ]);

        const lastMonthVolume = await Transaction.aggregate([
            {
                $match: {
                    userId,
                    createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth },
                    status: 'completed',
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$amount' }
                }
            }
        ]);

        const thisMonth = thisMonthVolume[0]?.total || 0;
        const lastMonth = lastMonthVolume[0]?.total || 0;
        const percentageChange = lastMonth > 0 ? ((thisMonth - lastMonth) / lastMonth) * 100 : 0;

        // Get conversion stats
        const ngnToGhsConversions = await Conversion.countDocuments({
            userId,
            from_currency: 'NGN',
            to_currency: 'GHS',
            createdAt: { $gte: startOfMonth },
        });

        const ghsToNgnConversions = await Conversion.countDocuments({
            userId,
            from_currency: 'GHS',
            to_currency: 'NGN',
            createdAt: { $gte: startOfMonth },
        });

        return {
            error: false,
            data: {
                monthlyStats: {
                    deposits: monthlyDeposits,
                    withdrawals: monthlyWithdrawals,
                    conversions: monthlyConversions,
                },
                transactionVolume: {
                    thisMonth,
                    lastMonth,
                    percentageChange,
                },
                conversionStats: {
                    ngnToGhs: ngnToGhsConversions,
                    ghsToNgn: ghsToNgnConversions,
                },
            },
        };
    } catch (error) {
        console.error('Error in GetDashboardStatsService:', error);
        return {
            error: true,
            message: 'Failed to get dashboard stats',
        };
    }
}

export {
    GetDashboardOverviewService,
    GetDashboardStatsService,
};
