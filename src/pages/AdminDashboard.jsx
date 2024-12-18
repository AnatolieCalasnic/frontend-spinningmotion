import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AdminLayout from '../components/admin/AdminLayout';
import DashboardStats from '../components/admin/DashboardStats';
import RecentOrdersTable from '../components/admin/RecentOrdersTable';
import { useAdminData } from '../hooks/useAdminData';
import SalesChart from '../components/admin/SalesChart';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { dashboardData, loading, error } = useAdminData();

  React.useEffect(() => {
    if (!user?.isAdmin) {
      navigate('/');
    }
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="bg-white p-8 border-8 border-black rounded-lg"
        >
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-black"></div>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="bg-red-600 text-white p-8 border-8 border-black"
        >
          Error loading dashboard: {error}
        </motion.div>
      </div>
    );
  }

  return (
 
      <div className="p-8">
              <motion.div 
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="mb-8"
              >
                <div className="bg-black p-6">
                  <h1 className="text-4xl font-bold text-white">Dashboard</h1>
                </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <DashboardStats stats={dashboardData} />
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white border-8 border-black p-6 mb-8"
        >
          <h2 className="text-2xl font-bold mb-6">Sales Overview</h2>
          <div className="p-4 bg-black rounded-lg">
            <SalesChart data={dashboardData?.recentOrders || []} />
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white border-8 border-black p-6"
        >
          <h2 className="text-2xl font-bold mb-6">Recent Orders</h2>
          <RecentOrdersTable orders={dashboardData?.recentOrders} />
        </motion.div>
      </div>

  );
};

export default AdminDashboard;