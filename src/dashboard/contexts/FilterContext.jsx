import { createContext, useContext, useState, useMemo } from 'react';

const FilterContext = createContext(null);

export const FILTER_OPTIONS = [
  { key: 'today', label: 'Hoy' },
  { key: 'week', label: 'Esta Semana' },
  { key: 'month', label: 'Este Mes' },
  { key: 'last30', label: 'Últimos 30 días' },
  { key: 'ytd', label: 'YTD' },
  { key: 'custom', label: 'Personalizado' },
];

export function FilterProvider({ children }) {
  const [activeFilter, setActiveFilter] = useState('last30');
  const [customRange, setCustomRange] = useState({ start: '', end: '' });

  const dateRange = useMemo(() => {
    const now = new Date();
    const end = new Date(now);
    end.setHours(23, 59, 59, 999);

    switch (activeFilter) {
      case 'today': {
        const start = new Date(now);
        start.setHours(0, 0, 0, 0);
        return { start, end, label: 'Hoy' };
      }
      case 'week': {
        const start = new Date(now);
        const day = start.getDay();
        start.setDate(start.getDate() - (day === 0 ? 6 : day - 1));
        start.setHours(0, 0, 0, 0);
        return { start, end, label: 'Esta Semana' };
      }
      case 'month': {
        const start = new Date(now.getFullYear(), now.getMonth(), 1);
        return { start, end, label: 'Este Mes' };
      }
      case 'ytd': {
        const start = new Date(now.getFullYear(), 0, 1);
        return { start, end, label: 'YTD' };
      }
      case 'custom': {
        if (customRange.start && customRange.end) {
          return {
            start: new Date(customRange.start),
            end: new Date(customRange.end + 'T23:59:59.999'),
            label: 'Personalizado',
          };
        }
        // Fall through to last30 if custom not set
      }
      // eslint-disable-next-line no-fallthrough
      case 'last30':
      default: {
        const start = new Date(now);
        start.setDate(start.getDate() - 30);
        start.setHours(0, 0, 0, 0);
        return { start, end, label: 'Últimos 30 días' };
      }
    }
  }, [activeFilter, customRange]);

  return (
    <FilterContext.Provider
      value={{
        activeFilter,
        setActiveFilter,
        customRange,
        setCustomRange,
        dateRange,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
}

export function useFilter() {
  const ctx = useContext(FilterContext);
  if (!ctx) throw new Error('useFilter must be used within FilterProvider');
  return ctx;
}
