import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Filter, ArrowUpDown, Eye, Download, Printer } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:8080/purchase-history/all');
      const data = await response.json();
      setOrders(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toString().includes(searchTerm) ||
                         order.userId.toString().includes(searchTerm);
    const matchesStatus = filterStatus === 'ALL' || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

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
  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.text('Orders Report', 14, 22);
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 32);
  
    // Create table data
    const tableColumn = ["Order ID", "User ID", "Amount", "Date", "Status"];
    const tableRows = filteredOrders.map(order => [
      order.id,
      order.userId,
      `€${order.totalAmount.toFixed(2)}`,
      new Date(order.purchaseDate).toLocaleDateString(),
      order.status
    ]);
  
    // Create the table
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: { fillColor: [0, 0, 0] }
    });
  
    // Save PDF
    doc.save('orders-report.pdf');
  };
  
  const handlePrint = () => {
    window.print();
  };
  
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
          { label: 'Total Orders', value: orders.length, color: 'bg-red-600' },
          { label: 'Completed', value: orders.filter(o => o.status === 'COMPLETED').length, color: 'bg-blue-600' },
          { label: 'Pending', value: orders.filter(o => o.status === 'PENDING').length, color: 'bg-yellow-400' },
          { label: 'Total Revenue', value: `€${orders.reduce((acc, curr) => acc + curr.totalAmount, 0).toFixed(2)}`, color: 'bg-black' }
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

          <motion.div variants={itemVariants} className="flex items-center space-x-4">
            <Filter />
            <select 
              className="flex-1 py-3 px-4 border-4 border-black focus:border-red-600 outline-none"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="ALL">All Status</option>
              <option value="COMPLETED">Completed</option>
              <option value="PENDING">Pending</option>
            </select>
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
              <th className="p-4 text-left">User ID</th>
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
              filteredOrders.map((order) => (
                <motion.tr
                  key={order.id}
                  variants={itemVariants}
                  className="border-b-4 border-black hover:bg-yellow-50 cursor-pointer"
                  onClick={() => navigate(`/admin/orders/${order.id}`)}
                >
                  <td className="p-4 font-bold">#{order.id}</td>
                  <td className="p-4">{order.userId}</td>
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