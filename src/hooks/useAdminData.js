import { useState, useEffect } from 'react';
import axios from 'axios';

export const useAdminData = () => {
  const [dashboardData, setDashboardData] = useState({ 
    totalOrders: 0,
    totalRevenue: 0,
    recentOrders: [],
    salesData: []});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [dashboardStats, purchaseStats] = await Promise.all([
          axios.get('http://localhost:8080/purchase-history/admin/dashboard', { withCredentials: true }),
          axios.get('http://localhost:8080/purchase-history/stats', { withCredentials: true }),
          axios.get('http://localhost:8080/purchase-history/all', { 
            withCredentials: true 
          })
        ]);

        setDashboardData({
          ...dashboardStats.data,
          purchaseStats: purchaseStats.data
        });
      } catch (err) {
        console.error('Error fetching admin data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { dashboardData, loading, error };
};