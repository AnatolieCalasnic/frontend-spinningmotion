import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { Ticket, Calendar, Check, X } from 'lucide-react';

const CouponPage = () => {
  const { user } = useAuth();
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const response = await fetch(`http://localhost:8080/coupons/user/${user.userId}`, {
          credentials: 'include'
        });
        const data = await response.json();
        setCoupons(data);
      } catch (error) {
        console.error('Error fetching coupons:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.userId) {
      fetchCoupons();
    }
  }, [user]);

  if (loading) {
    return <div className="p-8">Loading your coupons...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-black text-white p-6 mb-8"
      >
        <h1 className="text-3xl font-bold flex items-center">
          <Ticket className="mr-2" />
          My Coupons
        </h1>
      </motion.div>

      <div className="grid gap-6">
        {coupons.length === 0 ? (
          <div className="bg-white border-8 border-black p-8 text-center">
            <Ticket size={48} className="mx-auto mb-4 text-gray-400" />
            <p className="text-xl mb-2">No Coupons Available</p>
            <p className="text-gray-600">Make more purchases to earn coupons!</p>
          </div>
        ) : (
          coupons.map((coupon) => (
            <motion.div
              key={coupon.id}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="bg-white border-8 border-black p-6"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="bg-yellow-400 text-black px-4 py-2 inline-block font-bold border-4 border-black mb-4">
                    {coupon.couponCode}
                  </div>
                  <div className="space-y-2">
                    <p className="font-bold text-2xl">{coupon.discountPercentage}% OFF</p>
                    <p className="text-gray-600 flex items-center">
                      <Calendar className="mr-2" size={16} />
                      Valid until: {new Date(coupon.validUntil).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {coupon.isUsed ? (
                    <span className="bg-gray-200 text-gray-600 px-3 py-1 rounded-full flex items-center">
                      <X size={16} className="mr-1" /> Used
                    </span>
                  ) : (
                    new Date(coupon.validUntil) < new Date() ? (
                      <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full flex items-center">
                        <X size={16} className="mr-1" /> Expired
                      </span>
                    ) : (
                      <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full flex items-center">
                        <Check size={16} className="mr-1" /> Active
                      </span>
                    )
                  )}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default CouponPage;