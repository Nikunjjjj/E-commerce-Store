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
      removeFromWishlist(product.id);
    }
    // Item doesn't exist, add it with quantity 1
    else {
      updatedCart.push({ ...product, quantity: 1 });
      removeFromWishlist(product.id);
    }
    setCart(updatedCart); // Update the state here too
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-gray-50 mt-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Wishlist</h1>
            <p className="text-gray-500 mt-1">{wishlist.length} Items</p>
          </div>
          <Link to="/">
            <button className="text-gray-500 hover:text-gray-700 transition-colors">
              <IoCloseOutline className="w-6 h-6" />
            </button>
          </Link>
        </div>

        {wishlist.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 bg-white rounded-lg shadow-sm">
            <p className="text-gray-500 text-lg mb-4">Your wishlist is empty</p>
            <Link to="/">
              <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-3 px-6 rounded-md transition-colors">
                Continue Shopping
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlist.map((product) => (
              <div
                key={product.id}
                className="group relative bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Wishlist Remove Button */}
                <button
                  onClick={() => removeFromWishlist(product.id)}
                  className="absolute top-3 right-3 z-10 p-1.5 bg-white rounded-full shadow-sm hover:shadow-md transition-all opacity-0 group-hover:opacity-100"
                >
                  <IoCloseSharp className="w-4 h-4 text-gray-600" />
                </button>

                {/* Product Image */}
                <div className="relative pt-[70%]">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="absolute top-0 left-0 w-full h-48 object-contain p-4"
                  />
                </div>

                {/* Product Details */}
                <div className="p-4">

                  {/* Product Title */}
                  <h3 className="text-sm text-gray-900 font-medium mb-2 line-clamp-2">
                    {product.title}
                  </h3>

                  {/* Price Section */}
                  <div className="flex items-center mb-2">
                    <span className="text-gray-900 font-semibold">
                      ₹{product.price}
                    </span>
                    <span className="ml-2 text-gray-500 line-through text-sm">
                      ₹{(product.price * 1.2).toFixed(2)}
                    </span>
                    <span className="ml-2 text-yellow-500 text-sm">
                      (20% OFF)
                    </span>
                  </div>

                  {/* Ratings */}
                  <div className="flex items-center mb-4">
                    <div className="flex items-center bg-green-500 text-white px-2 py-0.5 rounded text-sm">
                      <span>{product.rating.rate}</span>
                      <span className="text-yellow-300 ml-1">★</span>
                    </div>
                    <span className="ml-2 text-gray-500 text-sm">
                      ({product.rating.count})
                    </span>
                  </div>

                  {/* Move to Bag Button */}
                  <button
                    onClick={() => moveToCart(product)}
                    className="w-full bg-white text-yellow-500 border border-yellow-500 hover:bg-yellow-50 font-medium py-2.5 px-4 rounded-md transition-colors"
                  >
                    MOVE TO BAG
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishList;
