import { motion } from "framer-motion";

const cardVariants = {
  hidden: (i) => ({
    opacity: 0,
    x: i % 2 === 0 ? 60 : -60,
  }),
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5 },
  },
};

export default function CategoryCard({ category, index }) {
  return (
    <motion.div
      className="shadow-md rounded-lg p-4 flex flex-col items-center hover:shadow-lg transition"
      custom={index}
      variants={cardVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
    >
      <img
        src={category.image}
        alt={category.name}
        className="w-20 h-20 object-cover mb-2 rounded-full"
      />
      <h3 className="text-lg font-medium text-center">{category.name}</h3>
    </motion.div>
  );
}
