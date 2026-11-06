const defaultLocalShipping = { originAddress: 'Gabriel Miró 774, Bella Vista, Buenos Aires, Argentina', fuelPrice: 2169, vehicleKmPerLiter: 10, operatingMultiplier: 1.5, baseDeliveryFee: 2500, minimumDeliveryFee: 3500, maximumLocalKm: 15 };
const numericFields = { fuelPrice: 2169, vehicleKmPerLiter: 10, operatingMultiplier: 1.5, baseDeliveryFee: 2500, minimumDeliveryFee: 3500, maximumLocalKm: 15, flatRate: 0, freeThreshold: 0 };

const finiteSetting = (value, fallback, minimum = 0) => {
  if (value == null || (typeof value === 'string' && !value.trim())) return fallback;
  const parsed = Number(typeof value === 'string' ? value.trim().replace(',', '.') : value);
  return Number.isFinite(parsed) && parsed >= minimum ? parsed : fallback;
};

export const normalizeShippingSettings = (settings = {}) => {
  const normalized = { ...defaultLocalShipping, pickupEnabled: true, pickupLabel: 'Retiro a coordinar', localDeliveryEnabled: true, ...settings };
  for (const [key, fallback] of Object.entries(numericFields)) {
    const minimum = key === 'vehicleKmPerLiter' || key === 'maximumLocalKm' ? Number.EPSILON : key === 'operatingMultiplier' ? 1 : 0;
    normalized[key] = finiteSetting(normalized[key], fallback, minimum);
  }
  return normalized;
};

const geocode = async (address, apiKey) => {
  const url = new URL('https://maps.googleapis.com/maps/api/geocode/json');
  url.searchParams.set('address', address);
  url.searchParams.set('region', 'ar');
  url.searchParams.set('key', apiKey);
  const response = await fetch(url);
  const data = await response.json();
  if (!response.ok || data.status !== 'OK' || !data.results?.[0]) {
    const detail = data.error_message || data.status || 'sin resultados';
    throw Object.assign(new Error(`No pudimos ubicar esa dirección: ${detail}`), { status: 502 });
  }
  return data.results[0].geometry.location;
};

export const calculateLocalDelivery = async (settings, customer) => {
  const shipping = normalizeShippingSettings(settings);
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) throw Object.assign(new Error('El cálculo de entrega local todavía no está configurado'), { status: 503 });
  const destinationAddress = [customer.address, customer.city, customer.province, customer.postalCode, 'Argentina'].filter(Boolean).join(', ');
  const [origin, destination] = await Promise.all([geocode(shipping.originAddress, apiKey), geocode(destinationAddress, apiKey)]);
  const response = await fetch('https://routes.googleapis.com/directions/v2:computeRoutes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Goog-Api-Key': apiKey, 'X-Goog-FieldMask': 'routes.distanceMeters,routes.duration' },
    body: JSON.stringify({ origin: { location: { latLng: { latitude: origin.lat, longitude: origin.lng } } }, destination: { location: { latLng: { latitude: destination.lat, longitude: destination.lng } } }, travelMode: 'DRIVE', routingPreference: 'TRAFFIC_AWARE' }),
  });
  const data = await response.json();
  if (!response.ok || !data.routes?.[0]) {
    console.error('Google Routes:', data.error?.message || data);
    throw new Error('No pudimos calcular la ruta de entrega');
  }
  const distanceMeters = Number(data.routes[0].distanceMeters);
  if (!Number.isFinite(distanceMeters) || distanceMeters < 0) throw Object.assign(new Error('No pudimos calcular la distancia de entrega'), { status: 502 });
  const distanceKm = distanceMeters / 1000;
  if (distanceKm > shipping.maximumLocalKm) return { available: false, distanceKm: Math.round(distanceKm * 10) / 10, maximumLocalKm: shipping.maximumLocalKm };
  const fuelRoundTripPerKm = (2 * shipping.fuelPrice) / shipping.vehicleKmPerLiter;
  const variableFee = distanceKm * fuelRoundTripPerKm * shipping.operatingMultiplier;
  const rawFee = Math.max(shipping.minimumDeliveryFee, shipping.baseDeliveryFee + variableFee);
  const cost = Math.ceil(rawFee / 100) * 100;
  if (!Number.isFinite(cost)) throw Object.assign(new Error('No pudimos calcular el costo de entrega'), { status: 503 });
  return { available: true, distanceKm: Math.round(distanceKm * 10) / 10, cost };
};
