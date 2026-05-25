import { Award, BadgeCheck, PackageCheck, Send, ShieldCheck, Truck } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import CollectionCard from "../components/CollectionCard";
import HeroSection from "../components/HeroSection";
import PerfumeCard from "../components/PerfumeCard";
import LuxuryButton from "../components/LuxuryButton";
import SectionTitle from "../components/SectionTitle";
import WhatsAppButton from "../components/WhatsAppButton";

const benefits = [
  [Award, "Qualite garantie", "Fragrances selectionnees pour leur tenue et leur signature."],
  [PackageCheck, "Commande rapide", "Un parcours simple, clair et fluide."],
  [Send, "Confirmation WhatsApp", "Votre commande reste confirmee humainement."],
  [Truck, "Livraison disponible", "Organisation locale selon votre ville."],
  [BadgeCheck, "Prix transparents", "Pas de surprise avant validation finale."]
];

const Home = () => {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    api.get("/perfumes/featured/list").then(({ data }) => setFeatured(data)).catch(() => setFeatured([]));
  }, []);

  return (
    <>
      <HeroSection />

      <section className="container-page py-20">
        <SectionTitle eyebrow="Collections" title="Nos collections" text="Quatre univers pour choisir une fragrance avec intention: puissance, douceur, equilibre ou rarete." align="center" />
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <CollectionCard title="Parfums Homme" to="/catalogue?gender=Homme" image="https://images.unsplash.com/photo-1619994403073-2cec844b8e63?auto=format&fit=crop&w=900&q=85" />
          <CollectionCard title="Parfums Femme" to="/catalogue?gender=Femme" image="https://images.unsplash.com/photo-1615634260167-c8cdede054de?auto=format&fit=crop&w=900&q=85" />
          <CollectionCard title="Parfums Mixte" to="/catalogue?gender=Mixte" image="https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?auto=format&fit=crop&w=900&q=85" />
          <CollectionCard title="Collections Premium" to="/catalogue?category=Luxe" image="https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=900&q=85" />
        </div>
      </section>

      <section className="container-page py-16">
        <div className="flex items-end justify-between gap-4">
          <SectionTitle eyebrow="Selection" title="Parfums populaires" text="Une vitrine courte de fragrances choisies pour leur caractere, leur tenue et leur elegance." />
          <Link to="/catalogue" className="hidden text-sm font-bold text-gold sm:block">Tout voir</Link>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.length ? featured.map((perfume) => <PerfumeCard key={perfume._id} perfume={perfume} />) : <p className="text-ink/60">Aucun parfum populaire pour le moment.</p>}
        </div>
      </section>

      <section className="bg-beige py-20">
        <div className="container-page grid items-center gap-10 lg:grid-cols-2">
          <div className="overflow-hidden rounded-[32px] shadow-luxury">
            <img src="https://images.unsplash.com/photo-1608528577891-eb055944f2e7?auto=format&fit=crop&w=1100&q=85" alt="Experience olfactive" className="h-full min-h-[520px] w-full object-cover" />
          </div>
          <div>
            <SectionTitle eyebrow="Experience" title="Une experience olfactive unique" text="Chaque parfum est selectionne pour son caractere, sa tenue et son elegance. Notre objectif est simple: vous aider a trouver une signature qui vous ressemble vraiment." />
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {[ShieldCheck, Award].map((Icon, index) => (
                <div key={index} className="glass-panel p-5">
                  <Icon className="text-gold" />
                  <p className="mt-4 font-bold">{index === 0 ? "Selection exigeante" : "Presentation raffinee"}</p>
                </div>
              ))}
            </div>
            <LuxuryButton as={Link} to="/catalogue" className="mt-8">Explorer les parfums</LuxuryButton>
          </div>
        </div>
      </section>

      <section className="container-page py-16">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {benefits.map(([Icon, label, text]) => (
            <div key={label} className="panel p-6">
              <Icon className="text-gold" />
              <h3 className="mt-5 font-bold">{label}</h3>
              <p className="mt-3 text-sm leading-6 text-elegantgray">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-page pb-20">
        <div className="luxury-gradient rounded-[32px] border border-gold/25 p-8 text-white shadow-luxury md:p-12">
          <div className="glass-panel bg-white/10 p-8 text-white">
            <p className="text-xs font-extrabold uppercase tracking-[0.35em] text-lightgold">Commande</p>
            <h2 className="mt-3 text-4xl font-black leading-tight text-white sm:text-5xl">Vous avez trouve votre signature olfactive ?</h2>
            <p className="mt-5 max-w-2xl leading-8 text-white/70">Confirmez votre commande directement sur WhatsApp avec un message prepare automatiquement.</p>
            <div className="gold-divider mt-6" />
            <div className="mt-8">
              <WhatsAppButton href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER || "212600000000"}`} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
