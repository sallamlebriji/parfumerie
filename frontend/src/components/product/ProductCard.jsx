import { Heart, Plus, Search } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { PriceTag } from "./PriceTag";
import { RatingStars } from "./RatingStars";
import { useAppStore } from "../../store/appStore";

export const ProductCard = ({ product, onQuickView }) => {
  const addToCart = useAppStore((state) => state.addToCart);
  const toggleWishlist = useAppStore((state) => state.toggleWishlist);

  const handleCart = () => {
    addToCart(product);
    toast.success(`${product.name} ajoute au panier`);
  };

  return (
    <motion.article initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} whileHover={{ y: -10 }} className="group overflow-hidden rounded-[26px] border border-[#B68A35]/15 bg-white shadow-[0_22px_65px_rgba(17,24,39,0.08)] transition duration-300 hover:shadow-[0_35px_90px_rgba(17,24,39,0.16)]">
      <div className="relative h-72 overflow-hidden bg-[#E9DDC7]">
        <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover transition duration-700 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/36 via-transparent to-transparent opacity-70" />
        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          <Badge>{product.badge}</Badge>
          {product.stock <= 0 ? <Badge tone="red">Rupture</Badge> : <Badge tone="green">Disponible</Badge>}
        </div>
        <div className="absolute right-4 top-4 flex flex-col gap-2 opacity-0 transition group-hover:opacity-100">
          <button className="rounded-full bg-white/90 p-3 shadow" onClick={() => toggleWishlist(product.id)}><Heart size={17} /></button>
          <button className="rounded-full bg-white/90 p-3 shadow" onClick={() => onQuickView?.(product)}><Search size={17} /></button>
        </div>
      </div>
      <div className="p-6">
        <p className="text-xs font-extrabold uppercase tracking-[0.28em] text-[#8A6230]">{product.brand}</p>
        <Link to={`/shop/${product.id}`} className="mt-2 block font-title text-2xl font-black leading-tight hover:text-[#C8A96A]">{product.name}</Link>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#8A8A8A]">{product.shortDescription}</p>
        <div className="mt-4"><RatingStars value={product.rating} /></div>
        <div className="mt-4 flex items-center justify-between gap-3">
          <PriceTag price={product.price} oldPrice={product.oldPrice} />
          <span className="rounded-full bg-[#E9DDC7]/70 px-3 py-1 text-xs font-bold">{product.volume}</span>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-2">
          <Button as={Link} to={`/shop/${product.id}`} variant="outline" className="w-full px-3 py-2.5">Details</Button>
          <Button variant="primary" className="w-full px-3 py-2.5" onClick={handleCart}><Plus size={16} /> Panier</Button>
        </div>
      </div>
    </motion.article>
  );
};
