import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import CategoryCard from "../components/CategoryCard";
import Pagination from "../components/Pagination";
import { toast } from "sonner";
import { loadCategory } from "../lib/categoryApi";
import { Loader2 } from "lucide-react";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchData = async (page = 1) => {
      setLoading(true);
      setError(null);
      try {
        const [categoriesRes] = await Promise.all([loadCategory(page)]);

        if (categoriesRes && Array.isArray(categoriesRes.categories.data)) {
          setCategories(categoriesRes.categories.data);
          setCurrentPage(categoriesRes.categories.current_page);
          setLastPage(categoriesRes.categories.last_page);
          setTotal(categoriesRes.categories.total);
        } else {
          setCategories([]);
          toast.warning("No categories found from the API.");
        }
      } catch (err) {
        console.error("Error loading data:", err);
        setError("Failed to load categories. Please try again later.");
        toast.error("Failed to load categories.");
      } finally {
        setLoading(false);
      }
    };

    fetchData(currentPage);
    window.scrollTo(0, 0);
  }, [currentPage]);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Categories</h2>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Loading...</span>
        </div>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {categories.map((category, i) => (
              <Link to={`/categories/${category.id}`} key={i}>
                <CategoryCard key={category.id} category={category} index={i} />
              </Link>
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            lastPage={lastPage}
            total={total}
            label="Category"
            onPrev={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            onNext={() =>
              setCurrentPage((prev) => Math.min(prev + 1, lastPage))
            }
          />
        </>
      )}
    </div>
  );
}

export default Categories;
