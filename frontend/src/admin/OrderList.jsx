import { Eye, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import AdminLayout from "../components/AdminLayout";
import AdminTable from "../components/AdminTable";
import StatusBadge from "../components/StatusBadge";

const statuses = ["", "pending", "confirmed", "cancelled", "delivered"];

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState("");

  const load = () => api.get(`/orders${status ? `?status=${status}` : ""}`).then(({ data }) => setOrders(data));
  useEffect(() => { load(); }, [status]);

  const remove = async (id) => {
    if (!confirm("Supprimer cette commande ?")) return;
    await api.delete(`/orders/${id}`);
    load();
  };

  return (
    <AdminLayout>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-black">Commandes</h1>
        <select className="field w-56" value={status} onChange={(e) => setStatus(e.target.value)}>
          {statuses.map((s) => <option key={s} value={s}>{s || "Tous les statuts"}</option>)}
        </select>
      </div>
      <div className="mt-8">
        <AdminTable headers={["Client", "Ville", "Total", "Statut", "Date", "Actions"]}>
            {orders.map((o) => (
              <tr key={o._id}>
                <td className="px-5 py-4 font-bold">{o.customerName}</td>
                <td>{o.city}</td>
                <td>{o.totalAmount} DH</td>
                <td><StatusBadge status={o.status} /></td>
                <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                <td className="flex gap-2 py-3">
                  <Link className="rounded-md border p-2" to={`/admin/commandes/${o._id}`}><Eye size={16} /></Link>
                  <button className="rounded-md border p-2 text-red-600" onClick={() => remove(o._id)}><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
        </AdminTable>
      </div>
    </AdminLayout>
  );
};

export default OrderList;
