import { Link } from "react-router-dom";
import WhatsAppButton from "./WhatsAppButton";

const Footer = () => (
  <footer className="relative mt-20 overflow-hidden border-t border-gold/20 bg-ink text-white">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_18%,rgba(201,162,39,0.22),transparent_30rem)]" />
    <div className="absolute -left-20 top-16 hidden h-72 w-72 rounded-full border border-gold/10 lg:block" />
    <div className="container-page relative py-14">
      <div className="grid gap-8 rounded-[34px] border border-gold/25 bg-white/10 p-8 backdrop-blur-xl lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.3em] text-lightgold">Maison Parfumee</p>
          <h2 className="mt-3 max-w-3xl text-4xl font-black leading-tight">Une fragrance choisie avec soin, confirmee avec simplicite.</h2>
        </div>
        <WhatsAppButton href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER || "212600000000"}`}>Commander sur WhatsApp</WhatsAppButton>
      </div>

      <div className="mt-12 grid gap-10 md:grid-cols-4">
        <div>
          <h3 className="font-title text-3xl font-black text-lightgold">Maison Parfumee</h3>
          <p className="mt-4 text-sm leading-7 text-white/62">Parfums elegants, selection premium, commande simple et confirmation finale sur WhatsApp.</p>
        </div>
        <div>
          <h4 className="font-semibold text-white">Navigation</h4>
          <div className="mt-4 grid gap-3 text-sm text-white/62">
            <Link className="hover:text-lightgold" to="/catalogue">Catalogue</Link>
            <Link className="hover:text-lightgold" to="/a-propos">A propos</Link>
            <Link className="hover:text-lightgold" to="/contact">Contact</Link>
          </div>
        </div>
        <div>
          <h4 className="font-semibold text-white">Avantages</h4>
          <p className="mt-4 text-sm leading-7 text-white/62">Livraison disponible, qualite garantie, prix transparents et suivi humain.</p>
        </div>
        <div>
          <h4 className="font-semibold text-white">Contact</h4>
          <p className="mt-4 text-sm leading-7 text-white/62">Casablanca, Maroc<br />WhatsApp: +212 600 000 000</p>
        </div>
      </div>
      <div className="mt-10 border-t border-white/10 pt-6 text-xs font-semibold uppercase tracking-[0.22em] text-white/35">
        Maison Parfumee - Boutique digitale de parfumerie
      </div>
    </div>
  </footer>
);

export default Footer;
