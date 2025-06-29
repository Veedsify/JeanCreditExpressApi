import HttpStatusCodes from '@src/common/constants/HttpStatusCodes';
import {
    GetAllTransactionsService,
    GetUserTransactionHistoryService,
    GetTransactionDetailsService,
    UpdateTransactionStatusService
} from '@src/services/TransactionService';
import { Request, Response } from 'express';

/**
 * @desc Get all transactions (Admin only)
 * @route GET /api/transactions/all
 * @access Private - Admin
 */
async function GetAllTransactions(req: Request, res: Response): Promise<any> {
    try {
        const transactions = await GetAllTransactionsService(req.query);

        if (transactions.error) {
            return res.status(HttpStatusCodes.BAD_REQUEST).json(transactions);
        }

        return res.status(HttpStatusCodes.OK).json(transactions);
    } catch (error) {
        console.error('Error getting all transactions:', error);
        return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
            error: true,
            message: 'An error occurred while processing your request.',
        });
    }
}

/**
 * @desc Get user transaction history
 * @route GET /api/transactions/history
 * @access Private
 */
async function GetUserTransactionHistory(req: Request, res: Response): Promise<any> {
    try {
        const userId = (req as any).user?.userId;

        if (!userId) {
            return res.status(HttpStatusCodes.UNAUTHORIZED).json({
                error: true,
                message: 'User not authenticated',
            });
        }

        const history = await GetUserTransactionHistoryService(userId, req.query);

        if (history.error) {
            return res.status(HttpStatusCodes.BAD_REQUEST).json(history);
        }

        return res.status(HttpStatusCodes.OK).json(history);
    } catch (error) {
        console.error('Error getting user transaction history:', error);
        return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
            error: true,
            message: 'An error occurred while processing your request.',
        });
    }
}

/**
 * @desc Get transaction details
 * @route GET /api/transactions/details/:id
 * @access Private
 */
async function GetTransactionDetails(req: Request, res: Response): Promise<any> {
    try {
        const { id } = req.params;
        const userId = (req as any).user?.userId;

        if (!userId) {
            return res.status(HttpStatusCodes.UNAUTHORIZED).json({
                error: true,
                message: 'User not authenticated',
            });
        }

        const details = await GetTransactionDetailsService(id, userId);

        if (details.error) {
            return res.status(HttpStatusCodes.BAD_REQUEST).json(details);
        }

        return res.status(HttpStatusCodes.OK).json(details);
    } catch (error) {
        console.error('Error getting transaction details:', error);
        return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
            error: true,
            message: 'An error occurred while processing your request.',
        });
    }
}

/**
 * @desc Update transaction status
 * @route PUT /api/transactions/status/:id
 * @access Private - Admin
 */
async function UpdateTransactionStatus(req: Request, res: Response): Promise<any> {
    try {
        const { id } = req.params;
        const adminId = (req as any).user?.userId;

        if (!adminId) {
            return res.status(HttpStatusCodes.UNAUTHORIZED).json({
                error: true,
                message: 'Admin not authenticated',
            });
        }

        const update = await UpdateTransactionStatusService(id, req.body, adminId);

        if (update.error) {
            return res.status(HttpStatusCodes.BAD_REQUEST).json(update);
        }

        return res.status(HttpStatusCodes.OK).json(update);
    } catch (error) {
        console.error('Error updating transaction status:', error);
        return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
            error: true,
            message: 'An error occurred while processing your request.',
        });
    }
}

export {
    GetAllTransactions,
    GetUserTransactionHistory,
    GetTransactionDetails,
    UpdateTransactionStatus
};
