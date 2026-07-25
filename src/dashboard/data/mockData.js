// ─── Seeded PRNG for deterministic mock data ───
function mulberry32(a) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    var t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const random = mulberry32(42);

// ─── Products ───
export const PRODUCTS = {
  nfcCard: { name: 'Tarjeta NFC A7', price: 3500, cost: 850 },
  stand3d: { name: 'Soporte 3D Premium', price: 8500, cost: 2200 },
  combo: { name: 'Combo Stand + NFC', price: 12000, cost: 3050 },
  saasPlan: { name: 'Plan SaaS Mensual', price: 2500, cost: 400 },
};

// ─── Argentine Tax Rates ───
export const TAX_RATES = {
  gateway: { name: 'Pasarela / Mercado Pago', rate: 0.06 },
  iibb: { name: 'Ingresos Brutos (IIBB)', rate: 0.05 },
  ganancias: { name: 'Impuesto a las Ganancias', rate: 0.35 },
};

// ─── Realistic Argentine Names ───
const FIRST_NAMES = [
  'Martín','Lucía','Santiago','Valentina','Mateo','Sofía','Thiago','Emma',
  'Benjamín','Isabella','Juan','Camila','Nicolás','Mía','Tomás','Catalina',
  'Felipe','Alma','Bautista','Olivia','Facundo','Delfina','Agustín','Renata',
  'Lautaro','Juana','Ignacio','Francesca','Joaquín','Emilia',
];

const LAST_NAMES = [
  'González','Rodríguez','López','Martínez','Fernández','García','Pérez',
  'Sánchez','Romero','Torres','Díaz','Ruiz','Álvarez','Moreno','Gutiérrez',
  'Muñoz','Castro','Flores','Acosta','Herrera',
];

const CITIES = [
  'CABA','Córdoba','Rosario','Mendoza','La Plata','Tucumán',
  'Mar del Plata','Salta','Neuquén','Bahía Blanca',
];

// ─── Generate 365 days of daily data ───
function generateAllData() {
  const dailyData = [];
  const orders = [];
  const today = new Date();
  const startDate = new Date(today);
  startDate.setFullYear(startDate.getFullYear() - 1);

  let orderIdCounter = 1000;
  let totalSubscribers = 12;

  for (let i = 0; i <= 365; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];

    const month = date.getMonth();
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    // Seasonal pattern (Argentina: Jan/Feb summer low, Mar-Jun ramp, Jul-Nov peak, Dec holiday)
    const seasonal = [0.55, 0.6, 0.75, 0.85, 0.95, 1.05, 1.0, 1.1, 1.15, 1.1, 0.9, 0.65][month];

    // Startup growth curve: ~120% annual growth
    const growth = 1 + (i / 365) * 1.2;

    // Day-of-week modifiers
    const dayFactor = isWeekend ? (dayOfWeek === 6 ? 0.35 : 0.15) : 1.0;
    const mondayBoost = dayOfWeek === 1 ? 1.12 : 1.0;

    // Hardware sales
    const baseUnits = 3;
    const units = Math.max(
      0,
      Math.round(
        baseUnits * seasonal * growth * dayFactor * mondayBoost * (0.5 + random() * 1.0)
      )
    );

    let hardwareRev = 0;
    let hardwareCost = 0;

    for (let u = 0; u < units; u++) {
      const r = random();
      let product, type;
      if (r < 0.45) {
        product = PRODUCTS.combo;
        type = 'combo';
      } else if (r < 0.72) {
        product = PRODUCTS.stand3d;
        type = 'stand3d';
      } else {
        product = PRODUCTS.nfcCard;
        type = 'nfcCard';
      }

      hardwareRev += product.price;
      hardwareCost += product.cost;

      const firstName = FIRST_NAMES[Math.floor(random() * FIRST_NAMES.length)];
      const lastName = LAST_NAMES[Math.floor(random() * LAST_NAMES.length)];
      const city = CITIES[Math.floor(random() * CITIES.length)];

      const statusRoll = random();
      const status =
        statusRoll < 0.72 ? 'completado' : statusRoll < 0.88 ? 'enviado' : 'pendiente';

      orders.push({
        id: `ORD-${orderIdCounter++}`,
        customer: `${firstName} ${lastName}`,
        city,
        product: product.name,
        type: 'hardware',
        productType: type,
        amount: product.price,
        cost: product.cost,
        status,
        date: dateStr,
      });
    }

    // SaaS subscriber growth
    if (date.getDate() === 1) {
      const newSubs = Math.round(4 + random() * 10 * growth * seasonal);
      const churn = Math.round(totalSubscribers * (0.02 + random() * 0.03));
      totalSubscribers = Math.max(10, totalSubscribers + newSubs - churn);
    }

    const dailySaasRev = Math.round((totalSubscribers * PRODUCTS.saasPlan.price) / 30);
    const dailySaasCost = Math.round((totalSubscribers * PRODUCTS.saasPlan.cost) / 30);

    // Operational expenses
    const baseOpex = 22000 * growth * seasonal;
    const opex = Math.round(baseOpex * (0.7 + random() * 0.6));

    // Occasional large expenses (inventory buys, equipment)
    const largeExpense = random() > 0.97 ? Math.round(180000 + random() * 500000) : 0;

    const totalIncome = hardwareRev + dailySaasRev;
    const totalExpenses = hardwareCost + dailySaasCost + opex + largeExpense;

    dailyData.push({
      date: dateStr,
      income: totalIncome,
      expenses: totalExpenses,
      hardwareRevenue: hardwareRev,
      saasRevenue: dailySaasRev,
      hardwareCost,
      saasCost: dailySaasCost,
      opex,
      units,
      subscriptions: totalSubscribers,
    });

    // Monthly SaaS bulk "order"
    if (date.getDate() === 1 && totalSubscribers > 0) {
      orders.push({
        id: `ORD-${orderIdCounter++}`,
        customer: `${totalSubscribers} suscriptores activos`,
        city: '—',
        product: 'Plan SaaS Mensual',
        type: 'saas',
        productType: 'saasPlan',
        amount: totalSubscribers * PRODUCTS.saasPlan.price,
        cost: totalSubscribers * PRODUCTS.saasPlan.cost,
        status: 'completado',
        date: dateStr,
      });
    }
  }

  return { dailyData, orders };
}

