const TOKEN_KEY = 'chosen-admin-token';
export const adminAuth = { token: () => sessionStorage.getItem(TOKEN_KEY), save: token => sessionStorage.setItem(TOKEN_KEY, token), clear: () => sessionStorage.removeItem(TOKEN_KEY) };
const request = async (path, options = {}) => { const response = await fetch(path, { ...options, headers: { Authorization: `Bearer ${adminAuth.token()}`, ...options.headers } }); if (response.status === 401) adminAuth.clear(); const data = await response.json().catch(() => ({})); if (!response.ok) throw new Error(data.message || 'No se pudo completar la operación'); return data; };
export const adminService = {
  login: password => request('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }) }),
  products: () => request('/api/admin/products'), product: id => request(`/api/admin/products/${id}`),
  saveProduct: (id, form) => request(`/api/admin/products${id ? `/${id}` : ''}`, { method: id ? 'PUT' : 'POST', body: form }),
  deleteProduct: id => request(`/api/admin/products/${id}`, { method: 'DELETE' }),
  categories: () => request('/api/admin/categories'),
  saveCategory: (id, form) => request(`/api/admin/categories${id ? `/${id}` : ''}`, { method: id ? 'PUT' : 'POST', body: form }),
  deleteCategory: id => request(`/api/admin/categories/${id}`, { method: 'DELETE' }),
};
