import * as productService from '../services/productService.js';

export async function getProducts(req, res, next) {
  try {
    const featured = req.query.featured === undefined ? undefined : req.query.featured === 'true';
    res.json(await productService.listProducts({ query: req.query.q, featured, category: req.query.category }));
  } catch (error) { next(error); }
}

export async function getProduct(req, res, next) {
  try {
    const product = await productService.findProductBySlug(req.params.slug);
    if (!product) return res.status(404).json({ message: 'Producto no encontrado' });
    res.json(product);
  } catch (error) { next(error); }
}
