import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { MessageCircle, ReceiptText, ShieldCheck } from "lucide-react";
import { CheckoutForm } from "../../components/forms/CheckoutForm";
import { PageHeader } from "../../components/common/PageHeader";
import { useAppStore } from "../../store/appStore";
import { formatPrice } from "../../utils/format";

export const CheckoutPage = () => {
  const cart = useAppStore((state) => state.cart);
  const total = useAppStore((state) => state.cartTotal());
  const clearCart = useAppStore((state) => state.clearCart);
  const navigate = useNavigate();
  const submit = (values) => {
    const lines = cart.map((item, index) => `${index + 1}. ${item.name} - ${item.volume} x ${item.quantity} - ${formatPrice(item.price * item.quantity)}`).join("\n");
    const message = `Bonjour, je souhaite confirmer cette commande :\n\nNom : ${values.fullName}\nTelephone : ${values.phone}\nAdresse : ${values.address}, ${values.city}\n\nCommande :\n${lines}\n\nTotal : ${formatPrice(total)}\n\nMerci de confirmer la disponibilite.`;
    window.open(`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank");
    clearCart();
    toast.success("Commande preparee");
    navigate("/order-success");
  };
  return (
    <main className="pb-20">
      <PageHeader eyebrow="Checkout" title="Finaliser la commande" text="Vos informations, livraison, paiement et recapitulation." image="https://images.unsplash.com/photo-1608528577891-eb055944f2e7?auto=format&fit=crop&w=1800&q=90" />
      <div className="mx-auto -mt-8 grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_380px] lg:px-8">
        <CheckoutForm onSubmit={submit} />
        <aside className="sticky top-28 h-fit rounded-[28px] bg-[#0B0B0F] p-7 text-white shadow-[0_28px_90px_rgba(17,19,24,0.2)]">
          <ReceiptText className="text-[#D6B56D]" size={26} />
          <h2 className="mt-4 font-title text-3xl font-black">Recapitulatif</h2>
          <div className="mt-5">{cart.map((item) => <p key={item.id} className="flex justify-between gap-4 py-2 text-sm text-white/70"><span>{item.name} x {item.quantity}</span><span>{formatPrice(item.price * item.quantity)}</span></p>)}</div>
          <div className="my-5 h-px bg-white/10" />
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-white/45">Total</p>
          <p className="mt-2 text-3xl font-black text-[#D6B56D]">{formatPrice(total)}</p>
          <div className="mt-6 grid gap-3 text-sm text-white/68">
            <p className="flex items-center gap-3"><MessageCircle className="text-[#D6B56D]" size={18} /> Confirmation WhatsApp automatique</p>
            <p className="flex items-center gap-3"><ShieldCheck className="text-[#D6B56D]" size={18} /> Donnees utilisees pour la commande</p>
          </div>
        </aside>
      </div>
    </main>
  );
};
