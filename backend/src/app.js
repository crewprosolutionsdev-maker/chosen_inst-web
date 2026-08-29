import express from 'express';
import cors from 'cors';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { productRouter } from './routes/productRoutes.js';
import { adminRouter } from './routes/adminRoutes.js';
import { authRouter } from './routes/authRoutes.js';
import { categoryRouter } from './routes/categoryRoutes.js';

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const frontendDirectory = path.resolve(currentDirectory, '../../frontend/dist');

export const app = express();
app.use(cors());
app.use(express.json());
app.get('/api/health', (_, res) => res.json({ status: 'ok', service: 'chosen-api' }));
app.use('/api/auth', authRouter);
app.use('/api/products', productRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/admin', adminRouter);
app.use(express.static(frontendDirectory));
app.use((req, res, next) => {
  if (req.method !== 'GET' || req.path.startsWith('/api/')) return next();
  res.sendFile(path.join(frontendDirectory, 'index.html'));
});
app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ message: 'Ocurrió un error inesperado' });
});
