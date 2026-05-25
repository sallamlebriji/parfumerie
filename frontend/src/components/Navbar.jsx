import { MessageCircle, Menu, ShoppingBag, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext";

const links = [
  ["Accueil", "/"],
  ["Parfums", "/catalogue"],
  ["Collections", "/catalogue?category=Luxe"],
  ["A propos", "/a-propos"],
  ["Contact", "/contact"],
  ["Admin", "/admin/login"]
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { items } = useCart();
  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  const whatsapp = `https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER || "212600000000"}`;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${scrolled || open ? "border-b border-ink/10 bg-ivory/95 text-ink shadow-soft backdrop-blur-xl" : "bg-transparent text-white"}`}>
      <nav className="container-page flex h-20 items-center justify-between">
        <Link to="/" className="font-title text-2xl font-black tracking-wide">Maison Parfumee</Link>
        <div className="hidden items-center gap-8 md:flex">
          {links.map(([label, to]) => (
            <NavLink key={to} to={to} className={({ isActive }) => `nav-underline text-sm font-bold transition ${isActive ? "text-gold" : "hover:text-gold"}`}>
              {label}
            </NavLink>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <a href={whatsapp} target="_blank" rel="noreferrer" className="hidden rounded-full bg-whatsapp px-4 py-2 text-sm font-bold text-white transition hover:-translate-y-0.5 sm:inline-flex sm:items-center sm:gap-2">
            <MessageCircle size={17} /> WhatsApp
          </a>
          <Link to="/panier" className={`relative rounded-full border p-3 transition hover:border-gold hover:bg-gold hover:text-ink ${scrolled || open ? "border-ink/10" : "border-white/25"}`} aria-label="Panier">
            <ShoppingBag size={19} />
            {count > 0 && <span className="absolute -right-1 -top-1 rounded-full bg-gold px-2 py-0.5 text-xs font-bold text-white">{count}</span>}
          </Link>
          <button className={`rounded-full border p-3 md:hidden ${scrolled || open ? "border-ink/10" : "border-white/25"}`} onClick={() => setOpen((value) => !value)} aria-label="Menu">
            {open ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
      </nav>
      {open && (
        <div className="container-page border-t border-ink/10 bg-ivory py-4 text-ink md:hidden">
          {links.map(([label, to]) => (
            <NavLink key={to} to={to} onClick={() => setOpen(false)} className="block py-3 text-sm font-semibold">
              {label}
            </NavLink>
          ))}
        </div>
      )}
    </header>
  );
};

export default Navbar;
