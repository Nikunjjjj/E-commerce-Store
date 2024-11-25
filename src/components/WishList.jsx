/* eslint-disable react/prop-types */
import { useEffect } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { IoCloseOutline } from "react-icons/io5";
import { Link } from "react-router-dom";

const WishList = ({ wishlist, setWishlist, cart, setCart }) => {
  useEffect(() => {
    const loadWishListFromStorage = () => {
      try {
        const storedWishlistString = localStorage.getItem("wishlist");
        let storedWishlist = []; // Initialize as an empty array

        if (storedWishlistString) {
          storedWishlist = JSON.parse(storedWishlistString);
        }

        if (wishlist.length === 0 && storedWishlist.length > 0) {
          setWishlist(storedWishlist);
        }
      } catch (error) {
        console.error("Error loading wishlist:", error);
      }
    };
    loadWishListFromStorage();
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
    } catch (error) {
      console.error("Error saving wishlist:", error);
    }
  }, [wishlist]);

  const removeFromWishlist = (product) => {
    setWishlist(wishlist.filter((item) => item.id !== product));
  };

  const moveToCart = (product) => {
    const existingItemIndex = cart.findIndex((item) => item.id === product.id);
    const updatedCart = [...cart]; // Create a copy

    if (existingItemIndex !== -1) {
      // Item already exists, increment quantity
      updatedCart[existingItemIndex].quantity =
        updatedCart[existingItemIndex].quantity || 0;
      alert("This item already exists in your cart");
    }
    // Item doesn't exist, add it with quantity 1
    else updatedCart.push({ ...product, quantity: 1 });
    setCart(updatedCart); // Update the state here too
  };

  return (
    <div className="container mx-auto p-4 mt-12">
      <div className="flex items-center justify-between mt-2">
        <h1 className="text-3xl font-bold mb-6">Your Wishlist</h1>
        <Link to={"/"}>
          <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mb-6">
            <IoCloseOutline />
          </button>
        </Link>
      </div>
      {wishlist.length === 0 ? (
        <p className="text-center text-gray-500">Your wishlist is empty.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlist.map((product) => (
            <div
              key={product.id}
              className="relative bg-white shadow-md rounded-lg overflow-hidden w-72 m-4" //Added relative
            >
              <span
                className="absolute top-2 right-2  text-gray-700 text-xl font-bold rounded-full p-1 cursor-pointer" //Improved styling
                onClick={() => removeFromWishlist(product.id)} //Added onClick handler
              >
                <IoCloseSharp />
              </span>
              <img
                src={product.image}
                alt={product.title}
                className="object-contain h-32 w-full mt-10"
              />
              <div className="p-4">
                <h3 className="text-base font-semibold">{product.title}</h3>
                <p className="text-green-500 font-semibold mt-2">
                  ${product.price}
                </p>
                <div className="flex items-center mt-2">
                  <span className="text-yellow-400">★</span>
                  <span className=" ml-1">{product.rating.rate}</span>
                  <span className="ml-1 text-gray-500 text-sm">
                    ({product.rating.count} reviews)
                  </span>
                </div>
                <div className="text-center mt-4">
                  <button
                    onClick={() => moveToCart(product)} //Added onClick handler for moveToCart
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                  >
                    Move to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishList;
