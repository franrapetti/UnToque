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
  return { dailyData: [], orders: [] };
}

const { dailyData: ALL_DAILY_DATA, orders: ALL_ORDERS } = generateAllData();

// ─── Filtering ───
export function filterByDateRange(data, dateRange) {
  if (!dateRange) return data;
  const { start, end } = dateRange;
  return data.filter((d) => {
    const date = new Date(d.date);
    return date >= start && date <= end;
  });
}

// ─── Exported Data Functions ───

export function getKPIs(dateRange) {
  return {
    totalSales: 0, hardwareSales: 0, saasSales: 0, salesChange: 0,
    netCash: 0, netCashChange: 0, grossIncome: 0, totalExpenses: 0,
    totalCost: 0, nfcStock: 0, standsStock: 0,
    nfcStockMax: 500, standsStockMax: 150,
    runwayDays: 0, runwayAmount: 0, subscriptions: 0,
  };
}

export function getCashflowData(dateRange) {
  return [];
}

export function getOrders(dateRange) {
  return [];
}

export function getActivityLog() {
  return [];
}

export function computeTaxWaterfall(grossIncome, cogs) {
  const gateway = Math.round(grossIncome * TAX_RATES.gateway.rate);
  const afterGateway = grossIncome - gateway;

  const iibb = Math.round(afterGateway * TAX_RATES.iibb.rate);
  const afterIIBB = afterGateway - iibb;

  const afterCOGS = afterIIBB - cogs;

  const ganancias = Math.round(Math.max(0, afterCOGS) * TAX_RATES.ganancias.rate);
  const plataLimpia = afterCOGS - ganancias;

  const getPct = (val) => grossIncome > 0 ? (Math.abs(val) / grossIncome) * 100 : 0;

  return {
    grossIncome,
    steps: [
      { label: 'Ingreso Bruto', value: grossIncome, type: 'income', percentage: 100 },
      { label: `Pasarela / MercadoPago (${TAX_RATES.gateway.rate * 100}%)`, value: -gateway, type: 'deduction', percentage: getPct(gateway) },
      { label: `Ingresos Brutos IIBB (${TAX_RATES.iibb.rate * 100}%)`, value: -iibb, type: 'deduction', percentage: getPct(iibb) },
      { label: 'Costo de Mercadería (Hardware + Fletes)', value: -cogs, type: 'cost', percentage: getPct(cogs) },
      { label: `Impuesto a las Ganancias (${TAX_RATES.ganancias.rate * 100}%)`, value: -ganancias, type: 'tax', percentage: getPct(ganancias) },
      { label: 'Plata Limpia (Caja Neta)', value: plataLimpia, type: 'final', percentage: getPct(plataLimpia) },
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
