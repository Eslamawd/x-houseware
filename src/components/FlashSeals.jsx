import React, { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import ProductsComponent from "./Products";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { loadProducts } from "../lib/productApi";

function FlashSales() {
  const [timeLeft] = React.useState({
    days: 3,
    hours: 23,
    minutes: 19,
    seconds: 56,
  });

  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchData = async (page = 1) => {
      try {
        const [servicesData] = await Promise.all([loadProducts(page)]);

        if (servicesData && Array.isArray(servicesData.products.data)) {
          setServices(servicesData.products.data);
        } else {
          setServices([]);
          toast.warning("No products found from the API.");
        }
      } catch (err) {
        console.error("Error loading data:", err);
        toast.error("Failed to load products.");
      }
    };

    fetchData();
  }, []);

  return (
    <div className="w-full max-w-6xl mt-6 mx-auto p-4 md:p-6 bg-white rounded-xl shadow-sm">
      {/* عنوان + عد تنازلي */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center gap-2">
          <span className="w-4 h-8 bg-green-500 rounded-sm" />
          Flash Sales
        </h2>

        {/* Countdown */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          <TimerBlock label="Days" value={timeLeft.days} />
          <TimeSep />
          <TimerBlock label="Hours" value={timeLeft.hours} />
          <TimeSep />
          <TimerBlock label="Minutes" value={timeLeft.minutes} />
          <TimeSep />
          <TimerBlock label="Seconds" value={timeLeft.seconds} />

          {/* Controls (desktop) */}
          <div className="hidden md:flex gap-2 ml-4">
            <button className="p-2 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors">
              <ArrowLeft size={20} />
            </button>
            <button className="p-2 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors">
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>

      <ProductsComponent Products={services} />
      {/* View all */}
      <div className="text-center mt-8">
        <Link
          to="/products"
          className="bg-green-500 text-white py-2 px-6 text-sm sm:text-base rounded-md hover:bg-green-600 transition-colors font-semibold"
        >
          View All Products
        </Link>
      </div>
    </div>
  );
}

export default FlashSales;

/* ───────────────────────────── helpers ───────────────────────────── */

function TimerBlock({ label, value }) {
  return (
    <div className="flex flex-col items-center min-w-[40px]">
      <span className="text-gray-500 text-[10px] sm:text-xs leading-none">
        {label}
      </span>
      <span className="text-gray-800 text-base sm:text-lg font-semibold leading-none">
        {value.toString().padStart(2, "0")}
      </span>
    </div>
  );
}

function TimeSep() {
  return (
    <span className="text-green-500 text-lg sm:text-xl font-bold leading-none">
      :
    </span>
  );
}
