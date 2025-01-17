import React, { useRef, useState, useCallback } from 'react';
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout
} from "@stripe/react-stripe-js";
import { CreditCard, X } from "lucide-react";
import { useAuth } from '../context/AuthContext';
import GuestCheckoutForm from './GuestCheckoutForm'; 

const EmbeddedCheckoutButton = ({ items, disabled = false, quickBuy = false, appliedCoupon }) => {
  const { user } = useAuth();
  const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);
  const [showCheckout, setShowCheckout] = useState(false);
  const [guestDetails, setGuestDetails] = useState(null);
  const [showGuestForm, setShowGuestForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const modalRef = useRef(null);

  const handleGuestSubmit = (formData) => {
    setGuestDetails(formData);
    setShowGuestForm(false);
    initiateCheckout();
  };
  const initiateCheckout = () => {
    if (!items.length) {
      alert("Your basket is empty");
      return;
    }
    setShowCheckout(true);
  };
  const fetchClientSecret = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:8080/api/payment/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Origin": window.location.origin
        },
        body: JSON.stringify({ 
          items: items.map(item => ({
            recordId: item.recordId,
            title: item.title,
            artist: item.artist,
            condition: item.condition,
            price: item.price,
            quantity: item.quantity
          })),
          metadata: {
            userId: user?.id ? String(user.id) : null, // Send user ID if logged in
            isGuest:  !user || !user.id, // true if no user is logged in
            couponCode: appliedCoupon?.couponCode
          },
          coupon: appliedCoupon ? {
            code: appliedCoupon.couponCode,
            discountPercentage: appliedCoupon.discountPercentage,
            isValid: await validateCouponBeforeCheckout(appliedCoupon.couponCode)
          } : null,
            guestDetails: !user ? {
              fname: guestDetails.fname,
              lname: guestDetails.lname,
              email: guestDetails.email,
              address: guestDetails.address,
              postalCode: guestDetails.postalCode,
              country: guestDetails.country,
              city: guestDetails.city,
              region: guestDetails.region,
              phonenum: guestDetails.phonenum
          } : null
        }),
      });



      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.clientSecret;
    } catch (error) {
      console.error("Error fetching client secret:", error);
      alert("Unable to start checkout process. Please try again later.");
      throw error;
    } finally {
      setLoading(false);
    }
  }, [items, user, guestDetails, appliedCoupon]);

  const validateCouponBeforeCheckout = async (couponCode) => {
    try {
      const response = await fetch(`http://localhost:8080/coupons/validate/${couponCode}`);
      return response.ok;
    } catch (error) {
      console.error("Coupon validation failed", error);
      return false;
    }
  };
  const calculateTotal = () => {
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    if (appliedCoupon) {
      const discount = (subtotal * appliedCoupon.discountPercentage) / 100;
      return subtotal - discount;
    }
    return subtotal;
  };

  const handleCheckoutClick = () => {
    if (!items.length) {
      alert("Your basket is empty");
      return;
    }
    // Modified to show guest form first for non-logged-in users
    if (!user && !guestDetails) {
      setShowGuestForm(true);
    } else {
      setShowCheckout(true);
    }
    modalRef.current?.showModal();
  };

  const handleCloseModal = () => {
    setShowCheckout(false);
    setShowGuestForm(false);
    setGuestDetails(null);
    modalRef.current?.close();
  };

  return (
    <>
      <button
        onClick={handleCheckoutClick}
        disabled={disabled || loading}
        className="w-full bg-yellow-400 text-black py-4 font-bold hover:bg-yellow-500 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <CreditCard className="mr-2" />
        {loading ? "Processing..." : "Checkout"}
      </button>

      <dialog 
        ref={modalRef} 
        className="modal modal-bottom sm:modal-middle transition-all duration-300 ease-in-out"
        onClick={(e) => {
          if (e.target === modalRef.current) handleCloseModal();
        }}
      >
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" aria-hidden="true" />
        <div className="modal-box w-full max-w-6xl bg-white border-8 border-black p-0 shadow-2xl transform transition-all duration-300">
        <div className="bg-red-600 p-6 flex justify-between items-center border-b-8 border-black">
            <h3 className="font-bold text-2xl text-white">
              {showGuestForm ? "Enter Shipping Details" : "Complete Your Purchase"}
            </h3>
            <button 
              onClick={handleCloseModal}
              className="bg-black text-white p-2 hover:bg-gray-800 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
            {/* Order Summary - Left side */}
            <div className="border-8 border-black p-6 bg-white">
              <h4 className="font-bold text-xl mb-4 bg-yellow-400 p-3 border-4 border-black inline-block">
                Order Summary
              </h4>
              <div className="space-y-4">
                {items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center border-b-2 border-black pb-2">
                    <span className="font-bold">{item.title} × {item.quantity}</span>
                    <span className="bg-blue-600 text-white px-3 py-1">
                      €{(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
                <div className="border-t-4 border-black pt-4 mt-4">
                  <div className="flex justify-between items-center font-bold text-xl">
                    <span>Total</span>
                    <span className="bg-yellow-400 px-4 py-2 border-4 border-black">
                    €{calculateTotal().toFixed(2)}
                    </span>
                  </div>
                  {appliedCoupon && (
                  <div className="text-green-500 text-sm mt-2">
                    {appliedCoupon.discountPercentage}% discount applied
                  </div>
                )}
                </div>
              </div>
            </div>

            {/* Stripe Checkout - Right side */}
            <div className="border-8 border-black bg-white">
              {showGuestForm ? (
                <GuestCheckoutForm onSubmit={handleGuestSubmit} />
              ) : showCheckout && (
                <EmbeddedCheckoutProvider 
                  stripe={stripePromise} 
                  options={{ fetchClientSecret }}
                >
                  <EmbeddedCheckout className="h-full" />
                </EmbeddedCheckoutProvider>
              )}
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default EmbeddedCheckoutButton;

