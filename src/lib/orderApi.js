// src/lib/serviceApi.js

import api from "../api/axiosClient";


export async function loadOrder() {
  const response = await api().get("api/orders");
  // نفترض أنّ الـ response.data هو مصفوفة الخدمات
  return response.data;
}

export async function addOrder(serviceData) {
  // لا حاجة لتمرير الـ id، Laravel سيولّد id تلقائيًا (بما أننا استخدمنا auto-increment)
  const payload = { ...serviceData };

  const response = await api().post("api/orders", payload);
  return response.data;
}


export async function updateOrder(id, formData ) {
  
  
  const response = await api().put(`api/admin/orders/${id}`, formData);
  return response.data;
}

/**
 * حذف خدمة
 * DELETE /api/services/{id}
 */
export async function deleteOrder(id) {
  const response = await api().delete(`api/admin/orders/${id}`);
  return response.data;
}





