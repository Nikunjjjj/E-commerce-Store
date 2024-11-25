import ProductList from "./components/ProductList";
import Cart from "./components/Cart";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Navbar from "./components/Navbar";
import WishList from "./components/WishList";

const App = () => {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  return (
    <BrowserRouter>
      <Navbar cart={cart} wishlist={wishlist}/>
      <Routes>
        <Route path="/" element={<ProductList cart={cart} setCart={setCart}  wishlist={wishlist} setWishlist={setWishlist} />}/>
        <Route path="/cart" element={<Cart cart={cart} setCart={setCart} />} />
        <Route path="/wishlist" element={<WishList cart={cart} wishlist={wishlist} setWishlist={setWishlist} setCart={setCart} />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
