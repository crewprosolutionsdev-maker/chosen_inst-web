import { useEffect, useState } from 'react';
import { productService } from '../services/productService';

export function useProducts(filters = {}) {
  const [state, setState] = useState({ products: [], loading: true, error: '' });
  const query = filters.query || '';
  const featured = filters.featured;

  useEffect(() => {
    let active = true;
    setState(current => ({ ...current, loading: true, error: '' }));
    productService.list({ query, featured })
      .then(products => active && setState({ products, loading: false, error: '' }))
      .catch(error => active && setState({ products: [], loading: false, error: error.message }));
    return () => { active = false; };
  }, [query, featured]);
  return state;
}

export function useProduct(slug) {
  const [state, setState] = useState({ product: null, loading: true, error: '' });
  useEffect(() => {
    let active = true;
    productService.getBySlug(slug)
      .then(product => active && setState({ product, loading: false, error: '' }))
      .catch(error => active && setState({ product: null, loading: false, error: error.message }));
    return () => { active = false; };
  }, [slug]);
  return state;
}
