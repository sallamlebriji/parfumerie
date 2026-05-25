import { Download, Edit3, Eye, FileText, LogIn, MessageCircle, Plus, Power, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { adminService } from "../../services/adminService";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { DataTable } from "../../components/tables/DataTable";
import { formatPrice } from "../../utils/format";
import { exportElementToPdf } from "../../utils/pdf";
import { useAuth } from "../../context/AuthContext";
import { normalizeRole, ROLES } from "../../constants/permissions";

const config = {
  products: { title: "Gestion parfums", query: adminService.products, description: "Ajouter, modifier, filtrer, importer et exporter les parfums.", columns: ["name", "brand", "category", "gender", "price", "stock", "badge"] },
  categories: { title: "Categories", query: adminService.categories, description: "Homme, Femme, Mixte, Luxe, Oud, Musc et collections commerciales.", columns: ["name", "id"] },
  brands: { title: "Marques", query: adminService.brands, description: "Logos, descriptions, statut actif et nombre de produits.", columns: ["name", "products", "active"] },
  orders: { title: "Commandes", query: adminService.orders, description: "Statuts, facture PDF, filtres, recherche telephone et numero.", columns: ["id", "customer", "phone", "total", "payment", "delivery", "status", "date"] },
  customers: { title: "CRM clients", query: adminService.customers, description: "Historique commandes, total depense, statut VIP et tags.", columns: ["name", "phone", "email", "city", "orders", "spent", "status"] },
  stocks: { title: "Gestion stock", query: adminService.stocks, description: "Quantites, seuils d'alerte, entrees/sorties et mouvements.", columns: ["sku", "product", "available", "threshold", "status", "in", "out"] },
  promotions: { title: "Promotions", query: adminService.promotions, description: "Coupons, dates, limites, montant minimum et activation.", columns: ["code", "type", "value", "start", "end", "uses", "min", "active"] },
  payments: { title: "Paiements & factures", query: adminService.orders, description: "Paiement livraison, carte, virement, facture PDF et impression.", columns: ["id", "customer", "total", "payment", "status", "date"] },
  reports: { title: "Rapports", query: adminService.orders, description: "Ventes, marques, categories, clients fideles, annulations et revenus.", columns: ["id", "customer", "total", "status", "date"] },
  users: { title: "Utilisateurs & admins", query: adminService.users, description: "Comptes, roles, tenants, activation et limites d'abonnement.", columns: [] },
  parfumeries: { title: "Toutes les parfumeries", query: adminService.parfumeries, description: "Creation, activation et pilotage multi-boutiques reserves au superadmin.", columns: [] },
  settings: { title: "Parametres systeme", query: adminService.settings, description: "Boutique, WhatsApp, taxes, livraison et seuils de stock reserves au superadmin.", columns: [] }
};

export const AdminModulePage = ({ type }) => {
  const page = config[type] || config.products;
  const { user } = useAuth();
  const role = normalizeRole(user?.role);
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const { data = type === "settings" ? null : [] } = useQuery({ queryKey: [type], queryFn: page.query, retry: false });
  const tableData = Array.isArray(data) ? data : [];

  const deleteMutation = useMutation({
    mutationFn: adminService.deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Parfum supprime");
    },
    onError: (error) => toast.error(error.response?.data?.message || "Suppression impossible")
  });

  const categories = useMemo(() => [...new Set(tableData.map((item) => item.category).filter(Boolean))], [tableData]);
  const filteredData = useMemo(() => tableData.filter((item) => {
    if (categoryFilter !== "all" && item.category !== categoryFilter) return false;
    if (statusFilter === "low") return Number(item.stock ?? item.available ?? 0) <= Number(item.threshold ?? 5);
    if (statusFilter === "available") return item.isAvailable !== false && item.active !== false && item.status !== "rupture";
    if (statusFilter !== "all" && item.status) return item.status === statusFilter;
    return true;
  }), [categoryFilter, statusFilter, tableData]);

  const baseColumns = useMemo(() => page.columns.map((key) => ({
    accessorKey: key,
    header: key.toUpperCase(),
    cell: ({ getValue }) => {
      const value = getValue();
      if (key === "price" || key === "total" || key === "spent" || key === "min") return formatPrice(value);
      if (key === "status" || key === "badge" || key === "active") return <Badge tone={badgeTone(value)}>{String(value)}</Badge>;
      if (key === "stock" || key === "available") return <span className={`font-black ${Number(value) <= 5 ? "text-red-600" : "text-[#0B0B0F]"}`}>{String(value ?? "-")}</span>;
      return <span className="font-semibold">{String(value ?? "-")}</span>;
    }
  })), [page.columns]);

  const columns = useMemo(() => {
    if (type === "products") {
      return [
        ...baseColumns,
        {
          id: "actions",
          header: "ACTIONS",
          cell: ({ row }) => (
            <div className="flex items-center gap-2">
              <Link to={`/admin/products/${row.original.id || row.original._id}`} className="rounded-xl border border-black/10 bg-white p-2 text-[#0B0B0F] transition hover:border-[#C8A96A] hover:text-[#C8A96A]"><Edit3 size={16} /></Link>
              <button onClick={() => deleteMutation.mutate(row.original.id || row.original._id)} className="rounded-xl border border-red-100 bg-red-50 p-2 text-red-600 transition hover:bg-red-100"><Trash2 size={16} /></button>
            </div>
          )
        }
      ];
    }
    if (type === "orders" || type === "customers") {
      return [
        ...baseColumns,
        {
          id: "actions",
          header: "CONTACT",
          cell: ({ row }) => {
            const phone = row.original.phone;
            const href = phone ? `https://wa.me/${String(phone).replace(/\D/g, "")}` : "#";
            return (
              <div className="flex items-center gap-2">
                <a href={href} target="_blank" rel="noreferrer" className="rounded-xl border border-green-100 bg-green-50 p-2 text-green-700 transition hover:bg-green-100"><MessageCircle size={16} /></a>
                {type === "orders" && <button className="rounded-xl border border-black/10 bg-white p-2"><Eye size={16} /></button>}
              </div>
            );
          }
        }
      ];
    }
    return baseColumns;
  }, [baseColumns, deleteMutation, type]);

  if (type === "settings") {
    return <SettingsPage page={page} settings={data} canEdit={[ROLES.SUPER_ADMIN, ROLES.ADMIN_TENANT].includes(role)} />;
  }

  if (type === "parfumeries") {
    return <ParfumeriesPage page={page} parfumeries={tableData} canEdit={role === ROLES.SUPER_ADMIN} />;
  }

  if (type === "users") {
    return <UsersPage page={page} users={tableData} role={role} />;
  }

  return (
    <main className="space-y-8">
      <section className="parfum-night overflow-hidden rounded-[30px] border border-[#D8B87E]/25 p-6 text-[#FFF9EF] shadow-[0_28px_90px_rgba(33,24,23,0.24)] sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div><p className="text-xs font-extrabold uppercase tracking-[0.35em] text-[#D8B87E]">Module admin</p><h1 className="mt-3 font-title text-4xl font-black sm:text-5xl">{page.title}</h1><p className="mt-4 max-w-2xl text-sm leading-7 text-[#F8EAD7]/62">{page.description}</p></div>
          <div className="flex flex-wrap gap-2">
            {type === "products" && <Button as={Link} to="/admin/products/new"><Plus size={17} /> Ajouter</Button>}
            {type !== "products" && <Button><Plus size={17} /> Nouveau</Button>}
            <Button variant="outline" onClick={() => exportElementToPdf("admin-table", `${type}.pdf`)}><FileText size={17} /> PDF</Button>
            <Button variant="outline"><Download size={17} /> Export</Button>
          </div>
        </div>
      </section>
      <div className="grid gap-4 md:grid-cols-3">
        <Metric label="Elements" value={tableData.length} />
        <Metric label="Affiches" value={filteredData.length} />
        <Metric label="Alertes" value={tableData.filter((item) => Number(item.stock ?? item.available ?? 9) <= Number(item.threshold ?? 5) || item.status === "rupture").length} />
      </div>
      <section id="admin-table">
        <DataTable
          data={filteredData}
          columns={columns}
          filters={
            <>
              {categories.length > 0 && (
                <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)} className="rounded-[20px] border border-[#D8B87E]/30 bg-[#FFFDF8] px-4 py-3 text-sm font-bold text-[#211817] outline-none focus:border-[#B98D4B]">
                  <option value="all">Toutes categories</option>
                  {categories.map((category) => <option key={category} value={category}>{category}</option>)}
                </select>
              )}
              <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="rounded-[20px] border border-[#D8B87E]/30 bg-[#FFFDF8] px-4 py-3 text-sm font-bold text-[#211817] outline-none focus:border-[#B98D4B]">
                <option value="all">Tous statuts</option>
                <option value="available">Disponible</option>
                <option value="low">Stock faible</option>
                <option value="pending">En attente</option>
                <option value="confirmed">Confirmee</option>
                <option value="delivered">Livree</option>
                <option value="cancelled">Annulee</option>
              </select>
            </>
          }
        />
      </section>
    </main>
  );
};

