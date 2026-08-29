import { useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'chosen-cart';

export function useCart() {
  const [items, setItems] = useState(() => JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'));
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => localStorage.setItem(STORAGE_KEY, JSON.stringify(items)), [items]);

  const summary = useMemo(() => ({
    count: items.reduce((sum, item) => sum + item.qty, 0),
    total: items.reduce((sum, item) => sum + item.price * item.qty, 0),
  }), [items]);

  const add = (product, qty = 1) => {
    setItems(current => current.some(item => item.id === product.id)
      ? current.map(item => item.id === product.id ? { ...item, qty: item.qty + qty } : item)
      : [...current, { ...product, qty }]);
    setIsOpen(true);
  };
  const change = (id, delta) => setItems(current => current
    .map(item => item.id === id ? { ...item, qty: item.qty + delta } : item)
    .filter(item => item.qty > 0));
  const remove = id => setItems(current => current.filter(item => item.id !== id));

  return { items, isOpen, summary, add, change, remove, open: () => setIsOpen(true), close: () => setIsOpen(false) };
}
