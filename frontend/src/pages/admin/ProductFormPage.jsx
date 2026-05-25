import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowLeft, Save, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import ImageUpload from "../../components/ImageUpload";
import { Button } from "../../components/ui/Button";
import { adminService } from "../../services/adminService";
import { useAuth } from "../../context/AuthContext";
import { normalizeRole, ROLES } from "../../constants/permissions";
import { formatPrice } from "../../utils/format";

const schema = z.object({
  name: z.string().min(2, "Nom requis"),
  brand: z.string().min(2, "Marque requise"),
  description: z.string().min(8, "Description requise"),
  purchasePrice: z.coerce.number().min(0).optional(),
  quantityPurchased: z.coerce.number().min(0).optional(),
  price: z.coerce.number().positive("Prix de vente requis"),
  oldPrice: z.coerce.number().min(0).optional(),
  volume: z.string().min(2),
  category: z.string().min(2, "Categorie requise"),
  gender: z.string(),
  stock: z.coerce.number().min(0),
  restockQuantity: z.coerce.number().min(0).optional(),
  top: z.string().optional(),
  middle: z.string().optional(),
  base: z.string().optional(),
  isAvailable: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  parfumerie: z.string().optional()
});

const defaults = {
  name: "",
  brand: "",
  description: "",
  purchasePrice: 0,
  quantityPurchased: 0,
  price: 0,
  oldPrice: 0,
  volume: "100ml",
  category: "",
  gender: "Mixte",
  stock: 0,
  restockQuantity: 0,
  top: "",
  middle: "",
  base: "",
  isAvailable: true,
  isFeatured: false,
  parfumerie: ""
};

