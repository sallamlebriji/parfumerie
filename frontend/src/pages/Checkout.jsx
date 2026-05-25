import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import CheckoutForm from "../components/CheckoutForm";
import EditorialPageHero from "../components/EditorialPageHero";
import EmptyState from "../components/EmptyState";
import LuxuryButton from "../components/LuxuryButton";
import OrderSummary from "../components/OrderSummary";
import { useCart } from "../context/CartContext";

const Checkout = () => {
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({ customerName: "", phone: "", address: "", city: "", notes: "" });
  const [error, setError] = useState("");

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      const payload = {
        ...form,
        products: items.map((item) => ({ perfumeId: item._id, quantity: item.quantity }))
      };
      const { data } = await api.post("/orders", payload);
      const order = data.order || data;
      const lines = order.products.map((item, index) => `${index + 1}. ${item.name} - ${item.volume} - Quantite : ${item.quantity} - Prix : ${item.price * item.quantity} DH`).join("\n");
      const message = `Bonjour, je souhaite confirmer cette commande :\n\nNom : ${order.customerName}\nTelephone : ${order.phone}\nAdresse : ${order.address}, ${order.city}\n\nCommande :\n${lines}\n\nTotal : ${order.totalAmount} DH\n\nMerci de confirmer la disponibilite.`;
      const whatsappUrl = `https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
      clearCart();
      window.open(whatsappUrl, "_blank");
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Impossible d'enregistrer la commande.");
    }
  };

  if (!items.length) {
    return <main className="container-page py-32"><EmptyState title="Votre panier est vide" action={<LuxuryButton as={Link} to="/catalogue">Voir les parfums</LuxuryButton>} /></main>;
  }

  return (
    <main className="pb-24">
      <EditorialPageHero
        eyebrow="Commande"
        title="Confirmation WhatsApp"
        text="Apres validation, votre commande sera enregistree puis envoyee automatiquement sur WhatsApp pour confirmation."
        image="https://images.unsplash.com/photo-1608528577891-eb055944f2e7?auto=format&fit=crop&w=1800&q=90"
        meta="Un message detaille sera prepare avec vos informations, produits, quantites et total."
      />
      <div className="container-page -mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
        <CheckoutForm form={form} update={update} submit={submit} error={error} />
        <OrderSummary items={items} total={total} checkout />
      </div>
    </main>
  );
};

export default Checkout;
