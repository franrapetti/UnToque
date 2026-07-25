import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Search, Filter } from 'lucide-react';
import { getOrders, formatARSFull } from '../data/mockData';
import { useFilter } from '../contexts/FilterContext';
import { useTheme } from '../ThemeContext';

export default function OrdersTable() {
  const { theme, isDark } = useTheme();
  const [activeTab, setActiveTab] = useState('Todos');
  const [search, setSearch] = useState('');
  const [visibleCount, setVisibleCount] = useState(20);
  
  const allOrders = getOrders();
  
  // Tabs and counts
  const tabs = ['Todos', 'Completado', 'Enviado', 'Pendiente'];
  const counts = {
    Todos: allOrders.length,
    Completado: allOrders.filter(o => o.status === 'completado').length,
    Enviado: allOrders.filter(o => o.status === 'enviado').length,
    Pendiente: allOrders.filter(o => o.status === 'pendiente').length,
  };

  // Filter
  const filteredOrders = allOrders.filter(order => {
    const matchesTab = activeTab === 'Todos' || order.status === activeTab.toLowerCase();
    const matchesSearch = order.customer.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const displayOrders = filteredOrders.slice(0, visibleCount);

  const getStatusBadge = (status) => {
    switch(status) {
      case 'completado': return 'badge-success';
      case 'enviado': return 'badge-info';
      case 'pendiente': return 'badge-warning';
      default: return 'badge-neutral';
    }
  };

  const getStatusText = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6"
    >
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <ShoppingBag className="text-sapphire w-6 h-6" />
          <h2 className="text-xl font-bold dark:text-ghost">Pedidos Recientes</h2>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
          <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-2 border ${
                  activeTab === tab 
                    ? 'bg-sapphire/20 border-sapphire text-sapphire' 
                    : 'bg-transparent border-white/10 text-silver hover:border-white/20'
                }`}
              >
                {tab}
                <span className="bg-black/10 dark:bg-white/10 px-1.5 py-0.5 rounded-full text-xs">
                  {counts[tab]}
                </span>
              </button>
            ))}
          </div>
          
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-silver" />
            <input 
              type="text" 
              placeholder="Buscar cliente..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-64 bg-black/5 dark:bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 outline-none focus:border-sapphire transition-colors dark:text-ghost text-sm"
            />
          </div>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/10 text-silver text-sm">
              <th className="pb-3 font-medium">ID</th>
              <th className="pb-3 font-medium">Cliente</th>
              <th className="pb-3 font-medium">Ciudad</th>
              <th className="pb-3 font-medium">Producto</th>
              <th className="pb-3 font-medium text-right">Monto</th>
              <th className="pb-3 font-medium text-center">Estado</th>
              <th className="pb-3 font-medium text-right">Fecha</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {displayOrders.map((order, i) => (
                <motion.tr 
                  key={order.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.02 }}
                  className="border-b border-white/5 last:border-0 group hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                >
                  <td className="py-4 text-sm font-mono text-silver">#{order.id}</td>
                  <td className="py-4 font-medium dark:text-ghost">{order.customer}</td>
                  <td className="py-4 text-sm text-silver">{order.city}</td>
                  <td className="py-4 text-sm dark:text-ghost">{order.product}</td>
                  <td className="py-4 text-right font-medium tabular-nums dark:text-ghost">{formatARSFull(order.amount)}</td>
                  <td className="py-4 text-center">
                    <span className={`badge ${getStatusBadge(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                  </td>
                  <td className="py-4 text-sm text-silver text-right">{order.date}</td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden flex flex-col gap-3">
        {displayOrders.map(order => (
          <div key={order.id} className="p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-white/5 flex flex-col gap-2">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium dark:text-ghost">{order.customer}</p>
                <p className="text-xs font-mono text-silver">#{order.id}</p>
              </div>
              <span className={`badge ${getStatusBadge(order.status)}`}>
                {getStatusText(order.status)}
              </span>
            </div>
            <p className="text-sm dark:text-ghost">{order.product} <span className="text-silver">•</span> {order.city}</p>
            <div className="flex justify-between items-center mt-2 pt-2 border-t border-white/10">
              <span className="text-xs text-silver">{order.date}</span>
              <span className="font-bold tabular-nums dark:text-ghost">{formatARSFull(order.amount)}</span>
            </div>
          </div>
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <div className="text-center py-10 text-silver">
          <Filter size={32} className="mx-auto mb-3 opacity-50" />
          <p>No se encontraron pedidos con esos filtros.</p>
        </div>
      )}

      {filteredOrders.length > visibleCount && (
        <div className="mt-6 flex justify-center">
          <button 
            onClick={() => setVisibleCount(prev => prev + 20)}
            className="px-6 py-2 rounded-xl font-medium border border-white/10 text-silver hover:text-ghost hover:border-white/20 transition-all bg-black/5 dark:bg-white/5"
          >
            Ver más pedidos
          </button>
        </div>
      )}
    </motion.div>
  );
}
