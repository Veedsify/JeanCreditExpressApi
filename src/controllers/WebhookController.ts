import HttpStatusCodes from '@src/common/constants/HttpStatusCodes';
import { Request, Response } from 'express';
import { Transaction } from '@src/database/schemas/TransactionSchema';
import { Wallet } from '@src/database/schemas/WalletSchema';

/**
 * @desc Handle Paystack webhook
 * @route POST /api/webhooks/paystack
 * @access Public (webhook)
 */
async function HandlePaystackWebhook(req: Request, res: Response): Promise<any> {
    try {
        const { event, data } = req.body;

        console.log('Paystack webhook received:', { event, data });

        if (event === 'charge.success') {
            const { reference, amount, currency, customer } = data;

            // Find the transaction by reference
            const transaction = await Transaction.findOne({ refernce: reference });

            if (!transaction) {
                console.log('Transaction not found for reference:', reference);
                return res.status(HttpStatusCodes.OK).json({ status: 'ignored' });
            }

            if (transaction.status === 'completed') {
                console.log('Transaction already completed:', reference);
                return res.status(HttpStatusCodes.OK).json({ status: 'already_processed' });
            }

            // Update transaction status
            transaction.status = 'completed';
            await transaction.save();

            // Update wallet balance
            const wallet = await Wallet.findOne({ userId: transaction.userId });
            if (wallet) {
                if (transaction.currency === 'NGN') {
                    wallet.balanceNGN += transaction.amount;
                } else {
                    wallet.balanceGHS += transaction.amount;
                }
                wallet.totalDeposits += transaction.amount;
                wallet.lastTransactionAt = new Date();
                await wallet.save();
            }

            console.log('Payment processed successfully:', reference);
        }

        return res.status(HttpStatusCodes.OK).json({ status: 'success' });
    } catch (error) {
        console.error('Error handling Paystack webhook:', error);
        return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
            error: true,
            message: 'Webhook processing failed',
        });
    }
}

/**
 * @desc Handle Momo webhook
 * @route POST /api/webhooks/momo
 * @access Public (webhook)
 */
async function HandleMomoWebhook(req: Request, res: Response): Promise<any> {
    try {
        const { event, data } = req.body;

        console.log('Momo webhook received:', { event, data });

        if (event === 'payment.success') {
            const { reference, amount, currency } = data;

            // Find the transaction by reference
            const transaction = await Transaction.findOne({ refernce: reference });

            if (!transaction) {
                console.log('Transaction not found for reference:', reference);
                return res.status(HttpStatusCodes.OK).json({ status: 'ignored' });
            }

            if (transaction.status === 'completed') {
                console.log('Transaction already completed:', reference);
                return res.status(HttpStatusCodes.OK).json({ status: 'already_processed' });
            }

            // Update transaction status
            transaction.status = 'completed';
            await transaction.save();

            // For withdrawal, this would trigger the actual payout
            if (transaction.transaction_type === 'withdrawal') {
                console.log('Withdrawal confirmed via Momo:', reference);
            }

            // For deposit, update wallet balance
            if (transaction.transaction_type === 'deposit') {
                const wallet = await Wallet.findOne({ userId: transaction.userId });
                if (wallet) {
                    if (transaction.currency === 'GHS') {
                        wallet.balanceGHS += transaction.amount;
                    }
                    wallet.totalDeposits += transaction.amount;
                    wallet.lastTransactionAt = new Date();
                    await wallet.save();
                }
            }

            console.log('Momo payment processed successfully:', reference);
        }

        return res.status(HttpStatusCodes.OK).json({ status: 'success' });
    } catch (error) {
        console.error('Error handling Momo webhook:', error);
        return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
            error: true,
            message: 'Webhook processing failed',
        });
    }
}

export {
    HandlePaystackWebhook,
    HandleMomoWebhook
};