const Metric = ({ label, value }) => (
  <motion.div whileHover={{ y: -3 }} className="parfum-panel-solid p-5">
    <p className="parfum-eyebrow">{label}</p>
    <p className="mt-2 text-3xl font-black text-[#211817]">{value}</p>
  </motion.div>
);

const badgeTone = (value) => {
  if (value === false || value === "rupture" || value === "cancelled") return "red";
  if (value === "confirmed" || value === "ok" || value === "Actif") return "green";
  if (value === "delivered" || value === "VIP" || value === true) return "gold";
  return "soft";
};

const SettingsPage = ({ page, settings, canEdit }) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: adminService.updateSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Parametres sauvegardes");
    },
    onError: (error) => toast.error(error.response?.data?.message || "Sauvegarde impossible")
  });

  const submit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    mutation.mutate({
      shopName: formData.get("shopName"),
      currency: formData.get("currency"),
      lowStockThreshold: Number(formData.get("lowStockThreshold") || 0),
      taxRate: Number(formData.get("taxRate") || 0),
      deliveryFee: Number(formData.get("deliveryFee") || 0),
      whatsappNumber: formData.get("whatsappNumber"),
      orderNotificationNumber: formData.get("orderNotificationNumber"),
      invoicePrefix: formData.get("invoicePrefix"),
      address: formData.get("address"),
      allowOnlineOrders: formData.get("allowOnlineOrders") === "on",
      maintenanceMode: formData.get("maintenanceMode") === "on"
    });
  };

  if (!canEdit) {
    return (
      <main className="space-y-8">
        <Hero page={page} />
        <section className="parfum-panel-solid p-8">
          <h2 className="font-title text-3xl font-black">Acces reserve</h2>
          <p className="mt-3 text-[#8A8A8A]">Les parametres systeme sont modifiables uniquement par le superadmin.</p>
        </section>
      </main>
    );
  }

  if (!settings) return null;

  return (
    <main className="space-y-8">
      <Hero page={page} />
      <form onSubmit={submit} className="parfum-panel-solid grid gap-6 p-6 md:grid-cols-2">
        <Field label="Nom boutique" name="shopName" defaultValue={settings.shopName} />
        <Field label="Devise" name="currency" defaultValue={settings.currency} />
        <Field label="Seuil stock faible" name="lowStockThreshold" type="number" defaultValue={settings.lowStockThreshold} />
        <Field label="TVA / taxe (%)" name="taxRate" type="number" defaultValue={settings.taxRate} />
        <Field label="Frais livraison" name="deliveryFee" type="number" defaultValue={settings.deliveryFee} />
        <Field label="Prefixe facture" name="invoicePrefix" defaultValue={settings.invoicePrefix} />
        <Field label="WhatsApp boutique" name="whatsappNumber" defaultValue={settings.whatsappNumber} />
        <Field label="WhatsApp commandes" name="orderNotificationNumber" defaultValue={settings.orderNotificationNumber} />
        <label className="block md:col-span-2">
          <span className="mb-2 block text-sm font-bold text-[#0B0B0F]">Adresse boutique</span>
          <textarea name="address" defaultValue={settings.address} className="parfum-field min-h-28" />
        </label>
        <label className="flex items-center gap-3 rounded-[20px] border border-[#D8B87E]/28 bg-[#FFF8EE] p-4 text-sm font-bold">
          <input name="allowOnlineOrders" type="checkbox" defaultChecked={settings.allowOnlineOrders} className="h-5 w-5 accent-[#C8A96A]" />
          Commandes en ligne actives
        </label>
        <label className="flex items-center gap-3 rounded-[20px] border border-[#D8B87E]/28 bg-[#FFF8EE] p-4 text-sm font-bold">
          <input name="maintenanceMode" type="checkbox" defaultChecked={settings.maintenanceMode} className="h-5 w-5 accent-[#C8A96A]" />
          Mode maintenance
        </label>
        <div className="md:col-span-2">
          <Button disabled={mutation.isPending}>{mutation.isPending ? "Sauvegarde..." : "Sauvegarder les parametres"}</Button>
        </div>
      </form>
    </main>
  );
};

