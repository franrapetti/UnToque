import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarClock, Plus, Check, Clock, Trash2, Calendar, CalendarDays, CalendarRange, User, Wallet } from 'lucide-react';
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

  const calculateBalances = () => {
    const balances = {};
    const allExpenses = [...expenses.byDay, ...expenses.byWeek, ...expenses.byMonth];
    allExpenses.forEach(exp => {
      if (exp.status === 'Pagado' && exp.paidBy && exp.paidBy.trim() !== '') {
        const name = exp.paidBy.trim();
        balances[name] = (balances[name] || 0) + exp.amount;
      }
    });
    return balances;
  };
  
  const balances = calculateBalances();

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
      {expense.status === 'Pagado' && expense.paidBy && (
        <div className="mt-3 pt-3 border-t border-black/5 dark:border-white/5 flex items-center gap-1.5 text-xs text-silver">
          <User size={12} />
          Pagado por: <span className="font-semibold text-sapphire dark:text-sapphire-light">{expense.paidBy}</span>
        </div>
      )}
    </motion.div>
  );

  return (
    <div className="glass-card p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="flex items-center gap-2">
          <CalendarClock className="text-sapphire w-6 h-6" />
          <h2 className="text-xl font-bold dark:text-ghost">Registro de Gastos</h2>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-emerald hover:bg-emerald/90 text-white px-4 py-2 rounded-lg font-medium transition-all"
        >
          <Plus size={18} />
          Añadir Gasto
        </button>
      </div>

      {Object.keys(balances).length > 0 && (
        <div className="mb-8 p-4 rounded-xl bg-gradient-to-br from-sapphire/5 to-emerald/5 border border-white/5">
          <div className="flex items-center gap-2 mb-3">
            <Wallet className="text-sapphire w-5 h-5" />
            <h3 className="font-semibold dark:text-ghost">Balance de Pagos (Bolsillo de Socios)</h3>
          </div>
          <div className="flex flex-wrap gap-4">
            {Object.entries(balances).map(([name, amount]) => (
              <div key={name} className="flex items-center gap-3 bg-white/50 dark:bg-black/20 px-4 py-2 rounded-lg border border-black/5 dark:border-white/5">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sapphire to-emerald flex items-center justify-center text-white font-bold text-sm">
                  {name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="text-xs text-silver">{name} pagó</div>
                  <div className="font-bold tabular-nums dark:text-ghost">{formatARSFull(amount)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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
