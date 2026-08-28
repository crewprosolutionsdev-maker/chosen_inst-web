import { useEffect, useMemo, useState } from 'react';
import { Routes, Route, Link, NavLink, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Search, ShoppingBag, UserRound, Menu, X, Instagram, MessageCircle, ArrowRight, Minus, Plus, Trash2, Truck, ShieldCheck, CreditCard } from 'lucide-react';
import { products, money } from './data/products';

const WA = 'https://wa.me/541150454528';

function Header({ cart, onCart }) {
  const [open, setOpen] = useState(false); const [query, setQuery] = useState(''); const nav = useNavigate();
  const total = cart.reduce((s, x) => s + x.price * x.qty, 0); const count = cart.reduce((s, x) => s + x.qty, 0);
  const search = e => { e.preventDefault(); nav(`/productos?q=${encodeURIComponent(query)}`); setOpen(false); };
  return <>
    <div className="announcement">ENVÍOS A TODO EL PAÍS <span>•</span> 3 CUOTAS SIN INTERÉS</div>
    <header>
      <div className="header-main container">
        <button className="mobile-only icon-btn" onClick={() => setOpen(!open)} aria-label="Abrir menú">{open ? <X/> : <Menu/>}</button>
        <Link to="/" className="logo"><img src="/assets/chosen-logo.webp" alt="Chosen" /></Link>
        <form className="search" onSubmit={search}><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="¿Qué estás buscando?"/><button aria-label="Buscar"><Search size={19}/></button></form>
        <div className="utilities"><span className="account"><UserRound/><small>MI CUENTA</small></span><button className="cart-trigger" onClick={onCart}><ShoppingBag/><span><small>CARRITO ({count})</small><b>{money(total)}</b></span></button></div>
      </div>
      <nav className={open ? 'open' : ''}><div className="container nav-inner"><NavLink to="/" onClick={()=>setOpen(false)}>INICIO</NavLink><NavLink to="/productos" onClick={()=>setOpen(false)}>PRODUCTOS</NavLink><NavLink to="/contacto" onClick={()=>setOpen(false)}>CONTACTO</NavLink></div></nav>
    </header>
  </>;
}

function ProductCard({ product, add }) {
  const discount = Math.round((1-product.price/product.compareAt)*100);
  return <article className="product-card"><Link to={`/producto/${product.slug}`} className="product-image"><img src={product.image} alt={product.name}/><span className="badge">{discount}% OFF</span></Link><div className="product-info"><p className="category">{product.category}</p><Link to={`/producto/${product.slug}`}><h3>{product.name}</h3></Link><div><span className="old-price">{money(product.compareAt)}</span><strong>{money(product.price)}</strong></div><button className="btn" onClick={()=>add(product)}>AGREGAR AL CARRITO <ArrowRight size={16}/></button></div></article>;
}

function Home({ add }) {
  return <main>
    <section className="hero"><div className="container hero-content"><span className="eyebrow">NUEVA COLECCIÓN</span><h1>Elegí ser<br/><em>inolvidable.</em></h1><p>Accesorios que hablan por vos. Color, actitud y diseño en cada detalle.</p><Link className="btn btn-dark" to="/productos">VER COLECCIÓN <ArrowRight/></Link></div><div className="hero-art"><div className="sun"></div><span>CHOSEN</span></div></section>
    <section className="section container"><div className="section-head"><div><span className="eyebrow">NUESTROS ELEGIDOS</span><h2>Destacados</h2></div><Link to="/productos">VER TODO <ArrowRight size={16}/></Link></div><div className="product-grid">{products.filter(p=>p.featured).map(p=><ProductCard key={p.id} product={p} add={add}/>)}</div></section>
    <section className="benefits"><div className="container benefit-grid"><div><Truck/><b>ENVÍOS A TODO EL PAÍS</b><span>Recibí tu pedido donde estés</span></div><div><CreditCard/><b>PAGÁ COMO QUIERAS</b><span>Tarjetas y transferencia</span></div><div><ShieldCheck/><b>COMPRA SEGURA</b><span>Tus datos siempre protegidos</span></div></div></section>
    <Newsletter />
  </main>;
}

function Products({ add }) { const [params] = useSearchParams(); const q=(params.get('q')||'').toLowerCase(); const shown=products.filter(p=>p.name.toLowerCase().includes(q)); return <main className="page container"><div className="page-title"><span className="eyebrow">SHOP</span><h1>Todos los productos</h1><p>{q ? `Resultados para “${params.get('q')}”` : 'Encontrá ese detalle que te representa.'}</p></div><div className="catalog"><aside><b>CATEGORÍAS</b><button className="active">Todos</button><button>Abanicos</button></aside><div className="product-grid">{shown.length ? shown.map(p=><ProductCard key={p.id} product={p} add={add}/>) : <p>No encontramos productos.</p>}</div></div></main>; }

