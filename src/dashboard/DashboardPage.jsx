import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Topbar from './components/Topbar';
import KPICards from './components/KPICards';
import CashflowChart from './components/CashflowChart';
import ExpenseForecast from './components/ExpenseForecast';
import ArgentinaTaxWaterfall from './components/ArgentinaTaxWaterfall';
import OrdersTable from './components/OrdersTable';
import UserManagement from './components/UserManagement';
import ActivityLog from './components/ActivityLog';
import { getOrdersStore } from './data/orderStore';
import { getExpenses } from './data/expenseStore';
import { getProducts } from './data/catalogStore';

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  // Load all data from Firestore on mount
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      await Promise.all([
        getOrdersStore(),
        getExpenses(),
        getProducts()
      ]);
      setLoading(false);
    }
    loadData();

    // Listen for data changes from child components
    const handleUpdate = () => {
      loadData().then(() => setRefreshKey(k => k + 1));
    };
    window.addEventListener('orders-updated', handleUpdate);
    window.addEventListener('expenses-updated', handleUpdate);
    window.addEventListener('catalog-updated', handleUpdate);
    return () => {
      window.removeEventListener('orders-updated', handleUpdate);
      window.removeEventListener('expenses-updated', handleUpdate);
      window.removeEventListener('catalog-updated', handleUpdate);
    };
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
  };

  if (loading) {
    return (
      <div id="section-dashboard" className="min-h-full">
        <Topbar />
        <div className="flex items-center justify-center h-[60vh]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-2 border-emerald border-t-transparent rounded-full animate-spin"></div>
            <p className="text-silver text-sm">Cargando datos...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="section-dashboard" className="min-h-full" key={refreshKey}>
      <Topbar />
      
      <motion.div 
        className="p-6 flex flex-col gap-6 max-w-7xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={itemVariants}>
          <KPICards />
        </motion.div>

        <motion.div id="section-cashflow" variants={itemVariants}>
          <CashflowChart />
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-6">
          <motion.div id="section-expenses" variants={itemVariants} className="w-full lg:w-3/5">
            <ExpenseForecast />
          </motion.div>
          <motion.div id="section-taxes" variants={itemVariants} className="w-full lg:w-2/5">
            <ArgentinaTaxWaterfall />
          </motion.div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <motion.div id="section-orders" variants={itemVariants} className="w-full lg:w-2/3 min-w-0">
            <OrdersTable />
          </motion.div>
          <motion.div variants={itemVariants} className="w-full lg:w-1/3 min-w-0">
            <ActivityLog />
          </motion.div>
        </div>

        <motion.div id="section-users" variants={itemVariants} className="w-full min-w-0">
          <UserManagement />
        </motion.div>
      </motion.div>
    </div>
  );
}
