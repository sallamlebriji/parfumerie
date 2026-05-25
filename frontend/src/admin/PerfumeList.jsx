import { Edit, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import AdminLayout from "../components/AdminLayout";
import AdminProductCell from "../components/AdminProductCell";
import AdminTable from "../components/AdminTable";

const PerfumeList = () => {
  const [perfumes, setPerfumes] = useState([]);

  const load = () => api.get("/perfumes").then(({ data }) => setPerfumes(data));
  useEffect(() => { load(); }, []);

  const remove = async (id) => {
    if (!confirm("Supprimer ce parfum ?")) return;
    await api.delete(`/perfumes/${id}`);
    load();
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-black">Parfums</h1>
        <Link to="/admin/parfums/nouveau" className="btn-gold"><Plus size={18} /> Ajouter</Link>
      </div>
      <div className="mt-8">
        <AdminTable headers={["Nom", "Marque", "Total acheté", "Achat", "Vente", "Stock", "Capital stock", "Disponible", "Actions"]}>
            {perfumes.map((p) => (
              <tr key={p._id}>
                <td className="px-5 py-4"><AdminProductCell image={p.image} name={p.name} meta={`${p.brand} - ${p.volume}`} /></td>
                <td>{p.brand}</td>
                <td className="font-bold">{p.quantityPurchased || p.stock || 0}</td>
                <td>{p.purchasePrice || 0} DH</td>
                <td>{p.price} DH</td>
                <td>{p.stock}</td>
                <td className="font-bold text-gold">{Number(p.purchasePrice || 0) * Number(p.stock || 0)} DH</td>
                <td><span className={p.isAvailable ? "badge-gold" : "rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-700"}>{p.isAvailable ? "Oui" : "Non"}</span></td>
                <td className="flex gap-2 py-3">
                  <Link className="rounded-md border p-2" to={`/admin/parfums/${p._id}`}><Edit size={16} /></Link>
                  <button className="rounded-md border p-2 text-red-600" onClick={() => remove(p._id)}><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
        </AdminTable>
      </div>
    </AdminLayout>
  );
};

export default PerfumeList;
