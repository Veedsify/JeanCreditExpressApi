import HttpStatusCodes from '@src/common/constants/HttpStatusCodes';
import {
    GetDashboardOverviewService,
    GetDashboardStatsService
} from '@src/services/DashboardService';
import { Request, Response } from 'express';

/**
 * @desc Get dashboard overview for user
 * @route GET /api/dashboard/overview
 * @access Private
 */
async function GetDashboardOverview(req: Request, res: Response): Promise<any> {
    try {
        const userId = (req as any).user?.userId; // Assuming user is attached via middleware

        if (!userId) {
            return res.status(HttpStatusCodes.UNAUTHORIZED).json({
                error: true,
                message: 'User not authenticated',
            });
        }

        const overview = await GetDashboardOverviewService(userId);

        if (overview.error) {
            return res.status(HttpStatusCodes.BAD_REQUEST).json(overview);
        }

        return res.status(HttpStatusCodes.OK).json(overview);
    } catch (error) {
        console.error('Error getting dashboard overview:', error);
        return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
            error: true,
            message: 'An error occurred while processing your request.',
        });
    }
}

/**
 * @desc Get dashboard stats for user
 * @route GET /api/dashboard/stats
 * @access Private
 */
async function GetDashboardStats(req: Request, res: Response): Promise<any> {
    try {
        const userId = (req as any).user?.userId;

        if (!userId) {
            return res.status(HttpStatusCodes.UNAUTHORIZED).json({
                error: true,
                message: 'User not authenticated',
            });
        }

        const stats = await GetDashboardStatsService(userId);

        if (stats.error) {
            return res.status(HttpStatusCodes.BAD_REQUEST).json(stats);
        }

        return res.status(HttpStatusCodes.OK).json(stats);
    } catch (error) {
        console.error('Error getting dashboard stats:', error);
        return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
            error: true,
            message: 'An error occurred while processing your request.',
        });
    }
}

export {
    GetDashboardOverview,
    GetDashboardStats
};
