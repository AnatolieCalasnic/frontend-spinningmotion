import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Package, User, Calendar, CreditCard, Truck, Check } from 'lucide-react';

const AdminOrderDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      const response = await fetch(`http://localhost:8080/purchase-history/history/${id}`);
      const data = await response.json();
      setOrder(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching order details:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8">Loading order details...</div>;
  }

  if (!order) {
    return <div className="p-8">Order not found</div>;
  }

  const orderStages = [
    { icon: Package, label: 'Order Placed', completed: true },
    { icon: Check, label: 'Confirmed', completed: order.status === 'COMPLETED' },
    { icon: Truck, label: 'Shipped', completed: order.status === 'COMPLETED' },
    { icon: Check, label: 'Delivered', completed: order.status === 'COMPLETED' }
  ];

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Back Button */}
      <motion.button
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="mb-6 flex items-center space-x-2 text-gray-600 hover:text-black"
        onClick={() => navigate('/admin/orders')}
      >
        <ArrowLeft size={20} />
        <span>Back to Orders</span>
      </motion.button>

      {/* Order Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-black text-white p-6 mb-8"
      >
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Order #{order.id}</h1>
          <span className={`px-4 py-2 rounded-full text-sm font-bold ${
            order.status === 'COMPLETED' 
              ? 'bg-blue-600' 
              : 'bg-yellow-400 text-black'
          }`}>
            {order.status}
          </span>
        </div>
      </motion.div>

      {/* Order Progress */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white border-8 border-black p-6 mb-8"
      >
        <div className="grid grid-cols-4 gap-4">
          {orderStages.map((stage, index) => (
            <div key={index} className="relative flex flex-col items-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                stage.completed ? 'bg-blue-600' : 'bg-gray-200'
              }`}>
                <stage.icon className={stage.completed ? 'text-white' : 'text-gray-500'} />
              </div>
              <p className="mt-2 text-sm font-bold">{stage.label}</p>
              {index < orderStages.length - 1 && (
                <div className={`absolute top-6 left-1/2 w-full h-1 ${
                  stage.completed ? 'bg-blue-600' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Order Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Customer Information */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="bg-white border-8 border-black p-6"
        >
          <div className="flex items-center space-x-2 mb-4">
            <User className="text-gray-500" />
            <h2 className="text-xl font-bold">Customer Information</h2>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-gray-500">User ID</p>
              <p className="font-bold">{order.userId}</p>
            </div>
          </div>
        </motion.div>

        {/* Order Information */}
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="bg-white border-8 border-black p-6"
        >
          <div className="flex items-center space-x-2 mb-4">
            <Package className="text-gray-500" />
            <h2 className="text-xl font-bold">Order Information</h2>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-gray-500">Order Date</p>
              <p className="font-bold">{new Date(order.purchaseDate).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-gray-500">Total Amount</p>
              <p className="font-bold text-2xl">€{order.totalAmount.toFixed(2)}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Items */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white border-8 border-black p-6"
      >
        <h2 className="text-xl font-bold mb-4">Ordered Records</h2>
        <div className="space-y-4">
          <div className="p-4 bg-yellow-50 border-4 border-black">
            <p className="font-bold">Record ID: {order.recordId}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminOrderDetailsPage;