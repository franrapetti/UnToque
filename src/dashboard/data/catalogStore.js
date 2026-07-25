const STORAGE_KEY = 'untoque_catalog';

const DEFAULT_PRODUCTS = [
  {
    id: 'prod-001',
    name: 'Tarjeta NFC + Stand de Regalo',
    price_list: 15000,
    price_cash: 12000,
    stock: 50,
    image: '',
    createdAt: new Date().toISOString()
  }
];

export function getProducts() {
  const existing = localStorage.getItem(STORAGE_KEY);
  if (!existing) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_PRODUCTS));
    return DEFAULT_PRODUCTS;
  }
  return JSON.parse(existing);
}

export function addProduct(product) {
  const products = getProducts();
  const newProduct = { ...product, id: `prod-${Date.now()}`, createdAt: new Date().toISOString() };
  products.push(newProduct);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  return newProduct;
}

export function updateProduct(id, updates) {
  const products = getProducts();
  const idx = products.findIndex(p => p.id === id);
  if (idx !== -1) {
    products[idx] = { ...products[idx], ...updates };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    return products[idx];
  }
  return null;
}

export function deleteProduct(id) {
  const products = getProducts();
  const filtered = products.filter(p => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}
