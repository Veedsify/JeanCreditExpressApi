import HttpStatusCodes from '@src/common/constants/HttpStatusCodes';
import { Request, Response } from 'express';
import { User } from '@src/database/schemas/UserSchema';
import { CompareHashedPassword, CreateHashedPassword } from '@src/libs/HashPassword';

/**
 * @desc Update user settings
 * @route PUT /api/settings/update
 * @access Private
 */
async function UpdateSettings(req: Request, res: Response): Promise<any> {
    try {
        const userId = (req as any).user?.userId;

        if (!userId) {
            return res.status(HttpStatusCodes.UNAUTHORIZED).json({
                error: true,
                message: 'User not authenticated',
            });
        }

        const { firstName, lastName, phoneNumber, email } = req.body;

        const user = await User.findOne({ userId });
        if (!user) {
            return res.status(HttpStatusCodes.NOT_FOUND).json({
                error: true,
                message: 'User not found',
            });
        }

        // Update user information
        if (firstName) user.firstName = firstName;
        if (lastName) user.lastName = lastName;
        if (phoneNumber) user.phoneNumber = phoneNumber;
        if (email && email !== user.email) {
            // Check if email already exists
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(HttpStatusCodes.BAD_REQUEST).json({
                    error: true,
                    message: 'Email already exists',
                });
            }
            user.email = email;
        }

        await user.save();

        return res.status(HttpStatusCodes.OK).json({
            error: false,
            message: 'Settings updated successfully',
            data: {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phoneNumber: user.phoneNumber,
            },
        });
    } catch (error) {
        console.error('Error updating settings:', error);
        return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
            error: true,
            message: 'An error occurred while processing your request.',
        });
    }
}

/**
 * @desc Change user password
 * @route PUT /api/settings/change-password
 * @access Private
 */
async function ChangePassword(req: Request, res: Response): Promise<any> {
    try {
        const userId = (req as any).user?.userId;

        if (!userId) {
            return res.status(HttpStatusCodes.UNAUTHORIZED).json({
                error: true,
                message: 'User not authenticated',
            });
        }

        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(HttpStatusCodes.BAD_REQUEST).json({
                error: true,
                message: 'Current password and new password are required',
            });
        }

        if (newPassword.length < 6) {
            return res.status(HttpStatusCodes.BAD_REQUEST).json({
                error: true,
                message: 'New password must be at least 6 characters long',
            });
        }

        const user = await User.findOne({ userId });
        if (!user) {
            return res.status(HttpStatusCodes.NOT_FOUND).json({
                error: true,
                message: 'User not found',
            });
        }

        // Verify current password
        const isCurrentPasswordValid = await CompareHashedPassword(currentPassword, user.password);
        if (!isCurrentPasswordValid) {
            return res.status(HttpStatusCodes.BAD_REQUEST).json({
                error: true,
                message: 'Current password is incorrect',
            });
        }

        // Hash new password
        const hashedNewPassword = await CreateHashedPassword(newPassword);
        user.password = hashedNewPassword;
        await user.save();

        return res.status(HttpStatusCodes.OK).json({
            error: false,
            message: 'Password changed successfully',
        });
    } catch (error) {
        console.error('Error changing password:', error);
        return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
            error: true,
            message: 'An error occurred while processing your request.',
        });
    }
}

/**
 * @desc Update user preferences
 * @route PUT /api/settings/preferences
 * @access Private
 */
async function UpdatePreferences(req: Request, res: Response): Promise<any> {
    try {
        const userId = (req as any).user?.userId;

        if (!userId) {
            return res.status(HttpStatusCodes.UNAUTHORIZED).json({
                error: true,
                message: 'User not authenticated',
            });
        }

        const { emailNotifications, smsNotifications, currency } = req.body;

        // Placeholder implementation - in a real app you'd have a preferences schema
        const preferences = {
            emailNotifications: emailNotifications !== undefined ? emailNotifications : true,
            smsNotifications: smsNotifications !== undefined ? smsNotifications : false,
            currency: currency || 'NGN',
        };

        return res.status(HttpStatusCodes.OK).json({
            error: false,
            message: 'Preferences updated successfully',
            data: preferences,
        });
    } catch (error) {
        console.error('Error updating preferences:', error);
        return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
            error: true,
            message: 'An error occurred while processing your request.',
        });
    }
}

export {
    UpdateSettings,
    ChangePassword,
    UpdatePreferences
};
