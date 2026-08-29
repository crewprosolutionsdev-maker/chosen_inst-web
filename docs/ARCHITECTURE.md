# Arquitectura MVP de Chosen

```text
React pages
   │
   ├── components (UI reutilizable)
   ├── hooks (estado y ciclo de vida)
   └── services ────────────────┐
                                │ HTTP /api
Express routes → controllers → services → Product model → MongoDB
                                    │
                                    └── image.url → Cloudinary CDN
```

## Frontend

- `pages/`: composición de cada ruta.
- `components/`: piezas reutilizables sin acceso directo a datos.
- `hooks/`: carrito, carga y estado de productos.
- `services/`: única capa que conoce la API.
- `config/` y `utils/`: constantes y funciones puras compartidas.

## Backend

- `routes/`: contratos HTTP.
- `controllers/`: validación de entrada y respuesta.
- `services/`: reglas de acceso al catálogo.
- `models/`: esquema persistente de MongoDB.
- `config/`: conexiones externas.
- `scripts/seedProducts.js`: migración repetible de imágenes y productos.

La tienda usa un catálogo JSON de respaldo hasta que `MONGODB_URI` esté configurada. Las credenciales sólo viven en variables de entorno y nunca se incluyen en Git.
