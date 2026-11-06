import { useCallback, useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import { money } from '../../utils/currency';

const paymentLabel = method => method === 'transfer' ? 'Transferencia' : 'Mercado Pago';
const statusLabel = status => status === 'approved' ? 'Pago confirmado' : status === 'rejected' ? 'Rechazado' : status === 'in_process' ? 'En revisión' : 'Pendiente';
const dateLabel = value => new Date(value).toLocaleString('es-AR', { dateStyle: 'medium', timeStyle: 'short' });

export function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState('');
  const load = useCallback(() => adminService.orders().then(setOrders).catch(e => setError(e.message)), []);
  useEffect(() => { load(); }, [load]);
  const confirm = async order => {
    if (!window.confirm(`¿Confirmás que recibiste y verificaste el pago del pedido #${order.code}?`)) return;
    try { setBusy(order.id); setError(''); await adminService.confirmOrderPayment(order.id); await load(); }
    catch (e) { setError(e.message); }
    finally { setBusy(''); }
  };
  return <section className="admin-page"><header><div><span>VENTAS</span><h1>Pedidos</h1><p>Revisá los pedidos y confirmá las transferencias al verificar el comprobante.</p></div><button className="admin-primary" onClick={load}>ACTUALIZAR</button></header>
    {error && <p className="admin-error">{error}</p>}
    {!orders.length ? <div className="admin-order-empty">Todavía no hay pedidos.</div> : <div className="admin-orders">{orders.map(order => <article className="admin-order" key={order.id}>
      <header><div><span>PEDIDO #{order.code}</span><p>{dateLabel(order.createdAt)}</p></div><strong className={`order-status ${order.paymentStatus === 'approved' ? 'is-paid' : ''}`}>{statusLabel(order.paymentStatus)}</strong></header>
      <div className="admin-order-grid"><section><h2>Cliente</h2><p><b>{order.customer.name}</b><br/>{order.customer.email}<br/>{order.customer.phone}</p><p>{order.customer.address}, {order.customer.city}, {order.customer.province} {order.customer.postalCode}</p></section>
      <section><h2>Detalle</h2><ul>{order.items.map((item, index) => <li key={`${item.product || item.name}-${index}`}><span>{item.quantity} × {item.name}</span><b>{money(item.quantity * item.unitPrice)}</b></li>)}</ul><p className="order-shipping">{order.shipping.label}: {money(order.shipping.cost)}</p><p className="order-total"><span>Total</span><strong>{money(order.total)}</strong></p></section></div>
      <footer><span>Pago: {paymentLabel(order.paymentMethod)}</span>{order.paymentMethod === 'transfer' && order.paymentStatus !== 'approved' && <button className="admin-primary" disabled={busy === order.id} onClick={() => confirm(order)}>{busy === order.id ? 'GUARDANDO…' : 'CONFIRMAR PAGO'}</button>}</footer>
    </article>)}</div>}
  </section>;
}
