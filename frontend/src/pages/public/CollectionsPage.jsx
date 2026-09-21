import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { EmptyState } from "../../components/common/EmptyState";
import { PageHeader } from "../../components/common/PageHeader";
import { SafeImage, imageFallbacks } from "../../components/common/SafeImage";
import { Button } from "../../components/ui/Button";
import { useCatalog } from "../../hooks/useCatalog";
import { usePageTitle } from "../../hooks/usePageTitle";
import { optimizeImage } from "../../utils/format";
import { categoryLabel, familyKey } from "../../utils/labels";

export const CollectionsPage = () => {
  const { t } = useTranslation();
  usePageTitle(t("collections.title"));
  const { families, isLoading } = useCatalog();

  return (
    <main className="pb-24">
      <PageHeader eyebrow={t("collections.eyebrow")} title={t("collections.title")} text={t("collections.text")} />
      <div className="page-shell pt-12">
        {isLoading ? (
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4" aria-busy="true">{Array.from({ length: 4 }).map((_, index) => <div key={index} className="arch-soft aspect-[3/4] animate-pulse bg-brand-sand/70" />)}</div>
        ) : families.length ? (
          <ul className="grid grid-cols-2 gap-x-4 gap-y-12 sm:gap-x-8 lg:grid-cols-4">
            {families.map((family) => (
              <li key={family.name}>
                <Link to={`/shop?category=${encodeURIComponent(family.name)}`} className="group block text-center">
                  <span className="arch-soft relative block aspect-[3/4] overflow-hidden bg-brand-sand">
                    <SafeImage src={optimizeImage(family.image, 560)} fallbackSrc={imageFallbacks.category} alt="" loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                    <span className="absolute inset-0 bg-gradient-to-t from-brand-night/55 via-transparent to-transparent" />
                  </span>
                  <span className="mt-5 block font-display text-2xl font-medium">{t(`families.${familyKey(family.name)}`, categoryLabel(family.name))}</span>
                  <span className="mt-1 block text-sm text-brand-muted">{t("common.results", { count: family.count })}</span>
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
