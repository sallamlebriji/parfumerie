import { ArrowRight, Globe, Menu, MessageCircle, ShoppingBag, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, NavLink, Outlet } from "react-router-dom";
import i18n from "../../i18n";
import { useAppStore } from "../../store/appStore";
import { Button } from "../ui/Button";

const nav = [
  ["/", "home"],
  ["/shop", "shop"],
  ["/collections", "collections"],
  ["/brands", "brands"],
  ["/about", "A propos"],
  ["/contact", "Contact"]
];

export const PublicLayout = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { t } = useTranslation();
  const cart = useAppStore((state) => state.cart);
  const whatsapp = `https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER || ""}?text=${encodeURIComponent("Bonjour, je souhaite commander un parfum.")}`;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const switchLang = () => {
    const next = i18n.language === "fr" ? "en" : i18n.language === "en" ? "ar" : "fr";
    i18n.changeLanguage(next);
    document.documentElement.dir = next === "ar" ? "rtl" : "ltr";
  };

  return (
    <div className="min-h-screen bg-brand-ivory text-brand-ink">
      <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${scrolled || open ? "border-b border-black/10 bg-white/86 text-brand-ink shadow-[0_18px_55px_rgba(15,23,42,0.08)] backdrop-blur-2xl" : "border-b border-white/10 bg-brand-night/40 text-white backdrop-blur-xl"}`}>
        <nav className="premium-shell flex h-20 items-center justify-between">
          <Link to="/" className="group flex items-center gap-3">
            <span className={`grid h-11 w-11 place-items-center rounded-2xl border text-sm font-black transition ${scrolled || open ? "border-brand-gold/30 bg-brand-ink text-brand-gold" : "border-white/20 bg-white/10 text-brand-gold"}`}>MP</span>
            <span className="font-display text-xl font-black tracking-[-0.03em] sm:text-2xl">Maison Parfumee</span>
          </Link>
          <div className="hidden items-center gap-7 lg:flex">
            {nav.map(([to, label]) => <NavLink key={to} to={to} className={({ isActive }) => `relative text-sm font-extrabold transition after:absolute after:-bottom-2 after:left-0 after:h-px after:bg-brand-gold after:transition-all after:duration-300 hover:text-brand-gold ${isActive ? "text-brand-gold after:w-full" : "after:w-0 hover:after:w-full"}`}>{t(label, label)}</NavLink>)}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={switchLang} className="rounded-full border border-current/15 p-3 transition hover:border-brand-gold hover:text-brand-gold" aria-label="Changer la langue"><Globe size={18} /></button>
            <Link to="/cart" className="relative rounded-full border border-current/15 p-3 transition hover:border-brand-gold hover:text-brand-gold" aria-label="Panier">
              <ShoppingBag size={18} />
              {cart.length > 0 && <span className="absolute -right-1 -top-1 rounded-full bg-brand-gold px-2 py-0.5 text-xs font-black text-brand-ink">{cart.length}</span>}
            </Link>
            <Button as={Link} to="/checkout" className="hidden sm:inline-flex">{t("orderNow")}</Button>
            <button onClick={() => setOpen((value) => !value)} className="rounded-full border border-current/15 p-3 lg:hidden" aria-label="Menu">{open ? <X size={18} /> : <Menu size={18} />}</button>
          </div>
        </nav>
        {open && <div className="premium-shell grid gap-2 pb-5 lg:hidden">{nav.map(([to, label]) => <NavLink key={to} to={to} onClick={() => setOpen(false)} className="rounded-2xl px-4 py-3 text-sm font-bold hover:bg-black/5">{t(label, label)}</NavLink>)}</div>}
      </header>
      <Outlet />
      <a
        href={whatsapp}
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full bg-whatsapp px-5 py-4 text-sm font-black text-white shadow-[0_22px_65px_rgba(37,211,102,0.34)] transition hover:-translate-y-1 hover:brightness-95"
        aria-label="Commander via WhatsApp"
      >
        <MessageCircle size={19} />
        <span className="hidden sm:inline">WhatsApp</span>
      </a>
      <footer className="relative overflow-hidden bg-brand-ink text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_18%,rgba(215,181,109,0.22),transparent_30rem)]" />
        <div className="premium-shell relative py-16">
          <div className="grid gap-8 rounded-[34px] border border-white/10 bg-white/8 p-8 backdrop-blur-xl lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.3em] text-brand-gold">Maison Parfumee</p>
              <h2 className="mt-3 max-w-3xl font-display text-4xl font-black leading-tight tracking-[-0.04em]">Une boutique digitale de parfumerie premium, claire et commerciale.</h2>
            </div>
            <Button as={Link} to="/shop" className="bg-white text-brand-ink hover:bg-brand-gold">Explorer <ArrowRight size={17} /></Button>
          </div>
          <div className="mt-10 grid gap-8 md:grid-cols-4">
            {["Catalogue", "Collections", "Marques", "Contact"].map((item) => <div key={item}><h4 className="font-display font-black">{item}</h4><p className="mt-3 text-sm leading-7 text-white/58">Experience luxe, commande simple et suivi WhatsApp.</p></div>)}
          </div>
          <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 text-sm text-white/52 sm:flex-row sm:items-center sm:justify-between">
            <p>© 2026 Maison Parfumee. Tous droits reserves.</p>
            <p>React, Tailwind, Framer Motion et GSAP.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
