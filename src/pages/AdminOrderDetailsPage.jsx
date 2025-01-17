import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Package, User, Truck, Check } from 'lucide-react';

const AdminOrderDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [recordDetails, setRecordDetails] = useState({});
  const [guestDetails, setGuestDetails] = useState(null);
  const [userDetails, setUserDetails] = useState(null);  
  const [loadingUser, setLoadingUser] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);
  useEffect(() => {
    const fetchCustomerDetails = async () => {
      if (orders.length > 0) {
        const order = orders[0];
        setLoadingUser(true);
        try {
          if (order.isGuest) {
          // Fetch guest details
          const guestResponse = await fetch(`http://localhost:8080/guest-orders/${order.purchaseHistoryId}`);
          if (guestResponse.ok) {
            const guestData = await guestResponse.json();
            setGuestDetails(guestData);
          } else {
            console.error('Error fetching guest details:', guestResponse.status);
          } }else if (order.userId) {
          const userResponse = await fetch(`http://localhost:8080/user/${order.userId}`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json'
            }
          });
          if (userResponse.ok) {
            const userData = await userResponse.json();
            setUserDetails(userData);
          }else {
            console.error('Error fetching user details:', userResponse.status);
          }
        }
      
        } catch (error) {
          console.error('Error fetching user details:', error);
        } finally {
          setLoadingUser(false);
        }
      }
    };

    fetchCustomerDetails();
  }, [orders]);
  
  const renderCustomerInfo = () => {
    if (!orders.length) return null;

    const order = orders[0];
    
    if (order.isGuest && guestDetails) {
        return (
            <div className="space-y-4">
                <div>
                    <p className="text-gray-500">Customer Type</p>
                    <p className="font-bold">Guest User</p>
                </div>
                <div>
                    <p className="text-gray-500">Name</p>
                    <p className="font-bold">{guestDetails.fname} {guestDetails.lname}</p>
                </div>
                <div>
                    <p className="text-gray-500">Email</p>
                    <p className="font-bold">{guestDetails.email}</p>
                </div>
                <div>
                    <p className="text-gray-500">Phone</p>
                    <p className="font-bold">{guestDetails.phonenum}</p>
                </div>
                <div>
                    <p className="text-gray-500">Shipping Address</p>
                    <p className="font-bold">
                        {guestDetails.address}<br />
                        {guestDetails.city}{guestDetails.region ? `, ${guestDetails.region}` : ''}<br />
                        {guestDetails.postalCode}<br />
                        {guestDetails.country}
                    </p>
                </div>
            </div>
        );   
    }
    else if (!order.isGuest && userDetails) {
      // Added this block to display registered user details
      return (
          <div className="space-y-4">
              <div>
                  <p className="text-gray-500">Customer Type</p>
                  <p className="font-bold">Registered User</p>
              </div>
              <div>
                  <p className="text-gray-500">Name</p>
                  <p className="font-bold">{userDetails.fname} {userDetails.lname}</p>
              </div>
              <div>
                  <p className="text-gray-500">Email</p>
                  <p className="font-bold">{userDetails.email}</p>
              </div>
              <div>
                  <p className="text-gray-500">Phone</p>
                  <p className="font-bold">{userDetails.phonenum}</p>
              </div>
              <div>
                  <p className="text-gray-500">Shipping Address</p>
                  <p className="font-bold">
                      {userDetails.address}<br />
                      {userDetails.city}{userDetails.region ? `, ${userDetails.region}` : ''}<br />
                      {userDetails.postalCode}<br />
                      {userDetails.country}
                  </p>
              </div>
          </div>
      );
  } else if (loadingUser) {
      return <div>Loading user details...</div>;
  }

    return (
        <div className="space-y-4">
            <div>
                <p className="text-gray-500">Customer Type</p>
                <p className="font-bold">{order.isGuest ? 'Guest User' : 'Registered User'}</p>
            </div>
            <div>
                <p className="text-gray-500">User ID</p>
                <p className="font-bold">{order.userId || 'Guest User'}</p>
            </div>
            <div className="mt-4 p-4 bg-yellow-50 rounded border-2 border-yellow-400">
                <p className="text-yellow-700">
                    {order.isGuest ? 'Guest information not available' : 'User information not available'}
                </p>
            </div>
        </div>
    );
};
  const fetchOrderDetails = async () => {
    try {
        setLoading(true);
        
        // Get the main order
        const orderResponse = await fetch(`http://localhost:8080/purchase-history/history/${id}`);
        const orderData = await orderResponse.json();

        // Get any related orders
        const relatedResponse = await fetch(`http://localhost:8080/purchase-history/related/${id}`);
        const relatedData = await relatedResponse.json();

        // Combine orders and remove duplicates based on recordId
        const uniqueOrders = [];
        const seenRecordIds = new Set();

        [orderData, ...(Array.isArray(relatedData) ? relatedData : [])].forEach(order => {
            if (!seenRecordIds.has(order.recordId)) {
                seenRecordIds.add(order.recordId);
                uniqueOrders.push({
                  ...order,
                  purchaseHistoryId: order.id 
                });
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

        setLoading(false);
    } catch (error) {
        console.error('Error fetching order details:', error);
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

      {/* Order Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Customer Information */}
        <motion.div className="bg-white border-8 border-black p-6">
    <div className="flex items-center space-x-2 mb-4">
      <User className="text-gray-500" />
      <h2 className="text-xl font-bold">Customer Information</h2>
    </div>
    {renderCustomerInfo()}
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
              <p className="font-bold">{new Date(orders[0].purchaseDate).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-gray-500">Total Amount</p>
              <p className="font-bold text-2xl">€{totalAmount.toFixed(2)}</p>
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

export default AdminOrderDetailsPage;