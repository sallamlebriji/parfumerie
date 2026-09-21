import { Heart, Plus } from "lucide-react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useAppStore } from "../../store/appStore";
import { discountPercent, optimizeImage } from "../../utils/format";
import { categoryLabel, familyKey } from "../../utils/labels";
import { SafeImage, imageFallbacks } from "../common/SafeImage";
import { Badge } from "../ui/Badge";
import { PriceTag } from "./PriceTag";

export const ProductCard = ({ product }) => {
  const { t } = useTranslation();
  const addToCart = useAppStore((state) => state.addToCart);
  const favorite = useAppStore((state) => state.favorites.includes(product.id));
  const toggleFavorite = useAppStore((state) => state.toggleFavorite);
  const soldOut = product.stock <= 0 || product.isAvailable === false;
  const percent = discountPercent(product.price, product.oldPrice);
  const family = t(`families.${familyKey(product.category)}`, categoryLabel(product.category));

  const add = () => {
    addToCart(product);
    toast.success(t("common.added", { name: product.name }));
  };

  return (
    <article className="group relative flex flex-col">
      <Link to={`/shop/${product.id}`} className="relative block aspect-[4/5] overflow-hidden rounded-2xl bg-brand-sand" aria-label={product.name}>
        <SafeImage
          src={optimizeImage(product.images?.[0] || product.image, 640)}
          fallbackSrc={imageFallbacks.perfume}
          alt=""
          loading="lazy"
          className={`h-full w-full object-cover transition duration-700 group-hover:scale-105 ${soldOut ? "opacity-60 grayscale-[0.4]" : ""}`}
        />
        <div className="absolute start-3 top-3 flex flex-wrap gap-1.5">
          {percent > 0 && !soldOut && <Badge tone="dark" className="!bg-brand-wine !text-white">−{percent}%</Badge>}
          {product.isNew && !soldOut && <Badge tone="light">{t("common.new")}</Badge>}
          {soldOut && <Badge tone="dark">{t("common.outOfStock")}</Badge>}
        </div>
      </Link>

      <button
        type="button"
        onClick={() => toggleFavorite(product.id)}
        aria-pressed={favorite}
        aria-label={favorite ? t("common.removeFavorite") : t("common.addFavorite")}
        className="absolute end-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-white/90 text-brand-ink shadow-sm backdrop-blur transition hover:bg-white"
      >
        <Heart size={18} className={favorite ? "fill-brand-wine text-brand-wine" : ""} />
      </button>

      <div className="mt-4 flex flex-1 flex-col">
        <p className="text-[0.68rem] font-bold uppercase tracking-[0.2em] text-brand-golddeep">{product.brand}</p>
        <h3 className="mt-1.5 font-display text-xl font-medium leading-snug">
          <Link to={`/shop/${product.id}`} className="transition hover:text-brand-golddeep">{product.name}</Link>
        </h3>
        <p className="mt-1 text-sm text-brand-muted">{[family, product.volume].filter(Boolean).join(" · ")}</p>
        <div className="mt-auto flex items-end justify-between gap-3 pt-4">
          <PriceTag price={product.price} oldPrice={product.oldPrice} />
          <button
            type="button"
            onClick={add}
            disabled={soldOut}
            aria-label={`${t("common.addToCart")} — ${product.name}`}
            className="inline-flex h-11 shrink-0 items-center justify-center gap-1.5 rounded-full bg-brand-pine px-4 text-sm font-bold text-brand-porcelain transition hover:bg-brand-moss active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Plus size={17} />
            <span className="hidden sm:inline">{t("common.addToCart")}</span>
          </button>
        </div>
      </div>
    </article>
  );
};
