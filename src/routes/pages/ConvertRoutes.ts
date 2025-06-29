import { Router } from 'express';
import Paths from '@src/common/constants/Paths';
import {
    ConvertCurrency,
    GetExchangeRates,
    CalculateConversion
} from '@src/controllers/ConvertController';
import { authenticateToken, optionalAuth } from '@src/middleware/auth';
import { validateFields, validateAmount, validateCurrency } from '@src/middleware/validation';

const convertRouter = Router();

// Convert routes
convertRouter.post(
    Paths.Convert.Exchange,
    authenticateToken,
    validateFields(['fromCurrency', 'toCurrency', 'amount']),
    validateAmount,
    validateCurrency,
    ConvertCurrency
);

// Public route for getting exchange rates
convertRouter.get(Paths.Convert.Rates, optionalAuth, GetExchangeRates);

// Public route for calculating conversions
convertRouter.post(
    Paths.Convert.Calculate,
    optionalAuth,
    validateFields(['fromCurrency', 'toCurrency', 'amount']),
    validateAmount,
    validateCurrency,
    CalculateConversion
);

export default convertRouter;
