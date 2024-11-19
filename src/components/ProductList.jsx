/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { getProducts } from "../api/BaseUrl";

const ProductList = ({ cart, setCart }) => {
  const [productsData, setProductsData] = useState([]);
  const [isError, setIsError] = useState(false);
  const [sortOption, setSortOption] = useState("default"); // Add sort state

  const getProductsData = async () => {
  
    try {
      const res = await getProducts();
      const initialCart = localStorage.getItem("cart")
        ? JSON.parse(localStorage.getItem("cart"))
        : [];

      if (cart.length === 0 && initialCart.length > 0) {
        setCart(initialCart);
      }

      const productsWithQuantities = res.data.map((product) => ({
        ...product,
        quantity: cart.find((item) => item.id === product.id)?.quantity || 0,
      }));
      setProductsData(productsWithQuantities);
    } catch (error) {
      setIsError(true);
      console.error("Error fetching products:", error);
    } 
  };

  useEffect(() => {
    getProductsData();
  }, [cart]);

  const updateCartAndStorage = (updatedCart) => {
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const addToCart = (product) => {
    const existingItemIndex = cart.findIndex((item) => item.id === product.id);
    const newCart = [...cart];

    if (existingItemIndex !== -1) {
      newCart[existingItemIndex].quantity += 1;
    } else {
      newCart.push({ ...product, quantity: 1 });
    }

    updateCartAndStorage(newCart);
  };

  const decrementQuantity = (product) => {
    const existingItemIndex = cart.findIndex((item) => item.id === product.id);

    if (existingItemIndex !== -1 && cart[existingItemIndex].quantity > 1) {
      const newCart = [...cart];
      newCart[existingItemIndex].quantity -= 1;
      updateCartAndStorage(newCart);
    } else if (existingItemIndex !== -1) {
      removeFromCart(product.id);
    }
  };

  const removeFromCart = (productId) => {
    const updatedCart = cart.filter((item) => item.id !== productId);
    updateCartAndStorage(updatedCart);
  };

  // Sort functions
  const sortLowToHigh = () => {
    setSortOption("lowToHigh");
  };
  const sortHighToLow = () => {
    setSortOption("highToLow");
  };
  const sortDefault = () => {
    setSortOption("default");
  };

  const sortedProducts = [...productsData]; // Create a copy to avoid modifying original state
  if (sortOption === "lowToHigh") {
    sortedProducts.sort((a, b) => a.price - b.price);
  } else if (sortOption === "highToLow") {
    sortedProducts.sort((a, b) => b.price - a.price);
  }

  return (
    <>
      <div className="p-4 text-center ">
        <div className="flex justify-center mb-4 mt-10">
          {" "}
          {/* Add sort buttons */}
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
        
        {isError && (
          <div className="text-center text-red-500">
            Error: Could not load products.
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
          {sortedProducts.map(
            (
              product // Use sortedProducts
            ) => (
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
            )
          )}
        </div>
      </div>
    </>
  );
};

export default ProductList;
