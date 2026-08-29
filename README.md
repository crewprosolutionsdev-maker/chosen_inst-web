# Chosen — MVP e-commerce

Tienda independiente desarrollada con el mismo stack base de Planeta Digital: React + Vite para el frontend y Node.js + Express para la API.

## Inicio rápido

```bash
npm run install:all
npm install
npm run dev
```

- Frontend: http://localhost:5173
- API: http://localhost:3001/api/products

## Deploy en Render

El repositorio incluye `render.yaml` para desplegar frontend y API como un único Web Service.

- Build Command: `npm run build` (también se admite `npm run render-build`)
- Start Command: `npm start`
- Health Check Path: `/api/health`

Si el servicio se configura manualmente en Render, usá esos mismos valores y dejá el Root Directory vacío. El comando de build instala por sí mismo las dependencias del frontend y del backend.

## Alcance actual

Catálogo, búsqueda, detalle de producto, carrito persistente, contacto, newsletter visual y cierre asistido por WhatsApp. La API local deja preparada la migración a MongoDB/Cloudinary y el futuro panel administrativo.

## Catálogo con MongoDB y Cloudinary

1. Copiá `.env.example` como `.env` y completá las credenciales.
2. Definí `PRODUCT_IMAGE_DIR` con la carpeta que contiene las nueve imágenes.
3. Definí `DEFAULT_PRODUCT_PRICE` y ejecutá `npm run seed:products --prefix backend`.

El script carga las imágenes en `chosen/products` dentro de Cloudinary y guarda en MongoDB el título, slug, precio, stock y URL segura de cada imagen. Puede ejecutarse nuevamente sin duplicar productos.
