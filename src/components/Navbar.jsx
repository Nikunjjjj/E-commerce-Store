/* eslint-disable react/prop-types */
import { CiShoppingCart } from "react-icons/ci";
import { Link } from "react-router-dom";
import { CiHeart } from "react-icons/ci";
import { CiMedicalClipboard } from "react-icons/ci";

const Navbar = ({ cart }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto">
        <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
          {/* Logo Section */}
          <Link to="/" className="flex items-center">
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold text-gray-900 hidden sm:block">
                E-Commerce Store
              </h1>
            </div>
          </Link>

          {/* Navigation Items */}
          <div className="flex items-center space-x-8">
            {/* Orders */}
            <Link to="/orders" className="group flex flex-col items-center">
            <span className="text-gray-700 group-hover:text-yellow-500 transition-colors">
                <CiMedicalClipboard className="w-6 h-6" />
              </span>
              <span className="text-xs text-gray-700 group-hover:text-yellow-500 transition-colors">
                Orders
              </span>
            </Link>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="group flex flex-col items-center relative"
            >
              <span className="text-gray-700 group-hover:text-yellow-500 transition-colors">
                <CiHeart className="w-6 h-6" />
              </span>
              <span className="text-xs text-gray-700 group-hover:text-yellow-500 transition-colors">
                Wishlist
              </span>
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="group flex flex-col items-center relative"
            >
              <span className="text-gray-700 group-hover:text-yellow-500 transition-colors">
                <CiShoppingCart className="w-6 h-6" />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center bg-yellow-500 text-white text-xs font-medium rounded-full">
                    {cart.length}
                  </span>
                )}
              </span>
              <span className="text-xs text-gray-700 group-hover:text-yellow-500 transition-colors">
                Bag
              </span>
            </Link>
            
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
