import { MessageCircle } from 'lucide-react';
import { STORE } from '../config/store';
import { CartDrawer } from './CartDrawer';
import { Footer } from './Footer';
import { Header } from './Header';

export function StoreLayout({ cart, children }) { return <><Header cartSummary={cart.summary} onCartOpen={cart.open}/>{children}<Footer/><a href={STORE.whatsappUrl} className="whatsapp" aria-label="WhatsApp"><MessageCircle/></a><CartDrawer cart={cart}/></>; }
