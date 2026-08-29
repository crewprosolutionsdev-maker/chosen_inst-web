import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  compareAt: { type: Number, min: 0, default: null },
  category: { type: String, default: 'Abanicos', trim: true },
  description: { type: String, default: '', trim: true },
  image: {
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    width: Number,
    height: Number,
  },
  stock: { type: Number, min: 0, default: 0 },
  featured: { type: Boolean, default: false },
  active: { type: Boolean, default: true },
}, { timestamps: true });

productSchema.index({ name: 'text', category: 'text' });

export const Product = mongoose.model('Product', productSchema);
