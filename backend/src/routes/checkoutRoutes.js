import { Router } from 'express';
import { createCheckout, paymentWebhook } from '../controllers/checkoutController.js';
import { publicSettings } from '../controllers/settingsController.js';
export const checkoutRouter = Router();
checkoutRouter.get('/settings', publicSettings);
checkoutRouter.post('/checkout', createCheckout);
checkoutRouter.post('/payments/webhook', paymentWebhook);
