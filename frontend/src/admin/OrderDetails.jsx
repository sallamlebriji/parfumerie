import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import AdminLayout from "../components/AdminLayout";
import AdminProductCell from "../components/AdminProductCell";

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => { api.get(`/orders/${id}`).then(({ data }) => setOrder(data)); }, [id]);

  const updateStatus = async (status) => {
    const { data } = await api.put(`/orders/${id}/status`, { status });
    setOrder(data);
  };

  if (!order) return <AdminLayout>Chargement...</AdminLayout>;

  return (
    <AdminLayout>
      <h1 className="text-3xl font-black">Commande</h1>
      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="panel p-6">
          <h2 className="font-bold">Produits</h2>
          <div className="mt-4 divide-y divide-ink/10">
            {order.products.map((item) => (
              <div key={item._id} className="flex items-center justify-between gap-4 py-4">
                <AdminProductCell image={item.image || item.perfumeId?.image} name={item.name} meta={`${item.volume} x ${item.quantity}`} />
                <p className="font-bold">{item.price * item.quantity} DH</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-2xl font-black">Total: {order.totalAmount} DH</p>
        </div>
        <aside className="panel h-fit p-6">
          <h2 className="font-bold">Client</h2>
          <p className="mt-4">{order.customerName}</p>
          <p>{order.phone}</p>
          <p>{order.address}, {order.city}</p>
          <p className="mt-4 text-sm text-ink/60">{order.notes}</p>
          <label className="mt-6 block">
            <span className="label">Statut</span>
            <select className="field" value={order.status} onChange={(e) => updateStatus(e.target.value)}>
              <option value="pending">pending</option>
              <option value="confirmed">confirmed</option>
              <option value="cancelled">cancelled</option>
              <option value="delivered">delivered</option>
            </select>
          </label>
        </aside>
      </div>
    </AdminLayout>
  );
};

export default OrderDetails;
