import React from 'react';
import { motion } from 'framer-motion';
import Topbar from './components/Topbar';
import KPICards from './components/KPICards';
import CashflowChart from './components/CashflowChart';
import ExpenseForecast from './components/ExpenseForecast';
import ArgentinaTaxWaterfall from './components/ArgentinaTaxWaterfall';
import OrdersTable from './components/OrdersTable';
import UserManagement from './components/UserManagement';
import ActivityLog from './components/ActivityLog';

export default function DashboardPage() {
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

  return (
    <div id="section-dashboard" className="min-h-full">
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
          <motion.div id="section-orders" variants={itemVariants} className="w-full lg:w-2/3">
            <OrdersTable />
          </motion.div>
          <motion.div variants={itemVariants} className="w-full lg:w-1/3">
            <ActivityLog />
          </motion.div>
        </div>

        <motion.div id="section-users" variants={itemVariants} className="w-full">
          <UserManagement />
        </motion.div>
      </motion.div>
    </div>
  );
}
