import 'dotenv/config';
import { app } from './app.js';
import { connectDatabase } from './config/database.js';

const port = process.env.PORT || 3001;

connectDatabase()
  .catch(error => console.error('No se pudo conectar a MongoDB:', error.message))
  .finally(() => app.listen(port, () => console.log(`Chosen lista en puerto ${port}`)));
