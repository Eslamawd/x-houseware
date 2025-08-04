import React from "react";
import {
  Smartphone,
  Monitor,
  Watch,
  Camera,
  Headphones,
  Gamepad2,
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

// Data for the categories
const categories = [
  {
    id: 3,
    icon: <Smartphone size={30} className="text-white" />,
    title: "Phones",
  },
  {
    id: 4,
    icon: <Monitor size={30} className="text-white" />,
    title: "Computers",
  },
  {
    id: 5,
    icon: <Watch size={30} className="text-white" />,
    title: "SmartWatch",
  },
  {
    id: 6,
    icon: <Camera size={30} className="text-white" />,
    title: "Camera",
  },
  {
    id: 7,
    icon: <Headphones size={30} className="text-white" />,
    title: "HeadPhones",
  },
  {
    id: 8,
    icon: <Gamepad2 size={30} className="text-white" />,
    title: "Gaming",
  },
];

function BrowseByCategory() {
  return (
    <div className="w-full max-w-6xl mt-6 mx-auto p-4 md:p-6 bg-white rounded-xl shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex flex-col">
          <h2 className="text-2xl font-bold text-green-500">Categories</h2>
          <h2 className="text-2xl font-bold text-gray-800">
            Browse By Category
          </h2>
        </div>
        <div className="flex gap-2">
          <div className="p-2 rounded-full bg-green-500 text-white hover:bg-green-600 transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-arrow-left"
            >
              <path d="m12 19-7-7 7-7" />
              <path d="M19 12H5" />
            </svg>
          </div>
          <div className="p-2 rounded-full bg-green-500 text-white hover:bg-green-600 transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-arrow-right"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories.map((category, i) => (
          <Link to={`/categories/${category.id}`} key={i}>
            <motion.div
              className="flex flex-col items-center justify-center p-4 bg-green-500 rounded-xl cursor-pointer hover:bg-green-600 transition-colors duration-300 shadow-md"
              initial={{ opacity: 0, y: 80 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.4 }}
            >
              <div className="mb-2">{category.icon}</div>
              <p className="text-white font-medium text-sm text-center">
                {category.title}
              </p>
            </motion.div>
          </Link>
        ))}
      </div>
      <div className="text-center mt-8">
        <Link
          to="/categories"
          className="bg-green-500 text-white py-2 px-6 text-sm sm:text-base rounded-md hover:bg-green-600 transition-colors font-semibold"
        >
          View All Categories
        </Link>
      </div>
    </div>
  );
}

export default BrowseByCategory;
