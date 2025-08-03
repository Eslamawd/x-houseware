import React, { useEffect, useState } from "react";
import ProductsComponent from "../components/Products";
import { loadProducts } from "../lib/productApi";
import toast from "react-hot-toast";
import Pagination from "../components/Pagination";

function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
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
        const [servicesData] = await Promise.all([loadProducts(page)]);

        if (servicesData && Array.isArray(servicesData.products.data)) {
          setServices(servicesData.products.data);
          setFilteredServices(servicesData.products.data);
          setCurrentPage(servicesData.products.current_page);
          setLastPage(servicesData.products.last_page);
          setTotal(servicesData.products.total);
        } else {
          setServices([]);
          setFilteredServices([]);
          toast.warning("No products found from the API.");
        }
      } catch (err) {
        console.error("Error loading data:", err);
        setError("Failed to load products. Please try again later.");
        toast.error("Failed to load products.");
      } finally {
        setLoading(false);
      }
    };

    fetchData(currentPage);
    window.scrollTo(0, 0);
  }, [currentPage]);

  useEffect(() => {
    let currentFiltered = services;

    if (searchQuery) {
      currentFiltered = currentFiltered.filter(
        (product) =>
          (product.name_ar &&
            product.name_ar
              .toLowerCase()
              .includes(searchQuery.toLowerCase())) ||
          (product.name_en &&
            product.name_en.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    setFilteredServices(currentFiltered);
  }, [searchQuery, services]);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Products</h2>

      {/* Search Input */}
      <div className="mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search products..."
          className="border border-gray-300 px-4 py-2 rounded w-full"
        />
      </div>

      {/* Loading, Error, or Product List */}
      {loading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : error ? (
        <p className="text-destructive">{error}</p>
      ) : filteredServices.length > 0 ? (
        <>
          <ProductsComponent Products={filteredServices} />

          <Pagination
            currentPage={currentPage}
            lastPage={lastPage}
            total={total}
            label="Product"
            onPrev={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            onNext={() =>
              setCurrentPage((prev) => Math.min(prev + 1, lastPage))
            }
          />
        </>
      ) : (
        <p className="text-center text-muted-foreground">
          No products match your search.
        </p>
      )}
    </div>
  );
}

export default ProductsPage;
