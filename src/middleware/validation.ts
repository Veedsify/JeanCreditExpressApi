import { Request, Response, NextFunction } from 'express';
import HttpStatusCodes from '@src/common/constants/HttpStatusCodes';

/**
 * Middleware to validate request body fields
 */
export function validateFields(requiredFields: string[]) {
    return (req: Request, res: Response, next: NextFunction): any => {
        const missingFields: string[] = [];

        for (const field of requiredFields) {
            if (!req.body[field]) {
                missingFields.push(field);
            }
        }

        if (missingFields.length > 0) {
            return res.status(HttpStatusCodes.BAD_REQUEST).json({
                error: true,
                message: `Missing required fields: ${missingFields.join(', ')}`,
                missingFields,
            });
        }

        next();
    };
}

/**
 * Middleware to validate email format
 */
export function validateEmail(req: Request, res: Response, next: NextFunction): any {
    const { email } = req.body;

    if (email && !isValidEmail(email)) {
        return res.status(HttpStatusCodes.BAD_REQUEST).json({
            error: true,
            message: 'Invalid email format',
        });
    }

    next();
}

/**
 * Middleware to validate password strength
 */
export function validatePassword(req: Request, res: Response, next: NextFunction): any {
    const { password } = req.body;

    if (password && password.length < 6) {
        return res.status(HttpStatusCodes.BAD_REQUEST).json({
            error: true,
            message: 'Password must be at least 6 characters long',
        });
    }

    next();
}

/**
 * Middleware to validate currency
 */
export function validateCurrency(req: Request, res: Response, next: NextFunction): any {
    const { currency, fromCurrency, toCurrency } = req.body;

    const validCurrencies = ['NGN', 'GHS'];

    if (currency && !validCurrencies.includes(currency)) {
        return res.status(HttpStatusCodes.BAD_REQUEST).json({
            error: true,
            message: `Invalid currency. Must be one of: ${validCurrencies.join(', ')}`,
        });
    }

    if (fromCurrency && !validCurrencies.includes(fromCurrency)) {
        return res.status(HttpStatusCodes.BAD_REQUEST).json({
            error: true,
            message: `Invalid fromCurrency. Must be one of: ${validCurrencies.join(', ')}`,
        });
    }

    if (toCurrency && !validCurrencies.includes(toCurrency)) {
        return res.status(HttpStatusCodes.BAD_REQUEST).json({
            error: true,
            message: `Invalid toCurrency. Must be one of: ${validCurrencies.join(', ')}`,
        });
    }

    if (fromCurrency && toCurrency && fromCurrency === toCurrency) {
        return res.status(HttpStatusCodes.BAD_REQUEST).json({
            error: true,
            message: 'Cannot convert to the same currency',
        });
    }

    next();
}

/**
 * Middleware to validate amount
 */
export function validateAmount(req: Request, res: Response, next: NextFunction): any {
    const { amount } = req.body;

    if (amount !== undefined) {
        const numAmount = parseFloat(amount);

        if (isNaN(numAmount) || numAmount <= 0) {
            return res.status(HttpStatusCodes.BAD_REQUEST).json({
                error: true,
                message: 'Amount must be a positive number',
            });
        }

        // Update the amount to be a number
        req.body.amount = numAmount;
    }

    next();
}

/**
 * Middleware to validate pagination parameters
 */
export function validatePagination(req: Request, res: Response, next: NextFunction): any {
    const { page, limit } = req.query;

    if (page) {
        const pageNum = parseInt(page as string);
        if (isNaN(pageNum) || pageNum < 1) {
            return res.status(HttpStatusCodes.BAD_REQUEST).json({
                error: true,
                message: 'Page must be a positive integer',
            });
        }
    }

    if (limit) {
        const limitNum = parseInt(limit as string);
        if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
            return res.status(HttpStatusCodes.BAD_REQUEST).json({
                error: true,
                message: 'Limit must be between 1 and 100',
            });
        }
    }

    next();
}

/**
 * Helper function to validate email format
 */
function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Middleware to validate transaction status
 */
export function validateTransactionStatus(req: Request, res: Response, next: NextFunction): any {
    const { status } = req.body;

    if (status) {
        const validStatuses = ['pending', 'completed', 'failed'];
        if (!validStatuses.includes(status)) {
            return res.status(HttpStatusCodes.BAD_REQUEST).json({
                error: true,
                message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
            });
        }
    }

    next();
}

/**
 * Middleware to validate transaction type
 */
export function validateTransactionType(req: Request, res: Response, next: NextFunction): any {
    const { type } = req.query;

    if (type) {
        const validTypes = ['deposit', 'withdrawal', 'conversion', 'transfer'];
        if (!validTypes.includes(type as string)) {
            return res.status(HttpStatusCodes.BAD_REQUEST).json({
                error: true,
                message: `Invalid type. Must be one of: ${validTypes.join(', ')}`,
            });
        }
    }

    next();
}
