import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tag, Plus, Edit2, Trash2, X, Image as ImageIcon, Check } from 'lucide-react';
import { getProducts, addProduct, updateProduct, deleteProduct } from './data/catalogStore';
import { useTheme } from './ThemeContext';
import { formatARSFull } from './data/mockData';

export default function CatalogPage() {
  const { isDark } = useTheme();
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price_list: '',
    price_cash: '',
    stock: '',
    image: ''
  });

  useEffect(() => {
    setProducts(getProducts());
  }, []);

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        price_list: product.price_list.toString(),
        price_cash: product.price_cash.toString(),
        stock: product.stock.toString(),
        image: product.image || ''
      });
    } else {
      setEditingProduct(null);
      setFormData({ name: '', price_list: '', price_cash: '', stock: '', image: '' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const productData = {
      name: formData.name,
      price_list: parseFloat(formData.price_list) || 0,
      price_cash: parseFloat(formData.price_cash) || 0,
      stock: parseInt(formData.stock) || 0,
      image: formData.image
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, productData);
    } else {
      addProduct(productData);
    }
    setProducts(getProducts());
    handleCloseModal();
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Seguro que quieres eliminar este producto?')) {
      deleteProduct(id);
      setProducts(getProducts());
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto w-full min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold dark:text-ghost mb-2">Catálogo de Productos</h1>
          <p className="text-silver">Administra tu inventario y precios</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-white bg-gradient-to-r from-emerald to-[#10b981] hover:brightness-110 shadow-lg shadow-emerald/20 transition-all"
        >
          <Plus size={20} />
          Nuevo Producto
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence>
          {products.map(product => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="glass-card rounded-2xl overflow-hidden flex flex-col group relative"
            >
              <div className="h-48 bg-black/5 dark:bg-white/5 relative flex items-center justify-center overflow-hidden">
                {product.image ? (
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <Tag size={48} className="text-silver opacity-30" />
                )}
                <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleOpenModal(product)} className="p-2 rounded-lg bg-black/50 text-white backdrop-blur-md hover:bg-black/70 transition-colors">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => handleDelete(product.id)} className="p-2 rounded-lg bg-coral/80 text-white backdrop-blur-md hover:bg-coral transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="font-bold text-lg dark:text-ghost mb-4 line-clamp-2 leading-tight">{product.name}</h3>
                
                <div className="mt-auto space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-silver">Efectivo / Transferencia</span>
                    <span className="font-bold text-emerald">{formatARSFull(product.price_cash)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm border-t border-black/5 dark:border-white/5 pt-3">
                    <span className="text-silver">Precio Lista (Pasarela)</span>
                    <span className="font-medium dark:text-ghost">{formatARSFull(product.price_list)}</span>
                  </div>
                </div>
              </div>
              <div className="px-5 py-3 bg-black/5 dark:bg-white/5 border-t border-black/5 dark:border-white/5 flex justify-between items-center text-xs">
                <span className="text-silver">Stock disponible:</span>
                <span className={`font-mono font-medium px-2 py-1 rounded-md ${product.stock > 10 ? 'bg-sapphire/10 text-sapphire' : 'bg-coral/10 text-coral'}`}>
                  {product.stock} un.
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Product Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="modal-backdrop fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-[#0a0a0a] w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl border border-black/10 dark:border-white/10"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold dark:text-ghost">{editingProduct ? 'Editar Producto' : 'Añadir Producto'}</h3>
                  <button onClick={handleCloseModal} className="text-silver hover:text-ghost transition-colors">
                    <X size={24} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="label-text block mb-1">Nombre del producto</label>
                    <input 
                      type="text" 
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Ej. Combo NFC + Stand"
                      className="w-full bg-black/5 dark:bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 outline-none focus:border-sapphire transition-colors dark:text-ghost"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label-text block mb-1 text-emerald font-medium">Precio Efectivo/Transf.</label>
                      <input 
                        type="number" 
                        name="price_cash"
                        required
                        value={formData.price_cash}
                        onChange={handleChange}
                        placeholder="0"
                        className="w-full bg-black/5 dark:bg-white/5 border border-emerald/50 rounded-xl px-4 py-2.5 outline-none focus:border-emerald transition-colors dark:text-ghost tabular-nums"
                      />
                    </div>
                    <div>
                      <label className="label-text block mb-1">Precio Lista</label>
                      <input 
                        type="number" 
                        name="price_list"
                        required
                        value={formData.price_list}
                        onChange={handleChange}
                        placeholder="0"
                        className="w-full bg-black/5 dark:bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 outline-none focus:border-sapphire transition-colors dark:text-ghost tabular-nums"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label-text block mb-1">Stock</label>
                      <input 
                        type="number" 
                        name="stock"
                        required
                        value={formData.stock}
                        onChange={handleChange}
                        placeholder="0"
                        className="w-full bg-black/5 dark:bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 outline-none focus:border-sapphire transition-colors dark:text-ghost tabular-nums"
                      />
                    </div>
                    <div>
                      <label className="label-text block mb-1">URL Imagen (Opcional)</label>
                      <input 
                        type="url" 
                        name="image"
                        value={formData.image}
                        onChange={handleChange}
                        placeholder="https://..."
                        className="w-full bg-black/5 dark:bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 outline-none focus:border-sapphire transition-colors dark:text-ghost"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-6 mt-4 border-t border-black/10 dark:border-white/10">
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="px-5 py-2.5 rounded-xl font-medium text-silver hover:text-ghost transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl font-medium text-white bg-gradient-to-r from-sapphire to-[#2563eb] hover:brightness-110 shadow-lg shadow-sapphire/20 transition-all flex items-center gap-2"
                    >
                      <Check size={18} />
                      {editingProduct ? 'Guardar Cambios' : 'Añadir Producto'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
