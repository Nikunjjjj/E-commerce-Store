import ProductList from "./components/ProductList";
import Cart from "./components/Cart";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Navbar from "./components/Navbar";
import WishList from "./components/WishList";
import Orders from "./components/Orders";
import Login from "./components/Login";
import Admin from "./components/admin";
import PrivateRoute from "./utils/PrivateRoute";

const App = () => {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  return (
    <BrowserRouter>
      <Navbar cart={cart} wishlist={wishlist}/>
      <Routes>
        <Route path="/login" element={<Login/>} />
        <Route path="/" element={
          <PrivateRoute 
            component={ProductList} 
            isAdmin={false}
            cart={cart} 
            setCart={setCart}  
            wishlist={wishlist} 
            setWishlist={setWishlist}
          />
        }/>
        <Route path="/cart" element={
          <PrivateRoute 
            component={Cart} 
            isAdmin={false}
            cart={cart} 
            setCart={setCart}
          />
        } />
        <Route path="/wishlist" element={
          <PrivateRoute 
            component={WishList} 
            isAdmin={false}
            cart={cart} 
            wishlist={wishlist} 
            setWishlist={setWishlist} 
            setCart={setCart}
          />
        } />
        <Route path="/orders" element={
          <PrivateRoute 
            component={Orders} 
            isAdmin={false}
          />
        }/>
        <Route path="/admin" element={
          <PrivateRoute 
            component={Admin} 
            isAdmin={true}
          />
        }/>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
