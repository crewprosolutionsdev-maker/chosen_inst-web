import { ArrowRight, CreditCard, ShieldCheck, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Newsletter } from '../components/Newsletter';
import { ProductGrid } from '../components/ProductGrid';
import { FeaturedCategories } from '../components/FeaturedCategories';
import { useProducts } from '../hooks/useProducts';
export function HomePage({ onAdd }) {
    const catalog = useProducts({ featured: true });
    return <main>
        <section className="hero">
            <div className="container hero-content">
                <span className="eyebrow">NUEVA COLECCIÓN</span>
                <h1>Instrumentos con<br/><em>propósito.</em></h1>
                <p>Accesorios que hablan por vos. Color, actitud y diseño en cada detalle.</p>
                <Link className="btn btn-dark" to="/productos">VER COLECCIÓN <ArrowRight/></Link>
            </div>
            <div className="hero-art">
                <span>CHOSEN</span>
            </div>
        </section>
        <FeaturedCategories/>
        <section className="section container">
            <div className="section-head">
                <div>
                    <span className="eyebrow">NUESTROS ELEGIDOS</span>
                    <h2>Destacados</h2>
                </div>
                <Link to="/productos">VER TODO <ArrowRight size={16}/></Link>
            </div>
            <ProductGrid {...catalog} onAdd={onAdd}/>
        </section>
        <section className="benefits">
            <div className="container benefit-grid">
                <div>
                    <Truck/>
                    <b>ENVÍOS A TODO EL PAÍS</b>
                    <span>Recibí tu pedido donde estés</span>
                </div>
                <div>
                    <CreditCard/>
                    <b>PAGÁ COMO QUIERAS</b>
                    <span>Tarjetas y transferencia</span>
                </div>
                <div>
                    <ShieldCheck/>
                    <b>COMPRA SEGURA</b>
                    <span>Tus datos siempre protegidos</span>
                </div>
            </div>
        </section>
        <Newsletter/>
    </main>;
}
