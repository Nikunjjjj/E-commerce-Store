/* eslint-disable react/prop-types */
import ProductList from "./ProductList";

const Prime = ({ cart, setCart, wishlist, setWishlist }) => {
  return (
    <div className='mt-20'>
      <ProductList 
        cart={cart} 
        setCart={setCart} 
        wishlist={wishlist} 
        setWishlist={setWishlist} 
      />
    </div>
  );
};

export default Prime;
