import { Router } from 'express';
import Paths from '@src/common/constants/Paths';
import {
    HandlePaystackWebhook,
    HandleMomoWebhook
} from '@src/controllers/WebhookController';

const webhookRouter = Router();

// Webhook routes - these are public endpoints for payment providers
webhookRouter.post(Paths.Webhooks.Paystack, HandlePaystackWebhook);
webhookRouter.post(Paths.Webhooks.Momo, HandleMomoWebhook);

export default webhookRouter;
