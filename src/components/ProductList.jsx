/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useGetProductsQuery } from "../api/BaseUrl";
import { IoIosSearch } from "react-icons/io";
import { FaRegHeart } from "react-icons/fa";

const ProductList = ({ cart, setCart, wishlist, setWishlist }) => {
  // Destructure the data from the useGetProductsQuery hook
  const { data: productsData } = useGetProductsQuery();

  // State variable to manage the sorting option
  const [sortOption, setSortOption] = useState("default");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const storedCart = localStorage.getItem("cart"); // Get cart data from localStorage
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }

    const storedWishlist = localStorage.getItem("wishlist"); // Load wishlist on mount
    if (storedWishlist) {
      setWishlist(JSON.parse(storedWishlist));
    }
  }, []);

  // Function to update the cart in both state and localStorage
  const updateCartAndStorage = (updatedCart) => {
    setCart(updatedCart); // Update the cart state
    localStorage.setItem("cart", JSON.stringify(updatedCart)); // Update cart data in localStorage
  };

  const updateWishlistStorage = (updatedWishlist) => {
    setWishlist(updatedWishlist);
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
  };

  const addToCart = (product) => {
    const existingItemIndex = cart.findIndex((item) => item.id === product.id);
    const newCart = [...cart];
    if (existingItemIndex !== -1) {
      // If product already exists
      newCart[existingItemIndex].quantity += 1; // Increment its quantity
    } else {
      // If product doesn't exist
      newCart.push({ ...product, quantity: 1 }); // Add the product to the cart with quantity 1
    }
    updateCartAndStorage(newCart); // Update the cart in state and localStorage
  };

  // Function to decrement the quantity of a product in the cart
  const decrementQuantity = (product) => {
    const existingItemIndex = cart.findIndex((item) => item.id === product.id); // Find the index of the product in the cart
    if (existingItemIndex !== -1 && cart[existingItemIndex].quantity > 1) {
      // If product exists and quantity is > 1
      const newCart = [...cart];
      newCart[existingItemIndex].quantity -= 1;
      updateCartAndStorage(newCart);
    } else if (existingItemIndex !== -1) {
      // If product exists and quantity is 1
      removeFromCart(product.id); // Remove the product from the cart
    }
  };

  // Function to remove a product from the cart
  const removeFromCart = (productId) => {
    const updatedCart = cart.filter((item) => item.id !== productId); // Filter out the product with the given ID
    updateCartAndStorage(updatedCart);
  };

  // Function to set the sorting option to "lowToHigh"
  const sortLowToHigh = () => {
    setSortOption("lowToHigh");
  };

  // Function to set the sorting option to "highToLow"
  const sortHighToLow = () => {
    setSortOption("highToLow");
  };

  // Function to set the sorting option to "default"
  const sortDefault = () => {
    setSortOption("default");
  };

  // Create a copy of productsData and sort it based on sortOption
  let sortedProducts = productsData?.length > 0 ? [...productsData] : [];
  if (sortOption === "lowToHigh") {
    sortedProducts.sort((a, b) => a.price - b.price);
  } else if (sortOption === "highToLow") {
    sortedProducts.sort((a, b) => b.price - a.price);
  }

  // Map through sortedProducts and add quantity from cart if it exists
  const productsWithQuantities = sortedProducts.map((product) => ({
    ...product,
    quantity: cart.find((item) => item.id === product.id)?.quantity || 0,
  }));

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value.toLowerCase()); // Update the search term state
  };

  const addToWishlist = (product) => {
    const updatedWishlist = wishlist.some((item) => item.id === product.id)
      ? wishlist.filter((item) => item.id !== product.id)
      : [...wishlist, product];

    updateWishlistStorage(updatedWishlist);
    setWishlist(updatedWishlist);
  };

  const InWishlist = (product) =>
    wishlist.some((item) => item.id === product.id);

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen mt-20">
        {/* Filter and Search Bar */}
        <div className=" top-0 z-10 bg-white shadow-sm py-4 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Sort Buttons */}
            <div className="flex space-x-2">
              <button
                onClick={sortDefault}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
              >
                Default
              </button>
              <button
                onClick={sortLowToHigh}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
              >
                Price: Low to High
              </button>
              <button
                onClick={sortHighToLow}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
              >
                Price: High to Low
              </button>
            </div>

            {/* Search Bar */}
            <div className="relative w-full md:w-72">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-4 pr-10 py-2 border rounded-lg  focus:ring-yellow-500 focus:border-yellow-500"
                onChange={handleSearchChange}
                value={searchTerm}
              />
              <IoIosSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-20">
          {productsWithQuantities
            .filter((product) =>
              product.title.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                {/* Product Image */}
                <div className="relative group">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-64 object-contain p-4 bg-white transition-transform duration-300 group-hover:scale-105"
                  />
                  <button
                    className={`absolute top-4 right-4 p-2 rounded-full transition-all duration-300 ${
                      InWishlist(product)
                        ? "bg-red-50 text-red-600"
                        : "bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-600"
                    }`}
                    onClick={() => addToWishlist(product)}
                  >
                    <FaRegHeart className="w-5 h-5" />
                  </button>
                </div>

                {/* Product Details */}
                <div className="p-4">
                  <div className="mb-2">
                    <h3 className="text-lg font-medium text-gray-900 line-clamp-2 hover:line-clamp-none">
                      {product.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                      {product.description}
                    </p>
                  </div>

                  {/* Price and Rating */}
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-lg font-semibold text-gray-900">
                      ${product.price.toFixed(2)}
                    </p>
                    <div className="flex items-center">
                      <span className="text-yellow-400">★</span>
                      <span className="ml-1 text-sm font-medium text-gray-600">
                        {product.rating.rate}
                      </span>
                      <span className="mx-1 text-gray-400">·</span>
                      <span className="text-sm text-gray-500">
                        {product.rating.count} reviews
                      </span>
                    </div>
                  </div>

                  {/* Add to Cart Button */}
                  <div className="mt-4">
                    {product.quantity > 0 ? (
                      <div className="flex justify-center items-center space-x-3">
                        <button
                          onClick={() => decrementQuantity(product)}
                          className="w-8 h-8 flex items-center justify-center rounded-full bg-yellow-50 text-yellow-600 hover:bg-yellow-100"
                        >
                          -
                        </button>
                        <span className="text-gray-900 font-medium">
                          {product.quantity}
                        </span>
                        <button
                          onClick={() => addToCart(product)}
                          className="w-8 h-8 flex items-center justify-center rounded-full bg-yellow-50 text-yellow-600 hover:bg-yellow-100"
                        >
                          +
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => addToCart(product)}
                        className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                      >
                        Add to Cart
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

export default ProductList;
