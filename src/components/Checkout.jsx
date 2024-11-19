/* eslint-disable react/prop-types */

const Checkout = ({ cart }) => {
  const subtotal = cart.reduce(
    (accumulator, item) => accumulator + item.price * item.quantity,
    0
  ); // Calculate subtotal
  const gstRate = 0.18; // 18% GST rate
  const gstAmount = subtotal * gstRate;
  const total = subtotal + gstAmount;

  const handleOrder = () => {
    alert(`Order Placed: 
              Subtotal: $${subtotal.toFixed(2)}
              GST (18%): $${gstAmount.toFixed(2)}
              Total: $${total.toFixed(2)}`);
  };

  return (
    <div className="mt-8 bg-white shadow-lg rounded-lg p-4 ">
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
        onClick={handleOrder}
        className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Place Order
      </button>
    </div>
  );
};

export default Checkout;
