import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  TrendingUp, 
  CalendarClock, 
  Receipt, 
  ShoppingBag, 
  Users, 
  Sun, 
  Moon, 
  ChevronLeft, 
  ChevronRight,
  LogOut
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme, ThemeProvider } from './ThemeContext';
import { FilterProvider } from './contexts/FilterContext';
import { useAuth } from '../auth/AuthContext';
import logo from '../../logo.svg';

const NavItem = ({ icon: Icon, label, href, isCollapsed, isActive }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  return (
    <a 
      href={href}
      className={`flex items-center p-3 my-1 rounded-xl transition-all duration-200 ease-in-out ${
        isActive 
          ? (isDark ? 'text-ghost bg-white/5' : 'text-ink bg-black/5')
          : 'text-silver hover:bg-white/5'
      }`}
    >
      <Icon className="w-5 h-5 flex-shrink-0" />
      <AnimatePresence>
        {!isCollapsed && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            exit={{ opacity: 0, width: 0 }}
            className="ml-3 whitespace-nowrap overflow-hidden"
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </a>
  );
};

export default function DashboardLayout({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { theme, toggleTheme } = useTheme();
  
  // Safe destructuring in case AuthContext isn't fully implemented yet
  const auth = useAuth() || {};
  const user = auth.user || { name: 'Admin', initials: 'AD' };
  const logout = auth.logout || (() => {});
  
  const isDark = theme === 'dark';

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '#section-dashboard', isActive: true },
    { icon: TrendingUp, label: 'Cashflow', href: '#section-cashflow' },
    { icon: CalendarClock, label: 'Gastos', href: '#section-expenses' },
    { icon: Receipt, label: 'Impuestos', href: '#section-taxes' },
    { icon: ShoppingBag, label: 'Pedidos', href: '#section-orders' },
    { icon: Users, label: 'Usuarios', href: '#section-users' },
  ];

  return (
    <div className={`flex h-screen overflow-hidden ${isDark ? 'bg-obsidian text-ghost' : 'bg-cloud text-ink'}`}>
      {/* Sidebar - Desktop */}
      <motion.aside
        animate={{ width: isCollapsed ? 72 : 260 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={`hidden lg:flex flex-col justify-between ${isDark ? 'bg-charcoal border-r border-white/10' : 'bg-white border-r border-black/10'} transition-colors duration-200 ease-in-out z-20`}
        style={{ borderRightColor: isDark ? 'rgba(255,255,255,0.06)' : undefined }}
      >
        <div className="flex flex-col flex-grow">
          <div className="flex items-center h-20 px-4">
            <img src={logo} alt="Logo" className="w-8 h-8 flex-shrink-0" />
            <AnimatePresence>
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  className="ml-3 font-display font-bold text-xl whitespace-nowrap overflow-hidden"
                >
                  UnToque
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          <nav className="flex-1 px-3 overflow-y-auto mt-4">
            {navItems.map((item, idx) => (
              <NavItem 
                key={idx}
                icon={item.icon}
                label={item.label}
                href={item.href}
                isCollapsed={isCollapsed}
                isActive={item.isActive}
              />
            ))}
          </nav>
        </div>

        <div className="p-3 border-t border-black/5 dark:border-white/5">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-silver hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2 rounded-xl text-silver hover:bg-black/5 dark:hover:bg-white/5 transition-colors hidden lg:block"
            >
              {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            </button>
          </div>

          <div className={`flex items-center ${isCollapsed ? 'justify-center' : ''} p-2 rounded-xl bg-black/5 dark:bg-white/5`}>
            <div className="w-8 h-8 rounded-full bg-emerald text-obsidian flex items-center justify-center font-bold flex-shrink-0">
              {user.initials}
            </div>
            <AnimatePresence>
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  className="ml-3 flex-1 overflow-hidden"
                >
                  <div className="text-sm font-medium truncate">{user.name}</div>
                </motion.div>
              )}
            </AnimatePresence>
            {!isCollapsed && (
              <button onClick={logout} className="p-1.5 text-silver hover:text-coral transition-colors ml-auto">
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </motion.aside>

      {/* Main Area */}
      <main className="flex-1 overflow-y-auto relative scroll-smooth">
        <div className="pb-24 lg:pb-8">
          {children}
        </div>
      </main>

      {/* Bottom Tab Bar - Mobile */}
      <nav className={`lg:hidden fixed bottom-0 left-0 right-0 h-16 ${isDark ? 'bg-charcoal/90 border-t border-white/10' : 'bg-white/90 border-t border-black/10'} backdrop-blur-md flex items-center justify-around px-2 z-50`}>
        {navItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <a 
              key={idx}
              href={item.href}
              className={`p-2 rounded-xl flex flex-col items-center ${item.isActive ? (isDark ? 'text-emerald' : 'text-emerald') : 'text-silver'}`}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </a>
          );
        })}
      </nav>
    </div>
  );
}
