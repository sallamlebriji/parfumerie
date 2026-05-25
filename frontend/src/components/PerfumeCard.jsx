import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { uploadsUrl } from "../api/axios";
import { useCart } from "../context/CartContext";
import LuxuryButton from "./LuxuryButton";

const imageSrc = (image) => {
  if (!image) return "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=900&q=80";
  if (image.startsWith("http")) return image;
  return `${uploadsUrl}${image.replace("/uploads", "")}`;
};

const PerfumeCard = ({ perfume }) => {
  const { addToCart } = useCart();

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      whileHover={{ y: -8 }}
      className="group overflow-hidden rounded-[24px] border border-gold/10 bg-white shadow-soft transition-all duration-300 hover:shadow-luxury"
    >
      <Link to={`/parfums/${perfume._id}`} className="relative block h-[280px] overflow-hidden bg-beige">
        <img src={imageSrc(perfume.image)} alt={perfume.name} className="h-full w-full object-cover transition duration-700 group-hover:scale-110" />
        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          <span className={perfume.isAvailable ? "badge-gold bg-white/90" : "rounded-full bg-ink px-3 py-1 text-xs font-bold uppercase tracking-wide text-white"}>{perfume.isAvailable ? "Disponible" : "Rupture"}</span>
          <span className="badge-soft bg-white/85">{perfume.category}</span>
        </div>
      </Link>
      <div className="p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.25em] text-gold">{perfume.brand}</p>
            <h3 className="mt-2 text-2xl font-black leading-tight">{perfume.name}</h3>
          </div>
          <span className="rounded-full bg-beige px-3 py-1 text-xs font-bold">{perfume.volume}</span>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-semibold text-elegantgray">
          <span>{perfume.gender}</span>
          <span>|</span>
          <span>Stock {perfume.stock}</span>
        </div>
        <div className="mt-5 flex items-center justify-between">
          <p className="text-2xl font-extrabold">{perfume.price} DH</p>
          {perfume.oldPrice > 0 && <p className="text-sm text-ink/40 line-through">{perfume.oldPrice} DH</p>}
        </div>
        <div className="mt-6 grid gap-2 sm:grid-cols-2">
          <LuxuryButton as={Link} to={`/parfums/${perfume._id}`} variant="gold" className="w-full px-4 py-2.5">Voir details</LuxuryButton>
          <button className="rounded-full border border-ink/10 px-4 py-2.5 text-sm font-bold text-ink/70 transition hover:border-gold hover:text-ink" disabled={!perfume.isAvailable} onClick={() => addToCart(perfume)}>
            <span className="inline-flex items-center justify-center gap-2"><ShoppingBag size={16} /> Ajouter</span>
          </button>
        </div>
      </div>
    </motion.article>
  );
};

export default PerfumeCard;
