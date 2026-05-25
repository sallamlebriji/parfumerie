const SearchFilter = ({ filters, setFilters, perfumes }) => {
  const categories = [...new Set(perfumes.map((p) => p.category).filter(Boolean))];
  const brands = [...new Set(perfumes.map((p) => p.brand).filter(Boolean))];

  const update = (key, value) => setFilters((current) => ({ ...current, [key]: value }));

  return (
    <div className="panel grid gap-4 p-5 md:grid-cols-6">
      <input className="field md:col-span-2" placeholder="Recherche par nom" value={filters.search} onChange={(e) => update("search", e.target.value)} />
      <select className="field" value={filters.category} onChange={(e) => update("category", e.target.value)}>
        <option value="">Categorie</option>
        {categories.map((item) => <option key={item}>{item}</option>)}
      </select>
      <select className="field" value={filters.brand} onChange={(e) => update("brand", e.target.value)}>
        <option value="">Marque</option>
        {brands.map((item) => <option key={item}>{item}</option>)}
      </select>
      <select className="field" value={filters.gender} onChange={(e) => update("gender", e.target.value)}>
        <option value="">Genre</option>
        <option>Homme</option>
        <option>Femme</option>
        <option>Mixte</option>
      </select>
      <input className="field" type="number" placeholder="Prix max" value={filters.maxPrice} onChange={(e) => update("maxPrice", e.target.value)} />
    </div>
  );
};

export default SearchFilter;
