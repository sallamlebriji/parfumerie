import { RefreshCw, Search, SlidersHorizontal, X } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { EmptyState } from "../../components/common/EmptyState";
import { PageHeader } from "../../components/common/PageHeader";
import { SkeletonLoader } from "../../components/common/SkeletonLoader";
import { ProductGrid } from "../../components/product/ProductGrid";
import { Button } from "../../components/ui/Button";
import { Drawer } from "../../components/ui/Drawer";
import { Input, fieldClass } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { genders } from "../../constants/options";
import { useCatalog } from "../../hooks/useCatalog";
import { discountPercent } from "../../utils/format";
import { categoryLabel, familyKey } from "../../utils/labels";

const sorters = {
  "price-asc": (a, b) => a.price - b.price,
  "price-desc": (a, b) => b.price - a.price,
  newest: (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
};

export const ShopPage = () => {
  const { t } = useTranslation();
  const { products, families, brands, isLoading, isError, slow, refetch } = useCatalog();
  const [params, setParams] = useSearchParams();
  const [panel, setPanel] = useState(false);

  const filters = {
    q: params.get("q") || "",
    category: params.get("category") || "",
    brand: params.get("brand") || "",
    gender: params.get("gender") || "",
    min: params.get("min") || "",
    max: params.get("max") || "",
    stock: params.get("stock") === "1",
    promo: params.get("promo") === "1",
    sort: params.get("sort") || ""
  };

  const setFilter = (key, value) => setParams((current) => {
    const next = new URLSearchParams(current);
    if (value === "" || value === false || value == null) next.delete(key);
    else next.set(key, value === true ? "1" : value);
    return next;
  }, { replace: true });

  const clearAll = () => setParams({}, { replace: true });
  const familyName = (name) => t(`families.${familyKey(name)}`, categoryLabel(name));

  const visible = useMemo(() => {
    const q = filters.q.trim().toLowerCase();
    const list = products.filter((product) => {
      if (q && ![product.name, product.brand, product.category].some((value) => String(value || "").toLowerCase().includes(q))) return false;
      if (filters.category && product.category !== filters.category) return false;
      if (filters.brand && product.brand !== filters.brand) return false;
      if (filters.gender && product.gender !== filters.gender) return false;
      if (filters.min && product.price < Number(filters.min)) return false;
      if (filters.max && product.price > Number(filters.max)) return false;
      if (filters.stock && !(product.stock > 0 && product.isAvailable !== false)) return false;
      if (filters.promo && discountPercent(product.price, product.oldPrice) <= 0) return false;
      return true;
    });
    return sorters[filters.sort] ? [...list].sort(sorters[filters.sort]) : list;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products, params.toString()]);

  const hiddenFilters = [
    filters.brand && { key: "brand", label: filters.brand, clear: () => setFilter("brand", "") },
    filters.gender && { key: "gender", label: t(`genders.${filters.gender}`, filters.gender), clear: () => setFilter("gender", "") },
    (filters.min || filters.max) && { key: "price", label: `${filters.min || 0} – ${filters.max || "∞"} DH`, clear: () => { setFilter("min", ""); setFilter("max", ""); } },
    filters.stock && { key: "stock", label: t("shop.availableOnly"), clear: () => setFilter("stock", false) },
    filters.promo && { key: "promo", label: t("shop.promoOnly"), clear: () => setFilter("promo", false) }
  ].filter(Boolean);

  const hasAnyFilter = hiddenFilters.length > 0 || filters.category || filters.q;

  return (
    <main className="pb-24">
      <PageHeader eyebrow={t("shop.eyebrow")} title={t("shop.title")} text={t("shop.text")} />

      <div className="page-shell pt-8">
        <div className="flex flex-wrap items-center gap-3">
          <label className="relative min-w-[14rem] flex-1">
            <span className="sr-only">{t("common.search")}</span>
            <Search size={18} className="pointer-events-none absolute start-4 top-1/2 -translate-y-1/2 text-brand-muted" />
            <input type="search" value={filters.q} onChange={(event) => setFilter("q", event.target.value)} placeholder={t("shop.searchPlaceholder")} className={`${fieldClass} ps-11`} />
          </label>
          <Button variant="outline" onClick={() => setPanel(true)} aria-haspopup="dialog">
            <SlidersHorizontal size={17} /> {t("shop.filters")}
            {hiddenFilters.length > 0 && <span className="grid h-5 min-w-[1.25rem] place-items-center rounded-full bg-brand-gold px-1 text-[0.7rem] text-brand-night">{hiddenFilters.length}</span>}
          </Button>
          <div className="flex items-center gap-2 text-sm font-semibold">
            <span className="hidden sm:inline" aria-hidden="true">{t("shop.sortLabel")}</span>
            <Select
              aria-label={t("shop.sortLabel")}
              value={filters.sort}
              onChange={(event) => setFilter("sort", event.target.value)}
              inputClassName="!w-auto !py-2.5"
              options={[
                { value: "", label: t("shop.sort.recommended") },
                { value: "price-asc", label: t("shop.sort.priceAsc") },
                { value: "price-desc", label: t("shop.sort.priceDesc") },
                { value: "newest", label: t("shop.sort.newest") }
              ]}
            />
          </div>
        </div>

        {families.length > 1 && (
          <div className="hide-scrollbar -mx-4 mt-5 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0" role="group" aria-label={t("shop.allFamilies")}>
            {[{ name: "", count: products.length }, ...families].map((family) => {
              const active = filters.category === family.name;
              return (
                <button
                  key={family.name || "all"}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setFilter("category", family.name)}
                  className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition ${active ? "border-brand-pine bg-brand-pine text-brand-porcelain" : "border-brand-ink/15 bg-white hover:border-brand-ink/40"}`}
                >
                  {family.name ? familyName(family.name) : t("shop.allFamilies")} <span className={active ? "text-brand-goldsoft" : "text-brand-muted"}>{family.count}</span>
                </button>
              );
            })}
          </div>
        )}

        <div className="mt-6 flex flex-wrap items-center gap-2 text-sm" aria-live="polite">
          <p className="font-semibold">{t("common.results", { count: visible.length })}</p>
          {hiddenFilters.map((chip) => (
            <button key={chip.key} type="button" onClick={chip.clear} className="inline-flex items-center gap-1.5 rounded-full bg-brand-gold/15 px-3 py-1.5 font-semibold text-brand-golddeep transition hover:bg-brand-gold/25">
              {chip.label} <X size={13} aria-label={t("common.remove")} />
            </button>
          ))}
          {hasAnyFilter && <button type="button" onClick={clearAll} className="font-semibold text-brand-muted underline underline-offset-4 hover:text-brand-ink">{t("shop.clear")}</button>}
        </div>

        <div className="mt-8">
          {isLoading ? (
            <>
              <SkeletonLoader count={8} />
              {slow && <p className="mt-6 text-center text-sm text-brand-muted">{t("common.loading")}</p>}
            </>
          ) : isError ? (
            <EmptyState icon={RefreshCw} title={t("common.error")} text="" action={<Button onClick={() => refetch()}><RefreshCw size={16} /> {t("common.reset")}</Button>} />
          ) : visible.length ? (
            <ProductGrid products={visible} />
          ) : (
            <EmptyState title={t("shop.none.title")} text={t("shop.none.text")} action={<Button onClick={clearAll}>{t("shop.clear")}</Button>} />
          )}
        </div>
      </div>

      <Drawer
        open={panel}
        onClose={() => setPanel(false)}
        title={t("shop.filters")}
        closeLabel={t("nav.close")}
        footer={
          <div className="flex gap-3">
            <Button variant="outline" onClick={clearAll} className="flex-1">{t("shop.clear")}</Button>
            <Button onClick={() => setPanel(false)} className="flex-[1.4]">{t("common.results", { count: visible.length })}</Button>
          </div>
        }
      >
        <div className="grid gap-7">
          <fieldset>
            <legend className="mb-3 text-sm font-semibold">{t("shop.gender")}</legend>
            <div className="flex flex-wrap gap-2">
              {["", ...genders].map((gender) => {
                const active = filters.gender === gender;
                return (
                  <button key={gender || "all"} type="button" aria-pressed={active} onClick={() => setFilter("gender", gender)} className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${active ? "border-brand-pine bg-brand-pine text-brand-porcelain" : "border-brand-ink/15 bg-white hover:border-brand-ink/40"}`}>
                    {gender ? t(`genders.${gender}`, gender) : t("shop.allGenders")}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <Select label={t("shop.brand")} value={filters.brand} onChange={(event) => setFilter("brand", event.target.value)} options={[{ value: "", label: t("shop.allBrands") }, ...brands.map((brand) => ({ value: brand.name, label: `${brand.name} (${brand.count})` }))]} />

          <fieldset>
            <legend className="mb-3 text-sm font-semibold">{t("shop.price")}</legend>
            <div className="grid grid-cols-2 gap-3">
              <Input type="number" min="0" inputMode="numeric" aria-label={t("shop.min")} placeholder={t("shop.min")} value={filters.min} onChange={(event) => setFilter("min", event.target.value)} />
              <Input type="number" min="0" inputMode="numeric" aria-label={t("shop.max")} placeholder={t("shop.max")} value={filters.max} onChange={(event) => setFilter("max", event.target.value)} />
            </div>
          </fieldset>

          <div className="grid gap-3">
            <label className="flex cursor-pointer items-center gap-3 text-sm font-semibold">
              <input type="checkbox" checked={filters.stock} onChange={(event) => setFilter("stock", event.target.checked)} className="h-5 w-5 rounded border-brand-ink/30 accent-brand-pine" />
              {t("shop.availableOnly")}
            </label>
            <label className="flex cursor-pointer items-center gap-3 text-sm font-semibold">
              <input type="checkbox" checked={filters.promo} onChange={(event) => setFilter("promo", event.target.checked)} className="h-5 w-5 rounded border-brand-ink/30 accent-brand-pine" />
              {t("shop.promoOnly")}
            </label>
          </div>
        </div>
      </Drawer>
    </main>
  );
};