function ProductDetail({ add }) { const {slug}=useParams(); const p=products.find(x=>x.slug===slug); const [qty,setQty]=useState(1); if(!p) return <main className="page container"><h1>Producto no encontrado</h1></main>; return <main className="page container product-detail"><div className="detail-image"><img src={p.image} alt={p.name}/></div><div className="detail-copy"><p className="category">{p.category}</p><h1>{p.name}</h1><div className="detail-price"><strong>{money(p.price)}</strong><span>{money(p.compareAt)}</span></div><p>{p.description}</p><div className="quantity"><button onClick={()=>setQty(Math.max(1,qty-1))}><Minus/></button><span>{qty}</span><button onClick={()=>setQty(Math.min(p.stock,qty+1))}><Plus/></button></div><button className="btn btn-dark wide" onClick={()=>add(p,qty)}>AGREGAR AL CARRITO</button><small>Stock disponible: {p.stock} unidades</small><div className="detail-notes"><span><Truck/> Envíos a todo el país</span><span><ShieldCheck/> Compra protegida</span></div></div></main>; }

function Contact() { return <main className="page container"><div className="page-title"><span className="eyebrow">HABLEMOS</span><h1>Contacto</h1><p>¿Tenés una pregunta? Estamos para ayudarte.</p></div><div className="contact-grid"><form className="contact-form" onSubmit={e=>e.preventDefault()}><label>Nombre<input placeholder="Tu nombre"/></label><label>Email<input type="email" placeholder="hola@email.com"/></label><label>Mensaje<textarea rows="6" placeholder="¿En qué podemos ayudarte?"/></label><button className="btn btn-dark">ENVIAR MENSAJE</button></form><div className="contact-info"><h2>También podés encontrarnos</h2><a href={WA} target="_blank"><MessageCircle/> WhatsApp<br/><span>+54 11 5045-4528</span></a><a href="https://instagram.com/chosen_inst" target="_blank"><Instagram/> Instagram<br/><span>@chosen_inst</span></a></div></div></main>; }

function Newsletter(){return <section className="newsletter"><div><span className="eyebrow">NO TE PIERDAS NADA</span><h2>Entrá al mundo Chosen.</h2><p>Novedades, lanzamientos y beneficios exclusivos.</p></div><form onSubmit={e=>e.preventDefault()}><input type="email" placeholder="Tu email"/><button>QUIERO SUMARME <ArrowRight/></button></form></section>}

function Cart({ open, close, items, change, remove }) { const total=items.reduce((s,x)=>s+x.price*x.qty,0); return <><div className={`overlay ${open?'show':''}`} onClick={close}/><aside className={`cart ${open?'show':''}`}><div className="cart-head"><h2>Tu carrito <span>({items.reduce((s,x)=>s+x.qty,0)})</span></h2><button onClick={close}><X/></button></div>{items.length===0?<div className="empty"><ShoppingBag/><h3>Tu carrito está vacío</h3><Link to="/productos" onClick={close}>VER PRODUCTOS</Link></div>:<><div className="cart-items">{items.map(x=><div className="cart-item" key={x.id}><img src={x.image}/><div><b>{x.name}</b><span>{money(x.price)}</span><div className="mini-qty"><button onClick={()=>change(x.id,-1)}>-</button><span>{x.qty}</span><button onClick={()=>change(x.id,1)}>+</button></div></div><button onClick={()=>remove(x.id)}><Trash2 size={17}/></button></div>)}</div><div className="cart-footer"><div><span>SUBTOTAL</span><strong>{money(total)}</strong></div><small>El envío se calcula al finalizar la compra.</small><a className="btn btn-dark wide" href={`${WA}?text=${encodeURIComponent(`Hola! Quiero comprar: ${items.map(x=>`${x.qty}x ${x.name}`).join(', ')}. Total: ${money(total)}`)}`} target="_blank">FINALIZAR POR WHATSAPP</a></div></>}</aside></> }

function Footer(){return <footer><div className="container footer-grid"><div><img src="/assets/chosen-logo.webp"/><p>Accesorios elegidos para expresarte.</p><a href="https://instagram.com/chosen_inst"><Instagram/></a></div><div><b>NAVEGACIÓN</b><Link to="/">Inicio</Link><Link to="/productos">Productos</Link><Link to="/contacto">Contacto</Link></div><div><b>AYUDA</b><span>Envíos</span><span>Cambios y devoluciones</span><span>Preguntas frecuentes</span></div><div><b>CONTACTO</b><a href={WA}>+54 11 5045-4528</a><span>Buenos Aires, Argentina</span></div></div><div className="copyright container">© 2026 Chosen — Todos los derechos reservados.</div></footer>}

export default function App(){ const [cart,setCart]=useState(()=>JSON.parse(localStorage.getItem('chosen-cart')||'[]')); const [open,setOpen]=useState(false); useEffect(()=>localStorage.setItem('chosen-cart',JSON.stringify(cart)),[cart]); const add=(p,qty=1)=>{setCart(c=>c.some(x=>x.id===p.id)?c.map(x=>x.id===p.id?{...x,qty:x.qty+qty}:x):[...c,{...p,qty}]);setOpen(true)}; const change=(id,d)=>setCart(c=>c.map(x=>x.id===id?{...x,qty:x.qty+d}:x).filter(x=>x.qty>0)); return <><Header cart={cart} onCart={()=>setOpen(true)}/><Routes><Route path="/" element={<Home add={add}/>}/><Route path="/productos" element={<Products add={add}/>}/><Route path="/producto/:slug" element={<ProductDetail add={add}/>}/><Route path="/contacto" element={<Contact/>}/></Routes><Footer/><a href={WA} className="whatsapp" aria-label="WhatsApp"><MessageCircle/></a><Cart open={open} close={()=>setOpen(false)} items={cart} change={change} remove={id=>setCart(c=>c.filter(x=>x.id!==id))}/></> }
