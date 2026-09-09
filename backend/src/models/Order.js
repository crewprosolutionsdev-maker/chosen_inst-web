import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  customer: { name: String, email: String, phone: String, address: String, city: String, province: String, postalCode: String },
  items: [{ product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, name: String, quantity: Number, unitPrice: Number }],
  subtotal: Number,
  shipping: { method: String, label: String, cost: Number },
  total: Number,
  paymentMethod: { type: String, enum: ['mercadopago', 'transfer'] },
  paymentStatus: { type: String, default: 'pending' },
  mercadoPagoPreferenceId: String,
  mercadoPagoPaymentId: String,
  whatsappNotification: {
    status: { type: String, enum: ['pending', 'sent', 'failed'], default: 'pending' },
    messageId: String,
    sentAt: Date,
  },
}, { timestamps: true });

export const Order = mongoose.model('Order', orderSchema);
