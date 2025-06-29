import HttpStatusCodes from '@src/common/constants/HttpStatusCodes';
import {
    AdminLoginService, GetAdminDashboardService,
    GetAllTransactionsAdminService,
    GetTransactionDetailsAdminService,
    ApproveTransactionService,
    RejectTransactionService,
    GetAllUsersAdminService,
    // GetUserDetailsAdminService,
    BlockUserService,
    // UnblockUserService,
    // DeleteUserService,
    // GetExchangeRatesAdminService,
    // UpdateExchangeRateService,
    // GetRateHistoryService,
    // GetAdminLogsService
} from '@src/services/AdminService';
import { Request, Response } from 'express';

/**
 * @desc Admin login
 * @route POST /api/admin/login
 * @access Public
 */
async function AdminLogin(req: Request, res: Response): Promise<any> {
    try {
        const login = await AdminLoginService(req.body);

        if (login.error) {
            return res.status(HttpStatusCodes.BAD_REQUEST).json(login);
        }

        return res.status(HttpStatusCodes.OK).json(login);
    } catch (error) {
        console.error('Error during admin login:', error);
        return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
            error: true,
            message: 'An error occurred while processing your request.',
        });
    }
}

/**
 * @desc Get admin dashboard overview
 * @route GET /api/admin/dashboard
 * @access Private - Admin
 */
async function GetAdminDashboard(req: Request, res: Response): Promise<any> {
    try {
        const dashboard = await GetAdminDashboardService();

        if (dashboard.error) {
            return res.status(HttpStatusCodes.BAD_REQUEST).json(dashboard);
        }

        return res.status(HttpStatusCodes.OK).json(dashboard);
    } catch (error) {
        console.error('Error getting admin dashboard:', error);
        return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
            error: true,
            message: 'An error occurred while processing your request.',
        });
    }
}

/**
 * @desc Get all transactions for admin
 * @route GET /api/admin/transactions/all
 * @access Private - Admin
 */
async function GetAllTransactionsAdmin(req: Request, res: Response): Promise<any> {
    try {
        const transactions = await GetAllTransactionsAdminService(req.query);

        if (transactions.error) {
            return res.status(HttpStatusCodes.BAD_REQUEST).json(transactions);
        }

        return res.status(HttpStatusCodes.OK).json(transactions);
    } catch (error) {
        console.error('Error getting admin transactions:', error);
        return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
            error: true,
            message: 'An error occurred while processing your request.',
        });
    }
}

/**
 * @desc Get transaction details for admin
 * @route GET /api/admin/transactions/details/:id
 * @access Private - Admin
 */
async function GetTransactionDetailsAdmin(req: Request, res: Response): Promise<any> {
    try {
        const { id } = req.params;
        const details = await GetTransactionDetailsAdminService(id);

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
 * @desc Approve transaction
 * @route POST /api/admin/transactions/approve/:id
 * @access Private - Admin
 */
async function ApproveTransaction(req: Request, res: Response): Promise<any> {
    try {
        const { id } = req.params;
        const adminId = (req as any).user?.userId;

        const approval = await ApproveTransactionService(id, adminId);

        if (approval.error) {
            return res.status(HttpStatusCodes.BAD_REQUEST).json(approval);
        }

        return res.status(HttpStatusCodes.OK).json(approval);
    } catch (error) {
        console.error('Error approving transaction:', error);
        return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
            error: true,
            message: 'An error occurred while processing your request.',
        });
    }
}

/**
 * @desc Reject transaction
 * @route POST /api/admin/transactions/reject/:id
 * @access Private - Admin
 */
async function RejectTransaction(req: Request, res: Response): Promise<any> {
    try {
        const { id } = req.params;
        const adminId = (req as any).user?.userId;

        const rejection = await RejectTransactionService(id, adminId, req.body.reason);

        if (rejection.error) {
            return res.status(HttpStatusCodes.BAD_REQUEST).json(rejection);
        }

        return res.status(HttpStatusCodes.OK).json(rejection);
    } catch (error) {
        console.error('Error rejecting transaction:', error);
        return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
            error: true,
            message: 'An error occurred while processing your request.',
        });
    }
}

/**
 * @desc Get all users for admin
 * @route GET /api/admin/users/all
 * @access Private - Admin
 */
async function GetAllUsersAdmin(req: Request, res: Response): Promise<any> {
    try {
        const users = await GetAllUsersAdminService(req.query);

        if (users.error) {
            return res.status(HttpStatusCodes.BAD_REQUEST).json(users);
        }

        return res.status(HttpStatusCodes.OK).json(users);
    } catch (error) {
        console.error('Error getting admin users:', error);
        return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
            error: true,
            message: 'An error occurred while processing your request.',
        });
    }
}

/**
 * @desc Block user
 * @route POST /api/admin/users/block/:id
 * @access Private - Admin
 */
async function BlockUser(req: Request, res: Response): Promise<any> {
    try {
        const { id } = req.params;
        const adminId = (req as any).user?.userId;

        const block = await BlockUserService(id, adminId, req.body.reason);

        if (block.error) {
            return res.status(HttpStatusCodes.BAD_REQUEST).json(block);
        }

        return res.status(HttpStatusCodes.OK).json(block);
    } catch (error) {
        console.error('Error blocking user:', error);
        return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
            error: true,
            message: 'An error occurred while processing your request.',
        });
    }
}

export {
    AdminLogin,
    GetAdminDashboard,
    GetAllTransactionsAdmin,
    GetTransactionDetailsAdmin,
    ApproveTransaction,
    RejectTransaction,
    GetAllUsersAdmin,
    BlockUser
};
