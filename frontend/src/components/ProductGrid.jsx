import { ProductCard } from './ProductCard';

export function ProductGrid({ products, loading, error, onAdd }) {
  if (loading) return <p className="catalog-status">Cargando colección…</p>;
  if (error) return <p className="catalog-status">{error}</p>;
  if (!products.length) return <p className="catalog-status">No encontramos productos.</p>;
  return <div className="product-grid">{products.map(product => <ProductCard key={product.id} product={product} onAdd={onAdd}/>)}</div>;
}
