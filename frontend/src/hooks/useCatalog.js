import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { products as demoProducts } from "../data/products";
import { catalogService } from "../services/catalogService";

// Les produits de démonstration ne servent qu'en développement (VITE_DEMO_DATA=true), jamais en production.
const demoEnabled = import.meta.env.VITE_DEMO_DATA === "true";

const countBy = (products, key) => {
  const map = new Map();
  products.forEach((product) => {
    const name = product[key];
    if (!name) return;
    const entry = map.get(name) || { name, count: 0, image: product.images?.[0] || product.image || "" };
    entry.count += 1;
    map.set(name, entry);
  });
  return [...map.values()].sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
};

export const useCatalog = () => {
  const query = useQuery({ queryKey: ["products"], queryFn: catalogService.products, retry: 1, staleTime: 60_000, refetchOnWindowFocus: false });
  const [slow, setSlow] = useState(false);

  useEffect(() => {
    if (!query.isLoading) {
      setSlow(false);
      return undefined;
    }
    const timer = setTimeout(() => setSlow(true), 6000);
    return () => clearTimeout(timer);
  }, [query.isLoading]);

  const products = useMemo(() => {
    if (query.data?.length) return query.data;
    if (demoEnabled && !query.isLoading) return demoProducts;
    return [];
  }, [query.data, query.isLoading]);

  const families = useMemo(() => countBy(products, "category"), [products]);
  const brands = useMemo(() => countBy(products, "brand"), [products]);

  return {
    products,
    families,
    brands,
    isLoading: query.isLoading,
    isError: query.isError && products.length === 0,
    slow,
    refetch: query.refetch
  };
};

export const useProduct = (id) => {
  const { products, isLoading: listLoading } = useCatalog();
  const fromList = products.find((item) => item.id === id);
  const query = useQuery({ queryKey: ["product", id], queryFn: () => catalogService.product(id), enabled: !fromList && !listLoading && Boolean(id), retry: 0 });
  return {
    product: fromList || query.data || null,
    isLoading: listLoading || (!fromList && query.isLoading),
    notFound: !listLoading && !fromList && !query.isLoading && !query.data
  };
};
