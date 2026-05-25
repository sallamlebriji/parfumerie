import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/axios";
import EditorialPageHero from "../components/EditorialPageHero";
import EmptyState from "../components/EmptyState";
import FilterBar from "../components/FilterBar";
import PerfumeCard from "../components/PerfumeCard";
import SectionTitle from "../components/SectionTitle";
import SkeletonProductCard from "../components/SkeletonProductCard";

const Catalog = () => {
  const [params] = useSearchParams();
  const [perfumes, setPerfumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(8);
  const [filters, setFilters] = useState({ search: "", category: params.get("category") || "", brand: "", gender: params.get("gender") || "", minPrice: "", maxPrice: "", sort: "" });

  useEffect(() => {
    api.get("/perfumes").then(({ data }) => setPerfumes(data)).finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => perfumes.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(filters.search.toLowerCase());
    const matchesCategory = !filters.category || p.category === filters.category;
    const matchesBrand = !filters.brand || p.brand.toLowerCase().includes(filters.brand.toLowerCase());
    const matchesGender = !filters.gender || p.gender === filters.gender;
    const matchesMinPrice = !filters.minPrice || p.price >= Number(filters.minPrice);
    const matchesPrice = !filters.maxPrice || p.price <= Number(filters.maxPrice);
    return matchesSearch && matchesCategory && matchesBrand && matchesGender && matchesMinPrice && matchesPrice;
  }).sort((a, b) => {
    if (filters.sort === "asc") return a.price - b.price;
    if (filters.sort === "desc") return b.price - a.price;
    return 0;
  }), [perfumes, filters]);

  return (
    <main className="pb-24">
      <EditorialPageHero
        eyebrow="Collection de parfums"
        title="Explorez nos fragrances raffinees"
        text="Une selection claire et elegante pour chaque style, chaque moment et chaque personnalite."
        image="https://images.unsplash.com/photo-1590736704728-f4730bb30770?auto=format&fit=crop&w=1800&q=90"
        meta="Filtrez par famille olfactive, genre, marque et budget pour construire votre signature avec precision."
      />
      <div className="container-page -mt-10">
        <FilterBar filters={filters} setFilters={setFilters} />
      </div>
      <div className="container-page mt-10">
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => <SkeletonProductCard key={index} />)}
          </div>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.slice(0, visible).map((perfume) => <PerfumeCard key={perfume._id} perfume={perfume} />)}
            </div>
            {visible < filtered.length && <div className="mt-10 text-center"><button className="btn-outline" onClick={() => setVisible((count) => count + 8)}>Charger plus</button></div>}
          </>
        )}
        {!loading && !filtered.length && <div className="mt-10"><EmptyState title="Aucun parfum trouve" text="Ajustez la recherche, le genre, la marque ou la famille olfactive." /></div>}
      </div>
    </main>
  );
};

export default Catalog;
