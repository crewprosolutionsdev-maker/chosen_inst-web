import { Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';
import { STORE } from '../config/store';

export function Footer() { return <footer><div className="container footer-grid"><div><img src="/assets/chosen-logo.webp" alt="Chosen"/><p>Accesorios elegidos para expresarte.</p><a href={STORE.instagramUrl}><Instagram/></a></div><div><b>NAVEGACIÓN</b><Link to="/">Inicio</Link><Link to="/productos">Productos</Link><Link to="/contacto">Contacto</Link></div><div><b>AYUDA</b><span>Envíos</span><span>Cambios y devoluciones</span><span>Preguntas frecuentes</span></div><div><b>CONTACTO</b><a href={STORE.whatsappUrl}>+54 11 5045-4528</a><span>Buenos Aires, Argentina</span></div></div><div className="copyright container">© 2026 Chosen — Todos los derechos reservados.</div></footer>; }
