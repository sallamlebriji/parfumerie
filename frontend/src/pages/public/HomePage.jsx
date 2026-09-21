import { ArrowRight, MessageCircle, RefreshCw } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { AutoPlayVideo } from "../../components/common/AutoPlayVideo";
import { EmptyState } from "../../components/common/EmptyState";
import { SafeImage, imageFallbacks } from "../../components/common/SafeImage";
import { SkeletonLoader } from "../../components/common/SkeletonLoader";
import { SectionIntro } from "../../components/premium/SectionIntro";
import { ProductGrid } from "../../components/product/ProductGrid";
import { Button } from "../../components/ui/Button";
import { perfumeImages, perfumeVideos } from "../../data/images";
import { useCatalog } from "../../hooks/useCatalog";
import { discountPercent, formatPrice, optimizeImage, whatsappUrl } from "../../utils/format";
import { categoryLabel, familyKey } from "../../utils/labels";

const heroPhoto = "https://images.unsplash.com/photo-1608528577891-eb055944f2e7?auto=format&fit=crop&w=1000&q=75";

const SeeAll = ({ to, label }) => (
  <Link to={to} className="inline-flex items-center gap-2 text-sm font-bold text-brand-golddeep transition hover:text-brand-ink">
    {label} <ArrowRight size={16} className="rtl:-scale-x-100" />
  </Link>
);

