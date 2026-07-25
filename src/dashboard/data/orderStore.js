const STORAGE_KEY = 'untoque_orders';

export function getOrdersStore() {
  const existing = localStorage.getItem(STORAGE_KEY);
  if (!existing) return [];
  return JSON.parse(existing);
}

export function addOrder(order) {
  const orders = getOrdersStore();
  const newOrder = { 
    ...order, 
    id: `ord-${Math.floor(Math.random() * 10000)}`, // short id for display
    date: order.date || new Date().toISOString().split('T')[0],
    createdAt: new Date().toISOString()
  };
  orders.unshift(newOrder); // Add to beginning
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  return newOrder;
}

export function updateOrder(id, updates) {
  const orders = getOrdersStore();
  const idx = orders.findIndex(o => o.id === id);
  if (idx !== -1) {
    orders[idx] = { ...orders[idx], ...updates };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
    return orders[idx];
  }
  return null;
}

export function deleteOrder(id) {
  const orders = getOrdersStore();
  const filtered = orders.filter(o => o.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}
