import { Router } from 'express';
import { createAdminProduct, deleteAdminProduct, getAdminProduct, listAdminProducts, updateAdminProduct } from '../controllers/adminProductController.js';
import { createCategory, deleteCategory, listAdminCategories, updateCategory } from '../controllers/categoryController.js';
import { requireAdmin } from '../middleware/auth.js';
import { uploadImage } from '../middleware/upload.js';

export const adminRouter = Router();
adminRouter.use(requireAdmin);
adminRouter.get('/products', listAdminProducts);
adminRouter.get('/products/:id', getAdminProduct);
adminRouter.post('/products', uploadImage.single('image'), createAdminProduct);
adminRouter.put('/products/:id', uploadImage.single('image'), updateAdminProduct);
adminRouter.delete('/products/:id', deleteAdminProduct);
adminRouter.get('/categories', listAdminCategories);
adminRouter.post('/categories', uploadImage.single('image'), createCategory);
adminRouter.put('/categories/:id', uploadImage.single('image'), updateCategory);
adminRouter.delete('/categories/:id', deleteCategory);
