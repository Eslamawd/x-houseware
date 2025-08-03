import React, { useEffect, useState } from "react";
import { Button } from "../../ui/button.jsx";
import { Input } from "../../ui/Input.jsx";
import { Textarea } from "../../ui/textarea.jsx";
import { Label } from "../../ui/Label.jsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs.jsx";
import { Separator } from "../../ui/Separator.jsx";
import { CheckCheck, CheckCircle2, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { addProduct } from "../../../lib/productApi.js"; // تأكد من إنك عامل الملف ده
import { getAllCat } from "../../../lib/categoryApi.js";

export default function CreateProductForm({ onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    description: "",
    name: "",
    price: 0,
    oldPrice: 0,
    rating: 5,
    reviews: 65,
    imageFiles: [],
    imageUrl: "",
    imagePreviews: [],
    categoryId: "",
  });

  const [categories, setCategories] = useState([]);

  const [selectedParent, setSelectedParent] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");

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

  const [activeTab, setActiveTab] = useState("basic");
  const [isLoading, setIsLoading] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Please enter product name");
      return;
    }
    if (!formData.categoryId) {
      toast.error("Please select a category");
      return;
    }

    setIsLoading(true);
    try {
      const payload = new FormData();
      payload.append("name", formData.name);
      payload.append("description", formData.description);
      payload.append("price", formData.price.toString());
      payload.append("old_price", formData.oldPrice.toString());
      payload.append("rating", formData.rating.toString());
      payload.append("reviews", formData.reviews.toString());
      payload.append("category_id", formData.categoryId);

      if (formData.imageFiles) {
        formData.imageFiles.forEach((file) => {
          payload.append("images[]", file);
        });
      }

      const res = await addProduct(payload);

      if (res?.product?.id) {
        toast.success("Product created successfully!");
        onSuccess && onSuccess(res.product);
      }
    } catch (err) {
      console.error("Error creating product:", err);
      toast.error("Failed to create product. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6  rounded-lg shadow">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid p-3 grid-cols-2">
          <TabsTrigger value="basic" className="mr-2">
            Basic Info
          </TabsTrigger>
          <TabsTrigger value="pricing" className="ml-2">
            Pricing
          </TabsTrigger>
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
                placeholder="Enter product Name"
                required
              />
            </div>

            {/* Parent Dropdown */}
            <div className="space-y-2">
              <Label>Parent Category</Label>
              <select
                name="parent"
                className="w-full border rounded p-2"
                value={selectedParent || ""}
                onChange={handleParentChange}
              >
                <option value="">اختر تصنيف رئيسي</option>
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
                  className="w-full border rounded p-2 "
                  value={selectedCategoryId}
                  onChange={(e) => setSelectedCategoryId(e.target.value)}
                >
                  <option value="">اختر تصنيف فرعي</option>
                  {getChildrenOf(selectedParent).map((child) => (
                    <option key={child.id} value={child.id}>
                      {child.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
          {/* Descrption */}
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

          {/* Image */}

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
              <Label htmlFor="oldPrice">Old Price($)</Label>
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
          {isLoading ? "Saving..." : "Create Product"}
        </Button>
      </div>
    </form>
  );
}
