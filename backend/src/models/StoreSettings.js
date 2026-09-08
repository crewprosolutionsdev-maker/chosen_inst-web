import mongoose from 'mongoose';

const storeSettingsSchema = new mongoose.Schema({
  key: { type: String, unique: true, default: 'checkout' },
  shipping: {
    flatRate: { type: Number, min: 0, default: 0 },
    freeThreshold: { type: Number, min: 0, default: 0 },
    pickupEnabled: { type: Boolean, default: true },
    pickupLabel: { type: String, default: 'Retiro a coordinar' },
    localDeliveryEnabled: { type: Boolean, default: true },
    originAddress: { type: String, default: 'Gabriel Miró 774, Bella Vista, Buenos Aires, Argentina' },
    fuelPrice: { type: Number, min: 0, default: 2169 },
    vehicleKmPerLiter: { type: Number, min: 1, default: 10 },
    operatingMultiplier: { type: Number, min: 1, default: 1.5 },
    baseDeliveryFee: { type: Number, min: 0, default: 2500 },
    minimumDeliveryFee: { type: Number, min: 0, default: 3500 },
    maximumLocalKm: { type: Number, min: 1, default: 15 },
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
