import { Minus, Plus } from "lucide-react";

export const QuantitySelector = ({ value, onChange, max, decreaseLabel = "Diminuer la quantité", increaseLabel = "Augmenter la quantité" }) => (
  <div className="inline-flex items-center rounded-full border border-brand-ink/15 bg-white">
    <button type="button" aria-label={decreaseLabel} disabled={value <= 1} className="grid h-10 w-10 place-items-center rounded-full transition hover:bg-brand-ink/5 disabled:opacity-40" onClick={() => onChange(Math.max(1, value - 1))}><Minus size={15} /></button>
    <span className="w-8 text-center text-sm font-bold tabular-nums" aria-live="polite">{value}</span>
    <button type="button" aria-label={increaseLabel} disabled={max > 0 && value >= max} className="grid h-10 w-10 place-items-center rounded-full transition hover:bg-brand-ink/5 disabled:opacity-40" onClick={() => onChange(value + 1)}><Plus size={15} /></button>
  </div>
);
