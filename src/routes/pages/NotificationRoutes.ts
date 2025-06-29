import { Router } from 'express';
import Paths from '@src/common/constants/Paths';
import {
    GetAllNotifications,
    MarkNotificationRead,
    MarkAllNotificationsRead
} from '@src/controllers/NotificationController';
import { authenticateToken } from '@src/middleware/auth';

const notificationRouter = Router();

// Notification routes - all require authentication
notificationRouter.get(Paths.Notifications.All, authenticateToken, GetAllNotifications);
notificationRouter.put(Paths.Notifications.MarkRead, authenticateToken, MarkNotificationRead);
notificationRouter.put(Paths.Notifications.MarkAllRead, authenticateToken, MarkAllNotificationsRead);

export default notificationRouter;
