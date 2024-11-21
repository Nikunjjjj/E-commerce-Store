/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useGetProductsQuery } from "../api/BaseUrl";

const ProductList = ({ cart, setCart }) => {
  const {data: productsData} = useGetProductsQuery();
  const [sortOption, setSortOption] = useState("default");

  useEffect(() => {
    // Initialize cart from localStorage on component mount
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
}, [setCart]); // Only depends on setCart
  

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

  const sortLowToHigh = () => {
    setSortOption("lowToHigh");
  };
  const sortHighToLow = () => {
    setSortOption("highToLow");
  };
  const sortDefault = () => {
    setSortOption("default");
  };

  if (!productsData || productsData.length === 0) {
    return <div className="text-center text-gray-500">No products found.</div>;
  }

  let sortedProducts = [...productsData]; //Make sure to make a copy here!
  if (sortOption === "lowToHigh") {
    sortedProducts.sort((a, b) => a.price - b.price);
  } else if (sortOption === "highToLow") {
    sortedProducts.sort((a, b) => b.price - a.price);
  }

  //Handle case where productsData might be null or undefined initially.
  if (!productsData) {
    return <div className="text-center text-gray-500">No products found.</div>;
  }

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
