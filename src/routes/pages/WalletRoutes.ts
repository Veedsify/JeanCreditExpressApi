import { Router } from 'express';
import Paths from '@src/common/constants/Paths';
import {
    GetWalletBalance,
    TopUpWallet,
    WithdrawFromWallet,
    GetWalletHistory
} from '@src/controllers/WalletController';
import { authenticateToken } from '@src/middleware/auth';
import { validateFields, validateAmount, validateCurrency, validatePagination } from '@src/middleware/validation';

const walletRouter = Router();

// Wallet routes - all require authentication
walletRouter.get(Paths.Wallet.Balance, authenticateToken, GetWalletBalance);

walletRouter.post(
    Paths.Wallet.TopUp,
    authenticateToken,
    validateFields(['amount', 'currency', 'paymentMethod']),
    validateAmount,
    validateCurrency,
    TopUpWallet
);

walletRouter.post(
    Paths.Wallet.Withdraw,
    authenticateToken,
    validateFields(['amount', 'currency', 'withdrawalMethod', 'accountDetails']),
    validateAmount,
    validateCurrency,
    WithdrawFromWallet
);

walletRouter.get(
    Paths.Wallet.History,
    authenticateToken,
    validatePagination,
    GetWalletHistory
);

export default walletRouter;