const Field = ({ label, ...props }) => (
  <label className="block">
    <span className="parfum-label">{label}</span>
    <input className="parfum-field" {...props} />
  </label>
);

const Hero = ({ page }) => (
  <section className="parfum-night rounded-[30px] border border-[#D8B87E]/25 p-8 text-[#FFF9EF] shadow-[0_28px_90px_rgba(33,24,23,0.24)]">
    <p className="text-xs font-extrabold uppercase tracking-[0.35em] text-[#D8B87E]">Module admin</p>
    <h1 className="mt-3 font-title text-5xl font-black">{page.title}</h1>
    <p className="mt-4 max-w-2xl text-sm leading-7 text-[#F8EAD7]/62">{page.description}</p>
  </section>
);

const emptyUser = {
  name: "",
  email: "",
  password: "",
  role: ROLES.EMPLOYEE,
  tenantId: "",
  isActive: true
};

const UsersPage = ({ page, users, role }) => {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyUser);
  const { data: parfumeries = [] } = useQuery({ queryKey: ["parfumeries"], queryFn: adminService.parfumeries, enabled: role === ROLES.SUPER_ADMIN });
  const roleOptions = role === ROLES.SUPER_ADMIN
    ? [ROLES.SUPER_ADMIN, ROLES.ADMIN_TENANT, ROLES.MANAGER, ROLES.EMPLOYEE, ROLES.CLIENT]
    : [ROLES.MANAGER, ROLES.EMPLOYEE, ROLES.CLIENT];

  const saveMutation = useMutation({
    mutationFn: (payload) => {
      const cleanPayload = { ...payload };
      if (editing && !cleanPayload.password) delete cleanPayload.password;
      return editing ? adminService.updateUser({ id: editing.id || editing._id, payload: cleanPayload }) : adminService.createUser(cleanPayload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success(editing ? "Utilisateur mis a jour" : "Utilisateur cree");
      setEditing(null);
      setForm(emptyUser);
    },
    onError: (error) => toast.error(error.response?.data?.message || "Operation impossible")
  });

  const toggleMutation = useMutation({
    mutationFn: adminService.toggleUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Statut utilisateur mis a jour");
    },
    onError: (error) => toast.error(error.response?.data?.message || "Changement impossible")
  });

  const deleteMutation = useMutation({
    mutationFn: adminService.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Utilisateur supprime");
    },
    onError: (error) => toast.error(error.response?.data?.message || "Suppression impossible")
  });

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const startEdit = (item) => {
    setEditing(item);
    setForm({
      name: item.name || "",
      email: item.email || "",
      password: "",
      role: item.role || ROLES.EMPLOYEE,
      tenantId: item.tenantId || "",
      isActive: item.isActive !== false
    });
  };

  const submit = (event) => {
    event.preventDefault();
    saveMutation.mutate(form);
  };

  return (
    <main className="space-y-8">
      <Hero page={page} />
      <div className="grid gap-4 md:grid-cols-4">
        <Metric label="Comptes" value={users.length} />
        <Metric label="Actifs" value={users.filter((item) => item.isActive).length} />
        <Metric label="Admins tenant" value={users.filter((item) => item.role === ROLES.ADMIN_TENANT).length} />
        <Metric label="Managers" value={users.filter((item) => item.role === ROLES.MANAGER).length} />
      </div>

      <form onSubmit={submit} className="parfum-panel-solid grid gap-5 p-6 md:grid-cols-3">
        <div className="md:col-span-3">
          <p className="parfum-eyebrow">{editing ? "Modifier compte" : "Nouvel utilisateur"}</p>
        </div>
        <ControlledField label="Nom" value={form.name} onChange={(value) => update("name", value)} required />
        <ControlledField label="Email" value={form.email} onChange={(value) => update("email", value)} type="email" required />
        <ControlledField label={editing ? "Nouveau mot de passe" : "Mot de passe"} value={form.password} onChange={(value) => update("password", value)} type="password" required={!editing} />
        <label>
          <span className="parfum-label">Role</span>
          <select className="parfum-field" value={form.role} onChange={(event) => update("role", event.target.value)}>
            {roleOptions.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
        {role === ROLES.SUPER_ADMIN && form.role !== ROLES.SUPER_ADMIN && (
          <label>
            <span className="parfum-label">Tenant</span>
            <select className="parfum-field" value={form.tenantId} onChange={(event) => update("tenantId", event.target.value)} required>
              <option value="">Choisir un tenant</option>
              {parfumeries.map((item) => <option key={item.id || item._id} value={item.id || item._id}>{item.name}</option>)}
            </select>
          </label>
        )}
        <label className="flex items-center gap-3 rounded-[20px] border border-[#D8B87E]/28 bg-[#FFF8EE] p-4 text-sm font-bold">
          <input type="checkbox" checked={form.isActive} onChange={(event) => update("isActive", event.target.checked)} className="h-5 w-5 accent-[#C8A96A]" />
          Compte actif
        </label>
        <div className="flex flex-wrap gap-3 md:col-span-3">
          <Button disabled={saveMutation.isPending}>{saveMutation.isPending ? "Sauvegarde..." : editing ? "Mettre a jour" : "Creer utilisateur"}</Button>
          {editing && <Button type="button" variant="outline" onClick={() => { setEditing(null); setForm(emptyUser); }}>Annuler</Button>}
        </div>
      </form>

      <section className="grid gap-4">
        {users.map((item) => (
          <motion.article key={item.id || item._id} whileHover={{ y: -2 }} className="parfum-panel-solid grid gap-4 p-5 lg:grid-cols-[1.3fr_1fr_auto] lg:items-center">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="font-title text-2xl font-black text-[#211817]">{item.name}</h2>
                <Badge tone={item.isActive ? "green" : "red"}>{item.isActive ? "Actif" : "Inactif"}</Badge>
                <Badge tone={item.role === ROLES.SUPER_ADMIN ? "dark" : item.role === ROLES.ADMIN_TENANT ? "gold" : "soft"}>{item.role}</Badge>
              </div>
              <p className="mt-2 text-sm font-semibold text-[#8A8A8A]">{item.email}</p>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <MiniStat label="Tenant" value={item.tenant || item.parfumerie || "Plateforme"} />
              <MiniStat label="Cree le" value={item.createdAt ? new Date(item.createdAt).toLocaleDateString("fr-FR") : "-"} />
            </div>
            <div className="flex gap-2 lg:justify-end">
              <button onClick={() => startEdit(item)} className="rounded-xl border border-black/10 bg-white p-2 text-[#0B0B0F] transition hover:border-[#C8A96A] hover:text-[#C8A96A]"><Edit3 size={16} /></button>
              <button onClick={() => toggleMutation.mutate(item.id || item._id)} className="rounded-xl border border-black/10 bg-white p-2 text-[#0B0B0F] transition hover:border-[#C8A96A] hover:text-[#C8A96A]"><Power size={16} /></button>
              <button onClick={() => deleteMutation.mutate(item.id || item._id)} className="rounded-xl border border-red-100 bg-red-50 p-2 text-red-600 transition hover:bg-red-100"><Trash2 size={16} /></button>
            </div>
          </motion.article>
        ))}
      </section>
    </main>
  );
};

