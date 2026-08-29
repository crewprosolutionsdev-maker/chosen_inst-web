import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { adminService } from '../../services/adminService';

const initial = { name: '', category: '', price: '', compareAt: '', stock: 0, description: '', active: true, featured: false };

export function AdminProductFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(initial);
  const [categories, setCategories] = useState([]);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    adminService.categories().then(items => {
      setCategories(items);
      if (!id && items.length) setForm(current => ({ ...current, category: items[0].name }));
    }).catch(requestError => setError(requestError.message));
    if (id) adminService.product(id).then(product => {
      setForm({ ...initial, ...product });
      setPreview(product.image);
    }).catch(requestError => setError(requestError.message));
  }, [id]);

  const change = event => {
    const { name, value, type, checked } = event.target;
    setForm(current => ({ ...current, [name]: type === 'checkbox' ? checked : value }));
  };
  const choose = event => {
    const image = event.target.files[0];
    setFile(image);
    if (image) setPreview(URL.createObjectURL(image));
  };
  const submit = async event => {
    event.preventDefault();
    try {
      setSaving(true);
      setError('');
      const data = new FormData();
      ['name', 'category', 'price', 'compareAt', 'stock', 'description', 'active', 'featured']
        .forEach(key => data.append(key, form[key] ?? ''));
      if (file) data.append('image', file);
      await adminService.saveProduct(id, data);
      navigate('/admin/productos', { replace: true });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  };

  return <section className="admin-page">
    <header><div><span>CATÁLOGO</span><h1>{id ? 'Editar producto' : 'Nuevo producto'}</h1></div><Link to="/admin/productos">Volver</Link></header>
    <form className="admin-form" onSubmit={submit}>
      {error && <p className="admin-error">{error}</p>}
      <label>Nombre<input name="name" value={form.name} onChange={change} required /></label>
      <div className="admin-form-row">
        <label>Categoría<select name="category" value={form.category} onChange={change} required>
          <option value="" disabled>Elegí una categoría</option>
          {categories.map(category => <option key={category.id} value={category.name}>{category.name}</option>)}
        </select></label>
        <label>Precio<input name="price" type="number" min="0" value={form.price} onChange={change} required /></label>
      </div>
      <div className="admin-form-row">
        <label>Precio anterior<input name="compareAt" type="number" min="0" value={form.compareAt || ''} onChange={change} /></label>
        <label>Stock<input name="stock" type="number" min="0" value={form.stock} onChange={change} /></label>
      </div>
      <label>Descripción<textarea name="description" rows="5" value={form.description} onChange={change} /></label>
      <label>Imagen<input type="file" accept="image/*" onChange={choose} required={!id} /></label>
      {preview && <img className="admin-preview" src={preview} alt="Vista previa" />}
      <div className="admin-checks">
        <label><input name="active" type="checkbox" checked={form.active} onChange={change} /> Activo</label>
        <label><input name="featured" type="checkbox" checked={form.featured} onChange={change} /> Destacado</label>
      </div>
      <button type="submit" className="admin-primary" disabled={saving}>{saving ? 'GUARDANDO…' : 'GUARDAR PRODUCTO'}</button>
    </form>
  </section>;
}
