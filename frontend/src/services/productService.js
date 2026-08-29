const request = async path => {
  const response = await fetch(path);
  if (!response.ok) throw new Error('No pudimos cargar los productos');
  return response.json();
};

export const productService = {
  list: ({ query = '', featured } = {}) => {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (featured !== undefined) params.set('featured', featured);
    return request(`/api/products?${params}`);
  },
  getBySlug: slug => request(`/api/products/${slug}`),
};
