import { Request, Response, NextFunction } from 'express';
import HttpStatusCodes from '@src/common/constants/HttpStatusCodes';
import jwt from 'jsonwebtoken';
import { User } from '@src/database/schemas/UserSchema';

// Extend Request type to include user
declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: string;
                email: string;
                isAdmin?: boolean;
                [key: string]: any;
            };
        }
    }
}

/**
 * Middleware to authenticate JWT tokens
 */
export async function authenticateToken(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

        if (!token) {
            return res.status(HttpStatusCodes.UNAUTHORIZED).json({
                error: true,
                message: 'Access token required',
            });
        }

        const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';

        try {
            const decoded = jwt.verify(token, jwtSecret) as any;

            // Check if user still exists and is active
            const user = await User.findOne({
                userId: decoded.userId,
                isActive: true
            }).lean();

            if (!user) {
                return res.status(HttpStatusCodes.UNAUTHORIZED).json({
                    error: true,
                    message: 'User not found or inactive',
                });
            }

            if (user.isBlocked) {
                return res.status(HttpStatusCodes.UNAUTHORIZED).json({
                    error: true,
                    message: 'User account is blocked',
                });
            }

            // Attach user to request
            req.user = {
                userId: user.userId,
                email: user.email,
                isAdmin: user.isAdmin,
                firstName: user.firstName,
                lastName: user.lastName,
            };

            next();
        } catch (jwtError) {
            return res.status(HttpStatusCodes.UNAUTHORIZED).json({
                error: true,
                message: 'Invalid or expired token',
            });
        }
    } catch (error) {
        console.error('Error in authenticateToken middleware:', error);
        return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
            error: true,
            message: 'Authentication error',
        });
    }
}

/**
 * Middleware to check if user is admin
 */
export function requireAdmin(req: Request, res: Response, next: NextFunction): any {
    if (!req.user) {
        return res.status(HttpStatusCodes.UNAUTHORIZED).json({
            error: true,
            message: 'Authentication required',
        });
    }

    if (!req.user.isAdmin) {
        return res.status(HttpStatusCodes.FORBIDDEN).json({
            error: true,
            message: 'Admin access required',
        });
    }

    next();
}

/**
 * Optional authentication - doesn't fail if no token is provided
 */
export async function optionalAuth(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return next(); // Continue without user
        }

        const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';

        try {
            const decoded = jwt.verify(token, jwtSecret) as any;

            const user = await User.findOne({
                userId: decoded.userId,
                isActive: true
            }).lean();

            if (user && !user.isBlocked) {
                req.user = {
                    userId: user.userId,
                    email: user.email,
                    isAdmin: user.isAdmin,
                    firstName: user.firstName,
                    lastName: user.lastName,
                };
            }
        } catch (jwtError) {
            // Invalid token, but continue without user
        }

        next();
    } catch (error) {
        console.error('Error in optionalAuth middleware:', error);
        next(); // Continue even if there's an error
    }
}
