export const formatPrice = (value) => `${Number(value || 0).toLocaleString("fr-FR")} DH`;
export const cx = (...classes) => classes.filter(Boolean).join(" ");

export const discountPercent = (price, oldPrice) => {
  const current = Number(price || 0);
  const previous = Number(oldPrice || 0);
  if (!previous || previous <= current) return 0;
  return Math.round(((previous - current) / previous) * 100);
};

export const optimizeImage = (url, width = 800) => {
  if (!url || typeof url !== "string") return url;
  try {
    const parsed = new URL(url);
    if (parsed.hostname !== "images.unsplash.com") return url;
    parsed.searchParams.set("auto", "format");
    parsed.searchParams.set("fit", "crop");
    parsed.searchParams.set("w", String(width));
    parsed.searchParams.set("q", "72");
    return parsed.toString();
  } catch {
    return url;
  }
};

export const orderReference = (id) => String(id || "").slice(-6).toUpperCase();

export const whatsappNumber = () => String(import.meta.env.VITE_WHATSAPP_NUMBER || "").replace(/\D/g, "");

export const whatsappUrl = (text = "") => {
  const number = whatsappNumber();
  return `https://wa.me/${number}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
};

export const formatPhone = (value) => {
  const digits = String(value || "").replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("212")) return `+212 ${digits.slice(3, 4)} ${digits.slice(4, 6)} ${digits.slice(6, 8)} ${digits.slice(8, 10)} ${digits.slice(10)}`;
  return value || "";
};