export const HomePage = () => {
  const { t } = useTranslation();
  const { products, families, brands, isLoading, isError, slow, refetch } = useCatalog();

  const featured = (() => {
    const chosen = products.filter((item) => item.isFeatured || item.badge === "best-seller");
    const rest = products.filter((item) => !chosen.includes(item));
    return [...chosen, ...rest].slice(0, 4);
  })();
  const offers = products.filter((item) => discountPercent(item.price, item.oldPrice) > 0).slice(0, 4);
  const newest = products.filter((item) => item.isNew).slice(0, 4);
  const pick = featured[0];
  const message = t("contact.defaultMessage");

  return (
    <main>
      <section className="relative overflow-hidden bg-brand-night pb-24 pt-32 text-white sm:pt-36 lg:pb-32">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_18%,rgba(201,164,92,0.22),transparent_30rem),radial-gradient(circle_at_4%_92%,rgba(27,58,49,0.9),transparent_30rem)]" />
        <div className="page-shell relative grid items-center gap-16 lg:grid-cols-[1.08fr_0.92fr]">
          <div>
            <p className="eyebrow-light rise">{t("home.hero.eyebrow")}</p>
            <h1 className="rise mt-5 font-display text-display-2xl font-medium" style={{ "--d": "0.08s" }}>{t("home.hero.title")}</h1>
            <p className="rise mt-7 max-w-xl text-lg leading-8 text-white/72" style={{ "--d": "0.16s" }}>{t("home.hero.text")}</p>
            <div className="rise mt-10 flex flex-col gap-3 sm:flex-row" style={{ "--d": "0.24s" }}>
              <Button as={Link} to="/shop" size="lg">{t("home.hero.primary")} <ArrowRight size={18} className="rtl:-scale-x-100" /></Button>
              <Button as="a" href={whatsappUrl(message)} target="_blank" rel="noreferrer" variant="light" size="lg"><MessageCircle size={18} /> {t("common.orderOnWhatsapp")}</Button>
            </div>
          </div>

          <div className="rise relative mx-auto w-full max-w-md lg:max-w-none" style={{ "--d": "0.2s" }}>
            <div className="arch absolute -inset-3 border border-brand-gold/40" aria-hidden="true" />
            <div className="arch relative aspect-[4/5] overflow-hidden bg-brand-moss">
              <SafeImage src={heroPhoto} fallbackSrc={perfumeImages.hero} alt="" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-night/70 via-transparent to-transparent" />
            </div>
            {pick && (
              <Link to={`/shop/${pick.id}`} className="absolute -bottom-6 start-4 end-4 flex items-center justify-between gap-4 rounded-2xl bg-brand-ivory px-5 py-4 text-brand-ink shadow-lift transition hover:-translate-y-0.5 sm:start-8 sm:end-8">
                <span className="min-w-0">
                  <span className="eyebrow block">{t("home.hero.pick")}</span>
                  <span className="mt-1 block truncate font-display text-lg font-medium">{pick.name}</span>
                </span>
                <span className="shrink-0 text-end">
                  <span className="block font-display text-lg font-semibold tabular-nums">{formatPrice(pick.price)}</span>
                  <span className="block text-xs text-brand-muted">{pick.brand}</span>
                </span>
              </Link>
            )}
          </div>
        </div>
      </section>

      {isError && (
        <section className="page-shell py-20">
          <EmptyState
            icon={RefreshCw}
            title={t("common.error")}
            text={t("home.cta.text")}
            action={<div className="flex flex-wrap justify-center gap-3"><Button onClick={() => refetch()}><RefreshCw size={16} /> {t("common.reset")}</Button><Button as="a" href={whatsappUrl(message)} target="_blank" rel="noreferrer" variant="whatsapp"><MessageCircle size={16} /> {t("common.writeOnWhatsapp")}</Button></div>}
          />
        </section>
      )}

      {families.length > 1 && (
        <section className="page-shell pb-8 pt-24 sm:pt-32">
          <SectionIntro eyebrow={t("home.families.eyebrow")} title={t("home.families.title")} text={t("home.families.text")} action={<SeeAll to="/collections" label={t("common.seeAll")} />} />
          <ul className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-6">
            {families.slice(0, 6).map((family) => (
              <li key={family.name}>
                <Link to={`/shop?category=${encodeURIComponent(family.name)}`} className="group block text-center">
                  <span className="arch-soft block aspect-[3/4] overflow-hidden bg-brand-sand">
                    <SafeImage src={optimizeImage(family.image, 420)} fallbackSrc={imageFallbacks.category} alt="" loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                  </span>
                  <span className="mt-4 block font-display text-xl font-medium">{t(`families.${familyKey(family.name)}`, categoryLabel(family.name))}</span>
                  <span className="mt-0.5 block text-sm text-brand-muted">{t("common.results", { count: family.count })}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="page-shell py-20 sm:py-28">
        <SectionIntro eyebrow={t("home.featured.eyebrow")} title={t("home.featured.title")} text={t("home.featured.text")} action={<SeeAll to="/shop" label={t("common.seeAll")} />} />
        <div className="mt-12">
          {isLoading ? (
            <>
              <SkeletonLoader count={4} />
              {slow && <p className="mt-6 text-center text-sm text-brand-muted">{t("common.loading")}</p>}
            </>
          ) : featured.length > 0 && (
            <ProductGrid products={featured} />
          )}
        </div>
      </section>

      <section className="bg-brand-pine py-20 text-white sm:py-28">
        <div className="page-shell grid items-center gap-16 lg:grid-cols-2">
          <div>
            <SectionIntro light eyebrow={t("home.ritual.eyebrow")} title={t("home.ritual.title")} text={t("home.ritual.text")} />
            <ol className="mt-10 grid gap-7">
              {t("home.ritual.steps", { returnObjects: true }).map((step, index) => (
                <li key={step.title} className="flex gap-5">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-brand-gold/60 font-display text-lg text-brand-gold">{index + 1}</span>
                  <div>
                    <h3 className="font-display text-xl font-medium">{step.title}</h3>
                    <p className="mt-1 leading-7 text-white/65">{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
            <Button as={Link} to="/shop" className="mt-10" size="lg">{t("home.hero.primary")} <ArrowRight size={18} className="rtl:-scale-x-100" /></Button>
          </div>
          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="arch absolute -inset-3 border border-brand-gold/30" aria-hidden="true" />
            <div className="arch relative aspect-[4/5] overflow-hidden bg-brand-night">
              <SafeImage src={imageFallbacks.gift} fallbackSrc={perfumeImages.gift} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
              <AutoPlayVideo src={perfumeVideos.showcase} className="absolute inset-0 h-full w-full object-cover object-right" playLabel={t("home.ritual.videoLabel")} pauseLabel={t("home.ritual.pauseLabel")} />
            </div>
          </div>
        </div>
      </section>

      {offers.length > 0 && (
        <section className="page-shell py-20 sm:py-28">
          <SectionIntro eyebrow={t("home.offers.eyebrow")} title={t("home.offers.title")} action={<SeeAll to="/shop" label={t("common.seeAll")} />} />
          <div className="mt-12"><ProductGrid products={offers} /></div>
        </section>
      )}

      {brands.length > 1 && (
        <section className="border-y border-brand-ink/10 bg-brand-porcelain py-20 sm:py-24">
          <div className="page-shell">
            <SectionIntro eyebrow={t("home.brands.eyebrow")} title={t("home.brands.title")} text={t("home.brands.text")} align="center" className="justify-center" />
            <ul className="mx-auto mt-12 flex max-w-5xl flex-wrap items-center justify-center gap-x-3 gap-y-4">
              {brands.map((brand, index) => (
                <li key={brand.name} className="flex items-center gap-3">
                  <Link to={`/shop?brand=${encodeURIComponent(brand.name)}`} className="font-display text-display-md font-medium text-brand-ink transition hover:text-brand-golddeep">{brand.name}</Link>
                  {index < brands.length - 1 && <span className="text-brand-gold" aria-hidden="true">✦</span>}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {newest.length > 0 && (
        <section className="page-shell py-20 sm:py-28">
          <SectionIntro eyebrow={t("home.newest.eyebrow")} title={t("home.newest.title")} />
          <div className="mt-12"><ProductGrid products={newest} /></div>
        </section>
      )}

      <section className="page-shell pb-24 pt-8 sm:pb-32">
        <div className="relative overflow-hidden rounded-[2rem] bg-brand-gold px-6 py-14 text-center text-brand-night sm:px-12 sm:py-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(255,255,255,0.35),transparent_22rem)]" aria-hidden="true" />
          <div className="relative mx-auto max-w-2xl">
            <h2 className="font-display text-display-lg font-medium">{t("home.cta.title")}</h2>
            <p className="mt-4 text-lg leading-8 text-brand-night/75">{t("home.cta.text")}</p>
            <Button as="a" href={whatsappUrl(message)} target="_blank" rel="noreferrer" variant="dark" size="lg" className="mt-9"><MessageCircle size={18} /> {t("common.writeOnWhatsapp")}</Button>
          </div>
        </div>
      </section>
    </main>
  );
};
