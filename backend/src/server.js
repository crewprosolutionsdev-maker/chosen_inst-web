import express from 'express'; 
import cors from 'cors'; 
import products from './data/products.json' with { type:'json' };

const app=express(); app.use(cors()); app.use(express.json());

app.get('/api/health',(_,res)=>res.json({status:'ok',service:'chosen-api'}));
app.get('/api/products',(req,res)=>{
    const q=(req.query.q||'').toLowerCase();res.json(products.filter(p=>p.name.toLowerCase().includes(q)))
});
app.get('/api/products/:slug',(req,res)=>{
    const p=products.find(x=>x.slug===req.params.slug);p?res.json(p):res.status(404).json({message:'Producto no encontrado'})
});
app.listen(process.env.PORT||3001,()=>console.log(`Chosen API lista en puerto ${process.env.PORT||3001}`));
