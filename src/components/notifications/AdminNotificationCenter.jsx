import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Bell } from 'lucide-react';
import { toast } from 'react-toastify';

const AdminNotificationCenter = () => {
  const [notificationCount, setNotificationCount] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.isAdmin) return;

    const handleInventoryUpdate = (event) => {
      const { inventory } = event.detail;
      
      setNotificationCount(prev => prev + 1);

      // matching your backend properties
      const message = `${inventory.title} - ${inventory.updateType}: ${inventory.quantity} units`;
      
      if (inventory.quantity < 10) {
        toast.warning(`Low Stock Alert: ${message}`);
      } else {
        toast.info(`Inventory Update: ${message}`);
      }

      setTimeout(() => {
        setNotificationCount(prev => Math.max(0, prev - 1));
      }, 5000);
    };

    window.addEventListener('inventoryUpdate', handleInventoryUpdate);
    return () => window.removeEventListener('inventoryUpdate', handleInventoryUpdate);
  }, [user]);

  // render for admin users
  if (!user?.isAdmin) return null;

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="relative">
        <div className="p-2 bg-white dark:bg-slate-700 rounded-full shadow-lg">
          <Bell className="h-6 w-6 dark:text-white" />
          {notificationCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {notificationCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export { AdminNotificationCenter };