import { Wallet } from '@src/database/schemas/WalletSchema';
import { Transaction } from '@src/database/schemas/TransactionSchema';
import { Conversion } from '@src/database/schemas/ConversionSchema';
import { ExchangeRate } from '@src/database/schemas/AdminSchema';
import { GenerateUniqueId } from '@src/libs/GenerateRandomUuid';

interface ConversionData {
    fromCurrency: 'NGN' | 'GHS';
    toCurrency: 'NGN' | 'GHS';
    amount: number;
}

interface CalculationData {
    fromCurrency: 'NGN' | 'GHS';
    toCurrency: 'NGN' | 'GHS';
    amount: number;
}

async function ConvertCurrencyService(userId: string, conversionData: ConversionData): Promise<any> {
    try {
        const { fromCurrency, toCurrency, amount } = conversionData;

        if (!amount || amount <= 0) {
            return {
                error: true,
                message: 'Invalid amount',
            };
        }

        if (fromCurrency === toCurrency) {
            return {
                error: true,
                message: 'Cannot convert to the same currency',
            };
        }

        // Check wallet balance
        const wallet = await Wallet.findOne({ userId });
        if (!wallet) {
            return {
                error: true,
                message: 'Wallet not found',
            };
        }

        const currentBalance = fromCurrency === 'NGN' ? wallet.balanceNGN : wallet.balanceGHS;
        if (currentBalance < amount) {
            return {
                error: true,
                message: 'Insufficient balance',
            };
        }

        // Get current exchange rate
        const rate = await getCurrentExchangeRate(fromCurrency, toCurrency);
        if (!rate) {
            return {
                error: true,
                message: 'Exchange rate not available',
            };
        }

        // Calculate conversion
        const fee = amount * 0.02; // 2% fee
        const amountAfterFee = amount - fee;
        const convertedAmount = amountAfterFee * rate;

        // Create conversion record
        const conversion = new Conversion({
            userId,
            conversionId: GenerateUniqueId(),
            transactionId: GenerateUniqueId(),
            from_currency: fromCurrency,
            to_currency: toCurrency,
            amount,
            converted_amount: convertedAmount,
            fee,
            rate,
            source: 'user_request',
            status: 'pending',
            estimatedArrival: 'Instant',
        });

        await conversion.save();

        // Create transaction record
        const transaction = new Transaction({
            userId,
            transactionId: conversion.transactionId,
            amount,
            currency: fromCurrency,
            status: 'pending',
            transaction_type: 'conversion',
            refernce: conversion.conversionId,
            direction: `${fromCurrency}_${toCurrency}` as any,
            description: `Convert ${fromCurrency} ${amount} to ${toCurrency}`,
        });

        await transaction.save();

        // Update wallet balances
        if (fromCurrency === 'NGN') {
            wallet.balanceNGN -= amount;
            wallet.balanceGHS += convertedAmount;
        } else {
            wallet.balanceGHS -= amount;
            wallet.balanceNGN += convertedAmount;
        }
        wallet.totalConversions += amount;
        await wallet.save();

        // Update conversion and transaction status to completed
        conversion.status = 'completed';
        transaction.status = 'completed';
        await conversion.save();
        await transaction.save();

        return {
            error: false,
            message: 'Currency conversion completed successfully',
            data: {
                conversionId: conversion.conversionId,
                fromCurrency,
                toCurrency,
                originalAmount: amount,
                fee,
                convertedAmount,
                rate,
                status: 'completed',
            },
        };
    } catch (error) {
        console.error('Error in ConvertCurrencyService:', error);
        return {
            error: true,
            message: 'Failed to convert currency',
        };
    }
}

async function GetExchangeRatesService(): Promise<any> {
    try {
        // Try to get rates from database first
        const rates = await ExchangeRate.find({ isActive: true })
            .sort({ createdAt: -1 })
            .limit(2)
            .lean();

        let ngnToGhs = 0.0053;
        let ghsToNgn = 188.68;

        if (rates.length > 0) {
            const ngnRate = rates.find(r => r.fromCurrency === 'NGN' && r.toCurrency === 'GHS');
            const ghsRate = rates.find(r => r.fromCurrency === 'GHS' && r.toCurrency === 'NGN');

            if (ngnRate) ngnToGhs = ngnRate.rate;
            if (ghsRate) ghsToNgn = ghsRate.rate;
        }

        return {
            error: false,
            data: {
                rates: {
                    NGN_GHS: ngnToGhs,
                    GHS_NGN: ghsToNgn,
                },
                lastUpdated: new Date(),
                source: rates.length > 0 ? 'database' : 'default',
            },
        };
    } catch (error) {
        console.error('Error in GetExchangeRatesService:', error);
        return {
            error: true,
            message: 'Failed to get exchange rates',
        };
    }
}

async function CalculateConversionService(calculationData: CalculationData): Promise<any> {
    try {
        const { fromCurrency, toCurrency, amount } = calculationData;

        if (!amount || amount <= 0) {
            return {
                error: true,
                message: 'Invalid amount',
            };
        }

        if (fromCurrency === toCurrency) {
            return {
                error: true,
                message: 'Cannot convert to the same currency',
            };
        }

        // Get current exchange rate
        const rate = await getCurrentExchangeRate(fromCurrency, toCurrency);
        if (!rate) {
            return {
                error: true,
                message: 'Exchange rate not available',
            };
        }

        // Calculate conversion
        const fee = amount * 0.02; // 2% fee
        const amountAfterFee = amount - fee;
        const convertedAmount = amountAfterFee * rate;

        return {
            error: false,
            data: {
                fromCurrency,
                toCurrency,
                originalAmount: amount,
                fee,
                amountAfterFee,
                convertedAmount,
                rate,
                estimatedArrival: 'Instant',
            },
        };
    } catch (error) {
        console.error('Error in CalculateConversionService:', error);
        return {
            error: true,
            message: 'Failed to calculate conversion',
        };
    }
}

async function getCurrentExchangeRate(fromCurrency: string, toCurrency: string): Promise<number | null> {
    try {
        // Try to get from database first
        const rate = await ExchangeRate.findOne({
            fromCurrency,
            toCurrency,
            isActive: true,
        }).sort({ createdAt: -1 });

        if (rate) {
            return rate.rate;
        }

        // Default rates if not in database
        if (fromCurrency === 'NGN' && toCurrency === 'GHS') {
            return 0.0053;
        } else if (fromCurrency === 'GHS' && toCurrency === 'NGN') {
            return 188.68;
        }

        return null;
    } catch (error) {
        console.error('Error getting exchange rate:', error);
        return null;
    }
}

export {
    ConvertCurrencyService,
    GetExchangeRatesService,
    CalculateConversionService,
};
