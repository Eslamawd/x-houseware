import React, { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ShoppingCart,
  Heart,
  Star,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "../context/CartContext";
import { toast } from "sonner";
import { Link } from "react-router-dom";

// Variants للأنيميشن يمين/شمال على حسب الـ index
const cardVariants = {
  hidden: (i) => ({
    opacity: 0,
    x: i % 2 === 0 ? 60 : -60, // زوجي = يمين, فردي = شمال
  }),
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5 },
  },
};

function ProductsComponent({ Products }) {
  // Placeholder static countdown

  const { addToCart } = useCart();

  return (
    <div className="w-full max-w-6xl mt-6 mx-auto p-4 md:p-6 bg-white rounded-xl shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center gap-2">
          <span className="w-4 h-8 bg-green-500 rounded-sm" />
          Products
        </h2>
      </div>

      {/* منتجات */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {Products.map((product, i) => (
          <motion.div
            key={product.id}
            className="bg-white rounded-lg shadow-md overflow-hidden group"
            custom={i}
            variants={cardVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden">
              <img
                src={
                  product.images && product.images.length > 0
                    ? product.images[0]
                    : "/logo.png"
                }
                alt={product.name}
                className="absolute inset-0 w-full h-full object-cover"
                onError={(e) =>
                  (e.currentTarget.src =
                    "https://placehold.co/400x300/CCCCCC/000000?text=Image+Error")
                }
              />

              {/* Discount badge */}
              <span className="absolute top-2 left-2 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                -
                {Math.round(
                  ((product.old_price - product.price) / product.old_price) *
                    100
                )}
                %
              </span>

              {/* Hover actions */}
              <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span
                  onClick={() => {
                    addToCart(product);
                    toast.success(`Add New Product ${product.name} In Cart`);
                  }}
                  className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
                >
                  <Heart size={20} className="text-red-700" />
                </span>
                <span
                  onClick={() => {
                    addToCart(product);
                    toast.success(`Add New Product ${product.name} In Cart`);
                  }}
                  className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
                >
                  <ShoppingCart size={20} className="text-green-600" />
                </span>
              </div>
            </div>

            <div className="p-4">
              <h3 className="font-semibold text-gray-800 text-base sm:text-lg mb-1 line-clamp-2">
                {product.name}
              </h3>

              {/* Rating */}
              <div className="flex items-center mb-2">
                {[...Array(5)].map((_, idx) => (
                  <Star
                    key={idx}
                    size={16}
                    className={
                      idx < Math.floor(product.rating)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }
                  />
                ))}
                <span className="text-gray-500 text-sm ml-2">
                  ({product.reviews})
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-2">
                <span className="text-green-500 font-bold text-lg sm:text-xl">
                  {product.price}
                </span>
                <span className="text-gray-400 line-through text-sm">
                  {product.old_price}
                </span>
              </div>

              {/* Link To Product */}

              <Link to={`/product/${product.id}`}>
                <button className="mt-4 w-full bg-green-500 text-white py-2 text-sm sm:text-base rounded-md hover:bg-green-600 transition-colors font-semibold">
                  Buy Now
                </button>
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default ProductsComponent;
