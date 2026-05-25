import { ArrowRight, BadgeCheck, Droplets, MessageCircle, ShieldCheck, ShoppingBag, Sparkles, Truck } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { catalogService } from "../../services/catalogService";
import { products as fallbackProducts } from "../../data/products";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { PriceTag } from "../../components/product/PriceTag";
import { RatingStars } from "../../components/product/RatingStars";
import { ProductGrid } from "../../components/product/ProductGrid";
import { useAppStore } from "../../store/appStore";

export const ProductDetailPage = () => {
  const { id } = useParams();
  const { data: remoteProduct } = useQuery({ queryKey: ["product", id], queryFn: () => catalogService.product(id), retry: 1 });
  const { data: remoteProducts = [] } = useQuery({ queryKey: ["products"], queryFn: catalogService.products, retry: 1 });
  const addToCart = useAppStore((state) => state.addToCart);
  const products = remoteProducts.length ? remoteProducts : fallbackProducts;
  const product = remoteProduct || fallbackProducts.find((item) => item.id === id);
  if (!product) return null;
  const similar = products.filter((item) => item.id !== product.id && item.family === product.family).slice(0, 4);
  const add = () => { addToCart(product); toast.success("Ajoute au panier"); };
  const whatsapp = `https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER}?text=${encodeURIComponent(`Bonjour, je souhaite commander ${product.name} - ${product.volume}`)}`;

  return (
    <main className="pb-20">
      <section className="relative overflow-hidden bg-[#0B0B0F] pt-28 text-white">
        <img src={product.images[0]} alt="" className="absolute inset-0 h-full w-full object-cover opacity-20 blur-sm" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_76%_20%,rgba(200,169,106,0.22),transparent_30rem),linear-gradient(115deg,rgba(0,0,0,0.96),rgba(11,11,15,0.86),rgba(31,41,55,0.62))]" />
        <div className="relative mx-auto grid min-h-[660px] max-w-7xl items-center gap-10 px-4 pb-20 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="rounded-[42px] border border-[#C8A96A]/25 bg-white/[0.08] p-5 backdrop-blur-2xl"><img src={product.images[0]} alt={product.name} className="h-[560px] w-full rounded-[34px] object-cover" /></div>
          <div>
            <Badge>{product.category}</Badge>
            <h1 className="mt-5 font-title text-6xl font-black leading-[0.98]">{product.name}</h1>
            <p className="mt-3 text-[#D6B56D]">{product.brand}</p>
            <div className="mt-5"><RatingStars value={product.rating} /></div>
            <div className="mt-6"><PriceTag price={product.price} oldPrice={product.oldPrice} /></div>
            <p className="mt-6 max-w-2xl leading-8 text-white/70">{product.description}</p>
            <div className="mt-7 grid gap-3 sm:grid-cols-3">{["top", "middle", "base"].map((key) => <div key={key} className="rounded-[20px] border border-[#C8A96A]/20 bg-white/10 p-5"><p className="text-xs font-bold uppercase tracking-widest text-[#D6B56D]">{key === "top" ? "Tete" : key === "middle" ? "Coeur" : "Fond"}</p><p className="mt-2 text-sm text-white/75">{product.notes[key]}</p></div>)}</div>
            <div className="mt-8 flex flex-wrap gap-3"><Button onClick={add}><ShoppingBag size={18} /> Ajouter au panier</Button><Button as="a" href={whatsapp} target="_blank" variant="success"><MessageCircle size={18} /> Commander via WhatsApp</Button></div>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {[
                [ShieldCheck, "Authenticite", "Selection verifiee"],
                [Truck, "Livraison", "Confirmation rapide"],
                [BadgeCheck, "Conseil", "Accompagnement humain"]
              ].map(([Icon, title, text]) => (
                <div key={title} className="rounded-[18px] border border-white/10 bg-white/[0.07] p-4">
                  <Icon className="text-[#D6B56D]" size={20} />
                  <p className="mt-3 text-sm font-black">{title}</p>
                  <p className="mt-1 text-xs text-white/55">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-16 sm:px-6 lg:grid-cols-3 lg:px-8">
        <article className="rounded-[28px] border border-black/10 bg-white/80 p-7 shadow-[0_25px_80px_rgba(17,19,24,0.08)] backdrop-blur-xl">
          <Droplets className="text-brand-copper" size={25} />
          <h2 className="mt-5 font-display text-3xl font-black">Pyramide olfactive</h2>
          <p className="mt-4 text-sm leading-7 text-brand-muted">Une lecture claire des notes de tete, de coeur et de fond pour aider le client a imaginer le sillage.</p>
        </article>
        <article className="rounded-[28px] border border-black/10 bg-white/80 p-7 shadow-[0_25px_80px_rgba(17,19,24,0.08)] backdrop-blur-xl">
          <Sparkles className="text-brand-copper" size={25} />
          <h2 className="mt-5 font-display text-3xl font-black">Moment ideal</h2>
          <p className="mt-4 text-sm leading-7 text-brand-muted">Soiree, cadeau, signature quotidienne ou occasion speciale: le detail produit reste sensoriel et commercial.</p>
        </article>
        <article className="rounded-[28px] border border-black/10 bg-brand-ink p-7 text-white shadow-[0_25px_80px_rgba(17,19,24,0.14)]">
          <MessageCircle className="text-brand-gold" size={25} />
          <h2 className="mt-5 font-display text-3xl font-black">Reservation directe</h2>
          <p className="mt-4 text-sm leading-7 text-white/62">Le bouton WhatsApp prepare un message clair avec la reference choisie.</p>
          <Link to="/checkout" className="mt-6 inline-flex items-center gap-2 text-sm font-black text-brand-gold">
            Finaliser <ArrowRight size={16} />
          </Link>
        </article>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <h2 className="font-title text-4xl font-black">Produits similaires</h2>
        <div className="mt-8"><ProductGrid products={similar.length ? similar : products.slice(0, 4)} /></div>
      </section>
    </main>
  );
};
