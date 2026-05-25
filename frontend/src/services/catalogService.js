import api from "../api/axios";

const fallbackImage = "https://images.unsplash.com/photo-1590736704728-f4730bb30770?auto=format&fit=crop&w=900&q=85";

export const toProduct = (item) => ({
  id: item._id || item.id,
  _id: item._id || item.id,
  name: item.name,
  brand: item.brand,
  description: item.description,
  shortDescription: item.shortDescription || item.description,
  purchasePrice: item.purchasePrice || 0,
  quantityPurchased: item.quantityPurchased || 0,
  price: item.price,
  oldPrice: item.oldPrice || 0,
  volume: item.volume,
  category: item.category,
  family: item.family || item.category,
  gender: item.gender,
  stock: item.stock || 0,
  isAvailable: item.isAvailable,
  isFeatured: item.isFeatured,
  isPromo: item.isPromo ?? Number(item.oldPrice || 0) > Number(item.price || 0),
  isNew: item.isNew ?? (item.createdAt ? Date.now() - new Date(item.createdAt).getTime() < 1000 * 60 * 60 * 24 * 30 : false),
  badge: item.badge || (item.stock <= 0 ? "rupture" : item.isFeatured ? "best-seller" : Number(item.oldPrice || 0) > Number(item.price || 0) ? "promo" : "catalogue"),
  rating: item.rating || 4.7,
  sales: item.sales || 0,
  image: item.image || fallbackImage,
  images: item.images?.length ? item.images : [item.image || fallbackImage],
  notes: item.notes || { top: "", middle: "", base: "" },
  tenantId: item.tenantId?._id || item.tenantId || item.parfumerie?._id || item.parfumerie || "",
  parfumerie: item.tenantId?._id || item.tenantId || item.parfumerie?._id || item.parfumerie || "",
  parfumerieName: item.parfumerieName || item.parfumerie?.name || "",
  createdAt: item.createdAt
});

const uniqueBy = (items, key) => Array.from(new Map(items.filter(Boolean).map((item) => [item[key], item])).values());

const getProducts = async () => {
  const { data } = await api.get("/perfumes");
  return data.map(toProduct);
};

export const catalogService = {
  products: getProducts,
  product: async (id) => {
    const { data } = await api.get(`/perfumes/${id}`);
    return toProduct(data);
  },
  categories: async () => {
    const products = await getProducts();
    return uniqueBy(products.map((item) => ({
      id: item.category,
      name: item.category,
      image: item.images[0]
    })), "id");
  },
  brands: async () => {
    const products = await getProducts();
    return uniqueBy(products.map((item) => ({
      id: item.brand,
      name: item.brand,
      products: products.filter((product) => product.brand === item.brand).length,
      active: true
    })), "id");
  }
};
