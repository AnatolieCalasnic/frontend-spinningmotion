import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Package, Eye, Download } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const UserOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.userId) {
      navigate('/login');
      return;
    }
    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8080/purchase-history/${user.userId}`, {
        credentials: 'include'
      });
      const data = await response.json();
      const groupedData = groupOrdersByPurchaseTime(data);
      setOrders(groupedData);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const groupOrdersByPurchaseTime = (orders) => {
    const grouped = orders.reduce((acc, order) => {
      const purchaseTime = new Date(order.purchaseDate).getTime();
      const groupKey = `${order.userId}-${purchaseTime}`;
      
      if (!acc[groupKey]) {
        acc[groupKey] = {
          id: order.id,
          groupId: `ORDER-${purchaseTime}`,
          userId: order.userId,
          status: order.status,
          purchaseDate: order.purchaseDate,
          totalAmount: 0,
          items: [],
          orderIds: []
        };
      }

      const existingItem = acc[groupKey].items.find(item => item.recordId === order.recordId);
      if (!existingItem) {
        acc[groupKey].items.push({
          recordId: order.recordId,
          quantity: order.quantity,
          price: order.price
        });
        acc[groupKey].totalAmount += order.price * order.quantity;
      }
      
      if (!acc[groupKey].orderIds.includes(order.id)) {
        acc[groupKey].orderIds.push(order.id);
      }
      
      return acc;
    }, {});

    return Object.values(grouped);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.text('My Orders', 14, 22);
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 32);
  
    const tableColumn = ["Order ID", "Date", "Amount", "Status"];
    const tableRows = orders.map(order => [
      order.id,
      new Date(order.purchaseDate).toLocaleDateString(),
      `€${order.totalAmount.toFixed(2)}`,
      order.status
    ]);
  
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: { fillColor: [0, 0, 0] }
    });
  
    doc.save('my-orders.pdf');
  };

  const filteredOrders = orders.filter(order =>
    order.id.toString().includes(searchTerm)
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <motion.div 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="mb-8"
      >
        <div className="bg-black p-6">
          <h1 className="text-4xl font-bold text-white">My Orders</h1>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8"
      >
        {[
          { 
            label: 'Total Orders', 
            value: orders.length, 
            color: 'bg-red-600' 
          },
          { 
            label: 'Completed Orders', 
            value: orders.filter(o => o.status === 'COMPLETED').length, 
            color: 'bg-blue-600' 
          },
          { 
            label: 'Total Spent', 
            value: `€${orders.reduce((acc, curr) => acc + curr.totalAmount, 0).toFixed(2)}`, 
            color: 'bg-black' 
          }
        ].map((stat, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            className={`${stat.color} p-6 border-4 border-black`}
          >
            <h3 className="text-white text-lg font-bold">{stat.label}</h3>
            <p className="text-white text-3xl font-bold">{stat.value}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Controls */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="bg-white border-8 border-black p-6 mb-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div variants={itemVariants} className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by order ID..."
              className="w-full pl-10 pr-4 py-3 border-4 border-black focus:border-red-600 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <button 
              onClick={exportToPDF}
              className="flex items-center space-x-2 px-4 py-2 bg-black text-white hover:bg-gray-800"
            >
              <Download size={20} />
              <span>Export Orders</span>
            </button>
          </motion.div>
        </div>
      </motion.div>

      {/* Orders Table */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="bg-white border-8 border-black"
      >
        <div className="hidden sm:block">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="bg-black text-white">
                <th className="p-4 text-left">Order ID</th>
                <th className="p-4 text-left">Date</th>
                <th className="p-4 text-left">Amount</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Details</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center py-8">Loading orders...</td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-8">No orders found</td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <motion.tr
                    key={order.id}
                    variants={itemVariants}
                    className="border-b-4 border-black hover:bg-yellow-50"
                  >
                    <td className="p-4 font-bold">#{order.id}</td>
                    <td className="p-4">{new Date(order.purchaseDate).toLocaleDateString()}</td>
                    <td className="p-4">€{order.totalAmount.toFixed(2)}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                        order.status === 'COMPLETED' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-yellow-400 text-black'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <button 
                        className="p-2 hover:bg-gray-100 rounded-full"
                        onClick={() => navigate(`/my-orders/${order.id}`)}
                      >
                        <Eye className="text-gray-600" />
                      </button>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile view */}
        <div className="block sm:hidden">
          {loading ? (
            <p>Loading orders...</p>
          ) : filteredOrders.length === 0 ? (
            <p>No orders found</p>
          ) : (
            filteredOrders.map((order) => (
              <div key={order.id} className="border-2 border-black p-4 mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold">Order ID: #{order.id}</span>
                  <span className={`px-3 py-1 text-sm font-bold ${
                    order.status === 'COMPLETED' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-yellow-400 text-black'
                  }`}>
                    {order.status}
                  </span>
                </div>
                <p>Date: {new Date(order.purchaseDate).toLocaleDateString()}</p>
                <p>Amount: €{order.totalAmount.toFixed(2)}</p>
                <button 
                  className="p-2 mt-2 bg-black text-white hover:bg-gray-800 "
                  onClick={() => navigate(`/my-orders/${order.id}`)}
                >
                  <span>Details</span>
                </button>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default UserOrdersPage;