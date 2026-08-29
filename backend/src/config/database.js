import mongoose from 'mongoose';

export async function connectDatabase() {
  if (!process.env.MONGODB_URI) {
    console.warn('MONGODB_URI no configurada: se usará el catálogo local de respaldo.');
    return false;
  }

  await mongoose.connect(process.env.MONGODB_URI);
  console.log('MongoDB conectado');
  return true;
}
