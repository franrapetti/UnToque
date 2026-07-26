import { db } from '../../firebase';
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';

const COLLECTION = 'products';

const DEFAULT_PRODUCTS = [
  {
    name: 'Tarjeta NFC + Stand de Regalo',
    price_list: 15000,
    price_cash: 12000,
    stock: 50,
    image: '',
    createdAt: new Date().toISOString()
  }
];

let cachedProducts = null;

export async function getProducts() {
  try {
    const q = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      // Seed default products on first load
      const seeded = [];
      for (const product of DEFAULT_PRODUCTS) {
        const docRef = await addDoc(collection(db, COLLECTION), product);
        seeded.push({ id: docRef.id, ...product });
      }
      cachedProducts = seeded;
      return seeded;
    }
    cachedProducts = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    return cachedProducts;
  } catch (err) {
    console.error('Error fetching products:', err);
    // Fallback to cache or empty
    return cachedProducts || [];
  }
}

export function getProductsCached() {
  return cachedProducts || [];
}

export async function addProduct(product) {
  const data = {
    ...product,
    createdAt: new Date().toISOString()
  };
  const docRef = await addDoc(collection(db, COLLECTION), data);
  const newProduct = { id: docRef.id, ...data };
  if (cachedProducts) cachedProducts.unshift(newProduct);
  return newProduct;
}

export async function updateProduct(id, updates) {
  const docRef = doc(db, COLLECTION, id);
  await updateDoc(docRef, updates);
  if (cachedProducts) {
    const idx = cachedProducts.findIndex(p => p.id === id);
    if (idx !== -1) cachedProducts[idx] = { ...cachedProducts[idx], ...updates };
  }
}

export async function deleteProduct(id) {
  const docRef = doc(db, COLLECTION, id);
  await deleteDoc(docRef);
  if (cachedProducts) {
    cachedProducts = cachedProducts.filter(p => p.id !== id);
  }
}
