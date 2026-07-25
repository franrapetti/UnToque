import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail, ArrowRight, Loader2, Eye, EyeOff } from 'lucide-react';
import { useAuth } from './AuthContext';
import logoSvg from '../../logo.svg';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Por favor, ingresa tu email y contraseña.');
      return;
    }

    setIsLoading(true);

    try {
      await login(email, password);
      // login will update context, which triggers the useEffect to redirect
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError('Credenciales inválidas. Por favor, intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-obsidian flex items-center justify-center p-4 selection:bg-emerald/30 selection:text-emerald-light">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md"
      >
        <div className="glass-card p-8 md:p-10 flex flex-col items-center">
          {/* Logo */}
          <div className="mb-8">
            <img src={logoSvg} alt="UnToque Logo" className="h-12 w-auto object-contain" />
          </div>

          {/* Header */}
          <div className="text-center mb-8 w-full">
            <h1 className="text-3xl font-bold text-ghost tracking-tight mb-2">
              Centro de Mando
            </h1>
            <p className="text-smoke text-sm">
              Acceso Administrador
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="w-full space-y-5">
            {/* Error Message */}
            {error && (
              <div className="bg-coral-soft/10 border border-coral-soft/20 rounded-lg p-3 text-coral text-sm text-center">
                {error}
              </div>
            )}

            {/* Email Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-dark uppercase tracking-wider pl-1">
                Correo Electrónico
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-dark group-focus-within:text-emerald transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@untoque.com"
                  className="w-full bg-void/50 border border-charcoal rounded-xl py-3 pl-10 pr-4 text-ghost placeholder-slate-dark focus:outline-none focus:border-emerald/50 focus:ring-1 focus:ring-emerald/50 transition-all duration-300"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center pl-1">
                <label className="text-xs font-medium text-slate-dark uppercase tracking-wider">
                  Contraseña
                </label>
                <a href="#" className="text-xs text-emerald hover:text-emerald-light transition-colors">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-dark group-focus-within:text-emerald transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-void/50 border border-charcoal rounded-xl py-3 pl-10 pr-10 text-ghost placeholder-slate-dark focus:outline-none focus:border-emerald/50 focus:ring-1 focus:ring-emerald/50 transition-all duration-300"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-dark hover:text-ghost transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-6 bg-gradient-to-r from-emerald to-[#0ea5e9] hover:from-emerald-light hover:to-[#38bdf8] text-void font-semibold py-3.5 px-4 rounded-xl flex justify-center items-center gap-2 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] active:scale-[0.98]"
            >
              {isLoading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <>
                  <span>Ingresar</span>
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>
        </div>
        
        {/* Footer info */}
        <div className="mt-8 text-center text-xs text-slate-dark">
          <p>&copy; {new Date().getFullYear()} UnToque. Todos los derechos reservados.</p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
