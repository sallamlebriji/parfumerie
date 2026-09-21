import { Heart } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { EmptyState } from "../../components/common/EmptyState";
import { PageHeader } from "../../components/common/PageHeader";
import { SkeletonLoader } from "../../components/common/SkeletonLoader";
import { ProductGrid } from "../../components/product/ProductGrid";
import { Button } from "../../components/ui/Button";
import { useCatalog } from "../../hooks/useCatalog";
import { usePageTitle } from "../../hooks/usePageTitle";
import { useAppStore } from "../../store/appStore";

export const FavoritesPage = () => {
  const { t } = useTranslation();
  usePageTitle(t("favorites.title"));
  const favorites = useAppStore((state) => state.favorites);
  const { products, isLoading } = useCatalog();
  const saved = products.filter((product) => favorites.includes(product.id));

  return (
    <main className="pb-24">
      <PageHeader eyebrow={t("nav.favorites")} title={t("favorites.title")} text={t("favorites.text")} />
      <div className="page-shell pt-12">
        {isLoading && favorites.length > 0 ? (
          <SkeletonLoader count={Math.min(favorites.length, 4)} />
        ) : saved.length ? (
          <ProductGrid products={saved} />
        ) : (
          <EmptyState icon={Heart} title={t("favorites.empty.title")} text={t("favorites.empty.text")} action={<Button as={Link} to="/shop">{t("common.backToShop")}</Button>} />
        )}
      </div>
    </main>
  );
};
