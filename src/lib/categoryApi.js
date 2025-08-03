
import api from "../api/axiosClient";


export async function loadCategory(page) {
  const response = await api().get(`api/categories?page=${page || 1}`);
  // نفترض أنّ الـ response.data هو مصفوفة الخدمات
  return response.data;
}
export async function getAllCat() {
  const response = await api().get(`api/categories/all`);
  // نفترض أنّ الـ response.data هو مصفوفة الخدمات
  return response.data;
}

export async function getAllCatAdmin(page) {
  const response = await api().get(`api/categories/all-req?page=${page || 1}`);
  // نفترض أنّ الـ response.data هو مصفوفة الخدمات
  return response.data;
}

export const loadAllProductWithCat = async (id, productPage = 1, childrenPage = 1) => {
  const res = await api().get(
    `/api/categories/${id}?page=${productPage}&children_page=${childrenPage}`
  );
  return res.data;
};


export async function addCategory(serviceData) {
  // لا حاجة لتمرير الـ id، Laravel سيولّد id تلقائيًا (بما أننا استخدمنا auto-increment)
  

  const response = await api().post("api/admin/categories", serviceData, {
    headers: {
      "Content-Type": "multipart/form-data", // إذا كنت تستخدم FormData
    },
  });
  return response.data;
}


export async function updateCategory(id, formData ) {
  
  
  const response = await api().put(`api/admin/categories/${id}`, formData);
  return response.data;
}


export async function deleteCategory(id) {
  const response = await api().delete(`api/admin/categories/${id}`);
  return response.data;
}


