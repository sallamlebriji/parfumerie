import { Save } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import api, { uploadsUrl } from "../api/axios";
import AdminLayout from "../components/AdminLayout";

const SaleForm = () => {
  const navigate = useNavigate();
  const [perfumes, setPerfumes] = useState([]);
  const [form, setForm] = useState({
    perfumeId: "",
    quantity: 1,
    salePrice: "",
    paymentMethod: "cash",
    customerName: "",
    notes: ""
  });
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/perfumes").then(({ data }) => setPerfumes(data));
  }, []);

  const selected = useMemo(() => perfumes.find((p) => p._id === form.perfumeId), [perfumes, form.perfumeId]);
  const selectedImage = selected?.image
    ? selected.image.startsWith("http")
      ? selected.image
      : `${uploadsUrl}${selected.image.replace("/uploads", "")}`
    : "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=500&q=80";
  const quantity = Number(form.quantity || 0);
  const salePrice = Number(form.salePrice || selected?.price || 0);
  const purchasePrice = Number(selected?.purchasePrice || 0);
  const total = salePrice * quantity;
  const profit = (salePrice - purchasePrice) * quantity;
  const currentStock = Number(selected?.stock || 0);
  const newStock = Math.max(0, currentStock - quantity);

  const update = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
    if (key === "perfumeId") {
      const perfume = perfumes.find((p) => p._id === value);
      if (perfume) setForm((current) => ({ ...current, perfumeId: value, salePrice: perfume.price }));
    }
  };

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      await api.post("/sales", form);
      toast.success("Vente enregistree et stock mis a jour");
      navigate("/admin/ventes");
    } catch (err) {
      setError(err.response?.data?.message || "Impossible d'enregistrer la vente.");
    }
  };

  return (
    <AdminLayout>
      <div className="luxury-gradient rounded-[32px] border border-gold/25 p-8 text-white shadow-luxury">
        <p className="text-xs font-extrabold uppercase tracking-[0.3em] text-lightgold">Caisse locale</p>
        <h1 className="mt-2 text-5xl font-black">Nouvelle vente</h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-white/60">Mentionnez quel parfum est vendu, la quantite et le prix reel. Le stock sera diminue automatiquement.</p>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <form onSubmit={submit} className="panel grid gap-5 p-6 md:grid-cols-2">
          {error && <p className="rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-700 md:col-span-2">{error}</p>}
          <label className="md:col-span-2">
            <span className="label">Parfum vendu</span>
            <select className="field" required value={form.perfumeId} onChange={(e) => update("perfumeId", e.target.value)}>
              <option value="">Choisir un parfum</option>
              {perfumes.map((p) => (
                <option key={p._id} value={p._id} disabled={Number(p.stock || 0) <= 0}>
                  {p.name} - {p.brand} - Stock: {p.stock} {Number(p.stock || 0) <= 0 ? "(rupture)" : ""}
                </option>
              ))}
            </select>
            <div className="mt-3 flex flex-wrap gap-2">
              {perfumes.filter((p) => Number(p.stock || 0) <= 0).slice(0, 6).map((p) => (
                <span key={p._id} className="rounded-full bg-ink/10 px-3 py-1 text-xs font-bold text-elegantgray line-through">
                  {p.name} rupture
                </span>
              ))}
            </div>
          </label>
          <Input label="Quantite vendue" type="number" value={form.quantity} onChange={(v) => update("quantity", v)} />
          <Input label="Prix de vente reel" type="number" value={form.salePrice} onChange={(v) => update("salePrice", v)} />
          <label>
            <span className="label">Mode paiement</span>
            <select className="field" value={form.paymentMethod} onChange={(e) => update("paymentMethod", e.target.value)}>
              <option value="cash">Espece</option>
              <option value="card">Carte</option>
              <option value="transfer">Virement</option>
              <option value="other">Autre</option>
            </select>
          </label>
          <Input label="Client (optionnel)" value={form.customerName} onChange={(v) => update("customerName", v)} required={false} />
          <label className="md:col-span-2"><span className="label">Notes</span><textarea className="field min-h-28" value={form.notes} onChange={(e) => update("notes", e.target.value)} /></label>
          {selected && Number(selected.stock || 0) <= 0 && <p className="rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-700 md:col-span-2">Ce parfum est en rupture de stock, il ne peut pas etre vendu.</p>}
          <button className="btn-gold md:col-span-2" disabled={!selected || Number(selected.stock || 0) <= 0 || quantity > Number(selected.stock || 0)}>
            <Save size={18} /> Enregistrer la vente
          </button>
        </form>

        <aside className="sticky top-8 h-fit rounded-[28px] border border-gold/35 bg-ink p-7 text-white shadow-luxury">
          <p className="text-xs font-extrabold uppercase tracking-[0.28em] text-lightgold">Resume caisse</p>
          <img src={selectedImage} alt={selected?.name || "Parfum"} className="mt-5 h-48 w-full rounded-[24px] border border-gold/20 object-cover" />
          <h2 className="mt-3 text-2xl font-black">{selected?.name || "Aucun parfum choisi"}</h2>
          <div className="mt-6 grid gap-3 text-sm text-white/70">
            <p>Stock actuel: <strong className="text-white">{selected?.stock ?? "-"}</strong></p>
            <p>Quantite vendue: <strong className="text-white">{quantity || 0}</strong></p>
            <p>Nouveau stock apres vente: <strong className={quantity > currentStock ? "text-red-300" : "text-lightgold"}>{selected ? newStock : "-"}</strong></p>
            <p>Prix achat unitaire: <strong className="text-white">{purchasePrice} DH</strong></p>
            <p>Prix vente unitaire: <strong className="text-white">{salePrice} DH</strong></p>
            <p>Total vente: <strong className="text-lightgold">{total} DH</strong></p>
            <p>Benefice estime: <strong className={profit >= 0 ? "text-lightgold" : "text-red-300"}>{profit} DH</strong></p>
          </div>
        </aside>
      </div>
    </AdminLayout>
  );
};

const Input = ({ label, value, onChange, type = "text", required = true }) => (
  <label>
    <span className="label">{label}</span>
    <input className="field" type={type} required={required} value={value} onChange={(e) => onChange(e.target.value)} />
  </label>
);

export default SaleForm;
