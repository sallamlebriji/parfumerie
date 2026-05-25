import { Search } from "lucide-react";

const SearchInput = ({ value, onChange, placeholder = "Rechercher..." }) => (
  <label className="relative block">
    <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-elegantgray" size={18} />
    <input className="field pl-12" placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} />
  </label>
);

export default SearchInput;
