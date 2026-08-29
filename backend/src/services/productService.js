import mongoose from 'mongoose';
import { Product } from '../models/Product.js';
import fallbackProducts from '../data/products.json' with { type: 'json' };

const normalizeProduct = product => ({
  ...product,
  id: product._id?.toString?.() || product.id,
  image: typeof product.image === 'string' ? product.image : product.image?.url,
});

export async function listProducts({ query = '', featured } = {}) {
  if (mongoose.connection.readyState !== 1) {
    return fallbackProducts.filter(product =>
      (!query || product.name.toLowerCase().includes(query.toLowerCase())) &&
      (featured === undefined || product.featured === featured)
    );
  }

  const filter = { active: true };
  if (query) filter.name = { $regex: query, $options: 'i' };
  if (featured !== undefined) filter.featured = featured;
  return (await Product.find(filter).sort({ featured: -1, createdAt: -1 }).lean()).map(normalizeProduct);
}

export async function findProductBySlug(slug) {
  if (mongoose.connection.readyState !== 1) return fallbackProducts.find(product => product.slug === slug) || null;
  const product = await Product.findOne({ slug, active: true }).lean();
  return product ? normalizeProduct(product) : null;
}
