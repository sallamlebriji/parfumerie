import { LayoutDashboard, LogOut, Package, Receipt, ShoppingCart } from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminLayout = ({ children }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const signOut = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_88%_8%,rgba(201,162,39,0.12),transparent_24rem),linear-gradient(180deg,#FAF7F0,#F5EFE6)]">
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-gold/20 bg-ink p-7 text-white lg:block">
        <Link to="/admin" className="font-title text-2xl font-black text-lightgold">Maison Admin</Link>
        <p className="mt-2 text-xs font-semibold uppercase tracking-[0.25em] text-white/35">Parfumerie locale</p>
        <nav className="mt-10 grid gap-2">
          <NavLink to="/admin" end className={({ isActive }) => `flex items-center gap-3 rounded-2xl px-4 py-3 font-semibold ${isActive ? "bg-gold text-ink" : "hover:bg-white/10"}`}><LayoutDashboard size={18} /> Dashboard</NavLink>
          <NavLink to="/admin/parfums" className={({ isActive }) => `flex items-center gap-3 rounded-2xl px-4 py-3 font-semibold ${isActive ? "bg-gold text-ink" : "hover:bg-white/10"}`}><Package size={18} /> Parfums</NavLink>
          <NavLink to="/admin/ventes" className={({ isActive }) => `flex items-center gap-3 rounded-2xl px-4 py-3 font-semibold ${isActive ? "bg-gold text-ink" : "hover:bg-white/10"}`}><Receipt size={18} /> Ventes</NavLink>
          <NavLink to="/admin/commandes" className={({ isActive }) => `flex items-center gap-3 rounded-2xl px-4 py-3 font-semibold ${isActive ? "bg-gold text-ink" : "hover:bg-white/10"}`}><ShoppingCart size={18} /> Commandes</NavLink>
        </nav>
        <div className="absolute bottom-24 left-7 right-7 rounded-[24px] border border-gold/20 bg-white/10 p-5 backdrop-blur">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-lightgold">Session admin</p>
          <p className="mt-3 text-sm leading-6 text-white/55">Gestion locale des parfums, stocks et commandes WhatsApp.</p>
        </div>
        <button onClick={signOut} className="absolute bottom-6 flex items-center gap-3 rounded-2xl px-4 py-3 text-white/80 hover:bg-white/10">
          <LogOut size={18} /> Deconnexion
        </button>
      </aside>
      <main className="lg:pl-72">
        <div className="sticky top-0 z-40 border-b border-ink/10 bg-ivory/95 px-4 py-3 backdrop-blur lg:hidden">
          <div className="flex items-center justify-between">
            <Link to="/admin" className="font-title text-xl font-black">Admin</Link>
            <button onClick={signOut} className="rounded-full border border-ink/10 p-2"><LogOut size={18} /></button>
          </div>
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1 text-sm font-bold">
            <Link to="/admin" className="rounded-full bg-white px-4 py-2">Dashboard</Link>
            <Link to="/admin/parfums" className="rounded-full bg-white px-4 py-2">Parfums</Link>
            <Link to="/admin/ventes" className="rounded-full bg-white px-4 py-2">Ventes</Link>
            <Link to="/admin/commandes" className="rounded-full bg-white px-4 py-2">Commandes</Link>
          </div>
        </div>
        <div className="container-page py-8">{children}</div>
      </main>
    </div>
  );
};

export default AdminLayout;
