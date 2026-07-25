const STORAGE_KEY = 'untoque_expenses';

const DEFAULT_EXPENSES = [
  {
    id: 'exp-001',
    name: 'Lote 500 Tarjetas NFC China',
    amount: 850000,
    temporality: 'day',
    date: '2026-08-05',
    status: 'pending',
    category: 'inventory',
    createdAt: '2026-07-20T10:00:00Z',
  },
  {
    id: 'exp-002',
    name: 'Servidores y Hosting (AWS)',
    amount: 45000,
    temporality: 'month',
    date: '2026-08',
    status: 'pending',
    category: 'operations',
    createdAt: '2026-07-18T14:30:00Z',
  },
  {
    id: 'exp-003',
    name: 'Sueldos Equipo',
    amount: 890000,
    temporality: 'month',
    date: '2026-08',
    status: 'pending',
    category: 'payroll',
    createdAt: '2026-07-15T09:00:00Z',
  },
  {
    id: 'exp-004',
    name: 'Campaña Google Ads',
    amount: 150000,
    temporality: 'week',
    date: '2026-07-W31',
    status: 'pending',
    category: 'marketing',
    createdAt: '2026-07-22T11:00:00Z',
  },
  {
    id: 'exp-005',
    name: 'Fletes Andreani (envíos)',
    amount: 65000,
    temporality: 'week',
    date: '2026-07-W30',
    status: 'paid',
    category: 'logistics',
    createdAt: '2026-07-19T16:00:00Z',
  },
  {
    id: 'exp-006',
    name: 'Diseño packaging nuevo',
    amount: 120000,
    temporality: 'day',
    date: '2026-07-28',
    status: 'pending',
    category: 'design',
    createdAt: '2026-07-21T13:00:00Z',
  },
  {
    id: 'exp-007',
    name: 'Contador / Monotributo',
    amount: 35000,
    temporality: 'month',
    date: '2026-08',
    status: 'pending',
    category: 'admin',
    createdAt: '2026-07-10T10:00:00Z',
  },
  {
    id: 'exp-008',
    name: 'Filamento PLA impresora 3D',
    amount: 42000,
    temporality: 'day',
    date: '2026-08-02',
    status: 'pending',
    category: 'materials',
    createdAt: '2026-07-23T15:00:00Z',
  },
  {
    id: 'exp-009',
    name: 'Marketing Instagram Ads',
    amount: 95000,
    temporality: 'week',
    date: '2026-08-W32',
    status: 'pending',
    category: 'marketing',
    createdAt: '2026-07-24T09:00:00Z',
  },
  {
    id: 'exp-010',
    name: 'Dominio + SSL anual',
    amount: 28000,
    temporality: 'day',
    date: '2026-08-15',
    status: 'pending',
    category: 'operations',
    createdAt: '2026-07-25T08:00:00Z',
  },
];

function seedExpenses() {
  const existing = localStorage.getItem(STORAGE_KEY);
  if (!existing) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_EXPENSES));
  }
}

export function getExpenses() {
  seedExpenses();
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

export function addExpense(expense) {
  const expenses = getExpenses();
  const newExpense = {
    ...expense,
    id: `exp-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  expenses.push(newExpense);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
  return newExpense;
}

export function updateExpense(id, updates) {
  const expenses = getExpenses();
  const idx = expenses.findIndex((e) => e.id === id);
  if (idx !== -1) {
    expenses[idx] = { ...expenses[idx], ...updates };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
    return expenses[idx];
  }
  return null;
}

export function deleteExpense(id) {
  const expenses = getExpenses();
  const filtered = expenses.filter((e) => e.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}

export function getExpensesByTemporality() {
  const expenses = getExpenses();
  return {
    byDay: expenses
      .filter((e) => e.temporality === 'day')
      .sort((a, b) => a.date.localeCompare(b.date)),
    byWeek: expenses
      .filter((e) => e.temporality === 'week')
      .sort((a, b) => a.date.localeCompare(b.date)),
    byMonth: expenses
      .filter((e) => e.temporality === 'month')
      .sort((a, b) => a.date.localeCompare(b.date)),
  };
}

export function getTotalPendingExpenses() {
  return getExpenses()
    .filter((e) => e.status === 'pending')
    .reduce((sum, e) => sum + e.amount, 0);
}
