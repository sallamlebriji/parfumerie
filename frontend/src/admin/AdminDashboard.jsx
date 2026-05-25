import { Banknote, Package, ShoppingCart, Sparkles, TrendingUp, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import AdminLayout from "../components/AdminLayout";
import AdminProductCell from "../components/AdminProductCell";
import StatCard from "../components/StatCard";

const AdminDashboard = () => {
  const [perfumes, setPerfumes] = useState([]);
  const [orders, setOrders] = useState([]);
  const [sales, setSales] = useState([]);

  useEffect(() => {
    Promise.all([api.get("/perfumes"), api.get("/orders"), api.get("/sales")]).then(([p, o, s]) => {
      setPerfumes(p.data);
      setOrders(o.data);
      setSales(s.data);
    });
  }, []);

  const stats = [
    [Package, "Total parfums", perfumes.length],
    [Sparkles, "Disponibles", perfumes.filter((p) => p.isAvailable).length],
    [XCircle, "Rupture", perfumes.filter((p) => !p.isAvailable).length],
    [ShoppingCart, "Commandes", orders.length]
  ];
  const unitsPurchased = perfumes.reduce((sum, p) => sum + Number(p.quantityPurchased || p.stock || 0), 0);
  const currentStock = perfumes.reduce((sum, p) => sum + Number(p.stock || 0), 0);
  const investedCapital = perfumes.reduce((sum, p) => sum + Number(p.purchasePrice || 0) * Number(p.quantityPurchased || p.stock || 0), 0);
  const stockSaleValue = perfumes.reduce((sum, p) => sum + Number(p.price || 0) * Number(p.stock || 0), 0);
  const potentialProfit = perfumes.reduce((sum, p) => sum + (Number(p.price || 0) - Number(p.purchasePrice || 0)) * Number(p.stock || 0), 0);
  const localRevenue = sales.reduce((sum, s) => sum + Number(s.totalAmount || 0), 0);
  const localProfit = sales.reduce((sum, s) => sum + Number(s.profit || 0), 0);
  const formatDh = (value) => `${value.toLocaleString("fr-FR")} DH`;

  return (
    <AdminLayout>
      <div className="luxury-gradient rounded-[32px] border border-gold/25 p-8 text-white shadow-luxury">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.3em] text-lightgold">Administration</p>
          <h1 className="mt-2 text-5xl font-black">Dashboard</h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-white/60">Vue d'ensemble de la boutique: parfums, disponibilites, commandes et activite recente.</p>
        </div>
        <Link to="/admin/parfums/nouveau" className="btn-gold">Ajouter un parfum</Link>
      </div>
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-4">
        {stats.map(([Icon, label, value]) => (
          <StatCard key={label} icon={Icon} label={label} value={value} />
        ))}
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-5">
        <StatCard icon={Package} label="Total acheté" value={unitsPurchased} />
        <StatCard icon={Package} label="Stock actuel" value={currentStock} />
        <StatCard icon={Banknote} label="Capital investi" value={formatDh(investedCapital)} />
        <StatCard icon={ShoppingCart} label="Valeur de vente stock" value={formatDh(stockSaleValue)} />
        <StatCard icon={TrendingUp} label="Benefice potentiel" value={formatDh(potentialProfit)} />
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <StatCard icon={ShoppingCart} label="Ventes locales" value={sales.length} />
        <StatCard icon={Banknote} label="Chiffre d'affaires local" value={formatDh(localRevenue)} />
        <StatCard icon={TrendingUp} label="Benefice realise" value={formatDh(localProfit)} />
      </div>
      <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_420px]">
        <div className="panel p-6">
          <h2 className="text-2xl font-black">Graphique commandes</h2>
          <div className="mt-6 flex h-64 items-end gap-4 rounded-[22px] bg-beige/60 p-5">
            {["pending", "confirmed", "cancelled", "delivered"].map((status) => {
              const value = orders.filter((o) => o.status === status).length;
              const height = Math.max(12, value * 34);
              return (
                <div key={status} className="flex flex-1 flex-col items-center gap-3">
                  <div className="w-full rounded-t-2xl bg-gradient-to-t from-gold to-lightgold" style={{ height }} />
                  <span className="text-xs font-bold text-elegantgray">{status}</span>
                </div>
              );
            })}
          </div>
        </div>
        <div className="panel p-6">
          <h2 className="text-2xl font-black">Dernieres commandes</h2>
          <div className="mt-4 divide-y divide-ink/10">
            {orders.slice(0, 5).map((o) => <p key={o._id} className="flex justify-between gap-3 py-3 text-sm"><span>{o.customerName}</span><span className="font-bold">{o.totalAmount} DH</span></p>)}
          </div>
        </div>
      </div>
      <div className="panel mt-8 p-6">
        <h2 className="text-2xl font-black">Dernieres ventes locales</h2>
        <div className="mt-4 divide-y divide-ink/10">
          {sales.slice(0, 5).map((s) => (
            <div key={s._id} className="grid items-center gap-2 py-3 text-sm md:grid-cols-[1fr_auto_auto_auto_auto]">
              <AdminProductCell image={s.image || s.perfumeId?.image} name={s.perfumeName} meta={`x${s.quantity}`} />
              <span className="font-bold">Stock: {s.stockBefore ?? "-"} <span aria-hidden="true">-&gt;</span> {s.stockAfter ?? "-"}</span>
              <span className="font-bold">Prix: {s.salePrice} DH</span>
              <span className="font-bold text-gold">Total: {s.totalAmount} DH</span>
              <span className="font-bold">Marge: {s.profit} DH</span>
            </div>
          ))}
        </div>
      </div>
      <div className="panel mt-8 p-6">
        <h2 className="text-2xl font-black">Derniers parfums ajoutes</h2>
        <div className="mt-4 divide-y divide-ink/10">
          {perfumes.slice(0, 5).map((p) => (
            <div key={p._id} className="grid items-center gap-2 py-3 text-sm md:grid-cols-[1fr_auto_auto_auto_auto]">
              <AdminProductCell image={p.image} name={p.name} meta={p.brand} />
              <span className="font-bold">Total acheté: {p.quantityPurchased || p.stock || 0}</span>
              <span className="font-bold">Achat: {p.purchasePrice || 0} DH</span>
              <span className="font-bold">Vente: {p.price} DH</span>
              <span className="font-bold">Stock: {p.stock}</span>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
