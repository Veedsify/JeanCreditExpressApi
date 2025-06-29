import { Router } from 'express';
import Paths from '@src/common/constants/Paths';
import {
    GetDashboardOverview,
    GetDashboardStats
} from '@src/controllers/DashboardController';
import { authenticateToken } from '@src/middleware/auth';

const dashboardRouter = Router();

// Dashboard routes - all require authentication
dashboardRouter.get(Paths.Dashboard.Overview, authenticateToken, GetDashboardOverview);
dashboardRouter.get(Paths.Dashboard.Stats, authenticateToken, GetDashboardStats);

export default dashboardRouter;
