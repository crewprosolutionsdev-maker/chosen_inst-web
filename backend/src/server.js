import express from 'express'; 
import cors from 'cors'; 
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import products from './data/products.json' with { type:'json' };

const app=express();
const port = process.env.PORT || 3001;
const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const frontendDirectory = path.resolve(currentDirectory, '../../frontend/dist');

app.use(cors());
app.use(express.json());

app.get('/api/health',(_,res)=>res.json({status:'ok',service:'chosen-api'}));
app.get('/api/products',(req,res)=>{
    const q=(req.query.q||'').toLowerCase();res.json(products.filter(p=>p.name.toLowerCase().includes(q)))
});
app.get('/api/products/:slug',(req,res)=>{
    const p=products.find(x=>x.slug===req.params.slug);p?res.json(p):res.status(404).json({message:'Producto no encontrado'})
});

// En producción, Express entrega también el frontend compilado de Vite.
app.use(express.static(frontendDirectory));
app.use((req, res, next) => {
    if (req.method !== 'GET' || req.path.startsWith('/api/')) return next();
    res.sendFile(path.join(frontendDirectory, 'index.html'));
});

app.listen(port,()=>console.log(`Chosen lista en puerto ${port}`));
