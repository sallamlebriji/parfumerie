import { brands, categories, customers, dashboardStats, orders, products, promotions, stocks } from "../data";

const wait = (data, ms = 250) => new Promise((resolve) => setTimeout(() => resolve(data), ms));

export const mockApi = {
  getProducts: () => wait(products),
  getProduct: (id) => wait(products.find((item) => item.id === id) || products[0]),
  getCategories: () => wait(categories),
  getBrands: () => wait(brands),
  getOrders: () => wait(orders),
  getCustomers: () => wait(customers),
  getStocks: () => wait(stocks),
  getPromotions: () => wait(promotions),
  getDashboard: () => wait(dashboardStats),
  createOrder: (payload) => wait({ id: `CMD-${Date.now()}`, ...payload, status: "En attente" })
};
