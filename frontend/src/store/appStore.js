import { create } from "zustand";
import { persist } from "zustand/middleware";

const toCartItem = (product) => ({
  id: product.id || product._id,
  name: product.name,
  brand: product.brand,
  price: Number(product.price || 0),
  volume: product.volume,
  image: product.images?.[0] || product.image || "",
  stock: Number(product.stock ?? 0)
});

export const useAppStore = create(
  persist(
    (set, get) => ({
      cart: [],
      favorites: [],
      theme: "light",
      language: "fr",
      addToCart: (product, quantity = 1) => set((state) => {
        const item = toCartItem(product);
        const existing = state.cart.find((line) => line.id === item.id);
        const limit = item.stock > 0 ? item.stock : Infinity;
        if (existing) {
          const next = Math.min(existing.quantity + quantity, limit);
          return { cart: state.cart.map((line) => (line.id === item.id ? { ...line, ...item, quantity: next } : line)) };
        }
        return { cart: [...state.cart, { ...item, quantity: Math.min(quantity, limit) }] };
      }),
      updateQuantity: (id, quantity) => set((state) => ({
        cart: state.cart.map((line) => {
          if (line.id !== id) return line;
          const limit = line.stock > 0 ? line.stock : Infinity;
          return { ...line, quantity: Math.min(Math.max(1, quantity), limit) };
        })
      })),
      removeFromCart: (id) => set((state) => ({ cart: state.cart.filter((line) => line.id !== id) })),
      clearCart: () => set({ cart: [] }),
      toggleFavorite: (id) => set((state) => ({
        favorites: state.favorites.includes(id) ? state.favorites.filter((item) => item !== id) : [...state.favorites, id]
      })),
      toggleTheme: () => set((state) => ({ theme: state.theme === "dark" ? "light" : "dark" })),
      setLanguage: (language) => set({ language }),
      cartTotal: () => get().cart.reduce((sum, line) => sum + line.price * line.quantity, 0),
      cartCount: () => get().cart.reduce((sum, line) => sum + line.quantity, 0)
    }),
    {
      name: "maison-parfumee-store",
      partialize: (state) => ({ cart: state.cart, favorites: state.favorites, theme: state.theme, language: state.language })
    }
  )
);
