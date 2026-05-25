import { Minus, Plus } from "lucide-react";

export const QuantitySelector = ({ value, onChange }) => (
  <div className="inline-flex items-center rounded-full border border-black/10 bg-white">
    <button className="p-3" onClick={() => onChange(Math.max(1, value - 1))}><Minus size={15} /></button>
    <span className="w-10 text-center text-sm font-black">{value}</span>
    <button className="p-3" onClick={() => onChange(value + 1)}><Plus size={15} /></button>
  </div>
);
