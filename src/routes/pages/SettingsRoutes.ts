import { Router } from 'express';
import Paths from '@src/common/constants/Paths';
import {
    UpdateSettings,
    ChangePassword,
    UpdatePreferences
} from '@src/controllers/SettingsController';
import { authenticateToken } from '@src/middleware/auth';
import { validateFields, validateEmail, validatePassword } from '@src/middleware/validation';

const settingsRouter = Router();

// Settings routes - all require authentication
settingsRouter.put(
    Paths.Settings.Update,
    authenticateToken,
    validateEmail,
    UpdateSettings
);

settingsRouter.put(
    Paths.Settings.ChangePassword,
    authenticateToken,
    validateFields(['currentPassword', 'newPassword']),
    validatePassword,
    ChangePassword
);

settingsRouter.put(
    Paths.Settings.Preferences,
    authenticateToken,
    UpdatePreferences
);

export default settingsRouter;
