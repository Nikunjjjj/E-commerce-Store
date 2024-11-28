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
                text: `Order ID: ${orderId}\nPayment ID: ${response.razorpay_payment_id}`,
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
    <div className="mt-8 bg-white shadow-lg rounded-lg p-4">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Checkout</h2>
      <div className="border-b border-gray-200 py-2 mb-2">
        <p className="text-gray-600">Subtotal: ${subtotal.toFixed(2)}</p>
      </div>
      <div className="border-b border-gray-200 py-2 mb-2">
        <p className="text-gray-600">GST (18%): ${gstAmount.toFixed(2)}</p>
      </div>
      <div className="py-2">
        <p className="text-lg font-semibold text-gray-800">
          Total: ${total.toFixed(2)}
        </p>
      </div>
      <div className="flex items-center">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 w-48"
          onClick={handleOrder}
          disabled={paymentStatus === "loading"}
        >
          {paymentStatus === "loading" ? "Processing..." : "Place Order"}
        </button>
      </div>
      <div className="ml-4">
        {paymentStatus === "success" && (
          <p className="text-green-500 font-bold">Payment Successful!</p>
        )}
        {paymentStatus === "failed" && (
          <p className="text-red-500 font-bold">Payment Failed!</p>
        )}
      </div>
    </div>
  );
};

export default Checkout;
