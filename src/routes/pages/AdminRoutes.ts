import { Router } from 'express';
import Paths from '@src/common/constants/Paths';
import {
    AdminLogin,
    GetAdminDashboard,
    GetAllTransactionsAdmin,
    GetTransactionDetailsAdmin,
    ApproveTransaction,
    RejectTransaction,
    GetAllUsersAdmin,
    BlockUser
} from '@src/controllers/AdminController';
import { UpdateTransactionStatus } from '@src/controllers/TransactionController';
import { authenticateToken, requireAdmin } from '@src/middleware/auth';
import { validateFields, validateEmail, validatePassword, validatePagination, validateTransactionStatus } from '@src/middleware/validation';

const adminRouter = Router();

// Admin authentication - public route
adminRouter.post(
    Paths.Admin.Login,
    validateFields(['email', 'password']),
    validateEmail,
    AdminLogin
);

// Admin dashboard - requires admin auth
adminRouter.get(Paths.Admin.Dashboard, authenticateToken, requireAdmin, GetAdminDashboard);

// Admin transaction management - requires admin auth
adminRouter.get(
    Paths.Admin.Transactions.All,
    authenticateToken,
    requireAdmin,
    validatePagination,
    GetAllTransactionsAdmin
);

adminRouter.get(
    Paths.Admin.Transactions.Details,
    authenticateToken,
    requireAdmin,
    GetTransactionDetailsAdmin
);

adminRouter.post(
    Paths.Admin.Transactions.Approve,
    authenticateToken,
    requireAdmin,
    ApproveTransaction
);

adminRouter.post(
    Paths.Admin.Transactions.Reject,
    authenticateToken,
    requireAdmin,
    RejectTransaction
);

adminRouter.put(
    Paths.Admin.Transactions.UpdateStatus,
    authenticateToken,
    requireAdmin,
    validateFields(['status']),
    validateTransactionStatus,
    UpdateTransactionStatus
);

// Admin user management - requires admin auth
adminRouter.get(
    Paths.Admin.Users.All,
    authenticateToken,
    requireAdmin,
    validatePagination,
    GetAllUsersAdmin
);

adminRouter.get(
    Paths.Admin.Users.Details,
    authenticateToken,
    requireAdmin,
    GetTransactionDetailsAdmin
); // Placeholder

adminRouter.post(
    Paths.Admin.Users.Block,
    authenticateToken,
    requireAdmin,
    BlockUser
);

adminRouter.post(
    Paths.Admin.Users.Unblock,
    authenticateToken,
    requireAdmin,
    BlockUser
); // Placeholder

adminRouter.delete(
    Paths.Admin.Users.Delete,
    authenticateToken,
    requireAdmin,
    BlockUser
); // Placeholder

// Admin rate management - requires admin auth (placeholders)
adminRouter.get(Paths.Admin.Rates.Get, authenticateToken, requireAdmin, GetAdminDashboard);
adminRouter.put(Paths.Admin.Rates.Update, authenticateToken, requireAdmin, GetAdminDashboard);
adminRouter.get(Paths.Admin.Rates.History, authenticateToken, requireAdmin, GetAdminDashboard);

// Admin logs - requires admin auth (placeholders)
adminRouter.get(Paths.Admin.Logs.All, authenticateToken, requireAdmin, GetAdminDashboard);
adminRouter.get(Paths.Admin.Logs.Notifications, authenticateToken, requireAdmin, GetAdminDashboard);
adminRouter.get(Paths.Admin.Logs.Audit, authenticateToken, requireAdmin, GetAdminDashboard);

export default adminRouter;
