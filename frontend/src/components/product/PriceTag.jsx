import { discountPercent, formatPrice } from "../../utils/format";

export const PriceTag = ({ price, oldPrice, size = "md" }) => {
  const percent = discountPercent(price, oldPrice);
  const sizes = { md: "text-xl", lg: "text-3xl sm:text-4xl" };
  return (
    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
      <strong className={`font-display font-semibold tabular-nums text-brand-ink ${sizes[size] || sizes.md}`}>{formatPrice(price)}</strong>
      {percent > 0 && <span className="text-sm tabular-nums text-brand-muted line-through">{formatPrice(oldPrice)}</span>}
      {percent > 0 && <span className="rounded-full bg-brand-wine px-2 py-0.5 text-[0.7rem] font-bold text-white">−{percent}%</span>}
    </div>
  );
};
