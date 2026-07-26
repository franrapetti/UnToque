import { db } from '../../firebase';
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy 
} from 'firebase/firestore';

const COLLECTION = 'orders';

let cachedOrders = null;

export async function getOrdersStore() {
  try {
    const q = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    cachedOrders = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    return cachedOrders;
  } catch (err) {
    console.error('Error fetching orders:', err);
    return cachedOrders || [];
  }
}

export function getOrdersCached() {
  return cachedOrders || [];
}

export async function addOrder(order) {
  const data = {
    ...order,
    date: order.date || new Date().toISOString().split('T')[0],
    createdAt: new Date().toISOString()
  };
  const docRef = await addDoc(collection(db, COLLECTION), data);
  const newOrder = { id: docRef.id, ...data };
  if (cachedOrders) cachedOrders.unshift(newOrder);
  return newOrder;
}

export async function updateOrder(id, updates) {
  const docRef = doc(db, COLLECTION, id);
  await updateDoc(docRef, updates);
  if (cachedOrders) {
    const idx = cachedOrders.findIndex(o => o.id === id);
    if (idx !== -1) cachedOrders[idx] = { ...cachedOrders[idx], ...updates };
  }
}

export async function deleteOrder(id) {
  const docRef = doc(db, COLLECTION, id);
  await deleteDoc(docRef);
  if (cachedOrders) {
    cachedOrders = cachedOrders.filter(o => o.id !== id);
  }
}
