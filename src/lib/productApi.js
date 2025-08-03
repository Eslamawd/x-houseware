// src/lib/productApi.js

import api from "../api/axiosClient";

/**
 * جلب كل الخدمات
 * GET /api/products
 */
export async function loadProducts(page) {
  const response = await api().get(`api/product?page=${page || 1}`);
  // نفترض أنّ الـ response.data هو مصفوفة الخدمات
  return response.data;
}
export async function loadProductsByAdmin(page) {
  const response = await api().get(`api/admin/all/product?page=${page || 1}`);
  // نفترض أنّ الـ response.data هو مصفوفة الخدمات
  return response.data;
}

export async function getProduct(id) {
  const response = await api().get(`api/product/${id}`);
  // نفترض أنّ الـ response.data هو مصفوفة الخدمات
  return response.data;
}

/**
 * إنشاء خدمة جديدة
 * POST /api/products
 * @param productData: جسم الطلب بصيغة Product (object)
 */
export async function addProduct(productData) {
  // لا حاجة لتمرير الـ id، Laravel سيولّد id تلقائيًا (بما أننا استخدمنا auto-increment)

  const response = await api().post("api/admin/product", productData, {
    headers: {
      "Content-Type": "multipart/form-data", // إذا كنت تستخدم FormData
    },
  });
  return response.data;
}

/**
 * تحديث خدمة قائمة
 * PUT /api/products/{id}
 * @param productData: كائن الخدمة يحتوي على id وحقول أخرى محدثة
 */
export async function updateProduct(id, payload) {
  const response = await api().post(`api/admin/product/${id}`, payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}

/**
 * حذف خدمة
 * DELETE /api/products/{id}
 */
export async function deleteProduct(id) {
  const response = await api().delete(`api/admin/product/${id}`);
  return response.data;
}

export const getProductsByCategory = async (category) => {
  const response = await api().get(`/products?category=${category}`);
  return response.data.data;
};

// ✅ الحصول على الخدمات حسب الاسم
export const getProductByName = async (name) => {
  const response = await api().get(`/products?search=${name}`);
  return response.data.data;
};
