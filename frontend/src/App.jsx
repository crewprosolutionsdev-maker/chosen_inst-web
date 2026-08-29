import { Navigate, Route, Routes } from 'react-router-dom';
import { AdminLayout } from './components/AdminLayout';
import { AdminRoute } from './components/AdminRoute';
import { StoreLayout } from './components/StoreLayout';
import { useCart } from './hooks/useCart';
import { ContactPage } from './pages/ContactPage';
import { HomePage } from './pages/HomePage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { ProductsPage } from './pages/ProductsPage';
import { AdminCategoriesPage } from './pages/admin/AdminCategoriesPage';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminProductFormPage } from './pages/admin/AdminProductFormPage';
import { AdminProductsPage } from './pages/admin/AdminProductsPage';

function Storefront() { const cart = useCart(); return <StoreLayout cart={cart}><Routes><Route path="/" element={<HomePage onAdd={cart.add}/>}/><Route path="/productos" element={<ProductsPage onAdd={cart.add}/>}/><Route path="/producto/:slug" element={<ProductDetailPage onAdd={cart.add}/>}/><Route path="/contacto" element={<ContactPage/>}/></Routes></StoreLayout>; }
function AdminScreen({ children }) { return <AdminRoute><AdminLayout>{children}</AdminLayout></AdminRoute>; }

export default function App() { return <Routes><Route path="/admin/login" element={<AdminLoginPage/>}/><Route path="/admin" element={<Navigate to="/admin/productos" replace/>}/><Route path="/admin/productos" element={<AdminScreen><AdminProductsPage/></AdminScreen>}/><Route path="/admin/productos/nuevo" element={<AdminScreen><AdminProductFormPage/></AdminScreen>}/><Route path="/admin/productos/:id" element={<AdminScreen><AdminProductFormPage/></AdminScreen>}/><Route path="/admin/categorias" element={<AdminScreen><AdminCategoriesPage/></AdminScreen>}/><Route path="/*" element={<Storefront/>}/></Routes>; }
