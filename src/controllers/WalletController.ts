import HttpStatusCodes from '@src/common/constants/HttpStatusCodes';
import {
    GetWalletBalanceService,
    TopUpWalletService,
    WithdrawFromWalletService,
    GetWalletHistoryService
} from '@src/services/WalletService';
import { Request, Response } from 'express';

/**
 * @desc Get wallet balance
 * @route GET /api/wallet/balance
 * @access Private
 */
async function GetWalletBalance(req: Request, res: Response): Promise<any> {
    try {
        const userId = (req as any).user?.userId;

        if (!userId) {
            return res.status(HttpStatusCodes.UNAUTHORIZED).json({
                error: true,
                message: 'User not authenticated',
            });
        }

        const balance = await GetWalletBalanceService(userId);

        if (balance.error) {
            return res.status(HttpStatusCodes.BAD_REQUEST).json(balance);
        }

        return res.status(HttpStatusCodes.OK).json(balance);
    } catch (error) {
        console.error('Error getting wallet balance:', error);
        return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
            error: true,
            message: 'An error occurred while processing your request.',
        });
    }
}

/**
 * @desc Top up wallet
 * @route POST /api/wallet/topup
 * @access Private
 */
async function TopUpWallet(req: Request, res: Response): Promise<any> {
    try {
        const userId = (req as any).user?.userId;

        if (!userId) {
            return res.status(HttpStatusCodes.UNAUTHORIZED).json({
                error: true,
                message: 'User not authenticated',
            });
        }

        const topUp = await TopUpWalletService(userId, req.body);

        if (topUp.error) {
            return res.status(HttpStatusCodes.BAD_REQUEST).json(topUp);
        }

        return res.status(HttpStatusCodes.OK).json(topUp);
    } catch (error) {
        console.error('Error topping up wallet:', error);
        return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
            error: true,
            message: 'An error occurred while processing your request.',
        });
    }
}

/**
 * @desc Withdraw from wallet
 * @route POST /api/wallet/withdraw
 * @access Private
 */
async function WithdrawFromWallet(req: Request, res: Response): Promise<any> {
    try {
        const userId = (req as any).user?.userId;

        if (!userId) {
            return res.status(HttpStatusCodes.UNAUTHORIZED).json({
                error: true,
                message: 'User not authenticated',
            });
        }

        const withdrawal = await WithdrawFromWalletService(userId, req.body);

        if (withdrawal.error) {
            return res.status(HttpStatusCodes.BAD_REQUEST).json(withdrawal);
        }

        return res.status(HttpStatusCodes.OK).json(withdrawal);
    } catch (error) {
        console.error('Error withdrawing from wallet:', error);
        return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
            error: true,
            message: 'An error occurred while processing your request.',
        });
    }
}

/**
 * @desc Get wallet history
 * @route GET /api/wallet/history
 * @access Private
 */
async function GetWalletHistory(req: Request, res: Response): Promise<any> {
    try {
        const userId = (req as any).user?.userId;

        if (!userId) {
            return res.status(HttpStatusCodes.UNAUTHORIZED).json({
                error: true,
                message: 'User not authenticated',
            });
        }

        const history = await GetWalletHistoryService(userId, req.query);

        if (history.error) {
            return res.status(HttpStatusCodes.BAD_REQUEST).json(history);
        }

        return res.status(HttpStatusCodes.OK).json(history);
    } catch (error) {
        console.error('Error getting wallet history:', error);
        return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
            error: true,
            message: 'An error occurred while processing your request.',
        });
    }
}

export {
    GetWalletBalance,
    TopUpWallet,
    WithdrawFromWallet,
    GetWalletHistory
};
