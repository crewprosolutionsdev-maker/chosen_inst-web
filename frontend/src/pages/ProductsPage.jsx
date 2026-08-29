import { useSearchParams } from 'react-router-dom';
import { ProductGrid } from '../components/ProductGrid';
import { useProducts } from '../hooks/useProducts';
export function ProductsPage({ onAdd }) { const [params] = useSearchParams(); const query = params.get('q') || ''; const catalog = useProducts({ query }); return <main className="page container"><div className="page-title"><span className="eyebrow">SHOP</span><h1>Todos los productos</h1><p>{query ? `Resultados para “${query}”` : 'Encontrá ese detalle que te representa.'}</p></div><div className="catalog"><aside><b>CATEGORÍAS</b><button className="active">Todos</button><button>Abanicos</button></aside><ProductGrid {...catalog} onAdd={onAdd}/></div></main>; }
