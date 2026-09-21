import { ArrowUpRight, Heart, Menu, MessageCircle, ShoppingBag, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { useAppStore } from "../../store/appStore";
import { whatsappUrl } from "../../utils/format";
import { LanguageSwitch } from "../common/LanguageSwitch";
import { Logo } from "../common/Logo";

const nav = [
  ["/", "nav.home"],
  ["/shop", "nav.shop"],
  ["/collections", "nav.collections"],
  ["/brands", "nav.brands"],
  ["/about", "nav.about"],
  ["/contact", "nav.contact"]
];

// Les pages dont le haut est clair (fiche produit) ont un en-tête plein dès le départ.
const hasLightTop = (pathname) => /^\/shop\/.+/.test(pathname);

const IconLink = ({ to, label, count, children }) => (
  <Link to={to} aria-label={count ? `${label} (${count})` : label} className="relative grid h-11 w-11 place-items-center rounded-full transition hover:bg-brand-gold/15 hover:text-brand-gold">
    {children}
    {count > 0 && <span className="absolute -end-0.5 -top-0.5 grid min-w-[1.2rem] place-items-center rounded-full bg-brand-gold px-1 text-[0.66rem] font-extrabold leading-[1.2rem] text-brand-night">{count}</span>}
  </Link>
);

export const PublicLayout = () => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const cartCount = useAppStore((state) => state.cart.reduce((sum, line) => sum + line.quantity, 0));
  const favoritesCount = useAppStore((state) => state.favorites.length);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  const solid = scrolled || open || hasLightTop(pathname);
  const linkClass = ({ isActive }) => `relative py-2 text-sm font-semibold transition after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-center after:bg-brand-gold after:transition-transform ${isActive ? "text-brand-gold after:scale-x-100" : "after:scale-x-0 hover:text-brand-gold hover:after:scale-x-100"}`;

  return (
    <div className="min-h-screen bg-brand-ivory text-brand-ink">
      <a href="#main" className="sr-only z-[100] rounded-full bg-brand-gold px-4 py-2 text-sm font-bold text-brand-night focus:not-sr-only focus:fixed focus:start-4 focus:top-4">{t("nav.skip")}</a>

      <header className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${solid ? "bg-brand-ivory/95 text-brand-ink shadow-[0_1px_0_rgba(21,19,15,0.08)] backdrop-blur-md" : "bg-transparent text-white"}`}>
        <nav className="page-shell flex h-[4.5rem] items-center justify-between gap-4" aria-label="Navigation principale">
          <Link to="/" aria-label="Maison Parfumée" className="shrink-0"><Logo /></Link>
          <div className="hidden items-center gap-8 lg:flex">
            {nav.map(([to, key]) => <NavLink key={to} to={to} end={to === "/"} className={linkClass}>{t(key)}</NavLink>)}
          </div>
          <div className="flex items-center gap-1">
            <LanguageSwitch className={`me-1 hidden sm:inline-flex ${solid ? "border-brand-ink/20" : "border-white/25"}`} />
            <IconLink to="/favorites" label={t("nav.favorites")} count={favoritesCount}><Heart size={20} /></IconLink>
            <IconLink to="/cart" label={t("nav.cart")} count={cartCount}><ShoppingBag size={20} /></IconLink>
            <button type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? t("nav.close") : t("nav.menu")} className="grid h-11 w-11 place-items-center rounded-full transition hover:bg-brand-gold/15 lg:hidden">
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </nav>
        {open && (
          <div id="mobile-menu" className="page-shell pb-6 lg:hidden">
            <div className="grid gap-1 border-t border-brand-ink/10 pt-3">
              {nav.map(([to, key]) => (
                <NavLink key={to} to={to} end={to === "/"} className={({ isActive }) => `rounded-xl px-3 py-3 text-base font-semibold ${isActive ? "bg-brand-gold/15 text-brand-golddeep" : "hover:bg-brand-ink/5"}`}>{t(key)}</NavLink>
              ))}
              <NavLink to="/track-order" className="rounded-xl px-3 py-3 text-base font-semibold hover:bg-brand-ink/5">{t("nav.track")}</NavLink>
            </div>
            <div className="mt-4 flex items-center justify-between gap-3">
              <LanguageSwitch className="border-brand-ink/20" />
              <a href={whatsappUrl(t("contact.defaultMessage"))} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-whatsapp px-4 py-2.5 text-sm font-bold text-white"><MessageCircle size={17} /> WhatsApp</a>
            </div>
          </div>
        )}
      </header>

      <div id="main" tabIndex={-1} className="outline-none"><Outlet /></div>

      <a
        href={whatsappUrl(t("contact.defaultMessage"))}
        target="_blank"
        rel="noreferrer"
        aria-label={t("common.writeOnWhatsapp")}
        className="fixed bottom-5 end-5 z-40 inline-flex items-center gap-2 rounded-full bg-whatsapp px-4 py-3.5 text-sm font-bold text-white shadow-[0_16px_40px_-10px_rgba(31,168,85,0.7)] transition hover:-translate-y-0.5 hover:brightness-110"
      >
        <MessageCircle size={20} />
        <span className="hidden sm:inline">WhatsApp</span>
      </a>

      <footer className="bg-brand-night text-white/80">
        <div className="page-shell py-16">
          <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
            <div>
              <Logo className="text-white" />
              <p className="mt-6 max-w-sm text-sm leading-7 text-white/65">{t("footer.tagline")}</p>
              <a href={whatsappUrl(t("contact.defaultMessage"))} target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/25 px-5 py-3 text-sm font-bold text-white transition hover:border-brand-gold hover:text-brand-gold">
                <MessageCircle size={17} /> {t("common.writeOnWhatsapp")} <ArrowUpRight size={15} className="rtl:-scale-x-100" />
              </a>
            </div>
            <div>
              <h2 className="font-body text-xs font-bold uppercase tracking-[0.22em] text-brand-gold">{t("footer.shop")}</h2>
              <ul className="mt-5 grid gap-3 text-sm">
                <li><Link className="transition hover:text-brand-gold" to="/shop">{t("nav.shop")}</Link></li>
                <li><Link className="transition hover:text-brand-gold" to="/collections">{t("nav.collections")}</Link></li>
                <li><Link className="transition hover:text-brand-gold" to="/brands">{t("nav.brands")}</Link></li>
                <li><Link className="transition hover:text-brand-gold" to="/favorites">{t("nav.favorites")}</Link></li>
              </ul>
            </div>
            <div>
              <h2 className="font-body text-xs font-bold uppercase tracking-[0.22em] text-brand-gold">{t("footer.help")}</h2>
              <ul className="mt-5 grid gap-3 text-sm">
                <li><Link className="transition hover:text-brand-gold" to="/track-order">{t("nav.track")}</Link></li>
                <li><Link className="transition hover:text-brand-gold" to="/faq">{t("faq.title")}</Link></li>
                <li><Link className="transition hover:text-brand-gold" to="/about">{t("nav.about")}</Link></li>
                <li><Link className="transition hover:text-brand-gold" to="/contact">{t("nav.contact")}</Link></li>
              </ul>
            </div>
            <div>
              <h2 className="font-body text-xs font-bold uppercase tracking-[0.22em] text-brand-gold">{t("nav.language")}</h2>
              <div className="mt-5"><LanguageSwitch className="border-white/25" /></div>
              <ul className="mt-6 grid gap-2 text-sm text-white/65">
                <li>{t("footer.confirmation")}</li>
                <li>{t("footer.payments")}</li>
              </ul>
            </div>
          </div>
          <p className="mt-14 border-t border-white/10 pt-6 text-xs text-white/50">{t("footer.rights", { year: new Date().getFullYear() })}</p>
        </div>
      </footer>
    </div>
  );
};
