import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api"
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  const tenantSlug = import.meta.env.VITE_TENANT_SLUG;
  if (tenantSlug) config.headers["X-Tenant-Slug"] = tenantSlug;
  return config;
});

export const uploadsUrl = import.meta.env.VITE_UPLOADS_URL || "http://localhost:5000/uploads";
export default api;
