import { formatPrice } from "../../utils/format";

export const PriceTag = ({ price, oldPrice }) => (
  <div className="flex items-end gap-3">
    <strong className="text-2xl text-[#C8A96A]">{formatPrice(price)}</strong>
    {oldPrice > 0 && <span className="text-sm font-semibold text-[#8A8A8A] line-through">{formatPrice(oldPrice)}</span>}
  </div>
);
