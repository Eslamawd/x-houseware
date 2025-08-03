import React from 'react';
import { ShieldCheck, Truck, BadgePercent, HandCoins } from 'lucide-react';
import { motion } from 'framer-motion';

// The HeaderPrivileges component provided by the user
const features = [
  {
    icon: <HandCoins size={30} className="text-green-500" />,
    title: "Cash on delivery",
    desc: "No need to debit/credit card, you can settle the payment on delivery",
  },
  {
    icon: <ShieldCheck size={30} className="text-green-500" />,
    title: "Choice of guarantee",
    desc: "Manufacturer's warranty, gold warranty, warranty plus",
  },
  {
    icon: <Truck size={30} className="text-green-500" />,
    title: "Free shipping",
    desc: "For purchases over $100",
  },
  {
    icon: <BadgePercent size={30} className="text-green-500" />,
    title: "Best price guarantee",
    desc: "Best price guarantee",
  },
];

function HeaderPrivileges() {
  return (
    <div className="bg-white rounded-xl mt-6 shadow-sm p-4 md:p-4 flex flex-col md:flex-row justify-between gap-4 items-start md:items-center w-full max-w-6xl mx-auto">
      {features.map((feature, i) => {
        const isEven = i % 2 === 0;
        return (
          <motion.div
            key={i}
            className="flex items-start gap-2 max-w-sm flex-1" // Added flex-1 for better distribution
            initial={{ opacity: 0, x: isEven ? 50 : -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: i * 0.2 }}
          >
            <div className="flex-shrink-0">{feature.icon}</div> {/* Prevents icon from shrinking */}
            <div>
              <h4 className="font-semibold text-left text-gray-800 text-base">{feature.title}</h4>
              <p className="text-gray-500 text-sm line-clamp-2 leading-snug text-left">{feature.desc}</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

export default HeaderPrivileges;