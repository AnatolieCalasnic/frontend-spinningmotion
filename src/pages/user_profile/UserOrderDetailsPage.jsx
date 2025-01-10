import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Package, Calendar, Check, Truck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const UserOrderDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [recordDetails, setRecordDetails] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.userId) {
      navigate('/login');
      return;
    }
    fetchOrderDetails();
  }, [id, user]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      
      // Get the main order and related orders
      const [orderResponse, relatedResponse] = await Promise.all([
        fetch(`http://localhost:8080/purchase-history/history/${id}`, {
          credentials: 'include'
        }),
        fetch(`http://localhost:8080/purchase-history/related/${id}`, {
          credentials: 'include'
        })
      ]);

      const orderData = await orderResponse.json();
      const relatedData = await relatedResponse.json();

      // Verify this order belongs to the current user
      if (orderData.userId !== user.userId) {
        navigate('/my-orders');
        return;
      }

      // Combine orders and remove duplicates
      const uniqueOrders = [];
      const seenRecordIds = new Set();

      [orderData, ...(Array.isArray(relatedData) ? relatedData : [])].forEach(order => {
        if (!seenRecordIds.has(order.recordId)) {
          seenRecordIds.add(order.recordId);
          uniqueOrders.push(order);
        }
      });

      setOrders(uniqueOrders);

      // Fetch record details
      const recordDetailsMap = {};
      for (const order of uniqueOrders) {
        const recordResponse = await fetch(`http://localhost:8080/records/${order.recordId}`);
        const recordData = await recordResponse.json();
        recordDetailsMap[order.recordId] = recordData;
      }
      setRecordDetails(recordDetailsMap);

    } catch (error) {
      console.error('Error fetching order details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8">Loading order details...</div>;
  }

  if (!orders.length) {
    return <div className="p-8">Order not found</div>;
  }

  const totalAmount = orders.reduce((sum, order) => sum + (order.price * order.quantity), 0);

  const orderStages = [
    { icon: Package, label: 'Order Placed', completed: true },
    { icon: Check, label: 'Confirmed', completed: orders[0].status === 'COMPLETED' },
    { icon: Truck, label: 'Shipped', completed: orders[0].status === 'COMPLETED' },
    { icon: Check, label: 'Delivered', completed: orders[0].status === 'COMPLETED' }
  ];

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Back Button */}
      <motion.button
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="mb-6 flex items-center space-x-2 text-gray-600 hover:text-black"
        onClick={() => navigate('/my-orders')}
      >
        <ArrowLeft size={20} />
        <span>Back to My Orders</span>
      </motion.button>

      {/* Order Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-black text-white p-6 mb-8"
      >
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Order #{orders[0].id}</h1>
          <span className={`px-4 py-2 rounded-full text-sm font-bold ${
            orders[0].status === 'COMPLETED' 
              ? 'bg-blue-600' 
              : 'bg-yellow-400 text-black'
          }`}>
            {orders[0].status}
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
                <div className={`absolute top-6 left-[60%] w-[90%] h-1 ${
                  stage.completed ? 'bg-blue-600' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Order Information */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white border-8 border-black p-6 mb-8"
      >
        <div className="flex items-center space-x-2 mb-4">
          <Package className="text-gray-500" />
          <h2 className="text-xl font-bold">Order Information</h2>
        </div>
        <div className="space-y-4">
          <div>
            <p className="text-gray-500">Order Date</p>
            <p className="font-bold">{new Date(orders[0].purchaseDate).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-gray-500">Total Amount</p>
            <p className="font-bold text-2xl">€{totalAmount.toFixed(2)}</p>
          </div>
        </div>
      </motion.div>

      {/* Items */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white border-8 border-black p-6"
      >
        <h2 className="text-xl font-bold mb-4">Ordered Records</h2>
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.recordId} className="p-4 bg-yellow-50 border-4 border-black">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="font-bold text-lg">
                    {recordDetails[order.recordId]?.artist} - {recordDetails[order.recordId]?.title}
                  </p>
                  <p className="text-gray-600">Record ID: {order.recordId}</p>
                  <p className="mt-2">Quantity: {order.quantity}</p>
                  <p className="font-bold mt-1">Price: €{order.price.toFixed(2)}</p>
                  <p className="font-bold text-lg mt-2">Subtotal: €{(order.price * order.quantity).toFixed(2)}</p>
                </div>
                {recordDetails[order.recordId]?.images?.[0] && (
                  <img 
                    src={recordDetails[order.recordId].images[0]} 
                    alt={recordDetails[order.recordId].title}
                    className="w-32 h-32 object-cover ml-4"
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default UserOrderDetailsPage;