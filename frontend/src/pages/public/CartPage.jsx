import { Link } from "react-router-dom";
import { Gift, ShieldCheck, Sparkles, Truck } from "lucide-react";
import { CartItem } from "../../components/cart/CartItem";
import { PageHeader } from "../../components/common/PageHeader";
import { EmptyState } from "../../components/common/EmptyState";
import { Button } from "../../components/ui/Button";
import { useAppStore } from "../../store/appStore";
import { formatPrice } from "../../utils/format";

export const CartPage = () => {
  const cart = useAppStore((state) => state.cart);
  const total = useAppStore((state) => state.cartTotal());
  return (
    <main className="pb-20">
      <PageHeader eyebrow="Panier" title="Votre selection" text="Ajustez vos quantites et finalisez la commande." image="https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=1800&q=90" />
      <div className="mx-auto -mt-8 grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8">
        <div className="space-y-4">{cart.length ? cart.map((item) => <CartItem key={item.id} item={item} />) : <EmptyState title="Panier vide" action={<Button as={Link} to="/shop">Voir la boutique</Button>} />}</div>
        <aside className="sticky top-28 h-fit rounded-[28px] border border-[#C8A96A]/35 bg-[#0B0B0F] p-7 text-white shadow-xl">
          <p className="text-sm text-white/60">Sous-total</p><p className="mt-2 text-4xl font-black text-[#D6B56D]">{formatPrice(total)}</p>
          <p className="mt-4 text-sm leading-6 text-white/60">Code promo, livraison et paiement seront confirmes au checkout.</p>
          <div className="mt-6 grid gap-3">
            {[
              [ShieldCheck, "Reservation securisee"],
              [Truck, "Livraison confirmee"],
              [Gift, "Cadeau possible"]
            ].map(([Icon, label]) => (
              <div key={label} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/7 px-4 py-3 text-sm font-bold text-white/75">
                <Icon className="text-[#D6B56D]" size={18} /> {label}
              </div>
            ))}
          </div>
          <Button as={Link} to="/checkout" className="mt-6 w-full">Commander</Button>
          <Button as={Link} to="/shop" variant="outline" className="mt-3 w-full text-white">Continuer mes achats</Button>
        </aside>
      </div>
      <section className="premium-shell mt-12">
        <div className="rounded-[32px] border border-black/10 bg-white/75 p-8 shadow-[0_28px_90px_rgba(17,19,24,0.08)] backdrop-blur-xl">
          <p className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.26em] text-brand-copper">
            <Sparkles size={14} /> Experience commande
          </p>
          <h2 className="mt-4 font-display text-4xl font-black">Un panier sobre, lisible et rassurant.</h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-brand-muted">Les quantites restent modifiables, le total est toujours visible et la validation WhatsApp garde le contact humain de la boutique.</p>
        </div>
      </section>
    </main>
  );
};
