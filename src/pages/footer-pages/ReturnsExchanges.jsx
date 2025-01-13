import React from 'react';

const ReturnsExchanges = () => {
  return (
    <div className="relative min-h-screen bg-black text-white">
      <div className="container mx-auto py-16 px-6">
        <h1 className="text-blue-500 text-5xl font-extrabold text-center mb-12">
          Returns & Exchanges
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="relative p-8 bg-white text-black border-4 border-red-600">
            <h2 className="text-3xl font-bold mb-4">How to Return?</h2>
            <p className="text-lg">
              Pack the item securely and send it to:
              <br />
              Vinyl Street 65, Eindhoven.
            </p>
            <div className="absolute -top-4 -left-4 w-16 h-16 bg-yellow-500 transform rotate-45"></div>
          </div>
          <div className="relative p-8 bg-red-600 text-white border-4 border-blue-500">
            <h2 className="text-3xl font-bold mb-4">Refund Policy</h2>
            <p className="text-lg">
              Refunds are processed within 14 business days upon receiving the
              item.
            </p>
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-yellow-500 transform rotate-45"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReturnsExchanges;
