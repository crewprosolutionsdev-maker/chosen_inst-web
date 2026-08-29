import { Route, Routes } from 'react-router-dom';
import { StoreLayout } from './components/StoreLayout';
import { useCart } from './hooks/useCart';
import { ContactPage } from './pages/ContactPage';
import { HomePage } from './pages/HomePage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { ProductsPage } from './pages/ProductsPage';
export default function App() { const cart = useCart(); return <StoreLayout cart={cart}><Routes><Route path="/" element={<HomePage onAdd={cart.add}/>}/><Route path="/productos" element={<ProductsPage onAdd={cart.add}/>}/><Route path="/producto/:slug" element={<ProductDetailPage onAdd={cart.add}/>}/><Route path="/contacto" element={<ContactPage/>}/></Routes></StoreLayout>; }
