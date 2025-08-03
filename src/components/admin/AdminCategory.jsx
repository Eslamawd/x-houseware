// src/components/admin/AdminCategory.jsx

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  PlusCircle,
  Pencil,
  Trash2,
  GiftIcon,
  RotateCw,
  Zap,
  Search,
  ContainerIcon,
  Loader2,
} from "lucide-react";
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

// استدعِ مكوّني الإنشاء والتحديث اللذين أنشأتهما
import CreateCategoryForm from "./customization/CreateCategoryForm";
import { deleteCategory, getAllCatAdmin } from "../../lib/categoryApi";
import UpdateCategoryForm from "./customization/UpdateCategoryForm";

// الدوال الجاهزة للتعامل مع Laravel API

const AdminCategory = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true); // حالة التحميل
  const [error, setError] = useState(null); // حالة الخطأ في التحميل
  // جلب الخدمات عند التحميل
  useEffect(() => {
    const fetchData = async (page = 1) => {
      setLoading(true);
      setError(null);
      try {
        const [categoriesRes] = await Promise.all([getAllCatAdmin(page)]);

        if (categoriesRes && Array.isArray(categoriesRes.categories.data)) {
          setCategories(categoriesRes.categories.data);
          setCurrentPage(categoriesRes.categories.current_page);
          setLastPage(categoriesRes.categories.last_page);
          setTotal(categoriesRes.categories.total);
        } else {
          // Handle case where servicesData.services is not an array
          setCategories([]);
          toast.warning("No services found from the API.");
        }
      } catch (err) {
        console.error("Error loading data:", err);
        setError("Failed to load services. Please try again later.");
        toast.error("Failed to load services.");
      } finally {
        setLoading(false);
      }
    };

    fetchData(currentPage);
    window.scrollTo(0, 0);
  }, [currentPage]); // Empty dependency array means this runs once on mount

  // فتح نافذة التعديل
  const handleEditCategory = async (category) => {
    try {
      setSelectedCategory(category);
      setIsNew(false);
      setIsUpdate(true);
      setIsDialogOpen(true);
    } catch (error) {
      console.error("Error opening edit dialog:", error);
      toast.error("Failed to open edit dialog");
    }
  };

  // فتح نافذة الإضافة
  const handleAddNewCategory = async () => {
    try {
      setIsNew(true);
      setIsUpdate(false);
      setSelectedCategory(null);
      setIsDialogOpen(true);
    } catch (error) {
      console.error("Error opening add dialog:", error);
      toast.error("Failed to open add dialog");
    }
  };

  const handleUpdateCategory = async (category) => {
    try {
      const updatedCateg = categories.map((u) =>
        u.id === selectedCategory.id ? category : u
      );
      setCategories(updatedCateg);
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error opening add dialog:", error);
      toast.error("Failed to open add dialog");
    }
  };

  const handleDeleteCategory = (category) => {
    setSelectedCategory(category);
    setIsDeleteDialogOpen(true);
  };
  const confirmDeleteCategory = async () => {
    if (!selectedCategory) return;
    setIsDeleting(true);
    try {
      await deleteCategory(selectedCategory.id);
      const deletedRes = categories.filter((u) => u.id !== selectedCategory.id);
      setCategories(deletedRes);
      toast.success("Category deleted");
      setIsDeleteDialogOpen(false);
      setSelectedCategory(null);
    } catch (err) {
      console.error("Error deleting category:", err);
      toast.error("Failed to delete category");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* العنوان وزرّ الإضافة */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Category Management</h2>
        <Button onClick={handleAddNewCategory}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">
            Loading services...
          </span>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-bold text-destructive mb-4">
            Error Loading Services
          </h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          {/* Optionally add a retry button */}
          {/* <Button onClick={() => window.location.reload()}>Retry</Button> */}
        </div>
      ) : (
        <CategoryList
          categories={categories}
          onEdit={handleEditCategory}
          onDelete={handleDeleteCategory}
        />
      )}
      <div className="flex justify-center items-center gap-2 mt-8">
        <Button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Prev
        </Button>

        <span className="text-sm text-muted-foreground">
          Page {currentPage} of {lastPage} — Total: {total} services
        </span>

        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, lastPage))}
          disabled={currentPage === lastPage}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* حوار الإضافة / التعديل */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle>
              {isNew && "Add New category"}{" "}
              {isUpdate && "Update Your Category "}
            </DialogTitle>
            <DialogDescription>
              {isNew && "Fill in the details to create a new category."}
              {isUpdate && "Update Your Category "}
            </DialogDescription>
          </DialogHeader>

          {isNew && (
            <CreateCategoryForm
              onSuccess={(newCategory) => {
                setCategories([newCategory, ...categories]);
                setIsDialogOpen(false);
              }}
              onCancel={() => {
                setIsDialogOpen(false);
              }}
            />
          )}
          {isUpdate && (
            <UpdateCategoryForm
              category={selectedCategory}
              onSuccess={handleUpdateCategory}
              onCancel={() => {
                setIsDialogOpen(false);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete{" "}
              {selectedCategory?.name}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteCategory}
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

export default AdminCategory;

const CategoryList = ({ categories, onEdit, onDelete }) => {
  const [expandedIds, setExpandedIds] = useState([]);

  const toggleExpand = (id) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  if (categories.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          No categories found. Add a new category to get started.
        </CardContent>
      </Card>
    );
  }

  return (
    <Table className="w-full">
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Image</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {categories.map((category) => (
          <React.Fragment key={category.id}>
            <TableRow>
              <TableCell>{category.id}</TableCell>
              <TableCell>
                <button
                  className="font-semibold text-left hover:underline"
                  onClick={() => toggleExpand(category.id)}
                >
                  {category.name}
                </button>
              </TableCell>
              <TableCell>
                <img
                  src={category.image || "/placeholder.png"}
                  alt={category.name}
                  className="h-10 w-10 object-cover rounded"
                />
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(category)}
                  >
                    <Pencil className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onDelete(category)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>

            {/* الشلدرين */}
            {expandedIds.includes(category.id) &&
              category.children?.map((child) => (
                <TableRow key={child.id} className="bg-white">
                  <TableCell className="pl-8">{child.id}</TableCell>
                  <TableCell className="pl-8">↳ {child.name}</TableCell>
                  <TableCell>
                    <img
                      src={child.image || "/placeholder.png"}
                      alt={child.name}
                      className="h-10 w-10 object-cover rounded"
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(child)}
                      >
                        <Pencil className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => onDelete(child)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </React.Fragment>
        ))}
      </TableBody>
    </Table>
  );
};
