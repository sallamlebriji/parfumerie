import { families, genders, concentrations, volumes } from "../../constants/options";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";

export const FilterPanel = ({ filters, setFilters, brands = [], categories = [] }) => {
  const update = (key, value) => setFilters((current) => ({ ...current, [key]: value }));
  return (
    <div className="rounded-[28px] border border-[#C8A96A]/20 bg-white/75 p-5 shadow-[0_25px_70px_rgba(0,0,0,0.08)] backdrop-blur">
      <div className="grid gap-4 md:grid-cols-4">
        <Select label="Categorie" value={filters.category} onChange={(e) => update("category", e.target.value)} options={["", ...categories.map((item) => item.name)]} />
        <Select label="Marque" value={filters.brand} onChange={(e) => update("brand", e.target.value)} options={["", ...brands.map((item) => item.name)]} />
        <Select label="Genre" value={filters.gender} onChange={(e) => update("gender", e.target.value)} options={["", ...genders]} />
        <Select label="Tri" value={filters.sort} onChange={(e) => update("sort", e.target.value)} options={[{ value: "", label: "Recommande" }, { value: "price-asc", label: "Prix croissant" }, { value: "price-desc", label: "Prix decroissant" }, { value: "new", label: "Nouveautes" }, { value: "popular", label: "Populaires" }, { value: "rating", label: "Meilleures notes" }]} />
        <Input label="Prix min" type="number" value={filters.minPrice} onChange={(e) => update("minPrice", e.target.value)} />
        <Input label="Prix max" type="number" value={filters.maxPrice} onChange={(e) => update("maxPrice", e.target.value)} />
        <Select label="Famille" value={filters.family} onChange={(e) => update("family", e.target.value)} options={["", ...families]} />
        <Select label="Concentration" value={filters.concentration} onChange={(e) => update("concentration", e.target.value)} options={["", ...concentrations]} />
        <Select label="Volume" value={filters.volume} onChange={(e) => update("volume", e.target.value)} options={["", ...volumes]} />
        <Select label="Disponibilite" value={filters.availability} onChange={(e) => update("availability", e.target.value)} options={[{ value: "", label: "Tous" }, { value: "available", label: "Disponible" }, { value: "out", label: "Rupture" }]} />
        <Select label="Promotions" value={filters.promo} onChange={(e) => update("promo", e.target.value)} options={[{ value: "", label: "Tous" }, { value: "promo", label: "Promotions" }]} />
        <div className="flex items-end"><Button variant="outline" className="w-full" onClick={() => setFilters({ search: "", category: "", brand: "", gender: "", minPrice: "", maxPrice: "", family: "", concentration: "", volume: "", availability: "", promo: "", sort: "" })}>Reinitialiser</Button></div>
      </div>
    </div>
  );
};
