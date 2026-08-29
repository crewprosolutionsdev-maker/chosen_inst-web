import { ShoppingBag, Trash2, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { STORE } from '../config/store';
import { money } from '../utils/currency';

export function CartDrawer({ cart }) {
  const message = `Hola! Quiero comprar: ${cart.items.map(item => `${item.qty}x ${item.name}`).join(', ')}. Total: ${money(cart.summary.total)}`;
  return <><div className={`overlay ${cart.isOpen ? 'show' : ''}`} onClick={cart.close}/><aside className={`cart ${cart.isOpen ? 'show' : ''}`}><div className="cart-head"><h2>Tu carrito <span>({cart.summary.count})</span></h2><button onClick={cart.close}><X/></button></div>{cart.items.length === 0 ? <div className="empty"><ShoppingBag/><h3>Tu carrito está vacío</h3><Link to="/productos" onClick={cart.close}>VER PRODUCTOS</Link></div> : <><div className="cart-items">{cart.items.map(item => <div className="cart-item" key={item.id}><img src={item.image} alt={item.name}/><div><b>{item.name}</b><span>{money(item.price)}</span><div className="mini-qty"><button onClick={() => cart.change(item.id,-1)}>-</button><span>{item.qty}</span><button onClick={() => cart.change(item.id,1)}>+</button></div></div><button onClick={() => cart.remove(item.id)}><Trash2 size={17}/></button></div>)}</div><div className="cart-footer"><div><span>SUBTOTAL</span><strong>{money(cart.summary.total)}</strong></div><small>El envío se calcula al finalizar la compra.</small><a className="btn btn-dark wide" href={`${STORE.whatsappUrl}?text=${encodeURIComponent(message)}`} target="_blank" rel="noreferrer">FINALIZAR POR WHATSAPP</a></div></>}</aside></>;
}
