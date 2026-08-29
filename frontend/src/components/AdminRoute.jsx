import { Navigate } from 'react-router-dom';
import { adminAuth } from '../services/adminService';
export function AdminRoute({ children }) { return adminAuth.token() ? children : <Navigate to="/admin/login" replace/>; }
