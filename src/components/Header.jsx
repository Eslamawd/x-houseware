import { useState } from "react";
import { Heart, ShoppingCart, Menu, Search, LogOut, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { cartCount } = useCart();
  const { user } = useAuth();

  return (
    <header className="shadow-md z-50 relative">
      {/* Top Nav */}
      <div className="flex justify-between items-center px-4 py-3">
        {/* Left side (Menu + Search) */}
        <div className="flex items-center gap-2">
          <motion.div
            className="p-2 md:hidden bg-blue-50 rounded-xl text-green-500 cursor-pointer"
            onClick={() => setMenuOpen(!menuOpen)}
            whileTap={{ scale: 0.8 }}
          >
            {menuOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90 }}
                animate={{ rotate: 0 }}
                transition={{ duration: 0.3 }}
              >
                <X />
              </motion.div>
            ) : (
              <motion.div
                key="open"
                initial={{ rotate: 90 }}
                animate={{ rotate: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Menu />
              </motion.div>
            )}
          </motion.div>

          {/* Logo */}
          <motion.h2
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.7 }}
            className="text-lg font-bold font-custom"
          >
            <Link to="/">
              <img
                src="/logo.png"
                alt=""
                className="w-full h-10 object-cover rounded-t-xl"
              />
            </Link>
          </motion.h2>
        </div>

        <div className=" hidden  md:block relative w-1/3">
          <input
            type="text"
            placeholder="Search essentials, groceries and more..."
            className="w-full bg-green-50 pl-10 py-2 rounded-lg border placeholder:text-base border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
          />
          <Search className="absolute top-1/2 left-3 transform -translate-y-1/2 text-green-400" />
        </div>

        {/* Right side (Desktop only) */}
        <div className="flex items-center md:w-2xs">
          <Link to="/checkout">
            <div className="flex justify-between p-2">
              <span>
                <ShoppingCart className="text-green-400" />
              </span>
              <span className=" ml-2">Carts</span>
            </div>

            {cartCount > 0 && (
              <span className=" absolute top-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              key="menu"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.4 }}
              className="fixed top-0 left-0 h-full w-2/3 bg-black shadow-md p-6 z-50 md:hidden flex flex-col gap-4"
            >
              <button className="flex items-center gap-2">
                <Heart /> Wishlist
              </button>
              <button className="flex items-center gap-2">
                <ShoppingCart /> Cart
              </button>
              <button className="flex items-center gap-2">
                <LogOut /> Logout
              </button>
            </motion.div>

            {/* Overlay */}
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="fixed inset-0 bg-black z-40 md:hidden"
              onClick={() => setMenuOpen(false)}
            ></motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
