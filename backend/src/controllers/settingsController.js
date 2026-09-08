import { StoreSettings } from '../models/StoreSettings.js';

const defaults = { key: 'checkout', shipping: { flatRate: 0, freeThreshold: 0, pickupEnabled: true, pickupLabel: 'Retiro a coordinar' }, transfer: { enabled: true, alias: '', cbu: '', holder: '' }, mercadoPago: { enabled: true } };
const getSettings = () => StoreSettings.findOneAndUpdate({ key: 'checkout' }, { $setOnInsert: defaults }, { returnDocument: 'after', upsert: true }).lean();

export async function publicSettings(_req, res, next) { try { const settings = await getSettings(); settings.mercadoPago.enabled = settings.mercadoPago.enabled && Boolean(process.env.MERCADO_PAGO_ACCESS_TOKEN); res.json(settings); } catch (error) { next(error); } }
export async function adminSettings(_req, res, next) { try { res.json(await getSettings()); } catch (error) { next(error); } }
export async function updateSettings(req, res, next) {
  try {
    const data = {
      shipping: { flatRate: Number(req.body.shipping?.flatRate || 0), freeThreshold: Number(req.body.shipping?.freeThreshold || 0), pickupEnabled: Boolean(req.body.shipping?.pickupEnabled), pickupLabel: req.body.shipping?.pickupLabel?.trim() || 'Retiro a coordinar' },
      transfer: { enabled: Boolean(req.body.transfer?.enabled), alias: req.body.transfer?.alias?.trim() || '', cbu: req.body.transfer?.cbu?.trim() || '', holder: req.body.transfer?.holder?.trim() || '' },
      mercadoPago: { enabled: Boolean(req.body.mercadoPago?.enabled) },
    };
    res.json(await StoreSettings.findOneAndUpdate({ key: 'checkout' }, data, { returnDocument: 'after', upsert: true, runValidators: true }).lean());
  } catch (error) { next(error); }
}
