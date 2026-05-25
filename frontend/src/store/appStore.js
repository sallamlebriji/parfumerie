import { create } from "zustand";
import { products } from "../data/products";

export const useAppStore = create((set, get) => ({
  cart: [],
  wishlist: [],
  compare: [],
  theme: "light",
  language: "fr",
  products,
  addToCart: (product, quantity = 1) => set((state) => {
    const existing = state.cart.find((item) => item.id === product.id);
    if (existing) {
      return { cart: state.cart.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item) };
    }
    return { cart: [...state.cart, { ...product, quantity }] };
  }),
  updateQuantity: (id, quantity) => set((state) => ({ cart: state.cart.map((item) => item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item) })),
  removeFromCart: (id) => set((state) => ({ cart: state.cart.filter((item) => item.id !== id) })),
  clearCart: () => set({ cart: [] }),
  toggleWishlist: (id) => set((state) => ({ wishlist: state.wishlist.includes(id) ? state.wishlist.filter((item) => item !== id) : [...state.wishlist, id] })),
  toggleCompare: (id) => set((state) => ({ compare: state.compare.includes(id) ? state.compare.filter((item) => item !== id) : [...state.compare.slice(-2), id] })),
  toggleTheme: () => set((state) => ({ theme: state.theme === "dark" ? "light" : "dark" })),
  setLanguage: (language) => set({ language }),
  cartTotal: () => get().cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
}));
