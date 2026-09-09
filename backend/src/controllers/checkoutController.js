import { Order } from '../models/Order.js';
import { Product } from '../models/Product.js';
import { StoreSettings } from '../models/StoreSettings.js';
import { calculateLocalDelivery } from '../services/shippingService.js';
import { notifyNewOrderSafely } from '../services/whatsappService.js';

const requiredCustomerFields = ['name', 'email', 'phone', 'address', 'city', 'province', 'postalCode'];

export async function createCheckout(req, res, next) {
  try {
    const { customer = {}, items = [], shippingMethod, paymentMethod } = req.body;
    if (!items.length || requiredCustomerFields.some(field => !customer[field]?.trim())) return res.status(400).json({ message: 'Completá todos los datos del checkout' });
    const quantities = new Map(items.map(item => [String(item.id), Math.max(1, Number(item.quantity || 1))]));
    const products = await Product.find({ _id: { $in: [...quantities.keys()] }, active: true }).lean();
    if (products.length !== quantities.size) return res.status(400).json({ message: 'Uno de los productos ya no está disponible' });
    const orderItems = products.map(product => ({ product: product._id, name: product.name, quantity: quantities.get(String(product._id)), unitPrice: product.price }));
    const subtotal = orderItems.reduce((total, item) => total + item.unitPrice * item.quantity, 0);
    const settings = await StoreSettings.findOne({ key: 'checkout' }).lean() || { shipping: {}, transfer: { enabled: true }, mercadoPago: { enabled: true } };
    settings.shipping = { flatRate: 0, freeThreshold: 0, pickupEnabled: true, pickupLabel: 'Retiro a coordinar', localDeliveryEnabled: true, maximumLocalKm: 15, ...settings.shipping };
    const pickup = shippingMethod === 'pickup';
    if (pickup && !settings.shipping.pickupEnabled) return res.status(400).json({ message: 'El retiro no está disponible' });
    let localQuote;
    if (shippingMethod === 'local') {
      if (!settings.shipping.localDeliveryEnabled) return res.status(400).json({ message: 'La entrega local no está disponible' });
      localQuote = await calculateLocalDelivery(settings.shipping, customer);
      if (!localQuote.available) return res.status(400).json({ message: `La dirección supera el radio de ${settings.shipping.maximumLocalKm} km. Elegí envío por correo.` });
    }
    const free = settings.shipping.freeThreshold > 0 && subtotal >= settings.shipping.freeThreshold;
    const shippingCost = pickup || free ? 0 : shippingMethod === 'local' ? localQuote.cost : settings.shipping.flatRate;
    if (paymentMethod === 'transfer' && !settings.transfer.enabled) return res.status(400).json({ message: 'La transferencia no está disponible' });
    if (paymentMethod === 'mercadopago' && (!settings.mercadoPago.enabled || !process.env.MERCADO_PAGO_ACCESS_TOKEN)) return res.status(503).json({ message: 'Mercado Pago todavía no está configurado' });
    if (!['transfer', 'mercadopago'].includes(paymentMethod)) return res.status(400).json({ message: 'Elegí un método de pago disponible' });
    const order = await Order.create({ customer, items: orderItems, subtotal, shipping: { method: pickup ? 'pickup' : shippingMethod === 'local' ? 'local' : 'delivery', label: pickup ? settings.shipping.pickupLabel : shippingMethod === 'local' ? `Entrega local (${localQuote.distanceKm} km)` : 'Envío por correo', cost: shippingCost }, total: subtotal + shippingCost, paymentMethod });
    void notifyNewOrderSafely(order);
    if (paymentMethod === 'transfer') {
      return res.status(201).json({ orderId: order.id, paymentMethod, total: order.total, transfer: settings.transfer });
    }
    const baseUrl = process.env.APP_URL || `${req.protocol}://${req.get('host')}`;
    const response = await fetch('https://api.mercadopago.com/checkout/preferences', { method: 'POST', headers: { Authorization: `Bearer ${process.env.MERCADO_PAGO_ACCESS_TOKEN}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ items: [...orderItems.map(item => ({ id: String(item.product), title: item.name, quantity: item.quantity, unit_price: item.unitPrice, currency_id: 'ARS' })), ...(shippingCost ? [{ id: 'shipping', title: 'Envío', quantity: 1, unit_price: shippingCost, currency_id: 'ARS' }] : [])], payer: { name: customer.name, email: customer.email, phone: { number: customer.phone }, address: { street_name: customer.address, zip_code: customer.postalCode } }, external_reference: order.id, back_urls: { success: `${baseUrl}/checkout/resultado?status=success`, pending: `${baseUrl}/checkout/resultado?status=pending`, failure: `${baseUrl}/checkout/resultado?status=failure` }, auto_return: 'approved', notification_url: `${baseUrl}/api/payments/webhook` }) });
    const preference = await response.json();
    if (!response.ok) throw new Error(preference.message || 'No se pudo iniciar Mercado Pago');
    order.mercadoPagoPreferenceId = preference.id; await order.save();
    res.status(201).json({ orderId: order.id, paymentMethod, checkoutUrl: preference.init_point });
  } catch (error) { next(error); }
}

export async function quoteLocalShipping(req, res, next) {
  try {
    const customer = req.body || {};
    if (!customer.address?.trim() || !customer.city?.trim() || !customer.province?.trim()) return res.status(400).json({ message: 'Completá dirección, localidad y provincia' });
    const settings = await StoreSettings.findOne({ key: 'checkout' }).lean();
    const shipping = { localDeliveryEnabled: true, ...settings?.shipping };
    if (!shipping.localDeliveryEnabled) return res.status(400).json({ message: 'La entrega local no está disponible' });
    res.json(await calculateLocalDelivery(shipping, customer));
  } catch (error) { next(error); }
}

export async function paymentWebhook(req, res, next) {
  try {
    const paymentId = req.query['data.id'] || req.body?.data?.id;
    if (!paymentId || !process.env.MERCADO_PAGO_ACCESS_TOKEN) return res.sendStatus(200);
    const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, { headers: { Authorization: `Bearer ${process.env.MERCADO_PAGO_ACCESS_TOKEN}` } });
    const payment = await response.json();
    if (response.ok && payment.external_reference) await Order.findByIdAndUpdate(payment.external_reference, { paymentStatus: payment.status, mercadoPagoPaymentId: String(payment.id) });
    res.sendStatus(200);
  } catch (error) { next(error); }
}
