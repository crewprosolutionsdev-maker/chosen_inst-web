import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  image: {
    url: { type: String, required: true },
    publicId: { type: String, required: true },
  },
  order: { type: Number, default: 0 },
  active: { type: Boolean, default: true },
}, { timestamps: true });

export const Category = mongoose.model('Category', categorySchema);
