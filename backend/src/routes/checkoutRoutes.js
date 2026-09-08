import { Router } from 'express';
import { createCheckout, paymentWebhook, quoteLocalShipping } from '../controllers/checkoutController.js';
import { publicSettings } from '../controllers/settingsController.js';
export const checkoutRouter = Router();
checkoutRouter.get('/settings', publicSettings);
checkoutRouter.post('/shipping/quote', quoteLocalShipping);
checkoutRouter.post('/checkout', createCheckout);
checkoutRouter.post('/payments/webhook', paymentWebhook);
