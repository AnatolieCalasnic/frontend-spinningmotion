import React, { useEffect } from 'react';
import { toast } from 'react-toastify';

const UserProductNotification = ({ productId, onInventoryUpdate }) => {
  useEffect(() => {
    const handleInventoryUpdate = (event) => {
      const { inventory } = event.detail;
      
      if (inventory.recordId === parseInt(productId)) {
        if (inventory.quantity < 5) {
          toast.warning(`Only ${inventory.quantity} units left in stock!`);
        } else {
          toast.info(`Stock updated: ${inventory.quantity} units available`);
        }

        if (onInventoryUpdate) {
          onInventoryUpdate(inventory);
        }
      }
    };

    window.addEventListener('inventoryUpdate', handleInventoryUpdate);
    return () => window.removeEventListener('inventoryUpdate', handleInventoryUpdate);
  }, [productId, onInventoryUpdate]);

  return null;
};

export { UserProductNotification };