import { Wallet } from '@src/database/schemas/WalletSchema';
import { Transaction } from '@src/database/schemas/TransactionSchema';
import { GenerateUniqueId } from '@src/libs/GenerateRandomUuid';

interface WalletBalanceResponse {
    error: boolean;
    message?: string;
    data?: {
        balanceNGN: number;
        balanceGHS: number;
        totalDeposits: number;
        totalWithdrawals: number;
        isActive: boolean;
    };
}

interface TopUpData {
    amount: number;
    currency: 'NGN' | 'GHS';
    paymentMethod: 'paystack' | 'momo';
    paymentReference?: string;
}

interface WithdrawData {
    amount: number;
    currency: 'NGN' | 'GHS';
    withdrawalMethod: 'bank' | 'momo';
    accountDetails: any;
}

async function GetWalletBalanceService(userId: string): Promise<WalletBalanceResponse> {
    try {
        let wallet = await Wallet.findOne({ userId });

        // Create wallet if it doesn't exist
        if (!wallet) {
            wallet = new Wallet({
                userId,
                balanceNGN: 0,
                balanceGHS: 0,
                totalDeposits: 0,
                totalWithdrawals: 0,
                totalConversions: 0,
                isActive: true,
            });
            await wallet.save();
        }

        return {
            error: false,
            data: {
                balanceNGN: wallet.balanceNGN,
                balanceGHS: wallet.balanceGHS,
                totalDeposits: wallet.totalDeposits,
                totalWithdrawals: wallet.totalWithdrawals,
                isActive: wallet.isActive,
            },
        };
    } catch (error) {
        console.error('Error in GetWalletBalanceService:', error);
        return {
            error: true,
            message: 'Failed to get wallet balance',
        };
    }
}

async function TopUpWalletService(userId: string, topUpData: TopUpData): Promise<any> {
    try {
        const { amount, currency, paymentMethod, paymentReference } = topUpData;

        if (!amount || amount <= 0) {
            return {
                error: true,
                message: 'Invalid amount',
            };
        }

        if (!['NGN', 'GHS'].includes(currency)) {
            return {
                error: true,
                message: 'Invalid currency',
            };
        }

        // Create transaction record
        const transaction = new Transaction({
            userId,
            transactionId: GenerateUniqueId(),
            amount,
            currency,
            status: 'pending',
            transaction_type: 'deposit',
            refernce: paymentReference || GenerateUniqueId(),
            direction: currency === 'NGN' ? 'DEPOSIT_NGN' : 'DEPOSIT_GHS',
            description: `Top up ${currency} ${amount} via ${paymentMethod}`,
        });

        await transaction.save();

        // Here you would integrate with Paystack or Momo payment gateway
        // For now, we'll return the transaction details for payment processing

        return {
            error: false,
            message: 'Top up initiated successfully',
            data: {
                transactionId: transaction.transactionId,
                amount,
                currency,
                paymentMethod,
                status: 'pending',
                // Add payment gateway URL or details here
            },
        };
    } catch (error) {
        console.error('Error in TopUpWalletService:', error);
        return {
            error: true,
            message: 'Failed to initiate top up',
        };
    }
}

async function WithdrawFromWalletService(userId: string, withdrawData: WithdrawData): Promise<any> {
    try {
        const { amount, currency, withdrawalMethod, accountDetails } = withdrawData;

        if (!amount || amount <= 0) {
            return {
                error: true,
                message: 'Invalid amount',
            };
        }

        // Check wallet balance
        const wallet = await Wallet.findOne({ userId });
        if (!wallet) {
            return {
                error: true,
                message: 'Wallet not found',
            };
        }

        const currentBalance = currency === 'NGN' ? wallet.balanceNGN : wallet.balanceGHS;
        if (currentBalance < amount) {
            return {
                error: true,
                message: 'Insufficient balance',
            };
        }

        // Create transaction record
        const transaction = new Transaction({
            userId,
            transactionId: GenerateUniqueId(),
            amount,
            currency,
            status: 'pending',
            transaction_type: 'withdrawal',
            refernce: GenerateUniqueId(),
            direction: currency === 'NGN' ? 'WITHDRAWAL_NGN' : 'WITHDRAWAL_GHS',
            description: `Withdraw ${currency} ${amount} via ${withdrawalMethod}`,
        });

        await transaction.save();

        // Update wallet balance (deduct amount temporarily)
        if (currency === 'NGN') {
            wallet.balanceNGN -= amount;
        } else {
            wallet.balanceGHS -= amount;
        }
        wallet.totalWithdrawals += amount;
        await wallet.save();

        return {
            error: false,
            message: 'Withdrawal initiated successfully',
            data: {
                transactionId: transaction.transactionId,
                amount,
                currency,
                withdrawalMethod,
                status: 'pending',
                accountDetails,
            },
        };
    } catch (error) {
        console.error('Error in WithdrawFromWalletService:', error);
        return {
            error: true,
            message: 'Failed to initiate withdrawal',
        };
    }
}

async function GetWalletHistoryService(userId: string, query: any): Promise<any> {
    try {
        const page = parseInt(query.page) || 1;
        const limit = parseInt(query.limit) || 10;
        const skip = (page - 1) * limit;

        const filter: any = { userId };

        if (query.type && ['deposit', 'withdrawal'].includes(query.type)) {
            filter.transaction_type = query.type;
        }

        if (query.status && ['pending', 'completed', 'failed'].includes(query.status)) {
            filter.status = query.status;
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
        console.error('Error in GetWalletHistoryService:', error);
        return {
            error: true,
            message: 'Failed to get wallet history',
        };
    }
}

export {
    GetWalletBalanceService,
    TopUpWalletService,
    WithdrawFromWalletService,
    GetWalletHistoryService,
};
