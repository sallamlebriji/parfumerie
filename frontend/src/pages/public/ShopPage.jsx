import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { SlidersHorizontal, Sparkles } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { catalogService } from "../../services/catalogService";
import { products as fallbackProducts } from "../../data/products";
import { PageHeader } from "../../components/common/PageHeader";
import { SearchBar } from "../../components/common/SearchBar";
import { SkeletonLoader } from "../../components/common/SkeletonLoader";
import { EmptyState } from "../../components/common/EmptyState";
import { ProductGrid } from "../../components/product/ProductGrid";
import { FilterPanel } from "../../components/product/FilterPanel";
import { Modal } from "../../components/ui/Modal";
import { ProductCard } from "../../components/product/ProductCard";

const initialFilters = { search: "", category: "", brand: "", gender: "", minPrice: "", maxPrice: "", family: "", concentration: "", volume: "", availability: "", promo: "", sort: "" };

export const ShopPage = () => {
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState({ ...initialFilters, category: searchParams.get("category") || "" });
  const [quick, setQuick] = useState(null);
  const { data: remoteProducts = [], isLoading } = useQuery({ queryKey: ["products"], queryFn: catalogService.products, retry: 1 });
  const { data: remoteCategories = [] } = useQuery({ queryKey: ["categories"], queryFn: catalogService.categories, retry: 1 });
  const { data: remoteBrands = [] } = useQuery({ queryKey: ["brands"], queryFn: catalogService.brands, retry: 1 });
  const products = remoteProducts.length ? remoteProducts : fallbackProducts;
  const categories = remoteCategories.length
    ? remoteCategories
    : Array.from(new Map(fallbackProducts.map((item) => [item.category, { id: item.category, name: item.category, image: item.images[0] }])).values());
  const brands = remoteBrands.length
    ? remoteBrands
    : Array.from(new Map(fallbackProducts.map((item) => [item.brand, { id: item.brand, name: item.brand, products: 1, active: true }])).values());

  const filtered = useMemo(() => {
    const result = products.filter((product) => {
      const q = filters.search.toLowerCase();
      return (!q || product.name.toLowerCase().includes(q) || product.brand.toLowerCase().includes(q))
        && (!filters.category || product.category === filters.category)
        && (!filters.brand || product.brand === filters.brand)
        && (!filters.gender || product.gender === filters.gender)
        && (!filters.family || product.family === filters.family)
        && (!filters.concentration || product.concentration === filters.concentration)
        && (!filters.volume || product.volume === filters.volume)
        && (!filters.minPrice || product.price >= Number(filters.minPrice))
        && (!filters.maxPrice || product.price <= Number(filters.maxPrice))
        && (!filters.availability || (filters.availability === "available" ? product.stock > 0 : product.stock <= 0))
        && (!filters.promo || product.isPromo);
    });
    if (filters.sort === "price-asc") result.sort((a, b) => a.price - b.price);
    if (filters.sort === "price-desc") result.sort((a, b) => b.price - a.price);
    if (filters.sort === "new") result.sort((a, b) => Number(b.isNew) - Number(a.isNew));
    if (filters.sort === "popular") result.sort((a, b) => b.sales - a.sales);
    if (filters.sort === "rating") result.sort((a, b) => b.rating - a.rating);
    return result;
  }, [products, filters]);

  return (
    <main className="pb-20">
      <PageHeader eyebrow="Boutique" title="Collection de parfums" text="Explorez nos fragrances raffinees avec filtres avances et cartes premium." image="https://images.unsplash.com/photo-1590736704728-f4730bb30770?auto=format&fit=crop&w=1800&q=90" />
      <div className="mx-auto -mt-10 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-[32px] border border-black/10 bg-white/82 p-5 shadow-[0_28px_90px_rgba(17,19,24,0.1)] backdrop-blur-2xl">
          <div className="mb-5 flex flex-col justify-between gap-4 border-b border-black/10 pb-5 md:flex-row md:items-center">
            <div>
              <p className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.24em] text-brand-copper">
                <Sparkles size={14} /> Catalogue premium
              </p>
              <h2 className="mt-2 font-display text-3xl font-black text-brand-ink">Recherche rapide et filtres avances</h2>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-brand-ink px-4 py-2 text-sm font-black text-white">
              <SlidersHorizontal size={16} /> {filtered.length} parfum{filtered.length > 1 ? "s" : ""}
            </div>
          </div>
          <SearchBar value={filters.search} onChange={(value) => setFilters((state) => ({ ...state, search: value }))} placeholder="Recherche par nom, marque..." />
          <div className="mt-5">
          <FilterPanel filters={filters} setFilters={setFilters} brands={brands} categories={categories} />
          </div>
        </div>
        <div className="mt-10">{isLoading ? <SkeletonLoader /> : filtered.length ? <ProductGrid products={filtered} onQuickView={setQuick} /> : <EmptyState title="Aucun parfum trouve" />}</div>
      </div>
      <Modal open={Boolean(quick)} title={quick?.name} onClose={() => setQuick(null)}>{quick && <ProductCard product={quick} />}</Modal>
    </main>
  );
};
