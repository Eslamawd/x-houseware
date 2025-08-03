import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { loadAllProductWithCat } from "../lib/categoryApi";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import CategoryCard from "../components/CategoryCard";
import Pagination from "../components/Pagination";
import ProductsComponent from "../components/Products";

function CategoriesDetail() {
  const { id } = useParams();

  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [children, setChildren] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);

  const [childrenPage, setChildrenPage] = useState(1);
  const [childrenLastPage, setChildrenLastPage] = useState(1);
  const [childrenTotal, setChildrenTotal] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await loadAllProductWithCat(id, currentPage, childrenPage);

        setCategory(res.category);
        setProducts(res.products?.data || []);
        setCurrentPage(res.products?.current_page || 1);
        setLastPage(res.products?.last_page || 1);
        setTotal(res.products?.total || 0);

        setChildren(res.children?.data || []);
        setChildrenPage(res.children?.current_page || 1);
        setChildrenLastPage(res.children?.last_page || 1);
        setChildrenTotal(res.children?.total || 0);
      } catch (error) {
        console.error("Error loading service details:", error);
        setError("Something went wrong while loading data.");
        toast.error("Please try again");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, currentPage, childrenPage]);

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Loading...</span>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-bold text-destructive mb-4">{error}</h2>
          <p className="text-muted-foreground mb-6">Please try again later.</p>
        </div>
      ) : (
        <>
          {category && (
            <div className="p-4">
              <CategoryCard category={category} index={0} />
            </div>
          )}

          {children.length > 0 && (
            <div className="p-4">
              <h2 className="text-2xl font-bold mb-4">Subcategories</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {children.map((child, i) => (
                  <Link to={`/categories/${child.id}`} key={i}>
                    <CategoryCard key={child.id} category={child} index={i} />
                  </Link>
                ))}
              </div>

              <Pagination
                currentPage={childrenPage}
                lastPage={childrenLastPage}
                total={childrenTotal}
                label="Category"
                onPrev={() => setChildrenPage((prev) => Math.max(prev - 1, 1))}
                onNext={() =>
                  setChildrenPage((prev) =>
                    Math.min(prev + 1, childrenLastPage)
                  )
                }
              />
            </div>
          )}

          {products.length > 0 ? (
            <>
              <ProductsComponent Products={products} />
              <Pagination
                currentPage={currentPage}
                lastPage={lastPage}
                total={total}
                label="Service"
                onPrev={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                onNext={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, lastPage))
                }
              />
            </>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No services found under this category.
            </div>
          )}
        </>
      )}
    </>
  );
}

export default CategoriesDetail;
