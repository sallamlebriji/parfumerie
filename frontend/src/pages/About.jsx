import EditorialPageHero from "../components/EditorialPageHero";
import SectionTitle from "../components/SectionTitle";

const About = () => (
  <main className="pb-24">
    <EditorialPageHero
      eyebrow="A propos"
      title="Une maison de fragrance proche de ses clients"
      text="Une approche locale, elegante et commerciale, pensee pour rendre l'achat de parfum plus simple et plus humain."
      image="https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?auto=format&fit=crop&w=1800&q=90"
      meta="Chaque parfum est presente avec ses notes, son volume, son prix et une confirmation WhatsApp claire."
    />
    <section className="container-page grid items-center gap-10 lg:grid-cols-2">
      <div>
        <SectionTitle eyebrow="A propos" title="Une maison locale, elegante et proche de ses clients" text="Maison Parfumee propose une selection de parfums pour homme, femme et mixte, avec une experience d'achat claire: consultation du catalogue, panier, puis confirmation finale par WhatsApp." />
        <blockquote className="mt-8 border-l-2 border-gold pl-6 text-2xl font-title italic leading-10 text-ink">Nous selectionnons des fragrances qui allient caractere, elegance et authenticite.</blockquote>
      </div>
      <img src="https://images.unsplash.com/photo-1590736704728-f4730bb30770?auto=format&fit=crop&w=1100&q=85" alt="Parfumerie premium" className="min-h-[520px] rounded-[32px] object-cover shadow-luxury" />
    </section>
    <section className="container-page mt-16 grid gap-5 md:grid-cols-4">
      {["Notre mission", "Notre selection", "Pourquoi nous choisir", "Experience client"].map((title) => (
        <div key={title} className="panel p-6">
          <h2 className="text-2xl font-black">{title}</h2>
          <p className="mt-4 text-sm leading-7 text-elegantgray">Offrir une experience simple, fiable et raffinee, avec une confirmation humaine a chaque commande.</p>
        </div>
      ))}
    </section>
  </main>
);

export default About;
