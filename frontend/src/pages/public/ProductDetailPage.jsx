import { Check, Heart, MessageCircle, ShoppingBag } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import { QuantitySelector } from "../../components/cart/QuantitySelector";
import { EmptyState } from "../../components/common/EmptyState";
import { SafeImage, imageFallbacks } from "../../components/common/SafeImage";
import { NotesPyramid } from "../../components/product/NotesPyramid";
import { PriceTag } from "../../components/product/PriceTag";
import { ProductGrid } from "../../components/product/ProductGrid";
import { Button } from "../../components/ui/Button";
import { useCatalog, useProduct } from "../../hooks/useCatalog";
import { usePageTitle } from "../../hooks/usePageTitle";
import { useAppStore } from "../../store/appStore";
import { optimizeImage, whatsappUrl } from "../../utils/format";
import { categoryLabel, familyKey } from "../../utils/labels";

export const ProductDetailPage = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const { products } = useCatalog();
  const { product, isLoading, notFound } = useProduct(id);
  const addToCart = useAppStore((state) => state.addToCart);
  const favorite = useAppStore((state) => state.favorites.includes(id));
  const toggleFavorite = useAppStore((state) => state.toggleFavorite);
  const [quantity, setQuantity] = useState(1);
  usePageTitle(product?.name);

  if (isLoading) {
    return (
      <main className="page-shell pb-24 pt-32" aria-busy="true">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="mx-auto aspect-[4/5] w-full max-w-lg animate-pulse rounded-t-full bg-brand-sand/70" />
          <div className="space-y-5 pt-6">
            <div className="h-4 w-28 animate-pulse rounded-full bg-brand-sand/70" />
            <div className="h-12 w-3/4 animate-pulse rounded-full bg-brand-sand/70" />
            <div className="h-8 w-40 animate-pulse rounded-full bg-brand-sand/70" />
            <div className="h-24 animate-pulse rounded-2xl bg-brand-sand/70" />
          </div>
        </div>
      </main>
    );
  }

  if (notFound || !product) {
    return (
      <main className="page-shell pb-24 pt-40">
        <EmptyState title={t("product.notFound.title")} text={t("product.notFound.text")} action={<Button as={Link} to="/shop">{t("common.backToShop")}</Button>} />
      </main>
    );
  }

  const soldOut = product.stock <= 0 || product.isAvailable === false;
  const family = t(`families.${familyKey(product.category)}`, categoryLabel(product.category));
  const similar = (() => {
    const others = products.filter((item) => item.id !== product.id);
    const sameFamily = others.filter((item) => item.category === product.category);
    return [...sameFamily, ...others.filter((item) => !sameFamily.includes(item))].slice(0, 4);
  })();

  const add = () => {
    addToCart(product, quantity);
    toast.success(t("common.added", { name: product.name }));
  };

  const availability = soldOut
    ? { label: t("common.outOfStock"), dot: "bg-brand-wine" }
    : product.stock > 0 && product.stock <= 5
      ? { label: t("common.lowStock", { count: product.stock }), dot: "bg-brand-copper" }
      : { label: t("common.inStock"), dot: "bg-emerald-600" };

  return (
    <main className="pb-24 pt-[6.5rem]">
      <div className="page-shell">
        <nav aria-label="Fil d'Ariane" className="text-sm text-brand-muted">
          <ol className="flex flex-wrap items-center gap-2">
            <li><Link className="transition hover:text-brand-ink" to="/shop">{t("nav.shop")}</Link></li>
            <li aria-hidden="true">/</li>
            <li><Link className="transition hover:text-brand-ink" to={`/shop?category=${encodeURIComponent(product.category)}`}>{family}</Link></li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-brand-ink">{product.name}</li>
          </ol>
        </nav>

        <div className="mt-8 grid gap-14 lg:grid-cols-2 lg:gap-24">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <div className="relative mx-auto max-w-lg">
              <div className="arch absolute -inset-3 border border-brand-gold/45" aria-hidden="true" />
              <div className="arch relative aspect-[4/5] overflow-hidden bg-brand-sand">
                <SafeImage src={optimizeImage(product.images?.[0] || product.image, 1000)} fallbackSrc={imageFallbacks.perfume} alt={product.name} className={`h-full w-full object-cover ${soldOut ? "opacity-70 grayscale-[0.4]" : ""}`} />
              </div>
              <button
                type="button"
                onClick={() => toggleFavorite(product.id)}
                aria-pressed={favorite}
                aria-label={favorite ? t("common.removeFavorite") : t("common.addFavorite")}
                className="absolute bottom-4 end-4 grid h-12 w-12 place-items-center rounded-full bg-white/95 text-brand-ink shadow-lg transition hover:scale-105"
              >
                <Heart size={20} className={favorite ? "fill-brand-wine text-brand-wine" : ""} />
              </button>
            </div>
          </div>

          <div className="lg:pt-6">
            <p className="eyebrow">{product.brand}</p>
            <h1 className="mt-3 font-display text-display-xl font-medium">{product.name}</h1>
            <p className="mt-4 text-brand-muted">{[family, product.gender && t(`genders.${product.gender}`, product.gender), product.volume].filter(Boolean).join(" · ")}</p>

            <div className="mt-8"><PriceTag price={product.price} oldPrice={product.oldPrice} size="lg" /></div>
            <p className="mt-4 inline-flex items-center gap-2 text-sm font-semibold"><span className={`h-2.5 w-2.5 rounded-full ${availability.dot}`} aria-hidden="true" /> {availability.label}</p>

            <p className="mt-8 max-w-xl text-base leading-8 text-brand-ink/80">{product.description}</p>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              <QuantitySelector value={quantity} onChange={setQuantity} max={product.stock} decreaseLabel={t("common.decrease")} increaseLabel={t("common.increase")} />
              <Button size="lg" onClick={add} disabled={soldOut} className="flex-1 whitespace-nowrap sm:flex-none"><ShoppingBag size={18} /> {t("common.addToCart")}</Button>
            </div>
            <Button as="a" href={whatsappUrl(t("product.orderMessage", { name: product.name, volume: product.volume }))} target="_blank" rel="noreferrer" variant="whatsapp" size="lg" className="mt-3 w-full sm:w-auto"><MessageCircle size={18} /> {t("common.orderOnWhatsapp")}</Button>

            <ul className="mt-10 grid gap-3 border-t border-brand-ink/10 pt-8 text-sm text-brand-ink/80">
              {t("product.reassurance", { returnObjects: true }).map((line) => (
                <li key={line} className="flex items-center gap-3"><span className="grid h-6 w-6 place-items-center rounded-full bg-brand-gold/20 text-brand-golddeep"><Check size={14} /></span>{line}</li>
              ))}
            </ul>
          </div>
        </div>

        <section className="mt-28 grid items-center gap-12 rounded-[2rem] bg-brand-porcelain px-6 py-14 sm:px-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20 lg:py-20" aria-labelledby="pyramid-title">
          <div>
            <p className="eyebrow">{t("product.notesEyebrow")}</p>
            <h2 id="pyramid-title" className="mt-3 font-display text-display-lg font-medium">{t("product.pyramid")}</h2>
            <p className="mt-5 max-w-md leading-8 text-brand-muted">{t("product.pyramidText")}</p>
          </div>
          <NotesPyramid notes={product.notes} />
        </section>

        {similar.length > 0 && (
          <section className="mt-28">
            <h2 className="font-display text-display-lg font-medium">{t("product.similar")}</h2>
            <div className="mt-10"><ProductGrid products={similar} /></div>
          </section>
        )}
      </div>
    </main>
  );
};
