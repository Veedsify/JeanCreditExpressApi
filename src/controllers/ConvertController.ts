import HttpStatusCodes from '@src/common/constants/HttpStatusCodes';
import {
    ConvertCurrencyService,
    GetExchangeRatesService,
    CalculateConversionService
} from '@src/services/ConvertService';
import { Request, Response } from 'express';

/**
 * @desc Convert currency
 * @route POST /api/convert/exchange
 * @access Private
 */
async function ConvertCurrency(req: Request, res: Response): Promise<any> {
    try {
        const userId = (req as any).user?.userId;

        if (!userId) {
            return res.status(HttpStatusCodes.UNAUTHORIZED).json({
                error: true,
                message: 'User not authenticated',
            });
        }

        const conversion = await ConvertCurrencyService(userId, req.body);

        if (conversion.error) {
            return res.status(HttpStatusCodes.BAD_REQUEST).json(conversion);
        }

        return res.status(HttpStatusCodes.OK).json(conversion);
    } catch (error) {
        console.error('Error converting currency:', error);
        return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
            error: true,
            message: 'An error occurred while processing your request.',
        });
    }
}

/**
 * @desc Get exchange rates
 * @route GET /api/convert/rates
 * @access Public
 */
async function GetExchangeRates(req: Request, res: Response): Promise<any> {
    try {
        const rates = await GetExchangeRatesService();

        if (rates.error) {
            return res.status(HttpStatusCodes.BAD_REQUEST).json(rates);
        }

        return res.status(HttpStatusCodes.OK).json(rates);
    } catch (error) {
        console.error('Error getting exchange rates:', error);
        return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
            error: true,
            message: 'An error occurred while processing your request.',
        });
    }
}

/**
 * @desc Calculate conversion amount
 * @route POST /api/convert/calculate
 * @access Public
 */
async function CalculateConversion(req: Request, res: Response): Promise<any> {
    try {
        const calculation = await CalculateConversionService(req.body);

        if (calculation.error) {
            return res.status(HttpStatusCodes.BAD_REQUEST).json(calculation);
        }

        return res.status(HttpStatusCodes.OK).json(calculation);
    } catch (error) {
        console.error('Error calculating conversion:', error);
        return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
            error: true,
            message: 'An error occurred while processing your request.',
        });
    }
}

export {
    ConvertCurrency,
    GetExchangeRates,
    CalculateConversion
};
