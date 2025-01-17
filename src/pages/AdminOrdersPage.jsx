import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Eye, Download, Printer } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchError, setSearchError] = useState(null);
  const navigate = useNavigate();
  const fetchUserDetails = async (userId) => {
    try {
      const response = await fetch(`http://localhost:8080/user/${userId}`);
      if (!response.ok) throw new Error('Failed to fetch user details');
      return await response.json();
    } catch (error) {
      console.error('Error fetching user details:', error);
      return null;
    }
  };
  useEffect(() => {
    fetchOrders();
  }, []);
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (searchTerm.length < 2) {
        fetchOrders();
        return;
      }
      setLoading(true);
      setSearchError(null);
      try {
        const response = await fetch(`http://localhost:8080/search/orders?searchTerm=${searchTerm}`);
        if (!response.ok) {
          throw new Error('Search failed');
        }
        const data = await response.json();
        const ordersWithUserDetails = await Promise.all(
          data.map(async (order) => {
            if (order.userId) {
              const userDetails = await fetchUserDetails(order.userId);
              return { ...order, userDetails };
            }
            return order;
          })
        );
        setOrders(ordersWithUserDetails || []);
      } catch (error) {
        console.error('Search error:', error);
        setSearchError('Failed to fetch search results');
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchSearchResults, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);



  const fetchOrders = async () => {
    setLoading(true); 
    try {
      const response = await fetch('http://localhost:8080/purchase-history/all');
      const data = await response.json();
      console.log('Raw order data:', data); // Debug log
      const ordersWithUserDetails = await Promise.all(
        data.map(async (order) => {
          if (order.userId) {
            const userDetails = await fetchUserDetails(order.userId);
            return { ...order, userDetails };
          }
          return order;
        })
      );
      console.log('Orders with user details:', ordersWithUserDetails); // Debug log

      setOrders(ordersWithUserDetails || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setSearchError('Failed to fetch orders');
      setOrders([]); // Set empty orders on error
    }finally{
        setLoading(false);
    }    
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };
  const groupOrdersByPurchaseTime = (orders) => {
    const grouped = orders.reduce((acc, order) => {
      const purchaseTime = new Date(order.purchaseDate).getTime();
      const groupKey = `${order.userId || 'guest'}-${purchaseTime}`;
      
      if (!acc[groupKey]) {
        acc[groupKey] = {
          id: order.id, 
          groupId: `ORDER-${purchaseTime}`, 
          userId: order.userId,
          userDetails: order.userDetails,
          isGuest: order.isGuest, 
          status: order.status,
          purchaseDate: order.purchaseDate,
          totalAmount: 0,
          items: [],
          orderIds: [] 
        };
      }
      const existingItem = acc[groupKey].items.find(item => item.recordId === order.recordId);
      if (!existingItem) {
          // Only add item if it's not already in the list
          acc[groupKey].items.push({
              recordId: order.recordId,
              quantity: order.quantity,
              price: order.price
          });
          // Update total amount only for new items
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
    doc.text('Orders Report', 14, 22);
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 32);
  
    const tableColumn = ["Order ID", "User Information", "Amount", "Date", "Status"];
    const tableRows = groupOrdersByPurchaseTime(orders).map(order => [
      order.id,
      order.userDetails ? 
        `${order.userDetails.fname} ${order.userDetails.lname} (ID: ${order.userId})` : 
        'Guest User',
      `€${order.totalAmount.toFixed(2)}`,
      new Date(order.purchaseDate).toLocaleDateString(),
      order.status
    ]);
  
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: { fillColor: [0, 0, 0] }
    });
  
    doc.save('orders-report.pdf');
  };
  
  const handlePrint = () => {
    window.print();
  };
  const groupedOrders = groupOrdersByPurchaseTime(orders);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <motion.div 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="mb-8"
      >
        <div className="bg-black p-6">
          <h1 className="text-4xl font-bold text-white">Orders Dashboard</h1>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
      >
        {[
          { label: 'Total Orders', value: orders?.length, color: 'bg-red-600' },
          { label: 'Total Revenue', value: `€${groupedOrders.reduce((acc, curr) => acc + curr.totalAmount, 0).toFixed(2)}`, color: 'bg-black' }
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

      {/* Controls Section */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="bg-white border-8 border-black p-6 mb-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div variants={itemVariants} className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search orders..."
              className="w-full pl-10 pr-4 py-3 border-4 border-black focus:border-red-600 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </motion.div>


          <motion.div variants={itemVariants} className="flex space-x-4">
            <button 
                onClick={exportToPDF}
                className="flex items-center space-x-2 px-4 py-2 bg-black text-white hover:bg-gray-800 print:hidden"
            >
                <Download size={20} />
                <span>Export</span>
            </button>
            <button 
                onClick={handlePrint}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white hover:bg-red-700 print:hidden"
            >
                <Printer size={20} />
                <span>Print</span>
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
        <table className="w-full">
          <thead>
            <tr className="bg-black text-white">
              <th className="p-4 text-left">Order ID</th>
              <th className="p-4 text-left">User Information</th>
              <th className="p-4 text-left">Amount</th>
              <th className="p-4 text-left">Date</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center py-8">Loading orders...</td>
              </tr>
            ) : (
                groupedOrders.map((order) => (
                <motion.tr
                  key={order.id}
                  variants={itemVariants}
                  className="border-b-4 border-black hover:bg-yellow-50 cursor-pointer"
                  onClick={() => navigate(`/admin/orders/${order.id}`)}
                >
                  <td className="p-4 font-bold">#{order.id}</td>
                  <td className="p-4">
                    {order.userDetails ? (
                      <div>
                        <div className="font-medium">{order.userDetails.name}</div>
                        <div className="text-lg text-black">
                          <div>ID: {order.userId}</div>
                          {order.userDetails.email && (
                            <div className="text-gray-400">{order.userDetails.email}</div>
                          )}
                        </div>
                      </div>
                    ) : (
                      "Guest User"
                    )}
                  </td>
                  <td className="p-4">€{order.totalAmount.toFixed(2)}</td>
                  <td className="p-4">{new Date(order.purchaseDate).toLocaleDateString()}</td>
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
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/admin/orders/${order.id}`);
                      }}
                    >
                      <Eye className="text-gray-600" />
                    </button>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
};

export default AdminOrdersPage;