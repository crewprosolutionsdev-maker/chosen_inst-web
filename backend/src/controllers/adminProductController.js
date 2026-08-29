import { Product } from '../models/Product.js';
import { deleteImage, uploadBuffer } from '../services/imageService.js';
import { slugify } from '../utils/slugify.js';

const serialize = product => ({ ...product, id: product._id.toString(), image: product.image?.url });
const values = body => ({
  name: body.name?.trim(), slug: slugify(body.name || ''), category: body.category?.trim(),
  description: body.description?.trim() || '', price: Number(body.price),
  compareAt: body.compareAt ? Number(body.compareAt) : null, stock: Number(body.stock || 0),
  featured: body.featured === 'true' || body.featured === true,
  active: body.active === 'true' || body.active === true,
});

export async function listAdminProducts(req, res, next) {
  try {
    const query = req.query.q ? { name: { $regex: req.query.q, $options: 'i' } } : {};
    res.json((await Product.find(query).sort({ createdAt: -1 }).lean()).map(serialize));
  } catch (error) { next(error); }
}
export async function getAdminProduct(req, res, next) {
  try { const product = await Product.findById(req.params.id).lean(); product ? res.json(serialize(product)) : res.status(404).json({ message: 'Producto no encontrado' }); } catch (error) { next(error); }
}
export async function createAdminProduct(req, res, next) {
  try {
    if (!req.file) return res.status(400).json({ message: 'La imagen es obligatoria' });
    const data = values(req.body); const upload = await uploadBuffer(req.file.buffer, { folder: 'chosen/products', publicId: data.slug });
    const product = await Product.create({ ...data, image: { url: upload.secure_url, publicId: upload.public_id, width: upload.width, height: upload.height } });
    res.status(201).json(serialize(product.toObject()));
  } catch (error) { next(error); }
}
export async function updateAdminProduct(req, res, next) {
  try {
    const current = await Product.findById(req.params.id); if (!current) return res.status(404).json({ message: 'Producto no encontrado' });
    const data = values(req.body);
    if (req.file) { const upload = await uploadBuffer(req.file.buffer, { folder: 'chosen/products', publicId: data.slug }); data.image = { url: upload.secure_url, publicId: upload.public_id, width: upload.width, height: upload.height }; if (current.image.publicId !== upload.public_id) await deleteImage(current.image.publicId); }
    const product = await Product.findByIdAndUpdate(req.params.id, data, { returnDocument: 'after', runValidators: true }).lean();
    res.json(serialize(product));
  } catch (error) { next(error); }
}
export async function deleteAdminProduct(req, res, next) {
  try { const product = await Product.findByIdAndDelete(req.params.id); if (!product) return res.status(404).json({ message: 'Producto no encontrado' }); await deleteImage(product.image?.publicId); res.json({ message: 'Producto eliminado' }); } catch (error) { next(error); }
}
