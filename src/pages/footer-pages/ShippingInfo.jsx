import React from 'react';

const ShippingInfo = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-500 via-white to-yellow-500 overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
      </div>
      <div className="relative z-10 container mx-auto py-16 px-6 text-black">
        <h1 className="text-5xl font-extrabold text-center mb-8">
          Shipping Information
        </h1>
        <div className="space-y-8">
          <p className="text-xl font-medium">
            🚚 Standard Shipping: 3-5 business days within the EU.
          </p>
          <p className="text-xl font-medium">
            ✈️ International Shipping: 7-14 business days worldwide.
          </p>
          <p className="text-xl font-medium">
            🛑 Free Shipping: Orders over €100.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ShippingInfo;
