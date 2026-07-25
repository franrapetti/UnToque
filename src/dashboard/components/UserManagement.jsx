import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, UserPlus, Trash2, Shield, ShieldCheck, X, Loader2 } from 'lucide-react';
import { getUsersPublic, addUser, deleteUser } from '../../auth/userStore';
import { useAuth } from '../../auth/AuthContext';
import { useTheme } from '../ThemeContext';
import { timeAgo } from '../data/mockData';

export default function UserManagement() {
  const { theme, isDark } = useTheme();
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'admin' });
  const [errors, setErrors] = useState({});

  const refreshUsers = () => {
    setUsers(getUsersPublic());
  };

  useEffect(() => {
    refreshUsers();
  }, []);

  const handleDelete = (id, role) => {
    if (role === 'superadmin') return;
    if (window.confirm('¿Estás seguro de eliminar a este administrador?')) {
      deleteUser(id);
      refreshUsers();
    }
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Requerido';
    if (!formData.email) newErrors.email = 'Requerido';
    if (!formData.password || formData.password.length < 6) newErrors.password = 'Mínimo 6 caracteres';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    addUser({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role,
      createdBy: currentUser?.name || 'Sistema'
    });
    
    setIsAdding(false);
    setFormData({ name: '', email: '', password: '', role: 'admin' });
    refreshUsers();
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6"
    >
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Users className="text-sapphire w-6 h-6" />
          <h2 className="text-xl font-bold dark:text-ghost">Gestión de Administradores</h2>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 bg-black/5 hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10 px-4 py-2 rounded-lg transition-colors font-medium dark:text-ghost"
        >
          {isAdding ? <X size={18} /> : <UserPlus size={18} />}
          {isAdding ? 'Cancelar' : 'Nuevo Admin'}
        </button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-6"
          >
            <form onSubmit={handleAddSubmit} className="p-4 rounded-xl border border-white/10 bg-black/5 dark:bg-white/5 flex flex-col gap-4">
              <h3 className="font-semibold dark:text-ghost">Crear Nuevo Administrador</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <input
                    type="text"
                    placeholder="Nombre"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-transparent border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-emerald dark:text-ghost"
                  />
                  {errors.name && <span className="text-coral text-xs mt-1">{errors.name}</span>}
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-transparent border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-emerald dark:text-ghost"
                  />
                  {errors.email && <span className="text-coral text-xs mt-1">{errors.email}</span>}
                </div>
                <div>
                  <input
                    type="password"
                    placeholder="Contraseña"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full bg-transparent border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-emerald dark:text-ghost"
                  />
                  {errors.password && <span className="text-coral text-xs mt-1">{errors.password}</span>}
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-emerald text-white px-6 py-2 rounded-lg font-medium hover:bg-emerald/90 transition-colors"
                >
                  Crear Admin
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/10 text-silver text-sm">
              <th className="pb-3 font-medium">Usuario</th>
              <th className="pb-3 font-medium">Rol</th>
              <th className="pb-3 font-medium">Registro</th>
              <th className="pb-3 font-medium text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {users.map(user => (
                <motion.tr 
                  key={user.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="border-b border-white/5 last:border-0 group hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                >
                  <td className="py-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald/20 flex items-center justify-center text-emerald font-bold uppercase">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium dark:text-ghost">{user.name}</p>
                      <p className="text-sm text-silver">{user.email}</p>
                    </div>
                  </td>
                  <td className="py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                      user.role === 'superadmin' 
                        ? 'bg-emerald-light border-emerald text-emerald' 
                        : 'bg-sapphire/20 border-sapphire text-sapphire'
                    }`}>
                      {user.role === 'superadmin' ? <ShieldCheck size={14} /> : <Shield size={14} />}
                      {user.role}
                    </span>
                  </td>
                  <td className="py-4">
                    <p className="text-sm dark:text-ghost">Creado: {timeAgo(user.createdAt)}</p>
                    <p className="text-xs text-silver">Por: {user.createdBy}</p>
                  </td>
                  <td className="py-4 text-right">
                    <button
                      onClick={() => handleDelete(user.id, user.role)}
                      disabled={user.role === 'superadmin'}
                      className={`p-2 rounded-lg transition-colors ${
                        user.role === 'superadmin' 
                          ? 'opacity-30 cursor-not-allowed' 
                          : 'text-silver hover:text-coral hover:bg-coral/10'
                      }`}
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
