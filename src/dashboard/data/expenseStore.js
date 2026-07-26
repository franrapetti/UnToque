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

const COLLECTION = 'expenses';

let cachedExpenses = null;

export async function getExpenses() {
  try {
    const q = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    cachedExpenses = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    return cachedExpenses;
  } catch (err) {
    console.error('Error fetching expenses:', err);
    return cachedExpenses || [];
  }
}

export function getExpensesCached() {
  return cachedExpenses || [];
}

export async function addExpense(expense) {
  const data = {
    ...expense,
    createdAt: new Date().toISOString()
  };
  const docRef = await addDoc(collection(db, COLLECTION), data);
  const newExpense = { id: docRef.id, ...data };
  if (cachedExpenses) cachedExpenses.unshift(newExpense);
  return newExpense;
}

export async function updateExpense(id, updates) {
  const docRef = doc(db, COLLECTION, id);
  await updateDoc(docRef, updates);
  if (cachedExpenses) {
    const idx = cachedExpenses.findIndex(e => e.id === id);
    if (idx !== -1) cachedExpenses[idx] = { ...cachedExpenses[idx], ...updates };
  }
}

export async function deleteExpense(id) {
  const docRef = doc(db, COLLECTION, id);
  await deleteDoc(docRef);
  if (cachedExpenses) {
    cachedExpenses = cachedExpenses.filter(e => e.id !== id);
  }
}

export async function getExpensesByTemporality() {
  const expenses = await getExpenses();
  return {
    byDay: expenses
      .filter(e => e.temporality === 'day')
      .sort((a, b) => (a.date || '').localeCompare(b.date || '')),
    byWeek: expenses
      .filter(e => e.temporality === 'week')
      .sort((a, b) => (a.date || '').localeCompare(b.date || '')),
    byMonth: expenses
      .filter(e => e.temporality === 'month')
      .sort((a, b) => (a.date || '').localeCompare(b.date || '')),
  };
}

export async function getTotalPendingExpenses() {
  const expenses = await getExpenses();
  return expenses
    .filter(e => e.status === 'pending')
    .reduce((sum, e) => sum + e.amount, 0);
}
