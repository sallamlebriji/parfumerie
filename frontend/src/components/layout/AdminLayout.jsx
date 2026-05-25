import { AnimatePresence, motion } from "framer-motion";
import { BadgePercent, BarChart3, Bell, Building2, Command, Globe, LayoutDashboard, LogOut, Menu, Moon, Package, Receipt, Search, Settings, Tags, Users, Warehouse, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { canAccessModule, normalizeRole, ROLES } from "../../constants/permissions";
import i18n from "../../i18n";
import { useAppStore } from "../../store/appStore";

const links = [
  ["/admin/dashboard", "Dashboard", LayoutDashboard, "dashboard"],
  ["/admin/products", "Parfums", Package, "products"],
  ["/admin/categories", "Categories", Tags, "products"],
  ["/admin/brands", "Marques", Tags, "products"],
  ["/admin/orders", "Commandes", Receipt, "orders"],
  ["/admin/customers", "Clients", Users, "customers"],
  ["/admin/users", "Utilisateurs", Users, "users"],
  ["/admin/stocks", "Stock", Warehouse, "stocks"],
  ["/admin/promotions", "Promotions", BadgePercent, "promotions"],
  ["/admin/payments", "Paiements", Receipt, "billing"],
  ["/admin/reports", "Rapports", BarChart3, "reports"],
  ["/admin/parfumeries", "Tenants", Building2, "tenants"],
  ["/admin/settings", "Parametres", Settings, "settings"]
];

export const AdminLayout = () => {
  const [palette, setPalette] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const toggleTheme = useAppStore((state) => state.toggleTheme);
  const theme = useAppStore((state) => state.theme);
  const language = useAppStore((state) => state.language);
  const setLanguage = useAppStore((state) => state.setLanguage);
  const { user, logout } = useAuth();
  const role = normalizeRole(user?.role);
  const visibleLinks = links.filter(([, , , module]) => canAccessModule(user, module));
  const commands = useMemo(() => visibleLinks.map(([to, label, Icon]) => ({ to, label, Icon })), [visibleLinks]);
  const filteredCommands = useMemo(() => {
    const value = search.trim().toLowerCase();
    if (!value) return commands;
    return commands.filter((item) => item.label.toLowerCase().includes(value) || item.to.toLowerCase().includes(value));
  }, [commands, search]);

  useEffect(() => {
    document.documentElement.classList.toggle("admin-dark", theme === "dark");
  }, [theme]);

  const goToCommand = (to) => {
    navigate(to);
    setPalette(false);
    setNotificationsOpen(false);
    setLanguageOpen(false);
    setSearch("");
  };

  const submitSearch = (event) => {
    event.preventDefault();
    const first = filteredCommands[0];
    if (first) goToCommand(first.to);
  };

  const cycleLanguage = () => {
    const next = language === "fr" ? "en" : language === "en" ? "ar" : "fr";
    setLanguage(next);
    i18n.changeLanguage(next);
    document.documentElement.dir = next === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = next;
    toast.success(`Langue: ${next.toUpperCase()}`);
    setLanguageOpen(false);
  };

  const setAdminLanguage = (next) => {
    setLanguage(next);
    i18n.changeLanguage(next);
    document.documentElement.dir = next === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = next;
    toast.success(`Langue: ${next.toUpperCase()}`);
    setLanguageOpen(false);
  };

  const toggleAdminTheme = () => {
    toggleTheme();
    toast.success(theme === "dark" ? "Mode clair active" : "Mode sombre active");
  };

  const notifications = [
    ["Commandes", "Consulter les commandes en attente", "/admin/orders"],
    ["Stock", "Verifier les alertes de stock faible", "/admin/stocks"],
    ["Parfumeries", "Gerer les boutiques et responsables", "/admin/parfumeries"]
  ].filter((item) => role === ROLES.SUPER_ADMIN || item[2] !== "/admin/parfumeries");

  const Sidebar = ({ mobile = false }) => (
    <aside className={`${mobile ? "h-full" : "fixed inset-y-0 left-0 hidden w-72 lg:flex"} parfum-night flex-col border-r border-[#D8B87E]/20 p-6 text-[#FFF9EF]`}>
      <div className="flex items-center justify-between gap-4">
        <Link to="/admin/dashboard" onClick={() => setMobileOpen(false)} className="group">
          <span className="block font-title text-2xl font-black text-[#E8CAA0]">Maison Admin</span>
          <span className="mt-1 block text-[11px] font-black uppercase tracking-[0.28em] text-[#F8EAD7]/38">{role === ROLES.SUPER_ADMIN ? "Super SaaS" : "Tenant"} suite</span>
        </Link>
        {mobile && <button onClick={() => setMobileOpen(false)} className="rounded-full border border-[#D8B87E]/20 p-2"><X size={18} /></button>}
      </div>
      <div className="mt-8 rounded-[24px] border border-[#D8B87E]/18 bg-[#FFF5E7]/[0.055] p-4">
        <p className="text-xs font-black uppercase tracking-[0.24em] text-[#D8B87E]">Alerte stock</p>
        <p className="mt-2 text-sm leading-6 text-[#F8EAD7]/62">Ruptures, commandes en attente et ventes du jour dans un cockpit raffine.</p>
      </div>
      <nav className="mt-7 grid gap-1.5 overflow-y-auto pr-1">
        {visibleLinks.map(([to, label, Icon]) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) => `group flex items-center gap-3 rounded-[20px] px-4 py-3 text-sm font-bold transition ${isActive ? "bg-[#D8B87E] text-[#211817] shadow-[0_18px_45px_rgba(216,184,126,0.24)]" : "text-[#F8EAD7]/66 hover:bg-[#FFF5E7]/10 hover:text-[#FFF9EF]"}`}
          >
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto grid gap-2 pt-6">
        <button onClick={logout} className="flex items-center gap-3 rounded-[20px] px-4 py-3 text-left text-sm font-bold text-[#F8EAD7]/66 transition hover:bg-[#FFF5E7]/10 hover:text-[#FFF9EF]"><LogOut size={18} /> Deconnexion</button>
        <Link to="/" className="flex items-center gap-3 rounded-[20px] px-4 py-3 text-sm font-bold text-[#F8EAD7]/66 transition hover:bg-[#FFF5E7]/10 hover:text-[#FFF9EF]">Retour boutique</Link>
      </div>
    </aside>
  );

  return (
    <div className="parfum-admin-bg min-h-screen">
      <Sidebar />
      <AnimatePresence>
        {mobileOpen && (
          <motion.div className="fixed inset-0 z-[80] bg-black/55 backdrop-blur-sm lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="h-full w-[86vw] max-w-80" initial={{ x: -340 }} animate={{ x: 0 }} exit={{ x: -340 }} transition={{ type: "spring", damping: 28, stiffness: 260 }}>
              <Sidebar mobile />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <main className="lg:pl-72">
        <header className="sticky top-0 z-40 border-b border-[#D8B87E]/24 bg-[#FFFDF8]/82 backdrop-blur-xl">
          <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
            <button onClick={() => setMobileOpen(true)} className="rounded-full border border-[#D8B87E]/30 bg-[#FFFDF8] p-3 shadow-sm lg:hidden"><Menu size={18} /></button>
            <form onSubmit={submitSearch} className="relative hidden flex-1 md:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B98D4B]" size={18} />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                onFocus={() => { setNotificationsOpen(false); setLanguageOpen(false); }}
                className="w-full max-w-xl rounded-[22px] border border-[#D8B87E]/30 bg-[#FFFDF8]/88 py-3 pl-12 pr-4 text-sm font-semibold text-[#211817] outline-none transition placeholder:text-[#9E8C7E] focus:border-[#B98D4B] focus:ring-4 focus:ring-[#D8B87E]/16"
                placeholder="Recherche globale..."
              />
              {search.trim() && (
                <div className="absolute left-0 top-14 z-50 w-full max-w-xl rounded-[22px] border border-[#D8B87E]/30 bg-[#FFFDF8] p-2 shadow-[0_24px_70px_rgba(82,55,37,0.18)]">
                  {filteredCommands.slice(0, 6).map(({ to, label, Icon }) => (
                    <button key={to} type="button" onClick={() => goToCommand(to)} className="flex w-full items-center gap-3 rounded-[16px] px-3 py-3 text-left text-sm font-bold text-[#211817] transition hover:bg-[#F8EAD7]">
                      <Icon size={17} className="text-[#B98D4B]" />
                      {label}
                    </button>
                  ))}
                  {!filteredCommands.length && <p className="rounded-[16px] px-3 py-3 text-sm font-bold text-[#8A8A8A]">Aucun resultat</p>}
                </div>
              )}
            </form>
            <div className="flex items-center gap-2">
              <button type="button" title="Commandes rapides" onClick={() => { setPalette(true); setNotificationsOpen(false); setLanguageOpen(false); }} className="rounded-full border border-[#D8B87E]/30 bg-[#FFFDF8] p-3 text-[#211817] shadow-sm transition hover:-translate-y-0.5"><Command size={18} /></button>
              <div className="relative">
                <button type="button" title="Notifications" onClick={() => { setNotificationsOpen((value) => !value); setLanguageOpen(false); }} className="relative rounded-full border border-[#D8B87E]/30 bg-[#FFFDF8] p-3 text-[#211817] shadow-sm transition hover:-translate-y-0.5"><Bell size={18} /><span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#B98D4B]" /></button>
                {notificationsOpen && (
                  <div className="absolute right-0 top-14 z-50 w-80 rounded-[22px] border border-[#D8B87E]/30 bg-[#FFFDF8] p-3 shadow-[0_24px_70px_rgba(82,55,37,0.18)]">
                    <p className="px-2 pb-2 text-xs font-black uppercase tracking-[0.22em] text-[#B98D4B]">Notifications</p>
                    {notifications.map(([title, text, to]) => (
                      <button key={to} type="button" onClick={() => goToCommand(to)} className="block w-full rounded-[16px] p-3 text-left transition hover:bg-[#F8EAD7]">
                        <span className="block text-sm font-black text-[#211817]">{title}</span>
                        <span className="mt-1 block text-xs font-semibold text-[#8A8A8A]">{text}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="relative hidden sm:block">
                <button type="button" title={`Langue: ${language.toUpperCase()}`} onClick={() => { setLanguageOpen((value) => !value); setNotificationsOpen(false); }} className="rounded-full border border-[#D8B87E]/30 bg-[#FFFDF8] p-3 text-[#211817] shadow-sm transition hover:-translate-y-0.5"><Globe size={18} /></button>
                {languageOpen && (
                  <div className="absolute right-0 top-14 z-50 w-44 rounded-[22px] border border-[#D8B87E]/30 bg-[#FFFDF8] p-2 shadow-[0_24px_70px_rgba(82,55,37,0.18)]">
                    {["fr", "en", "ar"].map((code) => (
                      <button key={code} type="button" onClick={() => setAdminLanguage(code)} className={`block w-full rounded-[16px] px-3 py-3 text-left text-sm font-black transition ${language === code ? "bg-[#D8B87E] text-[#211817]" : "text-[#211817] hover:bg-[#F8EAD7]"}`}>
                        {code === "fr" ? "Francais" : code === "en" ? "English" : "العربية"}
                      </button>
                    ))}
                    <button type="button" onClick={cycleLanguage} className="mt-1 block w-full rounded-[16px] px-3 py-2 text-left text-xs font-bold text-[#8A8A8A] hover:bg-[#F8EAD7]">Suivant</button>
                  </div>
                )}
              </div>
              <button type="button" title={theme === "dark" ? "Mode clair" : "Mode sombre"} onClick={toggleAdminTheme} className="hidden rounded-full border border-[#D8B87E]/30 bg-[#FFFDF8] p-3 text-[#211817] shadow-sm transition hover:-translate-y-0.5 sm:block"><Moon size={18} /></button>
              <div className="flex items-center gap-3 rounded-full bg-[#211817] px-3 py-2 text-sm font-bold text-[#FFF9EF] shadow-sm">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-[#D8B87E] text-[#211817]">{(user?.name || "A").slice(0, 1).toUpperCase()}</span>
                <span className="hidden sm:inline">{user?.name || "Admin"}</span>
              </div>
            </div>
          </div>
        </header>
        {palette && (
          <div className="fixed inset-0 z-[90] bg-black/50 p-4 backdrop-blur-sm" onClick={() => setPalette(false)}>
            <motion.div initial={{ opacity: 0, y: 18, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} className="parfum-panel mx-auto mt-24 max-w-2xl p-6" onClick={(e) => e.stopPropagation()}>
              <p className="parfum-eyebrow">Commandes rapides</p>
              <form onSubmit={submitSearch}>
                <input autoFocus value={search} onChange={(event) => setSearch(event.target.value)} className="parfum-field mt-4 py-4" placeholder="Rechercher un module..." />
              </form>
              <div className="mt-4 grid gap-2">
                {filteredCommands.map(({ to, label, Icon }) => (
                  <button key={to} type="button" onClick={() => goToCommand(to)} className="flex items-center gap-3 rounded-[18px] px-4 py-3 text-left text-sm font-bold text-[#211817] transition hover:bg-[#F8EAD7]">
                    <Icon size={18} className="text-[#B98D4B]" />
                    <span>{label}</span>
                  </button>
                ))}
                {!filteredCommands.length && <p className="rounded-[18px] bg-[#FFF8EE] px-4 py-3 text-sm font-bold text-[#8A8A8A]">Aucun module trouve.</p>}
              </div>
            </motion.div>
          </div>
        )}
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"><Outlet /></div>
      </main>
    </div>
  );
};
