import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ShoppingBag, CheckCircle } from 'lucide-react';

const SuccessPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (sessionId) {
      // Clear the basket
      localStorage.removeItem('guestBasket');
      
      const verifySession = async () => {
        try {
          const response = await fetch(`http://localhost:8080/api/payment/verify-session/${sessionId}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            }
          });
          
          if (!response.ok) {
            console.error('Session verification failed');
            navigate('/basket');
          }
        } catch (error) {
          console.error('Error verifying session:', error);
          navigate('/basket');
        }
      };
      
      verifySession();
    }
  }, [sessionId, navigate]);

  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="bg-white border-8 border-black">
        {/* Header */}
        <div className="bg-green-600 p-6 border-b-8 border-black">
          <div className="flex items-center justify-center space-x-4">
            <CheckCircle size={32} className="text-white" />
            <h1 className="text-3xl font-bold text-white">Order Confirmed!</h1>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 text-center">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Thank You for Your Purchase!</h2>
            <p className="text-gray-600">
              Your order has been successfully processed.
              {sessionId && <span className="block text-sm mt-2">Order reference: {sessionId}</span>}
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-4">
            <button
              onClick={() => navigate('/products')}
              className="bg-blue-600 text-white px-8 py-4 font-bold hover:bg-blue-700 transition-colors flex items-center justify-center mx-auto"
            >
              <ShoppingBag className="mr-2" />
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;