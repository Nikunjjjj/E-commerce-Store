/* eslint-disable react/prop-types */
import swal from "sweetalert";

const Checkout = ({ cart }) => {
  const subtotal = cart.reduce(
    (accumulator, item) => accumulator + item.price * item.quantity,
    0
  );
  const gstRate = 0.18;
  const gstAmount = subtotal * gstRate;
  const total = subtotal + gstAmount;

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
    let timeoutId;

    try {
      const res = await initializeRazorpay();

      if (!res) {
        swal({
          title: "Error!",
          text: "Razorpay SDK failed to load. Are you online?",
          icon: "error",
        });
        return;
      }

      const options = {
        key: "rzp_test_GZ5gpKSKDoFi4K", // Replace with your actual test key
        amount: Math.round(total * 100), // Amount in paise
        currency: "INR",
        name: "E-Commerce store",
        description: "Thank You for Purchase",
        image:
          "https://png.pngtree.com/png-vector/20210315/ourlarge/pngtree-k-logo-design-png-image_3055797.png",
        handler: function (response) {
          clearTimeout(timeoutId);
          swal({
            title: "Payment Success!",
            text: "Your Payment ID: " + response.razorpay_payment_id,
            icon: "success",
          });
        },
      };

      const paymentObject = new window.Razorpay(options);
      timeoutId = setTimeout(() => {
        //Reset status if payment is not completed
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

      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 w-48"
        onClick={handleOrder}
      >
        Place Order
      </button>
    </div>
  );
};

export default Checkout;
