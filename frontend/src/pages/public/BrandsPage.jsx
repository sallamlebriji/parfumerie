import { ArrowUpRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { EmptyState } from "../../components/common/EmptyState";
import { PageHeader } from "../../components/common/PageHeader";
import { Button } from "../../components/ui/Button";
import { useCatalog } from "../../hooks/useCatalog";
import { usePageTitle } from "../../hooks/usePageTitle";

export const BrandsPage = () => {
  const { t } = useTranslation();
  usePageTitle(t("brandsPage.title"));
  const { brands, isLoading } = useCatalog();

  return (
    <main className="pb-24">
      <PageHeader eyebrow={t("brandsPage.eyebrow")} title={t("brandsPage.title")} text={t("brandsPage.text")} />
      <div className="page-shell pt-12">
        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2" aria-busy="true">{Array.from({ length: 6 }).map((_, index) => <div key={index} className="h-24 animate-pulse rounded-2xl bg-brand-sand/70" />)}</div>
        ) : brands.length ? (
          <ul className="grid gap-x-12 sm:grid-cols-2">
            {brands.map((brand) => (
              <li key={brand.name} className="border-b border-brand-ink/10">
                <Link to={`/shop?brand=${encodeURIComponent(brand.name)}`} className="group flex items-center justify-between gap-4 py-7">
                  <span className="font-display text-display-md font-medium transition group-hover:text-brand-golddeep">{brand.name}</span>
                  <span className="flex shrink-0 items-center gap-3 text-sm text-brand-muted">
                    {t("common.results", { count: brand.count })}
                    <span className="grid h-10 w-10 place-items-center rounded-full border border-brand-ink/15 transition group-hover:border-brand-gold group-hover:bg-brand-gold group-hover:text-brand-night"><ArrowUpRight size={17} className="rtl:-scale-x-100" /></span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState title={t("shop.none.title")} text={t("shop.none.text")} action={<Button as={Link} to="/shop">{t("common.backToShop")}</Button>} />
        )}
      </div>
    </main>
  );
};