const emptyParfumerie = {
  name: "",
  slug: "",
  city: "",
  address: "",
  phone: "",
  whatsappNumber: "",
  email: "",
  managerName: "",
  adminName: "",
  adminEmail: "",
  adminPassword: "",
  plan: "FREE",
  status: "trial",
  maxUsers: 3,
  maxItems: 100,
  isActive: true
};

const ParfumeriesPage = ({ page, parfumeries, canEdit }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyParfumerie);

  const saveMutation = useMutation({
    mutationFn: (payload) => editing ? adminService.updateParfumerie({ id: editing.id || editing._id, payload }) : adminService.createParfumerie(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parfumeries"] });
      toast.success(editing ? "Parfumerie mise a jour" : "Parfumerie creee");
      setEditing(null);
      setForm(emptyParfumerie);
    },
    onError: (error) => toast.error(error.response?.data?.message || "Operation impossible")
  });

  const deleteMutation = useMutation({
    mutationFn: adminService.deleteParfumerie,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parfumeries"] });
      toast.success("Parfumerie supprimee");
    },
    onError: (error) => toast.error(error.response?.data?.message || "Suppression impossible")
  });

  const toggleMutation = useMutation({
    mutationFn: adminService.toggleParfumerie,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parfumeries"] });
      toast.success("Statut tenant mis a jour");
    },
    onError: (error) => toast.error(error.response?.data?.message || "Changement impossible")
  });

  const impersonateMutation = useMutation({
    mutationFn: adminService.impersonateTenant,
    onSuccess: ({ token }) => {
      localStorage.setItem("adminToken", token);
      toast.success("Session tenant ouverte");
      navigate("/admin/dashboard");
      window.location.reload();
    },
    onError: (error) => toast.error(error.response?.data?.message || "Impersonation impossible")
  });

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const startEdit = (item) => {
    setEditing(item);
    setForm({
      name: item.name || "",
      slug: item.slug || "",
      city: item.city || "",
      address: item.address || "",
      phone: item.phone || "",
      whatsappNumber: item.whatsappNumber || "",
      email: item.email || "",
      managerName: item.managerName || "",
      adminName: "",
      adminEmail: "",
      adminPassword: "",
      plan: item.subscription?.plan || "FREE",
      status: item.subscription?.status || "trial",
      maxUsers: item.subscription?.maxUsers || 3,
      maxItems: item.subscription?.maxItems || 100,
      isActive: item.isActive !== false
    });
  };

  const submit = (event) => {
    event.preventDefault();
    saveMutation.mutate(form);
  };

  if (!canEdit) {
    return (
      <main className="space-y-8">
        <Hero page={page} />
        <section className="parfum-panel-solid p-8">
          <h2 className="font-title text-3xl font-black">Acces reserve</h2>
          <p className="mt-3 text-[#8A8A8A]">Seul le superadmin peut gerer toutes les parfumeries.</p>
        </section>
      </main>
    );
  }

  return (
    <main className="space-y-8">
      <Hero page={page} />
      <div className="grid gap-4 md:grid-cols-4">
        <Metric label="Parfumeries" value={parfumeries.length} />
        <Metric label="Actives" value={parfumeries.filter((item) => item.isActive).length} />
        <Metric label="Parfums" value={parfumeries.reduce((sum, item) => sum + Number(item.products || 0), 0)} />
        <Metric label="CA total" value={formatPrice(parfumeries.reduce((sum, item) => sum + Number(item.revenue || 0), 0))} />
      </div>

      <form onSubmit={submit} className="parfum-panel-solid grid gap-5 p-6 md:grid-cols-3">
        <div className="md:col-span-3">
          <p className="parfum-eyebrow">{editing ? "Modifier parfumerie" : "Nouvelle parfumerie"}</p>
        </div>
        <ControlledField label="Nom" value={form.name} onChange={(value) => update("name", value)} required />
        <ControlledField label="Slug" value={form.slug} onChange={(value) => update("slug", value)} placeholder="auto si vide" />
        <ControlledField label="Ville" value={form.city} onChange={(value) => update("city", value)} />
        <ControlledField label="Telephone" value={form.phone} onChange={(value) => update("phone", value)} />
        <ControlledField label="WhatsApp" value={form.whatsappNumber} onChange={(value) => update("whatsappNumber", value)} />
        <ControlledField label="Email" value={form.email} onChange={(value) => update("email", value)} type="email" />
        <ControlledField label="Responsable" value={form.managerName} onChange={(value) => update("managerName", value)} />
        {!editing && <ControlledField label="Nom admin tenant" value={form.adminName} onChange={(value) => update("adminName", value)} />}
        {!editing && <ControlledField label="Email admin tenant" value={form.adminEmail} onChange={(value) => update("adminEmail", value)} type="email" required />}
        {!editing && <ControlledField label="Mot de passe admin" value={form.adminPassword} onChange={(value) => update("adminPassword", value)} type="password" required />}
        <label>
          <span className="parfum-label">Plan</span>
          <select className="parfum-field" value={form.plan} onChange={(event) => update("plan", event.target.value)}>
            {["FREE", "STARTER", "PRO", "ENTERPRISE"].map((plan) => <option key={plan} value={plan}>{plan}</option>)}
          </select>
        </label>
        <label>
          <span className="parfum-label">Statut abonnement</span>
          <select className="parfum-field" value={form.status} onChange={(event) => update("status", event.target.value)}>
            {["trial", "active", "past_due", "canceled"].map((status) => <option key={status} value={status}>{status}</option>)}
          </select>
        </label>
        <ControlledField label="Utilisateurs max" value={form.maxUsers} onChange={(value) => update("maxUsers", Number(value || 0))} type="number" />
        <ControlledField label="Produits max" value={form.maxItems} onChange={(value) => update("maxItems", Number(value || 0))} type="number" />
        <label className="block md:col-span-2">
          <span className="parfum-label">Adresse</span>
          <input className="parfum-field" value={form.address} onChange={(event) => update("address", event.target.value)} />
        </label>
        <label className="flex items-center gap-3 rounded-[20px] border border-[#D8B87E]/28 bg-[#FFF8EE] p-4 text-sm font-bold">
          <input type="checkbox" checked={form.isActive} onChange={(event) => update("isActive", event.target.checked)} className="h-5 w-5 accent-[#C8A96A]" />
          Active
        </label>
        <div className="flex flex-wrap gap-3 md:col-span-3">
          <Button disabled={saveMutation.isPending}>{saveMutation.isPending ? "Sauvegarde..." : editing ? "Mettre a jour" : "Creer la parfumerie"}</Button>
          {editing && <Button type="button" variant="outline" onClick={() => { setEditing(null); setForm(emptyParfumerie); }}>Annuler</Button>}
        </div>
      </form>

      <section className="grid gap-4">
        {parfumeries.map((item) => (
          <motion.article key={item.id || item._id} whileHover={{ y: -2 }} className="parfum-panel-solid grid gap-4 p-5 lg:grid-cols-[1.2fr_1fr_auto] lg:items-center">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="font-title text-2xl font-black text-[#211817]">{item.name}</h2>
                <Badge tone={item.isActive ? "green" : "red"}>{item.isActive ? "Active" : "Inactive"}</Badge>
                <Badge tone="soft">{item.subscription?.plan || "FREE"}</Badge>
                <Badge tone={item.subscription?.status === "active" ? "green" : item.subscription?.status === "trial" ? "gold" : "red"}>{item.subscription?.status || "trial"}</Badge>
              </div>
              <p className="mt-2 text-sm font-semibold text-[#8A8A8A]">{item.city || "Ville non renseignee"} · {item.managerName || "Aucun responsable"}</p>
              <p className="mt-1 text-sm text-[#8A8A8A]">{item.address || "Adresse non renseignee"}</p>
            </div>
            <div className="grid grid-cols-3 gap-3 text-sm">
              <MiniStat label="Parfums" value={item.products || 0} />
              <MiniStat label="Stock" value={item.stock || 0} />
              <MiniStat label="CA" value={formatPrice(item.revenue || 0)} />
            </div>
            <div className="flex gap-2 lg:justify-end">
              <button onClick={() => startEdit(item)} className="rounded-xl border border-black/10 bg-white p-2 text-[#0B0B0F] transition hover:border-[#C8A96A] hover:text-[#C8A96A]"><Edit3 size={16} /></button>
              <button onClick={() => toggleMutation.mutate(item.id || item._id)} className="rounded-xl border border-black/10 bg-white p-2 text-[#0B0B0F] transition hover:border-[#C8A96A] hover:text-[#C8A96A]"><Power size={16} /></button>
              <button onClick={() => impersonateMutation.mutate(item.id || item._id)} className="rounded-xl border border-black/10 bg-white p-2 text-[#0B0B0F] transition hover:border-[#C8A96A] hover:text-[#C8A96A]"><LogIn size={16} /></button>
              <button onClick={() => deleteMutation.mutate(item.id || item._id)} className="rounded-xl border border-red-100 bg-red-50 p-2 text-red-600 transition hover:bg-red-100"><Trash2 size={16} /></button>
            </div>
          </motion.article>
        ))}
      </section>
    </main>
  );
};

const ControlledField = ({ label, value, onChange, ...props }) => (
  <label className="block">
    <span className="parfum-label">{label}</span>
    <input className="parfum-field" value={value} onChange={(event) => onChange(event.target.value)} {...props} />
  </label>
);

const MiniStat = ({ label, value }) => (
  <div className="rounded-[18px] border border-[#D8B87E]/20 bg-[#FFF8EE] p-3">
    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#B98D4B]">{label}</p>
    <p className="mt-1 text-sm font-black text-[#211817]">{value}</p>
  </div>
);
