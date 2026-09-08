import { useSearchParams } from 'react-router-dom';
import { ProductGrid } from '../components/ProductGrid';
import { CategoryFilter } from '../components/CategoryFilter';
import { useProducts } from '../hooks/useProducts';
export function ProductsPage({ onAdd }) { const [params] = useSearchParams(); const query = params.get('q') || ''; const category = params.get('category') || ''; const catalog = useProducts({ query, category }); return <main className="page container"><div className="page-title"><span className="eyebrow">SHOP</span><h1>{category || 'Todos los productos'}</h1><p>{query ? `Resultados para “${query}”` : 'Encontrá ese detalle que te representa.'}</p></div><div className="catalog"><CategoryFilter/><ProductGrid {...catalog} onAdd={onAdd}/></div></main>; }
