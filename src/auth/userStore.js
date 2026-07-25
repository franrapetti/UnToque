const STORAGE_KEY = 'untoque_users';
const SESSION_KEY = 'untoque_session';

const DEFAULT_ADMIN = {
  id: 'admin-001',
  name: 'Administrador',
  email: 'admin@untoque.com',
  role: 'superadmin',
  createdAt: '2025-01-01T00:00:00Z',
  createdBy: 'system',
};

const DEFAULT_PASSWORD = 'untoque2025';

async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + 'untoque-salt-x9k2');
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function seedDefaultUser() {
  const users = getUsers();
  if (users.length === 0) {
    const passwordHash = await hashPassword(DEFAULT_PASSWORD);
    const user = { ...DEFAULT_ADMIN, passwordHash };
    localStorage.setItem(STORAGE_KEY, JSON.stringify([user]));
  }
}

export function getUsers() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

export function getUsersPublic() {
  return getUsers().map(({ passwordHash, ...u }) => u);
}

export async function addUser({ name, email, password, createdBy }) {
  const users = getUsers();
  if (users.find((u) => u.email === email)) {
    throw new Error('Ya existe un usuario con ese email');
  }
  const passwordHash = await hashPassword(password);
  const newUser = {
    id: `admin-${Date.now()}`,
    name,
    email,
    passwordHash,
    role: 'admin',
    createdAt: new Date().toISOString(),
    createdBy,
  };
  users.push(newUser);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  return { ...newUser, passwordHash: undefined };
}

export function deleteUser(id) {
  const users = getUsers();
  if (users.length <= 1) {
    throw new Error('No se puede eliminar el último administrador');
  }
  const target = users.find((u) => u.id === id);
  if (target?.role === 'superadmin') {
    throw new Error('No se puede eliminar al superadmin');
  }
  const filtered = users.filter((u) => u.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}

export async function authenticate(email, password) {
  const users = getUsers();
  const passwordHash = await hashPassword(password);
  const user = users.find(
    (u) => u.email === email && u.passwordHash === passwordHash
  );
  if (user) {
    const session = { ...user };
    delete session.passwordHash;
    session.lastLogin = new Date().toISOString();
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return session;
  }
  return null;
}

export function getSession() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY));
  } catch {
    return null;
  }
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}
