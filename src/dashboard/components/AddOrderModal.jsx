import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, DollarSign, User, MapPin, Package, Hash, CreditCard } from 'lucide-react';
import { addOrder } from '../data/orderStore';
import { getProductsCached } from '../data/catalogStore';
import { useTheme } from '../ThemeContext';

export default function AddOrderModal({ isOpen, onClose, onAdded }) {
  const { isDark } = useTheme();
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    customer: '',
    city: '',
    productId: '',
    quantity: 1,
    paymentMethod: 'cash', // cash, gateway
    amount: '',
    status: 'completado', // pendiente, enviado, completado
    date: new Date().toISOString().split('T')[0]
  });
  const [errors, setErrors] = useState({});
  const [autoAmount, setAutoAmount] = useState(true);

  useEffect(() => {
    if (isOpen) {
      const prodList = getProductsCached();
      setProducts(prodList);
      if (prodList.length > 0 && !formData.productId) {
        setFormData(prev => ({ ...prev, productId: prodList[0].id }));
      }
    }
  }, [isOpen]);

  useEffect(() => {
    // Auto-calculate amount if user hasn't manually overridden it
    if (autoAmount && formData.productId) {
      const product = products.find(p => p.id === formData.productId);
      if (product) {
        const unitPrice = formData.paymentMethod === 'cash' ? product.price_cash : product.price_list;
        const total = unitPrice * (parseInt(formData.quantity) || 1);
        setFormData(prev => ({ ...prev, amount: total.toString() }));
      }
    }
  }, [formData.productId, formData.quantity, formData.paymentMethod, products, autoAmount]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (name === 'amount') {
      setAutoAmount(false); // Stop auto-calculating if user edits amount manually
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.customer) newErrors.customer = 'Requerido';
    if (!formData.city) newErrors.city = 'Requerido';
    if (!formData.productId) newErrors.productId = 'Requerido';
    if (!formData.amount) newErrors.amount = 'Requerido';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const product = products.find(p => p.id === formData.productId);

    await addOrder({
      customer: formData.customer,
      city: formData.city,
      productId: formData.productId,
      product: product ? product.name : 'Producto Desconocido',
      quantity: parseInt(formData.quantity) || 1,
      paymentMethod: formData.paymentMethod,
      amount: parseFloat(formData.amount),
      status: formData.status,
      date: formData.date
    });

    onAdded();
    onClose();
    setFormData({
      customer: '',
      city: '',
      productId: products.length > 0 ? products[0].id : '',
      quantity: 1,
      paymentMethod: 'cash',
      amount: '',
      status: 'completado',
      date: new Date().toISOString().split('T')[0]
    });
    setAutoAmount(true);
  };

  return (
    <div className="modal-backdrop fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-[#0a0a0a] w-full max-w-xl rounded-2xl overflow-hidden shadow-2xl border border-black/10 dark:border-white/10 relative max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold dark:text-ghost">Registrar Nueva Venta</h3>
            <button onClick={onClose} className="text-silver hover:text-ghost transition-colors">
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Cliente y Ciudad */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label-text block mb-1">Cliente</label>
                <div className="relative">
                  <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-silver" />
                  <input 
                    type="text" 
                    name="customer"
                    value={formData.customer}
                    onChange={handleChange}
                    placeholder="Nombre y Apellido"
                    className="w-full bg-black/5 dark:bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 outline-none focus:border-sapphire transition-colors dark:text-ghost"
                  />
                </div>
                {errors.customer && <span className="text-coral text-xs mt-1">{errors.customer}</span>}
              </div>
              <div>
                <label className="label-text block mb-1">Ciudad / Envío</label>
                <div className="relative">
                  <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-silver" />
                  <input 
                    type="text" 
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Ej. CABA, Palermo"
                    className="w-full bg-black/5 dark:bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 outline-none focus:border-sapphire transition-colors dark:text-ghost"
                  />
                </div>
                {errors.city && <span className="text-coral text-xs mt-1">{errors.city}</span>}
              </div>
            </div>

            {/* Producto y Cantidad */}
            <div className="grid grid-cols-[2fr_1fr] gap-4">
              <div>
                <label className="label-text block mb-1">Producto</label>
                <div className="relative">
                  <Package size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-silver" />
                  <select
                    name="productId"
                    value={formData.productId}
                    onChange={handleChange}
                    className="w-full bg-black/5 dark:bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 outline-none focus:border-sapphire transition-colors dark:text-ghost appearance-none"
                  >
                    {products.length === 0 && <option value="">Sin productos en catálogo</option>}
                    {products.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
                {errors.productId && <span className="text-coral text-xs mt-1">{errors.productId}</span>}
              </div>
              <div>
                <label className="label-text block mb-1">Cantidad</label>
                <div className="relative">
                  <Hash size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-silver" />
                  <input 
                    type="number" 
                    name="quantity"
                    min="1"
                    value={formData.quantity}
                    onChange={handleChange}
                    className="w-full bg-black/5 dark:bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 outline-none focus:border-sapphire transition-colors dark:text-ghost tabular-nums"
                  />
                </div>
              </div>
            </div>

            {/* Medio de Pago */}
            <div>
              <label className="label-text block mb-2">Medio de Pago</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'cash' }))}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                    formData.paymentMethod === 'cash' 
                      ? 'bg-emerald/10 border-emerald/50 text-emerald dark:border-emerald' 
                      : 'bg-black/5 dark:bg-white/5 border-white/10 text-silver hover:border-white/20'
                  }`}
                >
                  <DollarSign size={20} className="mb-1" />
                  <span className="text-xs font-medium">Efectivo / Transf.</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'gateway' }))}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                    formData.paymentMethod === 'gateway' 
                      ? 'bg-sapphire/10 border-sapphire/50 text-sapphire dark:border-sapphire' 
                      : 'bg-black/5 dark:bg-white/5 border-white/10 text-silver hover:border-white/20'
                  }`}
                >
                  <CreditCard size={20} className="mb-1" />
                  <span className="text-xs font-medium">Pasarela (Tarjeta)</span>
                </button>
              </div>
            </div>

            {/* Monto y Fecha */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label-text block mb-1">Monto Total Cobrado</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-silver font-medium">$</span>
                  <input 
                    type="number" 
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    placeholder="0.00"
                    className="w-full bg-black/5 dark:bg-white/5 border border-white/10 rounded-xl pl-8 pr-4 py-2.5 outline-none focus:border-sapphire transition-colors dark:text-ghost tabular-nums font-bold text-lg"
                  />
                </div>
                {errors.amount && <span className="text-coral text-xs mt-1">{errors.amount}</span>}
              </div>
              <div>
                <label className="label-text block mb-1">Fecha</label>
                <input 
                  type="date" 
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full bg-black/5 dark:bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 outline-none focus:border-sapphire transition-colors dark:text-ghost h-[46px]"
                />
              </div>
            </div>

            {/* Estado */}
            <div>
              <label className="label-text block mb-2">Estado del Pedido</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, status: 'pendiente' }))}
                  className={`py-2 rounded-xl border text-sm font-medium transition-all ${
                    formData.status === 'pendiente' 
                      ? 'bg-amber/10 border-amber/50 text-amber dark:border-amber' 
                      : 'bg-black/5 dark:bg-white/5 border-white/10 text-silver hover:border-white/20'
                  }`}
                >
                  🟡 Pendiente
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, status: 'enviado' }))}
                  className={`py-2 rounded-xl border text-sm font-medium transition-all ${
                    formData.status === 'enviado' 
                      ? 'bg-cyan/10 border-cyan/50 text-cyan dark:border-cyan' 
                      : 'bg-black/5 dark:bg-white/5 border-white/10 text-silver hover:border-white/20'
                  }`}
                >
                  🚚 Enviado
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, status: 'completado' }))}
                  className={`py-2 rounded-xl border text-sm font-medium transition-all ${
                    formData.status === 'completado' 
                      ? 'bg-emerald/10 border-emerald/50 text-emerald dark:border-emerald' 
                      : 'bg-black/5 dark:bg-white/5 border-white/10 text-silver hover:border-white/20'
                  }`}
                >
                  ✅ Completado
                </button>
              </div>
            </div>

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
                className="px-5 py-2.5 rounded-xl font-medium text-white bg-gradient-to-r from-sapphire to-[#2563eb] hover:brightness-110 shadow-lg shadow-sapphire/20 transition-all"
              >
                Registrar Venta
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
