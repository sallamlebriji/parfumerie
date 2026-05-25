export const formatPrice = (value) => `${Number(value || 0).toLocaleString("fr-FR")} DH`;
export const cx = (...classes) => classes.filter(Boolean).join(" ");
