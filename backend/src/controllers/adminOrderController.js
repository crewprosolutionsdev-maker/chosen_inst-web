import { Order } from '../models/Order.js';

export const serializeAdminOrder = order => {
  const id = String(order._id ?? order.id);
  return { id, code: id.slice(-6).toUpperCase(), customer: order.customer, items: order.items, subtotal: order.subtotal, shipping: order.shipping, total: order.total, paymentMethod: order.paymentMethod, paymentStatus: order.paymentStatus, createdAt: order.createdAt };
};

export async function listAdminOrders(_req, res, next) {
  try { res.json((await Order.find().sort({ createdAt: -1 }).lean()).map(serializeAdminOrder)); }
  catch (error) { next(error); }
}

export async function confirmAdminOrderPayment(req, res, next) {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Pedido no encontrado' });
    if (order.paymentMethod !== 'transfer') return res.status(400).json({ message: 'Solo se puede confirmar manualmente una transferencia' });
    order.paymentStatus = 'approved';
    await order.save();
    res.json(serializeAdminOrder(order.toObject()));
  } catch (error) { next(error); }
}
