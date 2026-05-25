import { createContext, useContext, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => JSON.parse(localStorage.getItem("cartItems") || "[]"));

  useEffect(() => localStorage.setItem("cartItems", JSON.stringify(items)), [items]);

  const addToCart = (perfume, quantity = 1) => {
    setItems((current) => {
      const existing = current.find((item) => item._id === perfume._id);
      if (existing) {
        return current.map((item) => (item._id === perfume._id ? { ...item, quantity: item.quantity + quantity } : item));
      }
      return [...current, { ...perfume, quantity }];
    });
    toast.success(`${perfume.name} ajoute au panier`);
  };

  const updateQuantity = (id, quantity) => {
    setItems((current) => current.map((item) => (item._id === id ? { ...item, quantity: Math.max(1, quantity) } : item)));
  };

  const removeFromCart = (id) => {
    setItems((current) => current.filter((item) => item._id !== id));
    toast("Produit retire du panier");
  };
  const clearCart = () => setItems([]);
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const value = useMemo(() => ({ items, addToCart, updateQuantity, removeFromCart, clearCart, total }), [items, total]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => useContext(CartContext);
