/* eslint-disable react/prop-types */
import  { useState } from 'react';
import Razorpay from 'razorpay';


const Checkout = ({ cart }) => {
  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };


  const subtotal = cart.reduce((accumulator, item) => accumulator + item.price * item.quantity, 0);
  const gstRate = 0.18;
  const gstAmount = subtotal * gstRate;
  const total = subtotal + gstAmount;
  const [paymentStatus, setPaymentStatus] = useState(null);


  const handleOrder = async () => {
    setPaymentStatus('loading');
    try {
      const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
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
        key: "rzp_test_GZ5gpKSKDoFi4K", // Replace with your actual test key
        amount: Math.round(total * 100), // Amount in paise
        currency: "INR",
        name: "Sports-K",
        description: "Thank You for Purchase",
        image: "https://png.pngtree.com/png-vector/20210315/ourlarge/pngtree-k-logo-design-png-image_3055797.png",
        handler: function (response) {
          //This is where you would normally send the response to your server for verification.  But this is insecure!
          swal({
            title: "Payment Success!",
            text: "Your Payment ID: " + response.razorpay_payment_id,
            icon: "success",
          });
          setPaymentStatus('success');
        },
        prefill: {
          name: "Nikunj Bakre", //Get this from your form
          email: "manuarorawork@gmail.com", //Get this from your form
          contact: "9999999999", //Get this from your form
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error('Payment error:', error);
      swal({
        title: "Error!",
        text: "Payment failed. Please try again.",
        icon: "error",
      });
      setPaymentStatus('failed');
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
        <p className="text-lg font-semibold text-gray-800">Total: ${total.toFixed(2)}</p>
      </div>
      <button onClick={handleOrder} disabled={paymentStatus === 'loading'}>
        {paymentStatus === 'loading' ? 'Processing...' : 'Place Order'}
      </button>
      {paymentStatus === 'success' && <p>Payment Successful!</p>}
      {paymentStatus === 'failed' && <p>Payment Failed!</p>}
    </div>
  );
};

export default Checkout;
