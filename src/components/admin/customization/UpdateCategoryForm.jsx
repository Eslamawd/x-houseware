import React, { useEffect, useState } from "react";
import { Button } from "../../ui/button.jsx";
import { Input } from "../../ui/Input.jsx";
import { Label } from "../../ui/Label.jsx";
import { Separator } from "../../ui/Separator.jsx";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { updateCategory, getAllCat } from "../../../lib/categoryApi.js";

function UpdateCategoryForm({ category, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    name: category.name || "",
    image: null,
    parent_id: category.parent_id || "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [parentCategories, setParentCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchParents = async () => {
      try {
        const res = await getAllCat();
        setParentCategories(res.categories || []);
      } catch (err) {
        console.error("Error loading parents:", err);
      }
    };
    fetchParents();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData((prev) => ({ ...prev, image: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Please Add Name of Category");
      return;
    }

    const data = new FormData();
    data.append("name", formData.name);
    if (formData.image) data.append("image", formData.image);
    if (formData.parent_id) data.append("parent_id", formData.parent_id);

    setIsLoading(true);
    try {
      const res = await updateCategory(category.id, data);
      if (res.category) {
        toast.success("تم تحديث التصنيف بنجاح");
        onSuccess && onSuccess(res.category);
        navigate("/admin/categories");
        onCancel && onCancel();
      }
    } catch (err) {
      console.error("Error updating category:", err);
      toast.error("حدث خطأ أثناء التحديث");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 p-6 bg-white rounded-lg shadow "
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="image">Updated Image</Label>
          <Input
            id="image"
            name="image"
            type="file"
            accept="image/*"
            onChange={handleInputChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="parent_id">Parent Category</Label>
          <select
            name="parent_id"
            id="parent_id"
            value={formData.parent_id}
            onChange={handleInputChange}
            className="w-full rounded border px-3 py-2 bg-white text-black"
          >
            <option value={formData.parent_id}>Edit</option>
            {parentCategories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

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
          {isLoading ? "Updating..." : "Update Category"}
        </Button>
      </div>
    </form>
  );
}

export default UpdateCategoryForm;
