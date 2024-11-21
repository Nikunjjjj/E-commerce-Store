/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useGetProductsQuery } from "../api/BaseUrl";

const ProductList = ({ cart, setCart }) => {
  // Destructure the data from the useGetProductsQuery hook
  const { data: productsData } = useGetProductsQuery();

  // State variable to manage the sorting option
  const [sortOption, setSortOption] = useState("default");

  // useEffect hook to initialize the cart from localStorage when the component mounts
  useEffect(() => {
    const storedCart = localStorage.getItem("cart"); // Get cart data from localStorage
    if (storedCart) {
      // If cart data exists in localStorage
      setCart(JSON.parse(storedCart)); // Parse the JSON string and update the cart state
    }
  }, [setCart]); // Only re-run the effect if setCart changes

  // Function to update the cart in both state and localStorage
  const updateCartAndStorage = (updatedCart) => {
    setCart(updatedCart); // Update the cart state
    localStorage.setItem("cart", JSON.stringify(updatedCart)); // Update cart data in localStorage
  };

  // Function to add a product to the cart
  const addToCart = (product) => {
    const existingItemIndex = cart.findIndex((item) => item.id === product.id); // Check if product already exists in cart
    const newCart = [...cart]; // Create a copy of the current cart array
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
      const newCart = [...cart]; // Create a copy of the cart array
      newCart[existingItemIndex].quantity -= 1; // Decrement the quantity
      updateCartAndStorage(newCart); // Update the cart in state and localStorage
    } else if (existingItemIndex !== -1) {
      // If product exists and quantity is 1
      removeFromCart(product.id); // Remove the product from the cart
    }
  };

  // Function to remove a product from the cart
  const removeFromCart = (productId) => {
    const updatedCart = cart.filter((item) => item.id !== productId); // Filter out the product with the given ID
    updateCartAndStorage(updatedCart); // Update the cart in state and localStorage
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

  return (
    <>
      <div className="p-4 text-center ">
        <div className="flex justify-center mb-4 mt-10">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
          {productsWithQuantities.map((product) => (
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
                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-1 px-2 rounded-md"
                      >
                        +
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => addToCart(product)}
                      className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded"
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
