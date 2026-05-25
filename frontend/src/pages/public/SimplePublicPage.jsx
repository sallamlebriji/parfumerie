import { PageHeader } from "../../components/common/PageHeader";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { ArrowRight, CheckCircle2, Clock3, MapPin, MessageCircle, Phone, ShieldCheck, Sparkles } from "lucide-react";

const content = {
  collections: ["Homme", "Femme", "Mixte", "Luxe", "Oud", "Musc", "Coffrets"],
  brands: ["Maison Noir", "Atelier Pure", "Velours Paris", "Luxe Notes", "Urban Essence"],
  faq: ["Comment commander ?", "Quels modes de paiement ?", "Livraison disponible ?", "Comment suivre ma commande ?"],
  about: ["Notre mission", "Notre selection", "Experience client", "Pourquoi nous choisir"],
  contact: ["WhatsApp", "Telephone", "Adresse", "Horaires"],
  success: ["Commande preparee", "WhatsApp ouvert", "Confirmation humaine", "Merci pour votre confiance"]
};

const pageCopy = {
  collections: {
    image: "https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?auto=format&fit=crop&w=1800&q=90",
    intro: "Chaque collection devient une porte d'entree claire vers une humeur: oud intense, musc propre, floral elegant ou boise profond.",
    highlights: ["Parcours par univers", "Selections cadeau", "Collections saisonnieres"]
  },
  brands: {
    image: "https://images.unsplash.com/photo-1588405748880-12d1d2a59d32?auto=format&fit=crop&w=1800&q=90",
    intro: "Les marques sont presentees comme des signatures de confiance, avec une lecture simple pour comparer style, prix et disponibilite.",
    highlights: ["Maisons premium", "References commerciales", "Stock actualise"]
  },
  faq: {
    image: "https://images.unsplash.com/photo-1608528577891-eb055944f2e7?auto=format&fit=crop&w=1800&q=90",
    intro: "Une FAQ claire reduit les hesitations avant commande et rassure sur la livraison, le paiement et la confirmation WhatsApp.",
    highlights: ["Commande assistee", "Paiement flexible", "Suivi simple"]
  },
  about: {
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=1800&q=90",
    intro: "Maison Parfumee associe le conseil humain d'une boutique locale a la precision d'une experience e-commerce moderne.",
    highlights: ["Curation olfactive", "Service local", "Experience premium"]
  },
  contact: {
    image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=1800&q=90",
    intro: "Un contact rapide, direct et rassurant pour guider le client vers le bon parfum et confirmer sa reservation.",
    highlights: ["WhatsApp prioritaire", "Conseil cadeau", "Horaires boutique"]
  },
  success: {
    image: "https://images.unsplash.com/photo-1600612253971-422e7f7faeb6?auto=format&fit=crop&w=1800&q=90",
    intro: "La commande est preparee pour WhatsApp: l'equipe peut confirmer la disponibilite et finaliser les details avec le client.",
    highlights: ["Message pret", "Confirmation humaine", "Preparation rapide"]
  }
};

export const SimplePublicPage = ({ type = "about", title, eyebrow, text }) => {
  const items = content[type] || content.about;
  const details = pageCopy[type] || pageCopy.about;
  const whatsapp = `https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER || ""}?text=${encodeURIComponent("Bonjour, je souhaite avoir un conseil parfum.")}`;
  return (
    <main className="pb-20">
      <PageHeader eyebrow={eyebrow} title={title} text={text} image={details.image} />
      <section className="premium-shell -mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {items.map((item, index) => (
          <Card key={item} className="group p-7 transition duration-300 hover:-translate-y-2 hover:shadow-[0_35px_90px_rgba(17,19,24,0.14)]">
            {index % 3 === 0 ? <Sparkles className="text-brand-copper" size={22} /> : <CheckCircle2 className="text-brand-copper" size={22} />}
            <h2 className="mt-7 font-display text-2xl font-black tracking-[-0.03em]">{item}</h2>
            <p className="mt-4 text-sm leading-7 text-brand-muted">Interface premium, claire et prete pour une vraie boutique de parfumerie.</p>
          </Card>
        ))}
      </section>
      <section className="premium-shell mt-12 grid gap-6 lg:grid-cols-[1fr_0.8fr]">
        <div className="rounded-[34px] border border-black/10 bg-white/80 p-8 shadow-[0_30px_90px_rgba(17,19,24,0.08)] backdrop-blur-xl">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-brand-copper">Experience boutique</p>
          <h2 className="mt-4 max-w-3xl font-display text-4xl font-black leading-tight text-brand-ink">Une presence digitale plus premium, sans perdre la proximite locale.</h2>
          <p className="mt-5 max-w-3xl text-base leading-8 text-brand-muted">{details.intro}</p>
          <div className="mt-7 flex flex-wrap gap-2">
            {details.highlights.map((item) => (
              <span key={item} className="rounded-full bg-brand-mist px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-brand-pine">{item}</span>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button as="a" href="/shop">Explorer la boutique <ArrowRight size={17} /></Button>
            <Button as="a" href={whatsapp} target="_blank" variant="success"><MessageCircle size={17} /> WhatsApp</Button>
          </div>
        </div>
        <aside className="rounded-[34px] bg-brand-ink p-8 text-white shadow-[0_30px_90px_rgba(17,19,24,0.16)]">
          <ShieldCheck className="text-brand-gold" size={28} />
          <h3 className="mt-6 font-display text-3xl font-black">Contact rapide</h3>
          <div className="mt-7 grid gap-4 text-sm text-white/68">
            <p className="flex items-center gap-3"><MessageCircle className="text-brand-gold" size={18} /> WhatsApp disponible</p>
            <p className="flex items-center gap-3"><Phone className="text-brand-gold" size={18} /> Conseil et reservation</p>
            <p className="flex items-center gap-3"><MapPin className="text-brand-gold" size={18} /> Boutique locale</p>
            <p className="flex items-center gap-3"><Clock3 className="text-brand-gold" size={18} /> Reponse rapide</p>
          </div>
        </aside>
      </section>
    </main>
  );
};
