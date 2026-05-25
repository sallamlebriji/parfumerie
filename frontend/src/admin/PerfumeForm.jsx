import { Save } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import AdminLayout from "../components/AdminLayout";
import ImageUpload from "../components/ImageUpload";

const initialForm = {
  name: "", brand: "", description: "", purchasePrice: "", quantityPurchased: "", price: "", oldPrice: "", volume: "100ml",
  category: "", gender: "Mixte", stock: 0, restockQuantity: "", isAvailable: true, isFeatured: false,
  top: "", middle: "", base: ""
};

const PerfumeForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) {
      api.get(`/perfumes/${id}`).then(({ data }) => {
        setForm({
        name: data.name, brand: data.brand, description: data.description, purchasePrice: data.purchasePrice || "", quantityPurchased: data.quantityPurchased || data.stock || "", price: data.price, oldPrice: data.oldPrice || "",
        volume: data.volume, category: data.category, gender: data.gender, stock: data.stock, restockQuantity: "",
        isAvailable: data.isAvailable, isFeatured: data.isFeatured, top: data.notes?.top || "", middle: data.notes?.middle || "", base: data.notes?.base || ""
        });
        if (data.image) setPreview(`${import.meta.env.VITE_UPLOADS_URL}${data.image.replace("/uploads", "")}`);
      });
    }
  }, [id]);

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const pickImage = (file) => {
    setImage(file);
    if (file) setPreview(URL.createObjectURL(file));
  };
  const restockQuantity = Number(form.restockQuantity || 0);
  const currentStock = Number(form.stock || 0);
  const stockAfterRestock = currentStock + restockQuantity;

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => data.append(key, value));
    if (!id && !form.stock && form.quantityPurchased) data.set("stock", form.quantityPurchased);
    if (image) data.append("image", image);
    try {
      if (id) await api.put(`/perfumes/${id}`, data);
      else await api.post("/perfumes", data);
      navigate("/admin/parfums");
    } catch (err) {
      setError(err.response?.data?.message || "Enregistrement impossible.");
    }
  };

  return (
    <AdminLayout>
      <h1 className="text-3xl font-black">{id ? "Modifier" : "Ajouter"} un parfum</h1>
      <form onSubmit={submit} className="panel mt-8 grid gap-5 p-6 md:grid-cols-2">
        {error && <p className="rounded-md bg-red-50 p-3 text-sm text-red-700 md:col-span-2">{error}</p>}
        <Input label="Nom" value={form.name} onChange={(v) => update("name", v)} />
        <Input label="Marque" value={form.brand} onChange={(v) => update("brand", v)} />
        <Input label="Prix d'achat / Capital unitaire" type="number" value={form.purchasePrice} onChange={(v) => update("purchasePrice", v)} required={false} />
        <Input label="Prix de vente" type="number" value={form.price} onChange={(v) => update("price", v)} />
        <Input label="Ancien prix" type="number" value={form.oldPrice} onChange={(v) => update("oldPrice", v)} required={false} />
        <Input label="Volume" value={form.volume} onChange={(v) => update("volume", v)} />
        <Input label="Categorie" value={form.category} onChange={(v) => update("category", v)} />
        <label><span className="label">Genre</span><select className="field" value={form.gender} onChange={(e) => update("gender", e.target.value)}><option>Homme</option><option>Femme</option><option>Mixte</option></select></label>
        <Input label={id ? "Stock actuel" : "Stock initial"} type="number" value={form.stock} onChange={(v) => update("stock", v)} />
        {id && <Input label="Nouvel achat / arrivage a ajouter" type="number" value={form.restockQuantity} onChange={(v) => update("restockQuantity", v)} required={false} />}
        <div className="rounded-[24px] border border-gold/20 bg-beige/60 p-5 md:col-span-2">
          <p className="text-xs font-extrabold uppercase tracking-[0.25em] text-gold">Calcul stock</p>
          <div className="mt-4 grid gap-3 text-sm md:grid-cols-3">
            <p>Total acheté: <strong>{Number(form.quantityPurchased || form.stock || 0) + restockQuantity}</strong></p>
            <p>Stock actuel: <strong>{currentStock}</strong></p>
            <p>Arrivage ajoute: <strong>{restockQuantity}</strong></p>
            <p>Nouveau stock: <strong className="text-gold">{stockAfterRestock}</strong></p>
          </div>
        </div>
        <Input label="Note de tete" value={form.top} onChange={(v) => update("top", v)} required={false} />
        <Input label="Note de coeur" value={form.middle} onChange={(v) => update("middle", v)} required={false} />
        <Input label="Note de fond" value={form.base} onChange={(v) => update("base", v)} required={false} />
        <ImageUpload preview={preview} onChange={pickImage} />
        <label className="md:col-span-2"><span className="label">Description</span><textarea className="field min-h-32" required value={form.description} onChange={(e) => update("description", e.target.value)} /></label>
        <div className="flex gap-6 md:col-span-2">
          <label className="flex items-center gap-2"><input type="checkbox" checked={form.isAvailable} onChange={(e) => update("isAvailable", e.target.checked)} /> Disponible</label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={form.isFeatured} onChange={(e) => update("isFeatured", e.target.checked)} /> Populaire</label>
        </div>
        <button className="btn-gold md:col-span-2"><Save size={18} /> Enregistrer</button>
      </form>
    </AdminLayout>
  );
};

const Input = ({ label, value, onChange, type = "text", required = true }) => (
  <label>
    <span className="label">{label}</span>
    <input className="field" type={type} required={required} value={value} onChange={(e) => onChange(e.target.value)} />
  </label>
);

export default PerfumeForm;
