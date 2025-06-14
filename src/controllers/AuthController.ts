import HttpStatusCodes from '@src/common/constants/HttpStatusCodes';
import { LoginService, SignupService } from '@src/services/AuthService';
import { sign } from 'crypto';
import { Request, Response } from 'express';

/**
 * @desc Get all users
 * @route GET /api/users
 * @access Public
 */

async function Signup(_req: Request, res: Response): Promise<any> {
    try {
        const signup = await SignupService(_req.body);
        if (signup.error) {
            return res.status(400).json(signup);
        }
        return res.status(HttpStatusCodes.OK).json(signup);
    } catch (error) {
        console.error('Error during signup:', error);
        return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
            error: true,
            message: 'An error occurred while processing your request.',
        });
    }
}

async function Login(_req: Request, res: Response): Promise<any> {
    try {

        const login = await LoginService(_req.body);

        if (login.error) {
            return res.status(HttpStatusCodes.BAD_REQUEST).json(login);
        }

        // Placeholder for login logic
        return res.status(HttpStatusCodes.OK).json(login);
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
            error: true,
            message: 'An error occurred while processing your request.',
        });
    }
}
export { Signup, Login };