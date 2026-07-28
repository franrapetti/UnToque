import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, DollarSign, Calendar, CalendarDays, CalendarRange, Tag, User } from 'lucide-react';
import { addExpense } from '../data/expenseStore';
import { useTheme } from '../ThemeContext';

export default function AddExpenseModal({ isOpen, onClose, onAdded }) {
  const { isDark } = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    temporality: 'day', // day, week, month
    dateValue: '',
    status: 'Pendiente',
    category: 'operations',
    paidBy: ''
  });
  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Requerido';
    if (!formData.amount) newErrors.amount = 'Requerido';
    if (!formData.dateValue) newErrors.dateValue = 'Requerido';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    await addExpense({
      name: formData.name,
      amount: parseFloat(formData.amount),
      temporality: formData.temporality,
      [formData.temporality === 'day' ? 'date' : formData.temporality === 'week' ? 'week' : 'month']: formData.dateValue,
      status: formData.status,
      category: formData.category,
      paidBy: formData.status === 'Pagado' ? formData.paidBy : ''
    });

    onAdded();
    window.dispatchEvent(new Event('expenses-updated'));
    onClose();
    setFormData({
      name: '',
      amount: '',
      temporality: 'day',
      dateValue: '',
      status: 'Pendiente',
      category: 'operations',
      paidBy: ''
    });
  };

  return (
    <div className="modal-backdrop fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-[#0a0a0a] w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl border border-black/10 dark:border-white/10 relative"
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold dark:text-ghost">Añadir Gasto</h3>
            <button onClick={onClose} className="text-silver hover:text-ghost transition-colors">
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label-text block mb-1">Nombre del gasto</label>
              <input 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ej. Alquiler Oficina"
                className="w-full bg-black/5 dark:bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 outline-none focus:border-emerald transition-colors dark:text-ghost"
              />
              {errors.name && <span className="text-coral text-xs mt-1">{errors.name}</span>}
            </div>

            <div>
              <label className="label-text block mb-1">Monto estimado</label>
              <div className="relative">
                <DollarSign size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-silver" />
                <input 
                  type="number" 
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="0.00"
                  className="w-full bg-black/5 dark:bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 outline-none focus:border-emerald transition-colors dark:text-ghost tabular-nums"
                />
              </div>
              {errors.amount && <span className="text-coral text-xs mt-1">{errors.amount}</span>}
            </div>

            <div>
              <label className="label-text block mb-2">Temporalidad</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, temporality: 'day', dateValue: '' }))}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                    formData.temporality === 'day' 
                      ? 'bg-emerald/10 border-emerald/50 text-emerald dark:border-emerald' 
                      : 'bg-black/5 dark:bg-white/5 border-white/10 text-silver hover:border-white/20'
                  }`}
                >
                  <Calendar size={20} className="mb-1" />
                  <span className="text-xs font-medium">Día Específico</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, temporality: 'week', dateValue: '' }))}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                    formData.temporality === 'week' 
                      ? 'bg-sapphire/10 border-sapphire/50 text-sapphire dark:border-sapphire' 
                      : 'bg-black/5 dark:bg-white/5 border-white/10 text-silver hover:border-white/20'
                  }`}
                >
                  <CalendarDays size={20} className="mb-1" />
                  <span className="text-xs font-medium">Semana del Mes</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, temporality: 'month', dateValue: '' }))}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                    formData.temporality === 'month' 
                      ? 'bg-violet/10 border-violet/50 text-violet dark:border-violet' 
                      : 'bg-black/5 dark:bg-white/5 border-white/10 text-silver hover:border-white/20'
                  }`}
                >
                  <CalendarRange size={20} className="mb-1" />
                  <span className="text-xs font-medium">Mes Completo</span>
                </button>
              </div>

              <div className="mt-3">
                <input 
                  type={formData.temporality === 'day' ? 'date' : formData.temporality === 'week' ? 'week' : 'month'}
                  name="dateValue"
                  value={formData.dateValue}
                  onChange={handleChange}
                  className="w-full bg-black/5 dark:bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 outline-none focus:border-emerald transition-colors dark:text-ghost"
                />
                {errors.dateValue && <span className="text-coral text-xs mt-1">{errors.dateValue}</span>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label-text block mb-1">Estado</label>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, status: prev.status === 'Pendiente' ? 'Pagado' : 'Pendiente' }))}
                  className={`w-full py-2.5 rounded-xl border font-medium transition-all ${
                    formData.status === 'Pendiente' 
                      ? 'bg-amber/10 border-amber/50 text-amber dark:border-amber' 
                      : 'bg-emerald/10 border-emerald/50 text-emerald dark:border-emerald'
                  }`}
                >
                  {formData.status === 'Pendiente' ? '🟡 Pendiente' : '✅ Pagado'}
                </button>
              </div>

              <div>
                <label className="label-text block mb-1">Categoría</label>
                <div className="relative">
                  <Tag size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-silver" />
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full bg-black/5 dark:bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 outline-none focus:border-emerald transition-colors dark:text-ghost appearance-none"
                  >
                    <option value="operations">Operaciones</option>
                    <option value="inventory">Inventario</option>
                    <option value="payroll">Sueldos</option>
                    <option value="marketing">Marketing</option>
                    <option value="logistics">Logística</option>
                    <option value="design">Diseño</option>
                    <option value="admin">Administrativo</option>
                    <option value="materials">Materiales</option>
                  </select>
                </div>
              </div>
            </div>

            <AnimatePresence>
              {formData.status === 'Pagado' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <label className="label-text block mb-1">¿Quién lo pagó?</label>
                  <div className="relative">
                    <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-silver" />
                    <input 
                      type="text" 
                      name="paidBy"
                      value={formData.paidBy}
                      onChange={handleChange}
                      placeholder="Ej. Fran, Caja, Juan"
                      className="w-full bg-black/5 dark:bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 outline-none focus:border-emerald transition-colors dark:text-ghost"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl font-medium text-silver hover:text-ghost transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl font-medium text-white bg-gradient-to-r from-emerald to-[#10b981] hover:brightness-110 shadow-lg shadow-emerald/20 transition-all"
              >
                Añadir Gasto
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
