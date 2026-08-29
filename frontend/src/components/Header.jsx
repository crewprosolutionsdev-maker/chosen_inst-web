import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, Search, ShoppingBag, UserRound, X } from 'lucide-react';
import { money } from '../utils/currency';

export function Header({ cartSummary, onCartOpen }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const submitSearch = event => {
    event.preventDefault();
    navigate(`/productos?q=${encodeURIComponent(query)}`);
    setMenuOpen(false);
  };
  return <>
    <div className="announcement">ENVÍOS A TODO EL PAÍS <span>•</span> 3 CUOTAS SIN INTERÉS</div>
    <header>
      <div className="header-main container">
        <button className="mobile-only icon-btn" onClick={() => setMenuOpen(value => !value)} aria-label="Abrir menú">{menuOpen ? <X/> : <Menu/>}</button>
        <Link to="/" className="logo"><img src="/assets/chosen-logo.webp" alt="Chosen" /></Link>
        <form className="search" onSubmit={submitSearch}><input value={query} onChange={event => setQuery(event.target.value)} placeholder="¿Qué estás buscando?"/><button aria-label="Buscar"><Search size={19}/></button></form>
        <div className="utilities"><span className="account"><UserRound/><small>MI CUENTA</small></span><button className="cart-trigger" onClick={onCartOpen}><ShoppingBag/><span><small>CARRITO ({cartSummary.count})</small><b>{money(cartSummary.total)}</b></span></button></div>
      </div>
      <nav className={menuOpen ? 'open' : ''}><div className="container nav-inner">{[['/','INICIO'],['/productos','PRODUCTOS'],['/contacto','CONTACTO']].map(([to,label]) => <NavLink key={to} to={to} onClick={() => setMenuOpen(false)}>{label}</NavLink>)}</div></nav>
    </header>
  </>;
}