export const ProductFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const { user } = useAuth();
  const role = normalizeRole(user?.role);
  const isEdit = Boolean(id);
  const { data: product } = useQuery({ queryKey: ["product", id], queryFn: () => adminService.product(id), enabled: isEdit });
  const { data: parfumeries = [] } = useQuery({ queryKey: ["parfumeries"], queryFn: adminService.parfumeries, enabled: role === ROLES.SUPER_ADMIN });

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: defaults
  });

  useEffect(() => {
    if (!product) return;
    form.reset({
      ...defaults,
      name: product.name || "",
      brand: product.brand || "",
      description: product.description || "",
      purchasePrice: product.purchasePrice || 0,
      quantityPurchased: product.quantityPurchased || product.stock || 0,
      price: product.price || 0,
      oldPrice: product.oldPrice || 0,
      volume: product.volume || "100ml",
      category: product.category || "",
      gender: product.gender || "Mixte",
      stock: product.stock || 0,
      top: product.notes?.top || "",
      middle: product.notes?.middle || "",
      base: product.notes?.base || "",
      isAvailable: product.isAvailable !== false,
      isFeatured: Boolean(product.isFeatured),
      parfumerie: product.parfumerie || ""
    });
    if (product.image) {
      const cleaned = product.image.replace("/uploads", "");
      setPreview(`${import.meta.env.VITE_UPLOADS_URL}${cleaned}`);
    }
  }, [form, product]);

  const mutation = useMutation({
    mutationFn: (values) => {
      const payload = new FormData();
      Object.entries(values).forEach(([key, value]) => payload.append(key, value ?? ""));
      if (!isEdit && !values.stock && values.quantityPurchased) payload.set("stock", values.quantityPurchased);
      if (image) payload.append("image", image);
      return isEdit ? adminService.updateProduct({ id, payload }) : adminService.createProduct(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success(isEdit ? "Parfum mis a jour" : "Parfum cree");
      navigate("/admin/products");
    },
    onError: (error) => toast.error(error.response?.data?.message || "Enregistrement impossible")
  });

  const watched = form.watch();
  const stockAfter = useMemo(() => Number(watched.stock || 0) + Number(watched.restockQuantity || 0), [watched.stock, watched.restockQuantity]);
  const stockValue = useMemo(() => Number(watched.purchasePrice || 0) * stockAfter, [stockAfter, watched.purchasePrice]);

  const pickImage = (file) => {
    setImage(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  const submit = (values) => mutation.mutate(values);

  return (
    <main className="space-y-8">
      <section className="parfum-night rounded-[30px] border border-[#D8B87E]/25 p-6 text-[#FFF9EF] shadow-[0_28px_90px_rgba(33,24,23,0.24)] sm:p-8">
        <Link to="/admin/products" className="inline-flex items-center gap-2 text-sm font-bold text-[#F8EAD7]/62 transition hover:text-[#FFF9EF]"><ArrowLeft size={17} /> Retour aux parfums</Link>
        <div className="mt-6 flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.35em] text-[#D8B87E]">{isEdit ? "Edition parfum" : "Nouveau parfum"}</p>
            <h1 className="mt-3 font-title text-4xl font-black sm:text-5xl">{isEdit ? "Modifier la fiche" : "Ajouter un parfum"}</h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#F8EAD7]/62">Image, prix, stock, notes olfactives et statut catalogue dans un formulaire admin raffine.</p>
          </div>
          <div className="rounded-[22px] border border-[#D8B87E]/18 bg-[#FFF5E7]/[0.06] p-5">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#D8B87E]">Capital stock</p>
            <p className="mt-2 text-2xl font-black">{formatPrice(stockValue)}</p>
          </div>
        </div>
      </section>

      <form onSubmit={form.handleSubmit(submit)} className="grid gap-6 lg:grid-cols-[1fr_0.72fr]">
        <motion.section initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="parfum-panel-solid grid gap-5 p-6 md:grid-cols-2">
          <Field form={form} name="name" label="Nom" />
          <Field form={form} name="brand" label="Marque" />
          <Field form={form} name="purchasePrice" label="Prix d'achat" type="number" />
          <Field form={form} name="price" label="Prix de vente" type="number" />
          <Field form={form} name="oldPrice" label="Ancien prix" type="number" />
          <Field form={form} name="volume" label="Volume" />
          <Field form={form} name="category" label="Categorie" />
          {role === ROLES.SUPER_ADMIN && (
            <label>
              <span className="parfum-label">Parfumerie</span>
              <select className="parfum-field" {...form.register("parfumerie")}>
                <option value="">Parfumerie principale</option>
                {parfumeries.map((item) => <option key={item.id || item._id} value={item.id || item._id}>{item.name}</option>)}
              </select>
            </label>
          )}
          <label>
            <span className="parfum-label">Genre</span>
            <select className="parfum-field" {...form.register("gender")}><option>Homme</option><option>Femme</option><option>Mixte</option></select>
          </label>
          <Field form={form} name="stock" label={isEdit ? "Stock actuel" : "Stock initial"} type="number" />
          {isEdit && <Field form={form} name="restockQuantity" label="Arrivage a ajouter" type="number" />}
          <Field form={form} name="top" label="Note de tete" />
          <Field form={form} name="middle" label="Note de coeur" />
          <Field form={form} name="base" label="Note de fond" />
          <label className="md:col-span-2">
            <span className="parfum-label">Description</span>
            <textarea className="parfum-field min-h-36" {...form.register("description")} />
            <Error message={form.formState.errors.description?.message} />
          </label>
        </motion.section>

        <motion.aside initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="space-y-6">
          <section className="parfum-panel-solid p-6">
            <ImageUpload preview={preview} onChange={pickImage} />
          </section>
          <section className="parfum-panel-solid p-6">
            <p className="parfum-eyebrow flex items-center gap-2"><Sparkles size={16} /> Publication</p>
            <div className="mt-5 grid gap-3">
              <Toggle form={form} name="isAvailable" label="Disponible en boutique" />
              <Toggle form={form} name="isFeatured" label="Mettre en avant" />
            </div>
            <div className="mt-6 rounded-[20px] bg-[#FFF5E7] p-4 text-sm font-semibold text-[#6F5A4A]">
              Nouveau stock apres arrivage: <strong className="text-[#0B0B0F]">{stockAfter}</strong>
            </div>
            <Button className="mt-6 w-full" disabled={mutation.isPending}><Save size={18} /> {mutation.isPending ? "Sauvegarde..." : "Enregistrer"}</Button>
          </section>
        </motion.aside>
      </form>
    </main>
  );
};

const Field = ({ form, name, label, type = "text" }) => (
  <label>
    <span className="parfum-label">{label}</span>
    <input className="parfum-field" type={type} {...form.register(name)} />
    <Error message={form.formState.errors[name]?.message} />
  </label>
);

const Toggle = ({ form, name, label }) => (
  <label className="flex items-center justify-between gap-4 rounded-[20px] border border-[#D8B87E]/28 bg-[#FFF8EE] p-4 text-sm font-bold text-[#211817]">
    {label}
    <input type="checkbox" className="h-5 w-5 accent-[#B98D4B]" {...form.register(name)} />
  </label>
);

const Error = ({ message }) => message ? <span className="mt-1 block text-xs font-bold text-red-600">{message}</span> : null;
