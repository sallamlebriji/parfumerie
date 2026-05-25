import { Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import AdminLayout from "../components/AdminLayout";
import AdminProductCell from "../components/AdminProductCell";
import AdminTable from "../components/AdminTable";

const SaleList = () => {
  const [sales, setSales] = useState([]);

  const load = () => api.get("/sales").then(({ data }) => setSales(data));
  useEffect(() => { load(); }, []);

  const remove = async (id) => {
    if (!confirm("Supprimer cette vente ? Le stock ne sera pas restaure automatiquement.")) return;
    await api.delete(`/sales/${id}`);
    load();
  };

  const revenue = sales.reduce((sum, s) => sum + Number(s.totalAmount || 0), 0);
  const profit = sales.reduce((sum, s) => sum + Number(s.profit || 0), 0);

  return (
    <AdminLayout>
      <div className="luxury-gradient rounded-[32px] border border-gold/25 p-8 text-white shadow-luxury">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.3em] text-lightgold">Gestion locale</p>
            <h1 className="mt-2 text-5xl font-black">Ventes magasin</h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-white/60">Historique des ventes enregistrees localement avec prix reel, quantite, chiffre d'affaires et marge.</p>
          </div>
          <Link to="/admin/ventes/nouveau" className="btn-gold"><Plus size={18} /> Nouvelle vente</Link>
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <Card label="Nombre ventes" value={sales.length} />
        <Card label="Chiffre d'affaires" value={`${revenue} DH`} />
        <Card label="Benefice" value={`${profit} DH`} />
      </div>

      <div className="mt-8">
        <AdminTable headers={["Parfum", "Stock", "Quantite", "Prix vente", "Total", "Benefice", "Paiement", "Date", "Actions"]}>
          {sales.map((sale) => (
            <tr key={sale._id}>
              <td className="px-5 py-4"><AdminProductCell image={sale.image || sale.perfumeId?.image} name={sale.perfumeName} meta={`${sale.brand} - ${sale.volume}`} /></td>
              <td><span className="font-bold">{sale.stockBefore ?? "-"}</span> <span aria-hidden="true">-&gt;</span> <span className="font-bold text-gold">{sale.stockAfter ?? "-"}</span></td>
              <td>{sale.quantity}</td>
              <td>{sale.salePrice} DH</td>
              <td className="font-bold text-gold">{sale.totalAmount} DH</td>
              <td className={sale.profit >= 0 ? "font-bold text-green-700" : "font-bold text-red-700"}>{sale.profit} DH</td>
              <td>{sale.paymentMethod}</td>
              <td>{new Date(sale.createdAt).toLocaleDateString()}</td>
              <td><button className="rounded-md border p-2 text-red-600" onClick={() => remove(sale._id)}><Trash2 size={16} /></button></td>
            </tr>
          ))}
        </AdminTable>
      </div>
    </AdminLayout>
  );
};

const Card = ({ label, value }) => (
  <div className="panel p-6">
    <p className="text-sm font-semibold text-elegantgray">{label}</p>
    <p className="mt-2 text-3xl font-black">{value}</p>
  </div>
);

export default SaleList;
