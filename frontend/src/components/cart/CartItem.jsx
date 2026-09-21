import { Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useAppStore } from "../../store/appStore";
import { formatPrice, optimizeImage } from "../../utils/format";
import { SafeImage, imageFallbacks } from "../common/SafeImage";
import { QuantitySelector } from "./QuantitySelector";

export const CartItem = ({ item }) => {
  const { t } = useTranslation();
  const updateQuantity = useAppStore((state) => state.updateQuantity);
  const removeFromCart = useAppStore((state) => state.removeFromCart);
  return (
    <li className="flex gap-4 py-6 first:pt-0 sm:gap-6">
      <Link to={`/shop/${item.id}`} className="h-28 w-24 shrink-0 overflow-hidden rounded-2xl bg-brand-sand sm:h-32 sm:w-28" aria-label={item.name}>
        <SafeImage src={optimizeImage(item.image, 320)} fallbackSrc={imageFallbacks.perfume} alt="" className="h-full w-full object-cover" />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col">
        <p className="text-[0.68rem] font-bold uppercase tracking-[0.2em] text-brand-golddeep">{item.brand}</p>
        <h3 className="mt-1 font-display text-xl font-medium leading-snug"><Link to={`/shop/${item.id}`} className="transition hover:text-brand-golddeep">{item.name}</Link></h3>
        <p className="mt-1 text-sm text-brand-muted">{item.volume} · {formatPrice(item.price)}</p>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-4">
          <QuantitySelector value={item.quantity} max={item.stock} onChange={(value) => updateQuantity(item.id, value)} decreaseLabel={t("common.decrease")} increaseLabel={t("common.increase")} />
          <div className="flex items-center gap-4">
            <strong className="font-display text-xl font-semibold tabular-nums">{formatPrice(item.price * item.quantity)}</strong>
            <button type="button" onClick={() => removeFromCart(item.id)} aria-label={`${t("common.remove")} — ${item.name}`} className="grid h-10 w-10 place-items-center rounded-full text-brand-muted transition hover:bg-brand-wine/10 hover:text-brand-wine"><Trash2 size={18} /></button>
          </div>
        </div>
      </div>
    </li>
  );
};