const { dailyData: ALL_DAILY_DATA, orders: ALL_ORDERS } = generateAllData();

// ─── Filtering ───
export function filterByDateRange(data, dateRange) {
  const { start, end } = dateRange;
  return data.filter((d) => {
    const date = new Date(d.date);
    return date >= start && date <= end;
  });
}

// ─── Exported Data Functions ───

export function getKPIs(dateRange) {
  const filtered = filterByDateRange(ALL_DAILY_DATA, dateRange);
  if (filtered.length === 0) {
    return {
      totalSales: 0, hardwareSales: 0, saasSales: 0, salesChange: 0,
      netCash: 0, netCashChange: 0, grossIncome: 0, totalExpenses: 0,
      totalCost: 0, nfcStock: 234, standsStock: 89,
      nfcStockMax: 500, standsStockMax: 150,
      runwayDays: 45, runwayAmount: 0, subscriptions: 0,
    };
  }

  const totalIncome = filtered.reduce((s, d) => s + d.income, 0);
  const hardwareSales = filtered.reduce((s, d) => s + d.hardwareRevenue, 0);
  const saasSales = filtered.reduce((s, d) => s + d.saasRevenue, 0);
  const totalExpenses = filtered.reduce((s, d) => s + d.expenses, 0);
  const totalCost = filtered.reduce((s, d) => s + d.hardwareCost + d.saasCost, 0);
  const totalOpex = filtered.reduce((s, d) => s + d.opex, 0);

  // Net cash after gateway + IIBB + COGS + opex
  const afterGateway = totalIncome * (1 - TAX_RATES.gateway.rate);
  const afterIIBB = afterGateway * (1 - TAX_RATES.iibb.rate);
  const netCash = afterIIBB - totalCost - totalOpex;

  // Period comparison
  const dayCount = Math.max(1, filtered.length);
  const prevEnd = new Date(dateRange.start);
  prevEnd.setDate(prevEnd.getDate() - 1);
  const prevStart = new Date(prevEnd);
  prevStart.setDate(prevStart.getDate() - dayCount);
  const prevFiltered = filterByDateRange(ALL_DAILY_DATA, { start: prevStart, end: prevEnd });
  const prevIncome = prevFiltered.reduce((s, d) => s + d.income, 0);
  const salesChange = prevIncome > 0 ? ((totalIncome - prevIncome) / prevIncome) * 100 : 0;

  // Stock simulation
  const lastDay = filtered[filtered.length - 1];
  const nfcStock = Math.max(50, 500 - Math.round((lastDay?.subscriptions || 100) * 1.3));
  const standsStock = Math.max(12, 150 - Math.round((lastDay?.units || 5) * 8));

  // Runway
  const avgDailyExpense = totalExpenses / dayCount;
  const currentCapital = Math.max(netCash, 450000);
  const runwayDays = Math.round(currentCapital / Math.max(1, avgDailyExpense));

  return {
    totalSales: totalIncome,
    hardwareSales,
    saasSales,
    salesChange: Math.round(salesChange * 10) / 10,
    netCash: Math.round(netCash),
    netCashChange: Math.round(salesChange * 0.65 * 10) / 10,
    grossIncome: totalIncome,
    totalExpenses,
    totalCost,
    nfcStock,
    standsStock,
    nfcStockMax: 500,
    standsStockMax: 150,
    runwayDays: Math.min(120, Math.max(8, runwayDays)),
    runwayAmount: Math.round(avgDailyExpense * 30),
    subscriptions: lastDay?.subscriptions || 0,
  };
}

