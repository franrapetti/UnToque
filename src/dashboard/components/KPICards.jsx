import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Wallet, Package, Fuel, TrendingUp, TrendingDown } from 'lucide-react';
import { formatARS, formatARSFull, getKPIs } from '../data/mockData';
import { useFilter } from '../contexts/FilterContext';
import { useTheme } from '../ThemeContext';

export default function KPICards() {
  const { dateRange } = useFilter();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const data = getKPIs(dateRange) || {
    totalSales: 0,
    hardwareSales: 0,
    saasSales: 0,
    salesChange: 0,
    netCash: 0,
    netCashChange: 0,
    nfcStock: 0,
    nfcStockMax: 100,
    standsStock: 0,
    standsStockMax: 100,
    runwayDays: 0,
    runwayAmount: 0
  };

  const getStockColor = (current, max) => {
    const percent = (current / max) * 100;
    if (percent > 30) return 'bg-emerald';
    if (percent > 15) return 'bg-amber';
    return 'bg-coral';
  };

  const getRunwayColor = (days) => {
    if (days > 30) return 'bg-emerald text-emerald';
    if (days > 15) return 'bg-amber text-amber';
    return 'bg-coral text-coral';
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: (index) => ({
      opacity: 1, 
      y: 0, 
      transition: { delay: index * 0.1, duration: 0.5, ease: 'easeOut' }
    })
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {/* Card 1: Ventas Totales */}
      <motion.div 
        custom={0}
        initial="hidden"
        animate="show"
        variants={itemVariants}
        className="glass-card glow-emerald rounded-2xl p-6 relative overflow-hidden flex flex-col"
      >
        {isDark && (
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald/5 rounded-full blur-2xl pointer-events-none"></div>
        )}
        <div className="flex justify-between items-start mb-4 relative z-10">
          <div className="p-2 rounded-xl bg-emerald/10 text-emerald">
            <DollarSign className="w-6 h-6" />
          </div>
          <div className={`flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-full ${data.salesChange >= 0 ? 'bg-emerald/10 text-emerald' : 'bg-coral/10 text-coral'}`}>
            {data.salesChange >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            <span>{Math.abs(data.salesChange)}%</span>
          </div>
        </div>
        <div className="mb-1 label-text relative z-10">Ventas Totales</div>
        <div className="text-3xl font-bold tabular-nums metric-value mb-4 relative z-10">
          {formatARSFull(data.totalSales)}
        </div>
        <div className="flex gap-2 mt-auto relative z-10">
          <div className="text-xs px-2 py-1 rounded-md bg-black/5 dark:bg-white/5 text-silver">
            Hardware: {formatARS(data.hardwareSales)}
          </div>
          <div className="text-xs px-2 py-1 rounded-md bg-black/5 dark:bg-white/5 text-silver">
            SaaS: {formatARS(data.saasSales)}
          </div>
        </div>
      </motion.div>

      {/* Card 2: Caja Neta Real */}
      <motion.div 
        custom={1}
        initial="hidden"
        animate="show"
        variants={itemVariants}
        className="glass-card glow-sapphire rounded-2xl p-6 relative overflow-hidden flex flex-col"
      >
        {isDark && (
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-sapphire/5 rounded-full blur-2xl pointer-events-none"></div>
        )}
        <div className="flex justify-between items-start mb-4 relative z-10">
          <div className="p-2 rounded-xl bg-sapphire/10 text-sapphire">
            <Wallet className="w-6 h-6" />
          </div>
          <div className={`flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-full ${data.netCashChange >= 0 ? 'bg-emerald/10 text-emerald' : 'bg-coral/10 text-coral'}`}>
            {data.netCashChange >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            <span>{Math.abs(data.netCashChange)}%</span>
          </div>
        </div>
        <div className="mb-1 label-text relative z-10">Caja Neta Real</div>
        <div className="text-3xl font-bold tabular-nums metric-value text-emerald mb-2 relative z-10">
          {formatARSFull(data.netCash)}
        </div>
        <div className="text-xs text-silver mt-auto relative z-10">
          Después de pasarelas e impuestos
        </div>
      </motion.div>

      {/* Card 3: Stock Actual */}
      <motion.div 
        custom={2}
        initial="hidden"
        animate="show"
        variants={itemVariants}
        className="glass-card glow-violet rounded-2xl p-6 relative overflow-hidden flex flex-col"
      >
        {isDark && (
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-violet/5 rounded-full blur-2xl pointer-events-none"></div>
        )}
        <div className="flex justify-between items-start mb-4 relative z-10">
          <div className="p-2 rounded-xl bg-violet/10 text-violet">
            <Package className="w-6 h-6" />
          </div>
        </div>
        <div className="mb-4 label-text relative z-10">Stock Actual</div>
        
        <div className="space-y-4 mt-auto relative z-10">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-medium">NFC A7</span>
              <span className="tabular-nums text-silver">{data.nfcStock} u.</span>
            </div>
            <div className="h-1.5 w-full bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full ${getStockColor(data.nfcStock, data.nfcStockMax)}`} 
                style={{ width: `${Math.min(100, (data.nfcStock / data.nfcStockMax) * 100)}%` }}
              ></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-medium">Soportes 3D</span>
              <span className="tabular-nums text-silver">{data.standsStock} u.</span>
            </div>
            <div className="h-1.5 w-full bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full ${getStockColor(data.standsStock, data.standsStockMax)}`} 
                style={{ width: `${Math.min(100, (data.standsStock / data.standsStockMax) * 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Card 4: Runway / Alerta */}
      <motion.div 
        custom={3}
        initial="hidden"
        animate="show"
        variants={itemVariants}
        className="glass-card glow-amber rounded-2xl p-6 relative overflow-hidden flex flex-col"
      >
        {isDark && (
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber/5 rounded-full blur-2xl pointer-events-none"></div>
        )}
        <div className="flex justify-between items-start mb-4 relative z-10">
          <div className="p-2 rounded-xl bg-amber/10 text-amber">
            <Fuel className="w-6 h-6" />
          </div>
        </div>
        <div className="mb-1 label-text relative z-10">Runway / Alerta</div>
        <div className={`text-3xl font-bold tabular-nums metric-value mb-4 relative z-10 ${getRunwayColor(data.runwayDays).split(' ')[1]}`}>
          {data.runwayDays} días
        </div>
        
        <div className="mt-auto relative z-10">
          <div className="h-1.5 w-full bg-black/10 dark:bg-white/10 rounded-full overflow-hidden mb-2">
            <motion.div 
              className={`h-full rounded-full ${getRunwayColor(data.runwayDays).split(' ')[0]}`}
              style={{ width: `${Math.min(100, (data.runwayDays / 90) * 100)}%` }}
              animate={data.runwayDays <= 15 ? { opacity: [1, 0.5, 1] } : {}}
              transition={{ repeat: Infinity, duration: 1.5 }}
            ></motion.div>
          </div>
          <div className="text-xs text-silver">
            Capital necesario 30d: {formatARS(data.runwayAmount)}
          </div>
        </div>
      </motion.div>

    </div>
  );
}
