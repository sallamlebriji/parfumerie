import { Clock, Instagram, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import EditorialPageHero from "../components/EditorialPageHero";
import WhatsAppButton from "../components/WhatsAppButton";

const Contact = () => (
  <main className="bg-beige/50 pb-24">
    <EditorialPageHero
      eyebrow="Contact"
      title="Un conseil avant votre fragrance ?"
      text="Notre parfumerie vous accompagne dans le choix, la disponibilite et la confirmation de votre commande."
      image="https://images.unsplash.com/photo-1587017539504-67cfbddac569?auto=format&fit=crop&w=1800&q=90"
      meta="WhatsApp reste le canal privilegie pour une reponse rapide et une confirmation claire."
    />
    <div className="container-page -mt-8 grid gap-8 lg:grid-cols-2">
      <div className="space-y-6">
        <div className="glass-panel p-7">
        <p className="text-xs font-extrabold uppercase tracking-[0.35em] text-gold">Maison locale</p>
        <h2 className="mt-3 text-4xl font-black leading-tight">Nous sommes a votre ecoute</h2>
        <p className="mt-5 leading-8 text-elegantgray">Besoin d'un conseil ou d'une disponibilite precise? Envoyez-nous un message et finalisez votre commande en toute simplicite.</p>
        <div className="mt-7">
        <WhatsAppButton href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER || "212600000000"}`}>Ecrire sur WhatsApp</WhatsAppButton>
        </div>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {[
          [Phone, "Telephone", "+212 600 000 000"],
          [MapPin, "Adresse", "Casablanca, Maroc"],
          [Clock, "Horaires", "Lun - Sam, 10:00 - 20:00"],
          [Instagram, "Reseaux", "@maisonparfumee"]
        ].map(([Icon, title, text]) => (
          <div key={title} className="glass-panel p-6">
            <Icon className="text-gold" />
            <h2 className="mt-4 font-bold">{title}</h2>
            <p className="mt-2 text-sm text-elegantgray">{text}</p>
          </div>
        ))}
      </div>
    </div>
    <div className="container-page mt-10 grid gap-8 lg:grid-cols-2">
      <form className="glass-panel grid gap-4 p-6">
        <label><span className="label">Nom</span><input className="field" /></label>
        <label><span className="label">Email</span><input className="field" type="email" /></label>
        <label><span className="label">Message</span><textarea className="field min-h-32" /></label>
        <button type="button" className="btn-gold"><Mail size={18} /> Envoyer</button>
      </form>
      <div className="luxury-gradient flex min-h-[360px] items-center justify-center rounded-[28px] border border-gold/25 p-8 text-center text-white shadow-luxury">
        <div>
          <MapPin className="mx-auto text-lightgold" size={42} />
          <h2 className="mt-5 text-3xl font-black">Carte Google Maps</h2>
          <p className="mt-3 text-white/70">Emplacement de la parfumerie a integrer ici.</p>
        </div>
      </div>
    </div>
  </main>
);

export default Contact;
