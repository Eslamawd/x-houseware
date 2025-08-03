import React from "react";
import { ShoppingCart } from "lucide-react";

export default function GreenBanner() {
  return (
    <div className="relative bg-[#3CA060] rounded-2xl overflow-hidden p-6 md:p-12 text-white flex flex-col md:flex-row items-center justify-between">
      {/* خلفيات دائرية شفافة */}
      <div className="absolute w-44 h-44 bg-white/10 rounded-full top-[-30px] left-[-30px]"></div>
      <div className="absolute w-32 h-32 bg-white/10 rounded-full bottom-[-20px] right-[-20px]"></div>

      {/* المحتوى النصي */}
      <div className="z-10 max-w-md">
        <h2 className="text-3xl md:text-5xl font-bold mb-2">SMART WEARABLE.</h2>
        <p className="text-lg md:text-xl mb-4">UP TO 80% OFF</p>
        <button className="bg-white text-green-700 px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-green-100 transition">
          <ShoppingCart size={20} />
          Shop Now
        </button>
      </div>

      {/* صورة المنتج */}
      <div className="z-10 mt-6 md:mt-0">
        <img
          src="/smart-wat.png"
          alt="Smart Watch"
          className="w-40 md:w-60 drop-shadow-xl"
        />
      </div>
    </div>
  );
}
