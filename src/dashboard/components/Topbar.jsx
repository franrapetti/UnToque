import React, { useState } from 'react';
import { useFilter } from '../contexts/FilterContext';
import { useTheme } from '../ThemeContext';
import { Calendar } from 'lucide-react';

export default function Topbar() {
  const { filter, setFilter, FILTER_OPTIONS } = useFilter();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Fallback options if FilterContext doesn't provide them
  const options = FILTER_OPTIONS || [
    { id: 'hoy', label: 'Hoy' },
    { id: '7d', label: '7D' },
    { id: '30d', label: '30D' },
    { id: 'ytd', label: 'YTD' },
    { id: 'personalizado', label: 'Personalizado' },
  ];

  return (
    <div className={`h-16 flex items-center justify-between px-6 sticky top-0 z-40 glass border-b ${isDark ? 'border-white/5' : 'border-black/5'} backdrop-blur-md`}>
      <h1 className="font-display font-bold text-xl tracking-tight">Centro de Mando</h1>
      
      <div className="flex items-center gap-2">
        <div className="flex items-center p-1 rounded-xl bg-black/5 dark:bg-white/5">
          {options.map((opt) => {
            const isActive = filter === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => setFilter(opt.id)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? isDark
                      ? 'bg-white/10 text-ghost shadow-sm border-b-2 border-emerald'
                      : 'bg-black/10 text-ink shadow-sm border-b-2 border-emerald'
                    : 'text-silver hover:bg-white/5 dark:hover:bg-white/5 hover:text-ink dark:hover:text-ghost'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
        
        {filter === 'personalizado' && (
          <div className="flex items-center gap-2 ml-2 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className={`flex items-center px-3 py-1.5 rounded-lg border ${isDark ? 'border-white/10 bg-white/5' : 'border-black/10 bg-white'}`}>
              <Calendar className="w-4 h-4 text-silver mr-2" />
              <input 
                type="date" 
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-transparent text-sm outline-none text-ink dark:text-ghost"
              />
            </div>
            <span className="text-silver">-</span>
            <div className={`flex items-center px-3 py-1.5 rounded-lg border ${isDark ? 'border-white/10 bg-white/5' : 'border-black/10 bg-white'}`}>
              <input 
                type="date" 
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-transparent text-sm outline-none text-ink dark:text-ghost"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
