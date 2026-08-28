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

- Build Command: `npm run render-build`
- Start Command: `npm start`
- Health Check Path: `/api/health`

Si el servicio se configura manualmente en Render, usá esos mismos valores y dejá el Root Directory vacío.

## Alcance actual

Catálogo, búsqueda, detalle de producto, carrito persistente, contacto, newsletter visual y cierre asistido por WhatsApp. La API local deja preparada la migración a MongoDB/Cloudinary y el futuro panel administrativo.
