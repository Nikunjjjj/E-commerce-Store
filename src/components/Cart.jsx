/* eslint-disable react/prop-types */

import Checkout from "./Checkout";
import { IoCloseOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const Cart = ({ cart, setCart }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCartFromStorage = async () => {
      setIsLoading(true);
      try {
        const storedCart = localStorage.getItem("cart");
        const parsedCart = storedCart ? JSON.parse(storedCart) : [];
        if (cart.length === 0 && parsedCart.length > 0) {
          setCart(parsedCart);
        }
      } catch (error) {
        console.error("Error loading cart from localStorage:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCartFromStorage();
  }, []); // Runs only once on mount

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
    <div className="container mx-auto p-8">
      <div className="mt-10">
        <div className="flex items-center justify-between mt-2">
          <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
          <Link to={"/"}>
            <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mb-6">
              <IoCloseOutline />
            </button>
          </Link>
        </div>

        {isLoading ? (
          <p className="text-center text-gray-500">Loading cart...</p>
        ) : cart?.length === 0 ? (
          <p className="text-center text-gray-500">Your cart is empty.</p>
        ) : (
          <ul className="border border-gray-200 rounded-md overflow-hidden">
            {cart.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between p-4 border-b border-gray-200"
              >
                <div className="flex items-center">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-16 w-16 object-contain mr-4 rounded-md"
                  />
                  <div>
                    <p className="font-medium text-gray-800">{item.title}</p>
                    <p className="text-gray-600 text-sm">
                      Price: ${item.price}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => decrementQuantity(item.id)}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-1 px-2 rounded-md"
                  >
                    -
                  </button>
                  <span className="mx-2 text-gray-800">{item.quantity}</span>
                  <button
                    onClick={() => incrementQuantity(item.id)}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-1 px-2 rounded-md"
                  >
                    +
                  </button>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
            <Link to={"/"}>
              <button
                onClick={() => {
                  setCart([]); // Clear cart state
                  localStorage.setItem("cart", JSON.stringify([])); // Clear local storage
                }}
                className="bg-red-600 hover:bg-red-800 text-white py-2 px-4 mt-4 ml-4 rounded shadow"
              >
                Clear Cart
              </button>
            </Link>
            <Checkout cart={cart} />
          </ul>
        )}
      </div>
    </div>
  );
};

export default Cart;
