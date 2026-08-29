import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { categoryService } from '../services/categoryService';
export function FeaturedCategories() { const [categories, setCategories] = useState([]); useEffect(() => { categoryService.list().then(setCategories).catch(() => setCategories([])); }, []); if (!categories.length) return null; return <section className="section container category-section"><div className="section-head"><div><span className="eyebrow">EXPLORÁ CHOSEN</span><h2>Categorías</h2></div></div><div className="category-grid">{categories.map(category => <Link key={category.id} to={`/productos?category=${encodeURIComponent(category.name)}`} className="category-card"><img src={category.image} alt={category.name}/><div><h3>{category.name}</h3><span>VER PRODUCTOS <ArrowRight size={16}/></span></div></Link>)}</div></section>; }
