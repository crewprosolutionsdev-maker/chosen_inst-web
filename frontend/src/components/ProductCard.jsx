import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { money } from '../utils/currency';

export function ProductCard({ product, onAdd }) {
  const discount = product.compareAt > product.price ? Math.round((1 - product.price / product.compareAt) * 100) : 0;
  return <article className="product-card">
    <Link to={`/producto/${product.slug}`} className="product-image">
      <img src={product.image} alt={product.name} loading="lazy" />
      {discount > 0 && <span className="badge">{discount}% OFF</span>}
    </Link>
    <div className="product-info">
      <p className="category">{product.category}</p>
      <Link to={`/producto/${product.slug}`}><h3>{product.name}</h3></Link>
      <div>{product.compareAt > product.price && <span className="old-price">{money(product.compareAt)}</span>}<strong>{money(product.price)}</strong></div>
      <button className="btn" onClick={() => onAdd(product)}>AGREGAR AL CARRITO <ArrowRight size={16}/></button>
    </div>
  </article>;
}
