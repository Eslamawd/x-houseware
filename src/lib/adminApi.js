// src/lib/serviceApi.js

import api from "../api/axiosClient";




export async function getAllOrdersCount() {
  const response = await api().get("api/admin/order/count")
  if (response.status !== 200) {
    throw new Error("Failed to fetch order count");
  }
  return response.data;
}

export async function getAllOrders(page) {
  const response = await api().get(`api/admin/all-order?page=${page}`);
   if (response.status !== 200) {
    throw new Error("Failed to delete user");
  }
  return response.data;
}

export async function getRevnueCount() {
  const response = await api().get("api/admin/revnue/count")
   if (response.status !== 200) {
    throw new Error("Failed to delete user");
  }
  return response.data;
}



