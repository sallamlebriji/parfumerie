import { ArrowUpRight, PackageCheck, ShieldCheck, ShoppingBag, Truck } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api, { uploadsUrl } from "../api/axios";
import LoadingSpinner from "../components/LoadingSpinner";
import PerfumeCard from "../components/PerfumeCard";
import SectionTitle from "../components/SectionTitle";
import WhatsAppButton from "../components/WhatsAppButton";
import { useCart } from "../context/CartContext";

const imageSrc = (image) => {
  if (!image) return "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=900&q=80";
  if (image.startsWith("http")) return image;
  return `${uploadsUrl}${image.replace("/uploads", "")}`;
};

const PerfumeDetails = () => {
  const { id } = useParams();
  const [perfume, setPerfume] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    api.get(`/perfumes/${id}`).then(({ data }) => setPerfume(data));
    api.get("/perfumes").then(({ data }) => setSimilar(data.filter((p) => p._id !== id).slice(0, 4)));
  }, [id]);

  if (!perfume) return <main className="container-page py-32"><LoadingSpinner /></main>;

  const whatsAppMessage = encodeURIComponent(`Bonjour, je souhaite commander:\n\n${perfume.name} - ${perfume.volume} - Quantite : ${quantity} - Prix : ${perfume.price * quantity} DH\n\nMerci de confirmer la disponibilite.`);
  const whatsAppUrl = `https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER}?text=${whatsAppMessage}`;

  return (
    <main className="pb-24">
      <section className="relative overflow-hidden bg-ink pt-28 text-white">
        <img src={imageSrc(perfume.image)} alt="" className="absolute inset-0 h-full w-full object-cover opacity-20 blur-sm" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_76%_20%,rgba(201,162,39,0.22),transparent_30rem),linear-gradient(115deg,rgba(0,0,0,0.96),rgba(11,11,11,0.86),rgba(21,21,21,0.62))]" />
        <div className="absolute right-0 top-20 hidden text-[10vw] font-black leading-none text-white/[0.025] lg:block">ESSENCE</div>
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-ivory to-transparent" />
        <div className="container-page relative grid min-h-[620px] items-center gap-10 pb-20 lg:grid-cols-[0.92fr_1.08fr]">
        <div className="relative">
          <div className="absolute -left-5 top-8 z-10 rounded-full border border-gold/30 bg-ink/75 px-4 py-3 text-xs font-extrabold uppercase tracking-[0.25em] text-lightgold backdrop-blur [writing-mode:vertical-rl]">Signature</div>
          <div className="glass-panel overflow-hidden bg-white/10 p-4">
            <img src={imageSrc(perfume.image)} alt={perfume.name} className="h-[560px] w-full rounded-[24px] object-cover" />
          </div>
        </div>
        <div>
          <p className="text-sm font-extrabold uppercase tracking-[0.35em] text-lightgold">{perfume.brand}</p>
          <h1 className="mt-4 text-5xl font-black leading-[0.98] sm:text-7xl">{perfume.name}</h1>
          <p className="mt-6 max-w-2xl leading-8 text-white/70">{perfume.description}</p>
          <p className="mt-6 font-title text-5xl font-black text-lightgold">{perfume.price} DH</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Info label="Prix" value={`${perfume.price} DH`} />
            <Info label="Volume" value={perfume.volume} />
            <Info label="Genre" value={perfume.gender} />
            <Info label="Stock" value={`${perfume.stock} piece(s)`} />
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <Note title="Note de tete" value={perfume.notes?.top || "-"} />
            <Note title="Note de coeur" value={perfume.notes?.middle || "-"} />
            <Note title="Note de fond" value={perfume.notes?.base || "-"} />
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <input className="field w-28" type="number" min="1" value={quantity} onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))} />
            <button className="btn-gold" onClick={() => addToCart(perfume, quantity)}><ShoppingBag size={18} /> Ajouter au panier <ArrowUpRight size={17} /></button>
            <WhatsAppButton href={whatsAppUrl}>Commander via WhatsApp</WhatsAppButton>
          </div>
        </div>
      </div>
      </section>
      <div className="container-page">
      <section className="mt-20">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="panel p-7 lg:col-span-2">
            <SectionTitle eyebrow="Details" title="Description & conseils" text="Appliquez le parfum sur les points de pulsation: cou, poignets et derriere les oreilles. Pour une meilleure tenue, evitez de frotter apres application." />
            <p className="mt-6 leading-8 text-elegantgray">{perfume.description}</p>
          </div>
          <div className="grid gap-4">
            {[
              [Truck, "Livraison", "Disponibilite et livraison confirmees sur WhatsApp."],
              [PackageCheck, "Confirmation", "Votre commande est enregistree avant l'ouverture WhatsApp."],
              [ShieldCheck, "Garanties", "Selection controlee, prix clair et suivi humain."]
            ].map(([Icon, title, text]) => (
              <div key={title} className="glass-panel p-5">
                <Icon className="text-gold" />
                <h3 className="mt-4 font-bold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-elegantgray">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="mt-20">
        <SectionTitle eyebrow="Suggestions" title="Vous aimerez aussi" text="Quelques parfums proches pour continuer l'exploration." />
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {similar.map((item) => <PerfumeCard key={item._id} perfume={item} />)}
        </div>
      </section>
      </div>
    </main>
  );
};

const Info = ({ label, value }) => (
  <div className="rounded-[20px] border border-gold/20 bg-white/10 p-5 shadow-soft backdrop-blur">
    <p className="text-xs font-bold uppercase tracking-widest text-white/45">{label}</p>
    <p className="mt-2 font-bold text-white">{value}</p>
  </div>
);

const Note = ({ title, value }) => (
  <div className="rounded-[20px] border border-gold/20 bg-white/10 p-5 backdrop-blur">
    <p className="text-xs font-extrabold uppercase tracking-widest text-gold">{title}</p>
    <p className="mt-3 text-sm font-semibold leading-6 text-white/75">{value}</p>
  </div>
);

export default PerfumeDetails;
