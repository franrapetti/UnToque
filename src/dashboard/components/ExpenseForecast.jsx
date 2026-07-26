import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarClock, Plus, Check, Clock, Trash2, Calendar, CalendarDays, CalendarRange } from 'lucide-react';
import { getExpensesByTemporality, updateExpense, deleteExpense } from '../data/expenseStore';
import AddExpenseModal from './AddExpenseModal';
import { formatARSFull } from '../data/mockData';
import { useTheme } from '../ThemeContext';

export default function ExpenseForecast() {
  const { theme, isDark } = useTheme();
  const [expenses, setExpenses] = useState({ byDay: [], byWeek: [], byMonth: [] });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const refreshExpenses = async () => {
    const data = await getExpensesByTemporality();
    setExpenses(data);
  };

  useEffect(() => {
    refreshExpenses();
  }, []);

  const toggleStatus = async (expense) => {
    await updateExpense(expense.id, {
      status: expense.status === 'Pendiente' ? 'Pagado' : 'Pendiente'
    });
    await refreshExpenses();
    window.dispatchEvent(new Event('expenses-updated'));
  };

  const handleDelete = async (id) => {
    await deleteExpense(id);
    await refreshExpenses();
    window.dispatchEvent(new Event('expenses-updated'));
  };

  const ExpenseCard = ({ expense }) => (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="glass-card glass-hover p-4 rounded-xl relative group"
    >
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-semibold dark:text-ghost truncate pr-6">{expense.name}</h4>
        <button 
          onClick={() => handleDelete(expense.id)}
          className="absolute top-4 right-4 text-silver hover:text-coral transition-colors opacity-0 group-hover:opacity-100"
        >
          <Trash2 size={16} />
        </button>
      </div>
      <div className="text-lg font-bold tabular-nums mb-3 dark:text-ghost">
        {formatARSFull(expense.amount)}
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-silver flex items-center gap-1">
          <Clock size={14} />
          {expense.date || expense.week || expense.month}
        </span>
        <button
          onClick={() => toggleStatus(expense)}
          className={`px-2 py-1 rounded-full text-xs font-medium transition-colors ${
            expense.status === 'Pendiente' 
              ? 'bg-amber-soft text-amber border border-amber/20' 
              : 'bg-emerald-light text-emerald border border-emerald/20'
          }`}
        >
          {expense.status === 'Pendiente' ? '🟡 Pendiente' : '✅ Pagado'}
        </button>
      </div>
    </motion.div>
  );

  return (
    <div className="glass-card p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="flex items-center gap-2">
          <CalendarClock className="text-sapphire w-6 h-6" />
          <h2 className="text-xl font-bold dark:text-ghost">Gastos por Venir — Cashflow Forecast</h2>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-emerald hover:bg-emerald/90 text-white px-4 py-2 rounded-lg font-medium transition-all"
        >
          <Plus size={18} />
          Añadir Gasto Futuro
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Day Column */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="text-silver w-5 h-5" />
            <h3 className="font-semibold text-silver">Por Día Exacto</h3>
          </div>
          <div className="flex flex-col gap-3 min-h-[200px] p-2 rounded-xl bg-black/5 dark:bg-white/5 border border-white/5">
            <AnimatePresence>
              {expenses.byDay.map(exp => (
                <ExpenseCard key={exp.id} expense={exp} />
              ))}
              {expenses.byDay.length === 0 && (
                <div className="text-center text-silver text-sm py-8 opacity-50">Sin gastos pendientes</div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Week Column */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 mb-2">
            <CalendarDays className="text-silver w-5 h-5" />
            <h3 className="font-semibold text-silver">Por Semana</h3>
          </div>
          <div className="flex flex-col gap-3 min-h-[200px] p-2 rounded-xl bg-black/5 dark:bg-white/5 border border-white/5">
            <AnimatePresence>
              {expenses.byWeek.map(exp => (
                <ExpenseCard key={exp.id} expense={exp} />
              ))}
              {expenses.byWeek.length === 0 && (
                <div className="text-center text-silver text-sm py-8 opacity-50">Sin gastos pendientes</div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Month Column */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 mb-2">
            <CalendarRange className="text-silver w-5 h-5" />
            <h3 className="font-semibold text-silver">Por Mes</h3>
          </div>
          <div className="flex flex-col gap-3 min-h-[200px] p-2 rounded-xl bg-black/5 dark:bg-white/5 border border-white/5">
            <AnimatePresence>
              {expenses.byMonth.map(exp => (
                <ExpenseCard key={exp.id} expense={exp} />
              ))}
              {expenses.byMonth.length === 0 && (
                <div className="text-center text-silver text-sm py-8 opacity-50">Sin gastos pendientes</div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <AddExpenseModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAdded={refreshExpenses} 
      />
    </div>
  );
}
