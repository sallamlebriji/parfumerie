import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { AlertTriangle, ArrowUpRight, Banknote, Package, ShoppingCart, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { adminService } from "../../services/adminService";
import { StatCard } from "../../components/dashboard/StatCard";
import { SalesCharts } from "../../components/dashboard/SalesCharts";
import { DataTable } from "../../components/tables/DataTable";
import { Badge } from "../../components/ui/Badge";
import { formatPrice } from "../../utils/format";

export const AdminDashboardPage = () => {
  const rootRef = useRef(null);
  const { data: stats } = useQuery({ queryKey: ["dashboard"], queryFn: adminService.dashboard });
  const { data: orders = [] } = useQuery({ queryKey: ["orders"], queryFn: adminService.orders });
  const { data: stocks = [] } = useQuery({ queryKey: ["stocks"], queryFn: adminService.stocks });

  useEffect(() => {
    if (!stats || !rootRef.current) return;
    const context = gsap.context(() => {
      gsap.fromTo(".admin-reveal", { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.08, ease: "power3.out" });
      gsap.fromTo(".admin-number", { textContent: 0 }, { textContent: (_, target) => target.dataset.value || 0, duration: 1, snap: { textContent: 1 }, ease: "power2.out" });
    }, rootRef);
    return () => context.revert();
  }, [stats]);

  if (!stats) return null;

  return (
    <main ref={rootRef} className="space-y-8">
      <section className="admin-reveal parfum-night overflow-hidden rounded-[30px] border border-[#D8B87E]/25 p-6 text-[#FFF9EF] shadow-[0_28px_90px_rgba(33,24,23,0.24)] sm:p-8">
        <div className="grid gap-8 lg:grid-cols-[1.4fr_0.8fr] lg:items-end">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.35em] text-[#D8B87E]">Administration</p>
            <h1 className="mt-3 font-title text-4xl font-black sm:text-5xl">Dashboard premium</h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#F8EAD7]/62">Pilotage clair des ventes, commandes, clients, stocks et alertes pour une parfumerie haut de gamme.</p>
          </div>
          <div className="rounded-[24px] border border-[#D8B87E]/18 bg-[#FFF5E7]/[0.06] p-5">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-[#D8B87E]">Profit total</p>
            <p className="mt-3 text-3xl font-black">{formatPrice(stats.profit || 0)}</p>
            <p className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-[#F8EAD7]/58"><ArrowUpRight size={16} /> Suivi operations en temps reel</p>
          </div>
        </div>
      </section>
      <div className="admin-reveal grid gap-4 md:grid-cols-3 xl:grid-cols-6">
        <StatCard icon={Banknote} label="CA du jour" value={formatPrice(stats.todayRevenue)} trend="Live" />
        <StatCard icon={Banknote} label="CA mensuel" value={formatPrice(stats.monthRevenue)} />
        <StatCard icon={ShoppingCart} label="Commandes" value={stats.orders} />
        <StatCard icon={AlertTriangle} label="En attente" value={stats.pendingOrders} tone="dark" />
        <StatCard icon={Package} label="Stock faible" value={stats.lowStock} />
        <StatCard icon={Users} label="Clients actifs" value={stats.activeCustomers} />
      </div>
      <motion.div className="admin-reveal" initial={false}><SalesCharts stats={stats} /></motion.div>
      <div className="admin-reveal grid gap-6 xl:grid-cols-2">
        <section><h2 className="mb-4 font-title text-3xl font-black">Dernieres commandes</h2><DataTable data={orders.slice(0, 6)} columns={[{ accessorKey: "id", header: "N" }, { accessorKey: "customer", header: "Client" }, { accessorKey: "total", header: "Total", cell: ({ getValue }) => formatPrice(getValue()) }, { accessorKey: "status", header: "Statut", cell: ({ getValue }) => <Badge tone={getValue() === "cancelled" ? "red" : getValue() === "confirmed" ? "green" : getValue() === "delivered" ? "gold" : "soft"}>{getValue()}</Badge> }]} /></section>
        <section><h2 className="mb-4 font-title text-3xl font-black">Alertes stock</h2><DataTable data={stocks.filter((item) => item.status !== "ok").slice(0, 6)} columns={[{ accessorKey: "sku", header: "SKU" }, { accessorKey: "product", header: "Produit" }, { accessorKey: "available", header: "Disponible" }, { accessorKey: "status", header: "Statut", cell: ({ getValue }) => <Badge tone={getValue() === "rupture" ? "red" : getValue() === "faible" ? "gold" : "green"}>{getValue()}</Badge> }]} /></section>
      </div>
    </main>
  );
};
