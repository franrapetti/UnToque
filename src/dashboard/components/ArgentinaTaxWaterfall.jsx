import React from 'react';
import { motion } from 'framer-motion';
import { Receipt, Info } from 'lucide-react';
import { computeTaxWaterfall, formatARSFull, getKPIs } from '../data/mockData';
import { useFilter } from '../contexts/FilterContext';
import { useTheme } from '../ThemeContext';

export default function ArgentinaTaxWaterfall() {
  const { theme, isDark } = useTheme();
  const { dateRange } = useFilter();
  const kpis = getKPIs(dateRange);
  const waterfall = computeTaxWaterfall(kpis.grossIncome, kpis.totalCost);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6"
    >
      <div className="flex items-center gap-2 mb-6">
        <Receipt className="text-coral w-6 h-6" />
        <h2 className="text-xl font-bold dark:text-ghost">Costos e Impuestos (Argentina)</h2>
      </div>

      <div className="space-y-3 relative">
        {waterfall.steps.map((item, index) => {
          const isInitial = index === 0;
          const isFinal = index === waterfall.steps.length - 1;
          const isDeduction = !isInitial && !isFinal;
          
          return (
            <motion.div 
              key={item.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex flex-col relative group ${isFinal ? 'mt-6 pt-6 border-t border-white/10' : ''}`}
            >
              <div className="flex justify-between items-center z-10 mb-1">
                <div className="flex items-center gap-2">
                  <span className={`font-medium ${isFinal ? 'text-xl font-bold text-emerald' : 'dark:text-ghost'}`}>
                    {item.label}
                  </span>
                  {item.tooltip && (
                    <div className="relative cursor-help" title={item.tooltip}>
                      <Info size={14} className="text-silver hover:text-ghost transition-colors" />
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-4 tabular-nums">
                  {item.percentage > 0 && !isInitial && !isFinal && (
                    <span className="text-sm text-silver">({item.percentage.toFixed(1)}%)</span>
                  )}
                  <span className={`font-bold ${isFinal ? 'text-2xl text-emerald' : isDeduction ? 'text-coral' : 'dark:text-ghost'}`}>
                    {isDeduction ? '-' : ''}{formatARSFull(Math.abs(item.value))}
                  </span>
                </div>
              </div>
              
              <div className="h-2 w-full bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.max(2, item.percentage || 100)}%` }}
                  transition={{ delay: index * 0.1 + 0.2, duration: 0.8, ease: "easeOut" }}
                  className={`h-full rounded-full ${
                    isInitial ? 'bg-emerald' : 
                    isFinal ? 'bg-emerald glow-emerald' : 
                    'bg-coral'
                  }`}
                  style={{ marginLeft: isDeduction ? 'auto' : '0' }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
