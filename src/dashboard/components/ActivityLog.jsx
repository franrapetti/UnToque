import React from 'react';
import { motion } from 'framer-motion';
import { Activity, ShoppingBag, CreditCard, Package, UserPlus, Settings, TrendingUp, FileText } from 'lucide-react';
import { getActivityLog, timeAgo } from '../data/mockData';
import { useTheme } from '../ThemeContext';

export default function ActivityLog() {
  const { theme, isDark } = useTheme();
  const logs = getActivityLog();

  const getIconAndColor = (type) => {
    switch(type) {
      case 'order': return { icon: ShoppingBag, color: 'text-sapphire', bg: 'bg-sapphire/20', glow: 'glow-sapphire' };
      case 'expense': return { icon: CreditCard, color: 'text-amber', bg: 'bg-amber-soft', glow: 'glow-amber' };
      case 'stock': return { icon: Package, color: 'text-violet', bg: 'bg-violet/20', glow: 'glow-violet' };
      case 'user': return { icon: UserPlus, color: 'text-emerald', bg: 'bg-emerald-light', glow: 'glow-emerald' };
      case 'config': return { icon: Settings, color: 'text-silver', bg: 'bg-black/10 dark:bg-white/10', glow: '' };
      case 'subscription': return { icon: TrendingUp, color: 'text-cyan', bg: 'bg-cyan/20', glow: '' };
      case 'payment': return { icon: CreditCard, color: 'text-emerald', bg: 'bg-emerald-light', glow: 'glow-emerald' };
      case 'report': return { icon: FileText, color: 'text-coral', bg: 'bg-coral-soft', glow: 'glow-coral' };
      default: return { icon: Activity, color: 'text-ghost', bg: 'bg-white/10', glow: '' };
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 h-full max-h-[500px] overflow-y-auto"
    >
      <div className="flex items-center gap-2 mb-6 sticky top-0 bg-transparent backdrop-blur-sm z-10 pb-2 border-b border-white/5">
        <Activity className="text-violet w-6 h-6" />
        <h2 className="text-xl font-bold dark:text-ghost">Actividad Reciente</h2>
      </div>

      {logs.length === 0 ? (
        <div className="text-center py-8 text-silver opacity-60">
          <p>No hay actividad reciente.</p>
        </div>
      ) : (
        <div className="relative pl-6">
          {/* Timeline connecting line */}
          <div className="absolute left-10 top-2 bottom-2 w-px bg-gradient-to-b from-white/20 via-white/10 to-transparent z-0"></div>
          
          <div className="flex flex-col gap-6 relative z-10">
            {logs.map((log, i) => {
              const { icon: Icon, color, bg } = getIconAndColor(log.type);
              return (
                <motion.div 
                  key={log.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-4 group"
                >
                  <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center border border-white/10 ${bg} ${color}`}>
                    <Icon size={18} />
                  </div>
                  <div className="pt-1">
                    <p className="font-semibold dark:text-ghost text-sm leading-tight">
                      {log.action}
                    </p>
                    <p className="text-sm text-silver mt-0.5">
                      {log.detail}
                    </p>
                    <p className="text-xs text-silver/60 mt-1.5 flex items-center gap-1.5">
                      <span className="font-medium text-silver/80">{log.user}</span>
                      <span>•</span>
                      <span>{timeAgo(log.timestamp)}</span>
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </motion.div>
  );
}
