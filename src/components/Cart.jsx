/* eslint-disable react/prop-types */
import Checkout from "./Checkout";
import { IoCloseOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import { useEffect } from "react";

const Cart = ({ cart, setCart }) => {
  useEffect(() => {
    const loadCartFromStorage = () => {
      try {
        const storedCartString = localStorage.getItem("cart");
        let storedCart = []; // Initialize as an empty array

        if (storedCartString) {
          try {
            storedCart = JSON.parse(storedCartString);
          } catch (parseError) {
            console.error("Error parsing cart from localStorage:", parseError);
            // Handle the case where localStorage contains invalid JSON.
            // You might want to clear localStorage here to prevent future issues.
            localStorage.removeItem("cart");
          }
        }

        if (cart.length === 0 && storedCart.length > 0) {
          setCart(storedCart);
        }
      } catch (error) {
        console.error("Error loading cart from localStorage:", error);
      }
    };
    loadCartFromStorage();
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(cart));
    } catch (error) {
      console.error("Error saving cart to localStorage:", error);
    }
  }, [cart]);

  const incrementQuantity = (productId) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decrementQuantity = (productId) => {
    setCart((prevCart) => {
      return prevCart
        .map((item) =>
          item.id === productId
            ? { ...item, quantity: Math.max(0, item.quantity - 1) }
            : item
        )
        .filter((item) => item.quantity > 0);
    });
  };

  const removeItem = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-gray-50 mt-10">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
          <Link to="/">
            <button className="text-gray-500 hover:text-gray-700 transition-colors">
              <IoCloseOutline className="w-6 h-6" />
            </button>
          </Link>
        </div>

        {cart?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <p className="text-gray-500 text-lg mb-4">
              Your shopping bag is empty
            </p>
            <Link to="/">
              <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-3 px-6 rounded-md transition-colors">
                Continue Shopping
              </button>
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {cart.map((item) => (
              <div key={item.id} className="p-6 flex items-center space-x-6">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-24 h-24 object-contain rounded-md border border-gray-200"
                />
                <div className="flex-1">
                  <h3 className="text-gray-900 font-medium">{item.title}</h3>
                  <div className="flex items-center mt-2">
                    <span className="text-gray-900 font-semibold">
                      ${item.price}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center border border-gray-300 rounded-md">
                    <button
                      onClick={() => decrementQuantity(item.id)}
                      className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 border-x border-gray-300">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => incrementQuantity(item.id)}
                      className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-yellow-500 hover:text-yellow-600 font-medium"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

            <div className="p-6 bg-gray-50">
              <div className="flex justify-between items-center mb-6">
                <Link to="/">
                  <button
                    onClick={() => {
                      setCart([]);
                      localStorage.setItem("cart", JSON.stringify([]));
                    }}
                    className="text-yellow-500 hover:text-yellow-600 font-medium transition-colors"
                  >
                    Clear Cart
                  </button>
                </Link>
                <div className="text-right">
                  <p className="text-gray-700">Total Items: {cart.length}</p>
                  <p className="text-xl font-bold text-gray-900 mt-1">
                    Total: $
                    {cart
                      .reduce(
                        (acc, item) => acc + item.price * item.quantity,
                        0
                      )
                      .toFixed(2)}
                  </p>
                </div>
              </div>

              <Checkout
                cart={cart}
                setCart={setCart}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-3 px-6 rounded-md transition-colors"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
