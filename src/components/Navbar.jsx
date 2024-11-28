/* eslint-disable react/prop-types */
import { CiShoppingCart } from "react-icons/ci";
import { Link } from "react-router-dom";
import { CiHeart } from "react-icons/ci";

const Navbar = ({ cart }) => {
  return (
    <div className="w-full bg-zinc-800 flex justify-between p-4 items-center fixed top-0 left-0 z-10">
      <Link to={"/"}>
        <div className="flex ml-2">
          <h1 className="text-white text-xl font-bold">E-Commerce store</h1>
        </div>
      </Link>
      <div className="flex">
      <Link to="/orders">
          <button className="font-thin text-lg text-gray-100 hover:text-white mr-5 relative ">
            My Orders
          </button>
        </Link>
        <Link to="/wishlist">
          <button className="font-thin text-2xl text-gray-100 hover:text-white mr-5 relative">
            <CiHeart />
          </button>
        </Link>
        <Link to="/cart">
          <button className="font-thin text-2xl text-gray-100 hover:text-white mr-10 relative">
            <CiShoppingCart />
            {cart.length > 0 && (
              <span className="absolute top-0 right-[-5px] bg-red-500 text-white text-xs font-bold rounded-full px-1 py-0.1">
                {cart.length}
              </span>
            )}
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
