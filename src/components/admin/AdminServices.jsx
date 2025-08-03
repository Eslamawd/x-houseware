// src/components/admin/AdminProducts.jsx

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { PlusCircle, Pencil, Trash2, Search, Loader2 } from "lucide-react";
import { Input } from "../ui/Input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/Dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { toast } from "sonner";

import CreateProductForm from "./customization/CreateProductForm";
import UpdateProductForm from "./customization/UpdateProductForm";
import { deleteProduct, loadProducts } from "../../lib/productApi";
import ImageSlider from "../ImageSlider";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state for fetch failures

  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchData = async (page = 1) => {
      setLoading(true);
      setError(null);
      try {
        const [productsData] = await Promise.all([loadProducts(page)]);

        if (productsData && Array.isArray(productsData.products.data)) {
          setProducts(productsData.products.data);
          setFilteredProducts(productsData.products.data);
          setCurrentPage(productsData.products.current_page);
          setLastPage(productsData.products.last_page);
          setTotal(productsData.products.total);
        } else {
          // Handle case where productsData.products is not an array
          setProducts([]);
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
  }, [currentPage]); // Empty dependency array means this runs once on mount

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setIsNew(false);
    setIsUpdate(true);
    setIsDialogOpen(true);
  };

  const handleAddNewProduct = () => {
    setIsNew(true);
    setIsUpdate(false);
    setSelectedProduct(null);
    setIsDialogOpen(true);
  };

  const handleDeleteProduct = (product) => {
    setSelectedProduct(product);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteProduct = async () => {
    if (!selectedProduct) return;
    setIsDeleting(true);
    try {
      await deleteProduct(selectedProduct.id);
      toast.success("Product deleted");
      setIsDeleteDialogOpen(false);
      setSelectedProduct(null);
      setProducts((prev) =>
        prev.filter((serv) => serv.id !== selectedProduct.id)
      );
    } catch (err) {
      console.error("Error deleting product:", err);
      toast.error("Failed to delete product");
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    let currentFiltered = products;

    // Apply search query filter
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

    setFilteredProducts(currentFiltered);
  }, [searchQuery, products]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Products Management</h2>
        <Button onClick={handleAddNewProduct}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      <div className="relative flex-grow mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">
            Loading Products...
          </span>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-bold text-destructive mb-4">
            Error Loading Products
          </h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          {/* Optionally add a retry button */}
          {/* <Button onClick={() => window.location.reload()}>Retry</Button> */}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-bold mb-4">No Products Found</h2>
          <p className="text-muted-foreground">
            {searchQuery
              ? "Your search and filter returned no results."
              : "There are no Products available at the moment."}
          </p>
        </div>
      ) : (
        <ProductList
          products={filteredProducts}
          onEdit={handleEditProduct}
          onDelete={handleDeleteProduct}
        />
      )}
      <div className="flex justify-center items-center gap-2 mt-8">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Prev
        </button>

        <span className="text-sm text-muted-foreground">
          Page {currentPage} of {lastPage} — Total: {total} products
        </span>

        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, lastPage))}
          disabled={currentPage === lastPage}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle>
              {isNew ? "Add New Product" : "Update Product"}
            </DialogTitle>
            <DialogDescription>
              {isNew
                ? "Fill in the details to create a new product."
                : "Edit the product details."}
            </DialogDescription>
          </DialogHeader>

          {isNew ? (
            <CreateProductForm
              onSuccess={(newProduct) => {
                setProducts((prev) => [...prev, newProduct]);
                setIsDialogOpen(false);
              }}
              onCancel={() => setIsDialogOpen(false)}
            />
          ) : (
            <UpdateProductForm
              product={selectedProduct}
              onSuccess={(updatedProduct) => {
                setProducts((prev) =>
                  prev.map((serv) =>
                    serv.id === updatedProduct.id ? updatedProduct : serv
                  )
                );
                setIsDialogOpen(false);
              }}
              onCancel={() => setIsDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent className="bg-red-500 ">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete{" "}
              {selectedProduct?.name}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteProduct}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminProducts;

const ProductList = ({ products, onEdit, onDelete }) => {
  if (products.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          No products found. Add a new product to get started.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map((product) => (
        <Card key={product.id} className="overflow-hidden">
          <div className="aspect-video relative bg-gray-100">
            {product.images && <ImageSlider images={product.images} />}
          </div>

          <CardHeader className="p-4 pb-0">
            <CardTitle className="text-lg">{product.name}</CardTitle>
          </CardHeader>

          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
              {product?.category?.name}
            </p>

            <div className="flex items-center justify-between mt-2">
              <span className="font-semibold">
                ${parseFloat(product.price).toFixed(2)}
              </span>
              <div className="flex space-x-1">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onEdit(product)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-destructive hover:text-destructive"
                  onClick={() => onDelete(product)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
