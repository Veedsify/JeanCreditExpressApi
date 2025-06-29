import { Router } from 'express';
import Paths from '@src/common/constants/Paths';
import {
    GetAllTransactions,
    GetUserTransactionHistory,
    GetTransactionDetails,
    UpdateTransactionStatus
} from '@src/controllers/TransactionController';
import { authenticateToken, requireAdmin } from '@src/middleware/auth';
import { validatePagination, validateTransactionType, validateTransactionStatus } from '@src/middleware/validation';

const transactionRouter = Router();

// Transaction routes
transactionRouter.get(
    Paths.Transactions.All,
    authenticateToken,
    requireAdmin,
    validatePagination,
    validateTransactionType,
    GetAllTransactions
); // Admin only

transactionRouter.get(
    Paths.Transactions.UserHistory,
    authenticateToken,
    validatePagination,
    validateTransactionType,
    GetUserTransactionHistory
);

transactionRouter.get(
    Paths.Transactions.Details,
    authenticateToken,
    GetTransactionDetails
);

transactionRouter.put(
    Paths.Transactions.UpdateStatus,
    authenticateToken,
    requireAdmin,
    validateTransactionStatus,
    UpdateTransactionStatus
); // Admin only

export default transactionRouter;
