import axios from "axios";

export default function api() {
  const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000",
    withCredentials: true,
  });
  axios.defaults.withCredentials = true;
  axios.defaults.withXSRFToken = true;

  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response.status === 401) {
        // Handle unauthorized access, e.g., redirect to login
        console.warn("Unauthorized access, redirecting to login...");

        return Promise.reject();
      }

      return Promise.reject(error);
    }
  );

  return api;
}
