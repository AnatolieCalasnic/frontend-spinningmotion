import React from 'react';

const DashboardStats = ({ stats }) => {
  const { totalOrders, totalRevenue, activeUsers } = stats;

  return (
    <div className="grid grid-cols-3 gap-6 mb-8">
      <div className="bg-blue-600 p-6 border-4 border-black">
        <h3 className="text-white font-bold mb-2">TOTAL ORDERS</h3>
        <p className="text-4xl font-bold text-white">{totalOrders}</p>
      </div>
      <div className="bg-yellow-400 p-6 border-4 border-black">
        <h3 className="text-black font-bold mb-2">TOTAL REVENUE</h3>
        <p className="text-4xl font-bold text-black">
        €{totalRevenue?.toFixed(2)}
        </p>
      </div>
      <div className="bg-red-600 p-6 border-4 border-black">
        <h3 className="text-white font-bold mb-2">ACTIVE USERS</h3>
        <p className="text-4xl font-bold text-white">{activeUsers}</p>
      </div>
    </div>
  );
};
export default DashboardStats;
