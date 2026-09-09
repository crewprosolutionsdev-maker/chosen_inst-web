const currency = value => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(value);

export async function notifyNewOrder(order) {
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const recipient = process.env.WHATSAPP_ADMIN_NUMBER;
  if (!token || !phoneNumberId || !recipient) return { sent: false, reason: 'not_configured' };

  const products = order.items.map(item => `${item.quantity}x ${item.name}`).join(', ').slice(0, 900);
  const delivery = `${order.shipping.label} · ${order.customer.address}, ${order.customer.city}`.slice(0, 900);
  const response = await fetch(`https://graph.facebook.com/${process.env.WHATSAPP_GRAPH_VERSION || 'v25.0'}/${phoneNumberId}/messages`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: recipient,
      type: 'template',
      template: {
        name: process.env.WHATSAPP_ORDER_TEMPLATE || 'nuevo_pedido_chosen',
        language: { code: process.env.WHATSAPP_TEMPLATE_LANGUAGE || 'es_AR' },
        components: [{ type: 'body', parameters: [
          { type: 'text', text: order.id.slice(-6).toUpperCase() },
          { type: 'text', text: order.customer.name.slice(0, 100) },
          { type: 'text', text: products },
          { type: 'text', text: currency(order.total) },
          { type: 'text', text: delivery },
          { type: 'text', text: order.paymentMethod === 'transfer' ? 'Transferencia pendiente' : 'Mercado Pago pendiente' },
        ] }],
      },
    }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error?.message || 'WhatsApp rechazó la notificación');
  return { sent: true, messageId: data.messages?.[0]?.id };
}

export async function notifyNewOrderSafely(order) {
  try {
    const result = await notifyNewOrder(order);
    if (result.sent) await order.updateOne({ whatsappNotification: { status: 'sent', messageId: result.messageId, sentAt: new Date() } });
  } catch (error) {
    console.error('No se pudo enviar el aviso de WhatsApp:', error.message);
    await order.updateOne({ whatsappNotification: { status: 'failed' } }).catch(() => {});
  }
}
