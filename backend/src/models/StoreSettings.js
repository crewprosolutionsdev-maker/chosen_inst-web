import mongoose from 'mongoose';

const storeSettingsSchema = new mongoose.Schema({
  key: { type: String, unique: true, default: 'checkout' },
  shipping: {
    flatRate: { type: Number, min: 0, default: 0 },
    freeThreshold: { type: Number, min: 0, default: 0 },
    pickupEnabled: { type: Boolean, default: true },
    pickupLabel: { type: String, default: 'Retiro a coordinar' },
  },
  transfer: {
    enabled: { type: Boolean, default: true },
    alias: { type: String, default: '' },
    cbu: { type: String, default: '' },
    holder: { type: String, default: '' },
  },
  mercadoPago: { enabled: { type: Boolean, default: true } },
}, { timestamps: true });

export const StoreSettings = mongoose.model('StoreSettings', storeSettingsSchema);
