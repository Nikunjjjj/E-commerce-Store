/* eslint-disable react/prop-types */
import { useState } from "react";
import swal from "sweetalert";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

const Checkout = ({ cart, setCart }) => {
  const navigate = useNavigate();
  const [orderId] = useState(uuidv4()); // Generate order ID when component mounts

  const subtotal = cart.reduce(
    (accumulator, item) => accumulator + item.price * item.quantity,
    0
  );
  const gstRate = 0.18;
  const gstAmount = subtotal * gstRate;
  const total = subtotal + gstAmount;

  const [paymentStatus, setPaymentStatus] = useState(null);

  const initializeRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";

      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };

      document.body.appendChild(script);
    });
  };

  const handleOrder = async () => {
    setPaymentStatus("loading");
    let timeoutId;

    try {
      const res = await initializeRazorpay();

      if (!res) {
        swal({
          title: "Error!",
          text: "Razorpay SDK failed to load. Are you online?",
          icon: "error",
        });
        setPaymentStatus(null);
        return;
      }

      const options = {
        key: "rzp_test_GZ5gpKSKDoFi4K",
        amount: Math.round(total * 100),
        currency: "INR",
        name: "E-Commerce store",
        description: `Order ID: ${orderId}`, // Include order ID in description
        image:
          "https://png.pngtree.com/png-vector/20210315/ourlarge/pngtree-k-logo-design-png-image_3055797.png",
        handler: function (response) {
          clearTimeout(timeoutId);

          // Store order details in localStorage
          const orderDetails = {
            orderId: orderId,
            paymentId: response.razorpay_payment_id,
            amount: total,
            items: cart,
            date: new Date().toISOString(),
          };

          // Get existing orders or initialize empty array
          const existingOrders = JSON.parse(
            localStorage.getItem("orders") || "[]"
          );
          existingOrders.push(orderDetails);
          localStorage.setItem("orders", JSON.stringify(existingOrders));

          swal({
            title: "Payment Success!",
            text: "Click Yes to see order details",
            icon: "success",
          }).then((willShow) => {
            if (willShow) {
              swal({
                title: "Order Details",
                text: `Payment ID: ${response.razorpay_payment_id}`,
                icon: "success",
              }).then(() => {
                setCart([]);
                localStorage.setItem("cart", JSON.stringify([]));
                navigate("/");
              });
            } else {
              swal("Thank You for Shopping!").then(() => navigate("/"));
            }
          });
          setPaymentStatus("success");
        },
      };

      const paymentObject = new window.Razorpay(options);
      timeoutId = setTimeout(() => {
        setPaymentStatus(null);
        swal({
          title: "Payment Timeout",
          text: "Payment timed out. Please try again.",
          icon: "warning",
        });
      }, 5000);
      paymentObject.open();
    } catch (error) {
      clearTimeout(timeoutId);
      console.error("Payment error:", error);
      swal({
        title: "Error!",
        text: "Payment failed. Please try again.",
        icon: "error",
      });
      setPaymentStatus("failed");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-sm mt-8">
      {/* Order Summary Header */}
      <div className="border-b border-gray-200">
        <h2 className="px-6 py-4 text-lg font-semibold text-gray-900">
          Price Details
        </h2>
      </div>

      {/* Price Breakdown */}
      <div className="p-6">
        <div className="space-y-4">
          {/* Item Total */}
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Bag Total</span>
            <span className="text-gray-900">₹{subtotal.toFixed(2)}</span>
          </div>

          {/* GST */}
          <div className="flex justify-between items-center">
            <span className="text-gray-600">GST</span>
            <span className="text-gray-900">₹{gstAmount.toFixed(2)}</span>
          </div>

          {/* Delivery */}
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Delivery Charges</span>
            <span className="text-green-500">FREE</span>
          </div>

          {/* Total */}
          <div className="flex justify-between items-center pt-4 border-t border-gray-200">
            <span className="text-lg font-semibold text-gray-900">
              Total Amount
            </span>
            <span className="text-lg font-semibold text-gray-900">
              ₹{total.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Place Order Button */}
        <div className="mt-6">
          <button
            onClick={handleOrder}
            disabled={paymentStatus === "loading"}
            className={`w-full rounded-md px-4 py-3 text-sm font-medium text-white transition-colors
            ${
              paymentStatus === "loading"
                ? "bg-yellow-300 cursor-not-allowed"
                : "bg-yellow-500 hover:bg-yellow-600"
            }`}
          >
            {paymentStatus === "loading" ? (
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </div>
            ) : (
              "PLACE ORDER"
            )}
          </button>
        </div>

        {/* Payment Status Messages */}
        {paymentStatus && (
          <div className="mt-4">
            {paymentStatus === "success" && (
              <div className="flex items-center justify-center text-green-500 bg-green-50 p-3 rounded-md">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-medium">Payment Successful!</span>
              </div>
            )}
            {paymentStatus === "failed" && (
              <div className="flex items-center justify-center text-red-500 bg-red-50 p-3 rounded-md">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-medium">Payment Failed!</span>
              </div>
            )}
          </div>
        )}

       
      </div>
    </div>
  );
};

export default Checkout;
