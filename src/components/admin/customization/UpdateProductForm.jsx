// src/components/admin/customization/UpdateProductForm.jsx

import React, { useState, useEffect } from "react";
import { Button } from "../../ui/button.jsx";
import { Input } from "../../ui/Input.jsx";
import { Textarea } from "../../ui/textarea.jsx";
import { Label } from "../../ui/Label.jsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs.jsx";
import { Separator } from "../../ui/Separator.jsx";
import { ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { updateProduct } from "../../../lib/productApi.js";
import { getAllCat } from "../../../lib/categoryApi.js";
export default function UpdateProductForm({ product, onSuccess, onCancel }) {
  // هنا نهيئ الحالة بقيم 'product' عند فتح المكوّن
  const [formData, setFormData] = useState({
    name: product?.name || "",
    price: product?.price || 0,
    oldPrice: product?.old_price || 0,
    rating: product?.rating || 5,
    reviews: product?.reviews || 65,
    imageFiles: [],
    description: product?.description || "",
    quantity: product?.quantity || 0,
    imagePreviews: product.images || [],
    categoryId: product?.category_id || "",
  });

  const [categories, setCategories] = useState([]);

  const [selectedParent, setSelectedParent] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");

  const [activeTab, setActiveTab] = useState("basic");
  const [isLoading, setIsLoading] = useState(false);
  const DEFAULT_IMAGE = "/images/default-image.png";

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getAllCat();
        setCategories(data.categories || []);
      } catch (err) {
        console.error("Failed to load categories", err);
        toast.error("Failed to load categories");
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      categoryId: selectedCategoryId,
    }));
  }, [selectedCategoryId]);

  const handleParentChange = (e) => {
    const parentId = e.target.value;
    setSelectedParent(parentId);
    setSelectedCategoryId(""); // reset subcategory selection
  };

  const getChildrenOf = (parentId) => {
    const parent = categories.find((cat) => cat.id == parentId);
    return parent?.children || [];
  };

  // 2) تغييرات الحقول النصية والأرقام
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  const handleMultipleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map((file) => URL.createObjectURL(file));

    if (formData.imageFiles.length + files.length > 5) {
      toast.error("Maxmum 5 Images");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      imageFiles: [...prev.imageFiles, ...files],
      imagePreviews: [...prev.imagePreviews, ...previews],
    }));
  };

  const handleRemoveImage = (index) => {
    const updatedFiles = [...formData.imageFiles];
    const updatedPreviews = [...formData.imagePreviews];

    // حرر الذاكرة
    URL.revokeObjectURL(updatedPreviews[index]);

    updatedFiles.splice(index, 1);
    updatedPreviews.splice(index, 1);

    setFormData((prev) => ({
      ...prev,
      imageFiles: updatedFiles,
      imagePreviews: updatedPreviews,
    }));
  };

  // 4) عند الضغط على "Update Product"
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Please Add Name Product");
      return;
    }

    setIsLoading(true);
    try {
      const payload = new FormData();
      payload.append("name", formData.name);
      payload.append("price", formData.price.toString());
      payload.append("description", formData.description);
      payload.append("old_price", formData.oldPrice.toString());
      payload.append("rating", formData.rating.toString());
      payload.append("reviews", formData.reviews.toString());
      payload.append("category_id", formData.categoryId);
      payload.append("_method", "PATCH"); // Laravel expects this for updates
      if (formData.imageFiles) {
        formData.imageFiles.forEach((file) => {
          payload.append("images[]", file);
        });
      }

      const res = await updateProduct(product.id, payload);

      if (res.product.name && res.product.price) {
        toast.success("Created product successfully!");
        onSuccess && onSuccess(res.product);
      } else {
        // Handle cases where res.product might not be present but no error was thrown
        toast.warning("Product updated, but response was unexpected.");
      }
    } catch (err) {
      console.error("Error updating product:", err);
      // Improved error message for the user
      toast.error(
        `فشل في تحديث الخدمة: ${err.response?.data?.message || "خطأ غير معروف"}`
      );
      // If it's a validation error, you might want to show specific messages
      if (err.response && err.response.status === 422) {
        Object.values(err.response.data.errors).forEach((messages) => {
          messages.forEach((message) => toast.error(message));
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 p-6 bg-white rounded-lg shadow"
    >
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="pt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter product name"
                required
              />
            </div>

            {/* Parent Dropdown */}
            <div className="space-y-2">
              <Label>Selctet Or</Label>
              <select
                name="parent"
                className="w-full border rounded p-2 bg-white"
                value={selectedParent || ""}
                onChange={handleParentChange}
              >
                <option value="">{product.category.name}</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Children Dropdown */}
            {selectedParent && getChildrenOf(selectedParent).length > 0 && (
              <div className="space-y- 2">
                <Label>Subcategory</Label>
                <select
                  name="category_id"
                  className="w-full border rounded p-2 bg-white"
                  value={selectedCategoryId}
                  onChange={(e) => setSelectedCategoryId(e.target.value)}
                >
                  <option value="">Select Chaild Category</option>
                  {getChildrenOf(selectedParent).map((child) => (
                    <option key={child.id} value={child.id}>
                      {child.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter description"
            />
          </div>
          {/* Rating */}
          <div className="space-y-2">
            <Label htmlFor="Rating">Rating</Label>
            <Input
              id="rating"
              name="rating"
              type="number"
              max="5"
              min="1"
              value={formData.rating}
              onChange={handleInputChange}
              placeholder="Enter Rating"
            />
          </div>
          {/* Reviws*/}
          <div className="space-y-2">
            <Label htmlFor="reviews">Reviews</Label>
            <Input
              id="reviews"
              name="reviews"
              type="number"
              value={formData.reviews}
              onChange={handleInputChange}
              placeholder="Enter Reviews"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">
              <ImageIcon className="inline-block mr-1 h-5 w-5" />
              Upload Image
            </Label>
            <input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              multiple
              onChange={handleMultipleImageUpload}
            />
            {formData.imagePreviews.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {formData.imagePreviews.map((src, index) => (
                  <div key={index} className="relative">
                    <img
                      key={index}
                      src={src}
                      alt={`Preview ${index}`}
                      className="w-24 h-24 object-cover border rounded"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-0 right-0 text-white bg-red-500 rounded-full w-6 h-6 flex items-center justify-center"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="pricing" className="pt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleNumberChange}
                placeholder="0.00"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price"> Old Price ($)</Label>
              <Input
                id="oldPrice"
                name="oldPrice"
                type="number"
                value={formData.oldPrice}
                onChange={handleNumberChange}
                placeholder="0.00"
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <Separator />

      <div className="flex justify-end space-x-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Update Product"}
        </Button>
      </div>
    </form>
  );
}
