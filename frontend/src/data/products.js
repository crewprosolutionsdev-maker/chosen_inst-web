export const products = [{
  id: 'abanico-fuego', slug: 'abanico-fuego', name: 'Abanico Fuego',
  price: 25000, compareAt: 30000, category: 'Abanicos', featured: true,
  image: '/assets/abanico-fuego.webp', stock: 8,
  description: 'Abanico de diseño vibrante, ideal para sumar color y personalidad a cualquier look.'
}];

export const money = value => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(value);
