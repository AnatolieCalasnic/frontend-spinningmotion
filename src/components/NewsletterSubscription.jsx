import React, { useState } from 'react';
import axios from 'axios';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

const NewsletterSubscription = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    // Add console logs to debug
    console.log('Attempting to subscribe with email:', email);

    try {
      const response = await axios.post('http://localhost:8080/subscriber', 
        // Make sure this matches your SubscribeRequest in Java
        {
          email: email
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Subscribe response:', response);

      setStatus({
        type: 'success',
        message: 'Successfully subscribed to new release notifications!'
      });
      setEmail('');
    } catch (error) {
      console.error('Subscribe error:', error);
      
      setStatus({
        type: 'error',
        message: error.response?.data?.message || 'Failed to subscribe. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-black text-2xl font-bold mb-4">JOIN OUR MAILING LIST</h2>
      <form onSubmit={handleSubscribe} className="flex flex-col gap-4">
        <div className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email"
            className="flex-grow p-2 border-2 border-black"
            required
          />
          <button 
            type="submit" 
            className="bg-black text-white px-6 py-2 uppercase font-bold disabled:opacity-50 hover:bg-gray-800"
            disabled={loading || !email}
          >
            {loading ? 'Subscribing...' : 'Subscribe'}
          </button>
        </div>
        
        {status.message && (
          <div className={`flex items-center gap-2 p-2 ${
            status.type === 'success' ? 'text-green-600' : 'text-red-600'
          }`}>
            {status.type === 'success' ? (
              <CheckCircle2 className="h-5 w-5" />
            ) : (
              <AlertCircle className="h-5 w-5" />
            )}
            <span>{status.message}</span>
          </div>
        )}
      </form>
    </div>
  );
};

export default NewsletterSubscription;