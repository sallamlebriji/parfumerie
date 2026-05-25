import api from "../api/axios";
import { toProduct } from "./catalogService";

const get = async (url) => {
  const { data } = await api.get(url);
  return data;
};

export const adminService = {
  dashboard: () => get("/admin/dashboard"),
  orders: () => get("/admin/orders"),
  customers: () => get("/admin/customers"),
  stocks: () => get("/admin/stocks"),
  promotions: () => get("/admin/promotions"),
  products: async () => {
    const data = await get("/admin/products");
    return data.map(toProduct);
  },
  product: async (id) => {
    const data = await get(`/perfumes/${id}`);
    return toProduct(data);
  },
  createProduct: async (payload) => {
    const { data } = await api.post("/perfumes", payload, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    return data;
  },
  updateProduct: async ({ id, payload }) => {
    const { data } = await api.put(`/perfumes/${id}`, payload, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    return data;
  },
  deleteProduct: async (id) => {
    const { data } = await api.delete(`/perfumes/${id}`);
    return data;
  },
  brands: () => get("/admin/brands"),
  categories: () => get("/admin/categories"),
  parfumeries: () => get("/tenants"),
  createParfumerie: async (payload) => {
    const { adminEmail, adminPassword, adminName, plan, status, maxUsers, maxItems, enabledModules, ...tenant } = payload;
    const { data } = await api.post("/tenants/provision", {
      tenant,
      admin: { email: adminEmail, password: adminPassword, name: adminName || "Administrateur tenant" },
      subscription: { plan, status, maxUsers, maxItems, enabledModules }
    });
    return data;
  },
  updateParfumerie: async ({ id, payload }) => {
    const { plan, status, maxUsers, maxItems, enabledModules, ...tenant } = payload;
    const { data } = await api.put(`/tenants/${id}`, {
      ...tenant,
      subscription: { plan, status, maxUsers, maxItems, enabledModules }
    });
    return data;
  },
  deleteParfumerie: async (id) => {
    const { data } = await api.delete(`/tenants/${id}`);
    return data;
  },
  toggleParfumerie: async (id) => {
    const { data } = await api.patch(`/tenants/${id}/toggle`);
    return data;
  },
  tenantStats: (id) => get(`/tenants/${id}/stats`),
  impersonateTenant: async (id) => {
    const { data } = await api.post(`/tenants/${id}/impersonate`);
    return data;
  },
  settings: () => get("/admin/settings"),
  updateSettings: async (payload) => {
    const { data } = await api.put("/admin/settings", payload);
    return data;
  },
  users: () => get("/admin/users"),
  createUser: async (payload) => {
    const { data } = await api.post("/admin/users", payload);
    return data;
  },
  updateUser: async ({ id, payload }) => {
    const { data } = await api.put(`/admin/users/${id}`, payload);
    return data;
  },
  toggleUser: async (id) => {
    const { data } = await api.patch(`/admin/users/${id}/toggle`);
    return data;
  },
  deleteUser: async (id) => {
    const { data } = await api.delete(`/admin/users/${id}`);
    return data;
  }
};
