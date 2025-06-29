import { Router } from 'express';
import Paths from '@src/common/constants/Paths';
import userRouter from './pages/UserRoutes';
import authRouter from './pages/AuthRoutes';
import dashboardRouter from './pages/DashboardRoutes';
import walletRouter from './pages/WalletRoutes';
import convertRouter from './pages/ConvertRoutes';
import transactionRouter from './pages/TransactionRoutes';
import notificationRouter from './pages/NotificationRoutes';
import settingsRouter from './pages/SettingsRoutes';
import adminRouter from './pages/AdminRoutes';
import webhookRouter from './pages/WebhookRoutes';

/******************************************************************************
                                Setup
******************************************************************************/

const apiRouter = Router();

// Public routes
apiRouter.use(Paths.Auth.Base, authRouter);
apiRouter.use(Paths.Webhooks.Base, webhookRouter);

// User routes (require authentication middleware)
apiRouter.use(Paths.Users.Base, userRouter);
apiRouter.use(Paths.Dashboard.Base, dashboardRouter);
apiRouter.use(Paths.Wallet.Base, walletRouter);
apiRouter.use(Paths.Convert.Base, convertRouter);
apiRouter.use(Paths.Transactions.Base, transactionRouter);
apiRouter.use(Paths.Notifications.Base, notificationRouter);
apiRouter.use(Paths.Settings.Base, settingsRouter);

// Admin routes (require admin authentication middleware)
apiRouter.use(Paths.Admin.Base, adminRouter);

/******************************************************************************
                                Export default
******************************************************************************/

export default apiRouter;