export function getCashflowData(dateRange) {
  return filterByDateRange(ALL_DAILY_DATA, dateRange).map((d) => ({
    date: d.date,
    ingresos: d.income,
    gastos: d.expenses,
  }));
}

export function getOrders(dateRange) {
  return filterByDateRange(ALL_ORDERS, dateRange)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 100);
}

export function getActivityLog() {
  return [
    { id: 'act-1', action: 'Nuevo pedido completado', detail: 'ORD-1842 — Combo Stand + NFC', user: 'Sistema', timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(), type: 'order' },
    { id: 'act-2', action: 'Gasto marcado como pagado', detail: 'Servidores Julio — $45,000', user: 'admin@untoque.com', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), type: 'expense' },
    { id: 'act-3', action: 'Stock actualizado', detail: 'NFC A7: +200 unidades recibidas', user: 'admin@untoque.com', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), type: 'stock' },
    { id: 'act-4', action: 'Nuevo administrador creado', detail: 'operaciones@untoque.com', user: 'admin@untoque.com', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), type: 'user' },
    { id: 'act-5', action: 'Gasto futuro añadido', detail: 'Lote 500 Tarjetas China — $850,000', user: 'admin@untoque.com', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), type: 'expense' },
    { id: 'act-6', action: 'Alícuota IIBB actualizada', detail: 'Ajustada de 4.5% a 5%', user: 'admin@untoque.com', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), type: 'config' },
    { id: 'act-7', action: 'Pedido enviado', detail: 'ORD-1835 — Stand 3D Premium → Rosario', user: 'Sistema', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 80).toISOString(), type: 'order' },
    { id: 'act-8', action: 'Nueva suscripción SaaS', detail: 'Café Avellaneda — Plan mensual', user: 'Sistema', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(), type: 'subscription' },
    { id: 'act-9', action: 'Pago recibido', detail: 'MercadoPago — $37,500', user: 'Sistema', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 100).toISOString(), type: 'payment' },
    { id: 'act-10', action: 'Reporte mensual generado', detail: 'Junio 2026 — Revenue $3.2M', user: 'Sistema', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString(), type: 'report' },
  ];
}

export function computeTaxWaterfall(grossIncome, cogs) {
  const gateway = Math.round(grossIncome * TAX_RATES.gateway.rate);
  const afterGateway = grossIncome - gateway;

  const iibb = Math.round(afterGateway * TAX_RATES.iibb.rate);
  const afterIIBB = afterGateway - iibb;

  const afterCOGS = afterIIBB - cogs;

  const ganancias = Math.round(Math.max(0, afterCOGS) * TAX_RATES.ganancias.rate);
  const plataLimpia = afterCOGS - ganancias;

  return {
    grossIncome,
    steps: [
      { label: 'Ingreso Bruto', value: grossIncome, type: 'income' },
      { label: `Pasarela / MercadoPago (${TAX_RATES.gateway.rate * 100}%)`, value: -gateway, type: 'deduction' },
      { label: `Ingresos Brutos IIBB (${TAX_RATES.iibb.rate * 100}%)`, value: -iibb, type: 'deduction' },
      { label: 'Costo de Mercadería (Hardware + Fletes)', value: -cogs, type: 'cost' },
      { label: `Impuesto a las Ganancias (${TAX_RATES.ganancias.rate * 100}%)`, value: -ganancias, type: 'tax' },
    ],
    plataLimpia: Math.round(plataLimpia),
    breakdown: { gateway, iibb, cogs, ganancias },
  };
}

// ─── Currency Formatting ───

export function formatARS(value) {
  if (value == null) return '$0';
  const abs = Math.abs(value);
  const sign = value < 0 ? '-' : '';
  if (abs >= 1_000_000) return `${sign}$${(abs / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `${sign}$${Math.round(abs / 1_000)}K`;
  return `${sign}$${abs.toLocaleString('es-AR')}`;
}

export function formatARSFull(value) {
  if (value == null) return '$0';
  return `${value < 0 ? '-' : ''}$${Math.abs(Math.round(value)).toLocaleString('es-AR')}`;
}

export function formatDate(dateStr) {
  const date = new Date(dateStr + 'T12:00:00');
  return date.toLocaleDateString('es-AR', { day: 'numeric', month: 'short' });
}

export function formatDateFull(dateStr) {
  const date = new Date(dateStr + 'T12:00:00');
  return date.toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function timeAgo(timestamp) {
  const seconds = Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000);
  if (seconds < 60) return 'hace unos segundos';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `hace ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `hace ${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `hace ${days}d`;
  return `hace ${Math.floor(days / 7)} sem`;
}
