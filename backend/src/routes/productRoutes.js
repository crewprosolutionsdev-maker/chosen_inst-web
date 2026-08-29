import { Router } from 'express';
import { getProduct, getProducts } from '../controllers/productController.js';

export const productRouter = Router();
productRouter.get('/', getProducts);
productRouter.get('/:slug', getProduct);
