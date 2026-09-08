import { StoreSettings } from '../models/StoreSettings.js';

const defaultShipping = { flatRate: 0, freeThreshold: 0, pickupEnabled: true, pickupLabel: 'Retiro a coordinar', localDeliveryEnabled: true, originAddress: 'Gabriel Miró 774, Bella Vista, Buenos Aires, Argentina', fuelPrice: 2169, vehicleKmPerLiter: 10, operatingMultiplier: 1.5, baseDeliveryFee: 2500, minimumDeliveryFee: 3500, maximumLocalKm: 15 };
const defaults = { key: 'checkout', shipping: defaultShipping, transfer: { enabled: true, alias: '', cbu: '', holder: '' }, mercadoPago: { enabled: true } };
const getSettings = () => StoreSettings.findOneAndUpdate({ key: 'checkout' }, { $setOnInsert: defaults }, { returnDocument: 'after', upsert: true }).lean();

export async function publicSettings(_req, res, next) { try { const settings = await getSettings(); settings.shipping = { ...defaultShipping, ...settings.shipping }; settings.shipping.localDeliveryEnabled = settings.shipping.localDeliveryEnabled && Boolean(process.env.GOOGLE_MAPS_API_KEY); delete settings.shipping.originAddress; settings.mercadoPago.enabled = settings.mercadoPago.enabled && Boolean(process.env.MERCADO_PAGO_ACCESS_TOKEN); res.json(settings); } catch (error) { next(error); } }
export async function adminSettings(_req, res, next) { try { res.json(await getSettings()); } catch (error) { next(error); } }
export async function updateSettings(req, res, next) {
  try {
    const data = {
      shipping: { ...defaultShipping, flatRate: Number(req.body.shipping?.flatRate || 0), freeThreshold: Number(req.body.shipping?.freeThreshold || 0), pickupEnabled: Boolean(req.body.shipping?.pickupEnabled), pickupLabel: req.body.shipping?.pickupLabel?.trim() || 'Retiro a coordinar', localDeliveryEnabled: Boolean(req.body.shipping?.localDeliveryEnabled), originAddress: req.body.shipping?.originAddress?.trim() || defaultShipping.originAddress, fuelPrice: Number(req.body.shipping?.fuelPrice || defaultShipping.fuelPrice), vehicleKmPerLiter: Number(req.body.shipping?.vehicleKmPerLiter || defaultShipping.vehicleKmPerLiter), operatingMultiplier: Number(req.body.shipping?.operatingMultiplier || defaultShipping.operatingMultiplier), baseDeliveryFee: Number(req.body.shipping?.baseDeliveryFee || 0), minimumDeliveryFee: Number(req.body.shipping?.minimumDeliveryFee || 0), maximumLocalKm: Number(req.body.shipping?.maximumLocalKm || defaultShipping.maximumLocalKm) },
      transfer: { enabled: Boolean(req.body.transfer?.enabled), alias: req.body.transfer?.alias?.trim() || '', cbu: req.body.transfer?.cbu?.trim() || '', holder: req.body.transfer?.holder?.trim() || '' },
      mercadoPago: { enabled: Boolean(req.body.mercadoPago?.enabled) },
    };
    res.json(await StoreSettings.findOneAndUpdate({ key: 'checkout' }, data, { returnDocument: 'after', upsert: true, runValidators: true }).lean());
  } catch (error) { next(error); }
}
