import { motion } from "framer-motion";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import LuxuryButton from "../components/LuxuryButton";
import WhatsAppButton from "../components/WhatsAppButton";

const HeroSection = () => (
  <section className="relative min-h-[94vh] overflow-hidden bg-ink text-white">
    <img className="absolute inset-0 h-full w-full object-cover opacity-35" src="https://images.unsplash.com/photo-1590736704728-f4730bb30770?auto=format&fit=crop&w=1900&q=90" alt="Parfumerie haut de gamme" />
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_28%,rgba(201,162,39,0.28),transparent_30rem),linear-gradient(115deg,rgba(0,0,0,0.95)_0%,rgba(11,11,11,0.82)_46%,rgba(21,21,21,0.56)_100%)]" />
    <div className="absolute -left-24 top-28 hidden h-[420px] w-[420px] rounded-full border border-gold/10 lg:block" />
    <div className="absolute right-0 top-24 hidden text-[13vw] font-black leading-none text-white/[0.025] lg:block">EAU</div>
    <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-ivory to-transparent" />

    <div className="container-page relative grid min-h-[94vh] items-center gap-12 pt-28 lg:grid-cols-[1.04fr_0.96fr]">
      <motion.div initial={{ opacity: 0, y: 34 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: "easeOut" }} className="pb-10">
        <span className="inline-flex items-center gap-2 rounded-full border border-gold/35 bg-white/10 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.28em] text-lightgold backdrop-blur">
          <Sparkles size={14} /> Edition signature 2026
        </span>
        <h1 className="mt-7 max-w-4xl text-5xl font-black leading-[0.95] sm:text-7xl lg:text-[92px]">
          La fragrance qui signe votre presence
        </h1>
        <p className="mt-7 max-w-xl text-lg leading-8 text-white/72">
          Une selection de parfums raffines, pensee comme une garde-robe olfactive: precise, elegante et memorable.
        </p>
        <div className="mt-9 flex flex-wrap gap-3">
          <LuxuryButton as={Link} to="/catalogue" variant="gold">Explorer la collection <ArrowUpRight size={17} /></LuxuryButton>
          <WhatsAppButton href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER || "212600000000"}`}>Commander sur WhatsApp</WhatsAppButton>
        </div>
        <div className="mt-12 grid max-w-2xl gap-3 sm:grid-cols-3">
          {[
            ["40+", "references selectionnees"],
            ["24h", "reponse WhatsApp"],
            ["100%", "prix transparents"]
          ].map(([value, label]) => (
            <div key={label} className="border-l border-gold/35 pl-4">
              <p className="font-title text-3xl font-black text-lightgold">{value}</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-white/55">{label}</p>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, scale: 0.96, x: 26 }} animate={{ opacity: 1, scale: 1, x: 0 }} transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }} className="relative hidden lg:block">
        <div className="absolute -left-8 top-16 z-10 rounded-full border border-gold/30 bg-ink/70 px-5 py-3 text-xs font-extrabold uppercase tracking-[0.28em] text-lightgold backdrop-blur-xl [writing-mode:vertical-rl]">
          Maison fragrance
        </div>
        <div className="relative ml-auto max-w-[520px] rounded-[42px] border border-gold/25 bg-white/[0.07] p-5 shadow-[0_45px_120px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
          <div className="overflow-hidden rounded-[34px] bg-beige">
            <img src="https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1000&q=90" alt="Flacon parfum premium" className="h-[580px] w-full object-cover" />
          </div>
          <div className="absolute -bottom-8 left-8 right-8 rounded-[28px] border border-gold/25 bg-ink/82 p-5 shadow-luxury backdrop-blur-xl">
            <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-lightgold">Selection du moment</p>
            <div className="mt-3 flex items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black">Noir Imperial</h2>
                <p className="mt-1 text-sm text-white/58">Ambre, cedre, vetiver</p>
              </div>
              <p className="text-2xl font-black text-lightgold">540 DH</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

export default HeroSection;
