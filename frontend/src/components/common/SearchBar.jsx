import { Search } from "lucide-react";

export const SearchBar = ({ value, onChange, placeholder = "Rechercher..." }) => (
  <label className="relative block">
    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8A8A8A]" size={18} />
    <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full rounded-2xl border border-black/10 bg-white/85 py-3 pl-12 pr-4 text-sm outline-none focus:border-[#C8A96A] focus:ring-4 focus:ring-[#C8A96A]/15" />
  </label>
);
