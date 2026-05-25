import { SlidersHorizontal } from "lucide-react";
import CategoryChip from "./CategoryChip";
import SearchInput from "./SearchInput";

const chips = ["Homme", "Femme", "Mixte", "Oriental", "Floral", "Boise", "Frais", "Luxe"];

const FilterBar = ({ filters, setFilters }) => {
  const update = (key, value) => setFilters((current) => ({ ...current, [key]: current[key] === value ? "" : value }));

  return (
    <div className="glass-panel p-5">
      <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
        <SearchInput placeholder="Rechercher un parfum, une marque..." value={filters.search} onChange={(value) => setFilters((current) => ({ ...current, search: value }))} />
        <select className="field lg:w-56" value={filters.sort} onChange={(e) => setFilters((current) => ({ ...current, sort: e.target.value }))}>
          <option value="">Trier</option>
          <option value="asc">Prix croissant</option>
          <option value="desc">Prix decroissant</option>
        </select>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <input className="field" placeholder="Marque" value={filters.brand} onChange={(e) => setFilters((current) => ({ ...current, brand: e.target.value }))} />
        <input className="field" type="number" placeholder="Prix min" value={filters.minPrice || ""} onChange={(e) => setFilters((current) => ({ ...current, minPrice: e.target.value }))} />
        <input className="field" type="number" placeholder="Prix max" value={filters.maxPrice || ""} onChange={(e) => setFilters((current) => ({ ...current, maxPrice: e.target.value }))} />
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="mr-2 inline-flex items-center gap-2 text-sm font-bold text-elegantgray"><SlidersHorizontal size={16} /> Filtres</span>
        {chips.map((chip) => {
          const isGender = ["Homme", "Femme", "Mixte"].includes(chip);
          const key = isGender ? "gender" : "category";
          return <CategoryChip key={chip} active={filters[key] === chip} onClick={() => update(key, chip)}>{chip}</CategoryChip>;
        })}
      </div>
    </div>
  );
};

export default FilterBar;
