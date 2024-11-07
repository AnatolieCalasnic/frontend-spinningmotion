import { useRouter } from "next/navigation";
import { CreditCard } from "lucide-react";

const EmbbedCheckoutButton = ({ items, disabled = false }) => {
  const router = useRouter();

  const handleCheckout = async () => {
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ items }),
      });

      const { sessionId, error } = await response.json();

      if (error) {
        console.error("Error creating checkout session:", error);
        alert("Failed to create checkout session");
        return;
      }

      const stripe = await stripePromise;
      const { error: stripeError } = await stripe.redirectToCheckout({
        sessionId,
      });

      if (stripeError) {
        console.error("Stripe error:", stripeError);
        alert("Failed to redirect to checkout");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong");
    }
  };

  return (
    <button
      onClick={handleCheckout}
      disabled={disabled}
      className="w-full bg-yellow-400 text-black py-4 font-bold hover:bg-yellow-500 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <CreditCard className="mr-2" />
      Checkout
    </button>
  );
};

export default EmbbedCheckoutButton;