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
      <div className="flex flex-col items-center w-full min-h-screen ">
        <div className="p-4 w-full  flex justify-between items-center mb-4 mt-10 ">
          <div>
            <button
              onClick={sortDefault}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded mr-2"
            >
              Default
            </button>
            <button
              onClick={sortLowToHigh}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded mr-2"
            >
              Price: Low to High
            </button>
            <button
              onClick={sortHighToLow}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded"
            >
              Price: High to Low
            </button>
          </div>

          <div className="relative m-4">
            <input
              type="text"
              placeholder="Search "
              className="border border-gray-300 rounded px-3 py-2 w-full md:w-64 pr-8"
              onChange={handleSearchChange}
              value={searchTerm}
            />
            <IoIosSearch className="absolute top-1/2 right-2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-40 gap-y-5 mx-auto">
          {productsWithQuantities
            .filter((product) =>
              product.title.toLowerCase().includes(searchTerm)
            ) //searches with products
            .map((product) => (
              <div
                key={product.id}
                className="bg-white shadow-md rounded-lg overflow-hidden w-72 m-4"
              >
                <img
                  src={product.image}
                  alt={product.title}
                  className="object-contain h-48 w-full"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold">{product.title}</h3>
                  <p className="text-gray-600 text-sm line-clamp-3">
                    {product.description}
                  </p>
                  <p className="text-green-500 font-semibold mt-2">
                    ${product.price}
                  </p>
                  <div className="flex items-center mt-2">
                    <span className="text-yellow-400">★</span>
                    <span className="ml-1">{product.rating.rate}</span>
                    <span className="ml-1 text-gray-500 text-sm">
                      ({product.rating.count} reviews)
                    </span>
                  </div>
                  <div className="flex  items-center justify-evenly">
                    <div className="mt-5">
                      <button
                        className={`text-xl border-none p-3 rounded-full   
                          ${
                            InWishlist(product)
                              ? "bg-red-100 text-red-700"
                              : ""
                          } transition-all duration-300`}
                        onClick={() => addToWishlist(product)}
                      >
                        <FaRegHeart />
                      </button>
                    </div>
                    <div className="text-center mt-4">
                      {product.quantity > 0 ? (
                        <>
                          <button
                            type="button"
                            onClick={() => decrementQuantity(product)}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-1 px-2 rounded-md"
                          >
                            -
                          </button>
                          <span className="mx-2 text-gray-800">
                            {product.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => addToCart(product)}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-2 rounded-md"
                          >
                            +
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={() => addToCart(product)}
                          className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-2 px-2 rounded"
                        >
                          Add to Cart
                        </button>
                      )}
                    </div>
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
