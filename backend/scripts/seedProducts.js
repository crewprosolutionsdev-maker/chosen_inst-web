import dotenv from 'dotenv';
import path from 'node:path';
import { connectDatabase } from '../src/config/database.js';
import { configureCloudinary } from '../src/config/cloudinary.js';
import { Product } from '../src/models/Product.js';

dotenv.config({ path: new URL('../../.env', import.meta.url) });

const imageDirectory = process.env.PRODUCT_IMAGE_DIR;
const defaultPrice = Number(process.env.DEFAULT_PRODUCT_PRICE || 0);

const catalog = [
  ['Kairos', 'kairos', 'abanicos_kairos.jpeg'],
  ['Kiná', 'kina', 'abanico-kina.jpeg'],
  ['Eben-ezer', 'eben-ezer', 'abanico_eben-ezer.jpeg'],
  ['Emuná', 'emuna', 'abanico_emuna.jpeg'],
  ['Jésed', 'jesed', 'abanico_jesed.jpeg'],
  ['Ruáj', 'ruaj', 'abanico_ruaj.jpeg'],
  ['Olam', 'olam', 'abanico_olam.jpeg'],
  ['Kadosh', 'kadosh', 'abanico_kadosh.jpeg'],
  ['Shalom', 'shalom', 'abanico_shalom.jpeg'],
];

if (!imageDirectory) throw new Error('Falta PRODUCT_IMAGE_DIR');
if (!defaultPrice) throw new Error('Falta DEFAULT_PRODUCT_PRICE o debe ser mayor a cero');

await connectDatabase();
const cloudinary = configureCloudinary();

for (const [name, slug, filename] of catalog) {
  const upload = await cloudinary.uploader.upload(path.join(imageDirectory, filename), {
    folder: 'chosen/products', public_id: slug, overwrite: true, resource_type: 'image',
  });
  await Product.findOneAndUpdate(
    { slug },
    {
      name: `Abanico ${name}`, slug, price: defaultPrice, compareAt: null,
      category: 'Abanicos', description: `Abanico ${name} de seda, color y movimiento.`,
      image: { url: upload.secure_url, publicId: upload.public_id, width: upload.width, height: upload.height },
      stock: 10, featured: true, active: true,
    },
    { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true },
  );
  console.log(`✓ Abanico ${name}`);
}

console.log('Catálogo cargado en Cloudinary y MongoDB');
process.exit(0);
