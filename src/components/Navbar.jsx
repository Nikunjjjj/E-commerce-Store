/* eslint-disable react/prop-types */
import { CiShoppingCart } from "react-icons/ci";
import { Link } from "react-router-dom";

const Navbar = ({ cart }) => {
  return (
    <div className="w-full bg-zinc-800 flex justify-between p-4 fixed items-center">

      <Link to={"/"}>
      <div className="flex ml-10">
        <h1 className="text-white text-xl font-bold">E-Commerce store</h1>
      </div>
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
  );
};

export default Navbar;
