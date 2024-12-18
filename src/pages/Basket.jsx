import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, RefreshCw, CreditCard, X, ShoppingBag } from 'lucide-react';
import EmbbedCheckoutButton from '../components/EmbbedCheckoutButton'; 

const BasketPage = () => {
  const [basket, setBasket] = useState({ items: [], totalAmount: 0 });

  // Update how we load the basket
  useEffect(() => {
    const loadBasket = () => {
      try {
        const savedBasket = localStorage.getItem('guestBasket');
        console.log('Loading basket from localStorage:', savedBasket);
        
        if (savedBasket) {
          const parsedBasket = JSON.parse(savedBasket);
          console.log('Parsed basket:', parsedBasket);
          
          // Ensure all numbers are properly parsed
          const normalizedBasket = {
            items: parsedBasket.items.map(item => ({
              ...item,
              recordId: parseInt(item.recordId),
              price: parseFloat(item.price),
              quantity: parseInt(item.quantity),
              availableStock: parseInt(item.availableStock)
            })),
            totalAmount: parseFloat(parsedBasket.totalAmount)
          };
          
          setBasket(normalizedBasket);
        }
      } catch (error) {
        console.error('Error loading basket:', error);
      }
    };

    loadBasket();
    
    // Reload basket when localStorage changes
    window.addEventListener('storage', loadBasket);
    return () => window.removeEventListener('storage', loadBasket);
  }, []);
  
  const updateBasketTotal = (items) => {
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const handleQuantityUpdate = (recordId, newQuantity) => {
    const updatedItems = basket.items.map(item => 
      item.recordId === recordId 
        ? { ...item, quantity: newQuantity }
        : item
    );

    const newBasket = {
      items: updatedItems,
      totalAmount: updateBasketTotal(updatedItems)
    };

    setBasket(newBasket);
    localStorage.setItem('guestBasket', JSON.stringify(newBasket));
  };

  const handleRemoveItem = (recordId) => {
    const updatedItems = basket.items.filter(item => item.recordId !== recordId);
    const newBasket = {
      items: updatedItems,
      totalAmount: updateBasketTotal(updatedItems)
    };

    setBasket(newBasket);
    localStorage.setItem('guestBasket', JSON.stringify(newBasket));
  };


  const handleClearBasket = () => {
    setBasket({ items: [], totalAmount: 0 });
    localStorage.removeItem('guestBasket');
  };

  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="grid grid-cols-12 gap-8">
        {/* Main Content - Left Side */}
        <div className="col-span-8">
          <div className="bg-white border-8 border-black">
            {/* Header */}
            <div className="bg-red-600 p-6 text-white flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <ShoppingBag size={32} />
                <h1 className="text-3xl font-bold">Your Basket</h1>
                <span className="bg-white text-red-600 px-3 py-1 rounded-full font-bold">
                  {basket.items.length} items
                </span>
              </div>
              {basket.items.length > 0 && (
                <button
                  onClick={handleClearBasket}
                  className="bg-black text-white px-4 py-2 flex items-center hover:bg-gray-800 transition-colors"
                >
                  <Trash2 className="mr-2" /> Clear Basket
                </button>
              )}
            </div>

            {/* Items */}
            <div className="divide-y-4 divide-black">
              {basket.items.map((item) => (
                <div key={item.recordId} className="p-6 grid grid-cols-12 gap-4 items-center hover:bg-gray-50 transition-colors">
                  {/* Image */}
                  <div className="col-span-2">
                    <div className="aspect-square bg-blue-600 border-4 border-black" />
                  </div>

                  {/* Details */}
                  <div className="col-span-4">
                    <Link 
                      to={`/product/${item.recordId}`}
                      className="font-bold text-lg hover:text-blue-600"
                    >
                      {item.title}
                    </Link>
                    <p className="text-sm text-gray-600">{item.artist}</p>
                  </div>

                  {/* Quantity */}
                  <div className="col-span-3">
                    <div className="flex items-center space-x-2 border-4 border-black p-1 bg-white">
                      <button
                        onClick={() => handleQuantityUpdate(item.recordId, Math.max(1, item.quantity - 1))}
                        className="bg-black text-white p-2 disabled:bg-gray-400 hover:bg-gray-800 transition-colors"
                        disabled={item.quantity <= 1}
                      >
                        <Minus size={16} />
                      </button>
                      <span className="font-bold text-xl px-4">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityUpdate(item.recordId, Math.min(item.availableStock, item.quantity + 1))}
                        className="bg-black text-white p-2 disabled:bg-gray-400 hover:bg-gray-800 transition-colors"
                        disabled={item.quantity >= item.availableStock}
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="col-span-2 text-right">
                    <div className="bg-yellow-400 inline-block px-4 py-2 font-bold border-4 border-black">
                      €{(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>

                  {/* Remove */}
                  <div className="col-span-1 text-right">
                    <button
                      onClick={() => handleRemoveItem(item.recordId)}
                      className="text-red-600 hover:text-red-800 transition-colors"
                    >
                      <X size={24} />
                    </button>
                  </div>
                </div>
              ))}

              {basket.items.length === 0 && (
                <div className="p-12 text-center">
                  <ShoppingBag size={64} className="mx-auto mb-4 text-gray-400" />
                  <p className="text-xl mb-4 text-gray-600">Your basket is empty</p>
                  <Link
                    to="/products"
                    className="bg-blue-600 text-white px-6 py-3 inline-block font-bold hover:bg-blue-700 transition-colors"
                  >
                    Start Shopping
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Summary Panel - Right Side */}
        <div className="col-span-4">
          <div className="bg-white border-8 border-black sticky top-8">
            <div className="bg-black text-white p-6">
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>€{basket.totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-green-400">Free</span>
                </div>
                <div className="border-t border-gray-600 pt-4">
                  <div className="flex justify-between text-xl font-bold">
                    <span>Total</span>
                    <span>€{basket.totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="text-sm text-gray-400 text-right">Including VAT</div>
                </div>
              </div>

              <div className="space-y-4">
                <EmbbedCheckoutButton
                  items={basket.items}
                  disabled={basket.items.length === 0}
                />
                <Link
                  to="/products"
                  className="w-full bg-blue-600 text-white text-center py-4 font-bold hover:bg-blue-700 transition-colors inline-block"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasketPage;