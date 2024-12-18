import React from 'react';
import { cn } from '../../lib/utils';

const RecentOrdersTable = ({ orders }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-4 border-black">
        <thead>
          <tr className="bg-black text-white">
            <th className="p-3 text-left">Order ID</th>
            <th className="p-3 text-left">User ID</th>
            <th className="p-3 text-left">Record ID</th>
            <th className="p-3 text-left">Amount</th>
            <th className="p-3 text-left">Date</th>
            <th className="p-3 text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {orders?.map((order) => (
            <tr key={order.id} className="border-b-4 border-black hover:bg-gray-50">
              <td className="p-3">{order.id}</td>
              <td className="p-3">{order.userId}</td>
              <td className="p-3">{order.recordId}</td>
              <td className="p-3">€{order.totalAmount?.toFixed(2)}</td>
              <td className="p-3">
                {new Date(order.purchaseDate).toLocaleDateString()}
              </td>
              <td className="p-3">
                <span className={cn(
                  "px-2 py-1 rounded-full text-sm font-bold",
                  order.status === "COMPLETED" 
                    ? "bg-green-500 text-white" 
                    : "bg-yellow-400 text-black"
                )}>
                  {order.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default RecentOrdersTable;
