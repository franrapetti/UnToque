import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { getCashflowData, formatARS, formatDate } from '../data/mockData';
import { useFilter } from '../contexts/FilterContext';
import { useTheme } from '../ThemeContext';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';

export default function CashflowChart() {
  const { theme, isDark } = useTheme();
  const data = getCashflowData();

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const income = payload.find(p => p.dataKey === 'ingresos')?.value || 0;
      const expense = payload.find(p => p.dataKey === 'gastos')?.value || 0;
      const diff = income - expense;
      
      return (
        <div className="glass-card p-4 rounded-xl border border-white/10 dark:text-ghost">
          <p className="font-semibold mb-2">{formatDate(label)}</p>
          <div className="flex flex-col gap-1 text-sm tabular-nums">
            <div className="flex justify-between gap-4">
              <span className="text-emerald">Ingresos:</span>
              <span>{formatARS(income)}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-coral">Gastos:</span>
              <span>{formatARS(expense)}</span>
            </div>
            <div className="w-full h-px bg-white/10 my-1"></div>
            <div className="flex justify-between gap-4 font-bold">
              <span className="text-silver">Diferencia:</span>
              <span className={diff >= 0 ? 'text-emerald' : 'text-coral'}>{formatARS(diff)}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6"
    >
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="text-emerald w-6 h-6" />
        <h2 className="text-xl font-bold dark:text-ghost">Flujo de Caja y Facturación</h2>
      </div>
      
      <div className="h-[380px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="gradientIncome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="gradientExpense" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} vertical={false} />
            <XAxis dataKey="date" tickFormatter={formatDate} stroke={isDark ? '#9ca3af' : '#6b7280'} tick={{fontSize: 12}} />
            <YAxis tickFormatter={(val) => formatARS(val)} stroke={isDark ? '#9ca3af' : '#6b7280'} width={80} tick={{fontSize: 12}} />
            <Tooltip content={<CustomTooltip />} />
            <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
            <Area type="monotone" dataKey="ingresos" stroke="#10b981" fillOpacity={1} fill="url(#gradientIncome)" strokeWidth={2} name="Ingresos" />
            <Area type="monotone" dataKey="gastos" stroke="#ef4444" fillOpacity={1} fill="url(#gradientExpense)" strokeWidth={2} name="Gastos" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
