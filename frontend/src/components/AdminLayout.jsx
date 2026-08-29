import { NavLink, useNavigate } from 'react-router-dom';
import { UserRound } from 'lucide-react';
import { adminAuth } from '../services/adminService';
export function AdminLayout({ children }) { const navigate = useNavigate(); const logout = () => { adminAuth.clear(); navigate('/admin/login'); }; return <div className="admin-shell"><aside className="admin-sidebar"><div className="admin-avatar" aria-label="Perfil administrador"><UserRound/></div><span>ADMINISTRACIÓN</span><nav><NavLink to="/admin/productos">Productos</NavLink><NavLink to="/admin/categorias">Categorías del home</NavLink><NavLink to="/">Ver tienda</NavLink></nav><button onClick={logout}>Cerrar sesión</button></aside><main className="admin-content">{children}</main></div>; }
