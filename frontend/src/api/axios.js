import axios from "axios";

const apiBaseURL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: apiBaseURL
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  const tenantSlug = import.meta.env.VITE_TENANT_SLUG;
  if (tenantSlug) config.headers["X-Tenant-Slug"] = tenantSlug;
  return config;
});

const trimSlashes = (value) => value.replace(/\/+$/, "");
const apiOrigin = trimSlashes(apiBaseURL).replace(/\/api$/, "");

export const uploadsUrl = trimSlashes(import.meta.env.VITE_UPLOADS_URL || `${apiOrigin}/uploads`);

export const imageUrl = (image, fallback = "") => {
  if (!image) return fallback;
  const value = String(image);
  if (/^(https?:|data:|blob:)/i.test(value) || value.startsWith("/assets/")) return value;
  const cleaned = value.replace(/^\/?uploads\/?/, "").replace(/^\/+/, "");
  return cleaned ? `${uploadsUrl}/${cleaned}` : fallback;
};

export default api;
