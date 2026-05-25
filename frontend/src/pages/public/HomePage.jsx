import { motion } from "framer-motion";
import { ArrowRight, Crown, Gift, Mail, MessageCircle, Percent, Play, Quote, Sparkles } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { catalogService } from "../../services/catalogService";
import { products as fallbackProducts } from "../../data/products";
import {
  achievements,
  brandMarquee,
  heroStats,
  processSteps,
  services,
  testimonials,
  trustItems
} from "../../data/homeContent";
import { ProductGrid } from "../../components/product/ProductGrid";
import { Button } from "../../components/ui/Button";
import { SkeletonLoader } from "../../components/common/SkeletonLoader";
import { SectionIntro } from "../../components/premium/SectionIntro";
import { useGsapHome } from "../../hooks/useGsapHome";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (index = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: index * 0.06, duration: 0.65, ease: [0.22, 1, 0.36, 1] }
  })
};

export const HomePage = () => {
  const { t } = useTranslation();
  useGsapHome();

  const { data: remoteProducts = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: catalogService.products,
    retry: 1
  });
  const { data: remoteCategories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: catalogService.categories,
    retry: 1
  });

  const products = remoteProducts.length ? remoteProducts : fallbackProducts;
  const categories = remoteCategories.length
    ? remoteCategories
    : Array.from(new Map(fallbackProducts.map((item) => [item.category, { id: item.category, name: item.category, image: item.images[0] }])).values());
  const featured = products.filter((item) => item.badge === "best-seller" || item.isPromo || item.isFeatured).slice(0, 4);
  const newProducts = products.filter((item) => item.isNew || item.stock > 0).slice(0, 4);
  const offers = products.filter((item) => item.isPromo || item.oldPrice > 0).slice(0, 3);
  const signatureBrands = brandMarquee.slice(0, 5);

  return (
    <main className="overflow-hidden bg-brand-ivory">
      <section className="premium-hero relative min-h-[100svh] bg-brand-night text-white">
        <img
          className="absolute inset-0 h-full w-full object-cover opacity-45"
          src="https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=2200&q=90"
          alt="Parfumerie moderne"
        />
        <div className="absolute inset-0 bg-[linear-gradient(112deg,rgba(7,18,15,0.98)_0%,rgba(7,18,15,0.88)_42%,rgba(89,53,35,0.52)_70%,rgba(7,18,15,0.78)_100%)]" />
        <div className="animated-grain absolute inset-0 opacity-70" />

        <div className="premium-shell relative grid min-h-[100svh] items-center gap-12 pb-20 pt-32 lg:grid-cols-[1.02fr_0.98fr]">
          <div className="max-w-4xl">
            <span className="hero-reveal inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.28em] text-brand-gold backdrop-blur-xl">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-gold" />
              Maison Parfumee
            </span>
            <h1 className="hero-reveal mt-7 text-balance font-display text-5xl font-black leading-[0.95] tracking-[-0.04em] sm:text-7xl lg:text-[92px]">
              Boutique parfumee, experience digitale premium.
            </h1>
            <p className="hero-reveal mt-7 max-w-2xl text-pretty text-lg leading-8 text-white/72 sm:text-xl">
              Une vitrine elegante pour vendre vos parfums avec un parcours fluide, un catalogue clair et une finition visuelle digne des meilleures marques modernes.
            </p>
            <div className="hero-reveal mt-9 flex flex-wrap gap-3">
              <Button as={Link} to="/shop" className="bg-white text-brand-ink hover:bg-brand-gold">
                {t("discover")} <ArrowRight size={18} />
              </Button>
              <Button as={Link} to="/checkout" variant="outline" className="border-white/20 bg-white/10 text-white hover:bg-white/20">
                <MessageCircle size={18} /> {t("orderNow")}
              </Button>
            </div>
            <div className="hero-reveal mt-10 grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3">
              {heroStats.map((item) => (
                <div key={item.label} className="rounded-[24px] border border-white/12 bg-white/8 p-5 backdrop-blur-xl">
                  <p className="font-display text-3xl font-black tracking-[-0.04em] text-brand-gold">{item.value}</p>
                  <p className="mt-1 text-xs font-bold uppercase tracking-[0.18em] text-white/55">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="hero-reveal relative hidden lg:block">
            <div className="hero-bottle shine-sweep rounded-[34px] border border-white/15 bg-white/[0.08] p-4 shadow-[0_55px_140px_rgba(0,0,0,0.48)] backdrop-blur-2xl">
              <img
                src="https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1300&q=90"
                alt="Flacon de parfum premium"
                className="h-[590px] w-full rounded-[26px] object-cover"
              />
            </div>
            <div className="absolute -bottom-8 left-8 right-8 rounded-[28px] border border-white/20 bg-white/92 p-6 text-brand-ink shadow-[0_30px_80px_rgba(0,0,0,0.24)] backdrop-blur-xl">
              <p className="text-xs font-black uppercase tracking-[0.28em] text-brand-copper">Best seller</p>
              <p className="mt-2 font-display text-3xl font-black tracking-[-0.04em]">Oud Royal, Musk Blanc, Rose Elegance...</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-black/10 bg-white/65 py-6 backdrop-blur">
        <div className="premium-shell overflow-hidden">
          <div className="flex min-w-max gap-3 [animation:marquee_26s_linear_infinite]">
            {[...brandMarquee, ...brandMarquee].map((item, index) => (
              <span key={`${item}-${index}`} className="rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-black uppercase tracking-[0.18em] text-brand-pine shadow-sm">
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="premium-shell py-24">
        <SectionIntro
          eyebrow="Services"
          title="Une experience e-commerce pensee comme une maison de luxe."
          text="Chaque section clarifie l'offre, rassure le client et garde la boutique facile a administrer au quotidien."
          align="center"
        />
        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {services.map(({ icon: Icon, title, text }, index) => (
            <motion.article
              key={title}
              custom={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={fadeUp}
              whileHover={{ y: -8 }}
              className="premium-card group p-7"
            >
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-pine text-brand-gold shadow-[0_18px_45px_rgba(16,35,31,0.18)]">
                <Icon size={22} />
              </div>
              <h3 className="mt-7 font-display text-xl font-black tracking-[-0.02em]">{title}</h3>
              <p className="mt-4 text-sm leading-7 text-brand-muted">{text}</p>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="relative bg-brand-pine py-24 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(215,181,109,0.2),transparent_24rem)]" />
        <div className="premium-shell relative grid items-center gap-12 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="parallax-soft shine-sweep overflow-hidden rounded-[32px] border border-white/12 bg-white/8 p-3 shadow-[0_40px_120px_rgba(0,0,0,0.25)]">
            <img
              src="https://images.unsplash.com/photo-1600612253971-422e7f7faeb6?auto=format&fit=crop&w=1400&q=90"
              alt="Experience parfum premium"
              className="min-h-[520px] w-full rounded-[24px] object-cover"
            />
          </div>
          <div className="gsap-reveal">
            <p className="text-xs font-black uppercase tracking-[0.32em] text-brand-gold">A propos</p>
            <h2 className="mt-4 text-balance font-display text-4xl font-black leading-[1.02] tracking-[-0.04em] sm:text-6xl">
              Maison Parfumee garde son ame, avec une interface plus precise.
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/70">
              Le site conserve son identite parfumee et ses fonctions existantes, mais gagne une structure visuelle plus nette: hero, services, realisations, temoignages et contact.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {trustItems.map(({ icon: Icon, label }) => (
                <div key={label} className="rounded-[22px] border border-white/10 bg-white/8 p-5 backdrop-blur">
                  <Icon className="text-brand-gold" size={22} />
                  <h3 className="mt-4 font-bold">{label}</h3>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="premium-shell py-24">
        <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr]">
          <SectionIntro
            eyebrow="Realisations"
            title="Une boutique plus claire a chaque etape."
            text="Des blocs fonctionnels, lisibles et reutilisables qui rendent l'interface plus professionnelle sans changer le coeur du projet."
          />
          <div className="grid gap-5 md:grid-cols-3">
            {achievements.map(({ icon: Icon, title, text, meta }) => (
              <motion.article key={title} whileHover={{ y: -8 }} className="premium-card p-6">
                <div className="flex items-center justify-between gap-4">
                  <span className="rounded-full bg-brand-mist px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-brand-copper">{meta}</span>
                  <Icon size={19} className="text-brand-copper" />
                </div>
                <h3 className="mt-8 font-display text-2xl font-black tracking-[-0.03em]">{title}</h3>
                <p className="mt-4 text-sm leading-7 text-brand-muted">{text}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white/70 py-24">
        <div className="premium-shell">
          <SectionIntro eyebrow="Collections" title="Univers olfactifs" text="Des familles claires pour guider l'achat: boise, floral, oud, ambre, gourmand et frais." align="center" />
          <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {categories.slice(0, 8).map((category, index) => (
              <motion.div key={category.id || category.name} custom={index} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={fadeUp}>
                <Link to={`/shop?category=${category.name}`} className="group relative block min-h-[340px] overflow-hidden rounded-[30px] shadow-[0_25px_80px_rgba(17,19,24,0.12)]">
                  <img src={category.image} alt={category.name} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-night/95 via-brand-night/24 to-transparent" />
                  <div className="absolute bottom-0 p-7 text-white">
                    <h3 className="font-display text-3xl font-black tracking-[-0.04em]">{category.name}</h3>
                    <span className="mt-5 inline-flex items-center gap-2 rounded-full border border-brand-gold/60 px-4 py-2 text-sm font-bold text-brand-gold">
                      Explorer <ArrowRight size={15} />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="premium-shell py-24">
        <SectionIntro eyebrow="Selection" title="Parfums populaires" text="Les references qui attirent l'attention et creent naturellement la conversion." align="center" />
        <div className="mt-12">{isLoading && !remoteProducts.length ? <SkeletonLoader count={4} /> : <ProductGrid products={featured} />}</div>
      </section>

      <section className="relative overflow-hidden bg-brand-ink py-24 text-white">
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(215,181,109,0.18),transparent_38%,rgba(255,255,255,0.06)_70%,transparent)]" />
        <div className="premium-shell relative">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
            <SectionIntro
              eyebrow="Offres speciales"
              title="Promotions habillees comme des editions privees."
              text="Des reductions lisibles sans casser la perception premium de la boutique."
              className="[&_h2]:text-white [&_p:last-child]:text-white/65"
            />
            <div className="grid gap-4 md:grid-cols-3">
              {(offers.length ? offers : featured.slice(0, 3)).map((product, index) => (
                <motion.article
                  key={product.id}
                  custom={index}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-80px" }}
                  variants={fadeUp}
                  className="group overflow-hidden rounded-[30px] border border-white/12 bg-white/[0.08] p-4 backdrop-blur-2xl"
                >
                  <div className="relative h-56 overflow-hidden rounded-[24px] bg-white/10">
                    <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover transition duration-700 group-hover:scale-110" loading="lazy" />
                    <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-brand-gold px-3 py-1 text-xs font-black uppercase text-brand-ink">
                      <Percent size={14} /> Offre
                    </div>
                  </div>
                  <p className="mt-5 text-xs font-black uppercase tracking-[0.24em] text-brand-gold">{product.brand}</p>
                  <h3 className="mt-2 font-display text-2xl font-black">{product.name}</h3>
                  <Link to={`/shop/${product.id}`} className="mt-5 inline-flex items-center gap-2 text-sm font-black text-white/80 transition hover:text-brand-gold">
                    Voir l'offre <ArrowRight size={16} />
                  </Link>
                </motion.article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="premium-shell py-16">
        <div className="grid overflow-hidden rounded-[34px] border border-black/10 bg-brand-ink text-white shadow-[0_35px_110px_rgba(17,19,24,0.18)] lg:grid-cols-[0.95fr_1.05fr]">
          <div className="p-8 sm:p-12 lg:p-14">
            <p className="text-xs font-black uppercase tracking-[0.32em] text-brand-gold">Process</p>
            <h2 className="mt-4 font-display text-4xl font-black leading-[1.04] tracking-[-0.04em] sm:text-5xl">Une structure professionnelle, du desir au panier.</h2>
            <div className="mt-10 grid gap-4">
              {processSteps.map(({ icon: Icon, title, text }) => (
                <div key={title} className="flex gap-4 rounded-[24px] border border-white/10 bg-white/7 p-5">
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white text-brand-ink">
                    <Icon size={20} />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-black">{title}</h3>
                    <p className="mt-1 text-sm leading-6 text-white/62">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative min-h-[440px]">
            <img src="https://images.unsplash.com/photo-1588405748880-12d1d2a59d32?auto=format&fit=crop&w=1400&q=90" alt="Flacons modernes" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-ink/30 to-transparent" />
            <button className="absolute left-8 top-8 inline-flex h-14 w-14 items-center justify-center rounded-full bg-white text-brand-ink shadow-xl transition hover:scale-105" aria-label="Voir l'experience">
              <Play size={20} fill="currentColor" />
            </button>
          </div>
        </div>
      </section>

      <section className="premium-shell py-24">
        <SectionIntro eyebrow="Marques partenaires" title="Des signatures qui construisent la confiance." text="Une selection de maisons commerciales et niches pour aider le client a se projeter rapidement." align="center" />
        <div className="mt-12 grid gap-4 md:grid-cols-5">
          {signatureBrands.map((brand, index) => (
            <motion.div
              key={brand}
              custom={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="rounded-[26px] border border-black/10 bg-white/75 p-6 text-center shadow-[0_24px_70px_rgba(17,19,24,0.07)] backdrop-blur-xl"
            >
              <Crown className="mx-auto text-brand-copper" size={24} />
              <p className="mt-5 font-display text-xl font-black">{brand}</p>
              <p className="mt-2 text-xs font-bold uppercase tracking-[0.18em] text-brand-muted">Partenaire</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="premium-shell pb-24">
        <div className="grid gap-6 overflow-hidden rounded-[34px] border border-black/10 bg-white/80 p-6 shadow-[0_35px_110px_rgba(17,19,24,0.1)] backdrop-blur-xl lg:grid-cols-[0.8fr_1.2fr] lg:p-10">
          <div className="rounded-[28px] bg-brand-ink p-8 text-white">
            <Sparkles className="text-brand-gold" size={28} />
            <h2 className="mt-6 font-display text-4xl font-black leading-tight">Newsletter privee</h2>
            <p className="mt-4 text-sm leading-7 text-white/62">Nouveautes, conseils olfactifs, offres limitees et selections de saison.</p>
          </div>
          <div className="flex flex-col justify-center">
            <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
              <label className="sr-only" htmlFor="newsletter-email">Email</label>
              <input id="newsletter-email" type="email" placeholder="Votre adresse email" className="rounded-full border border-black/10 bg-white px-5 py-4 text-sm outline-none transition focus:border-brand-gold focus:ring-4 focus:ring-brand-gold/15" />
              <Button>
                <Mail size={17} /> S'inscrire
              </Button>
            </div>
            <div className="mt-5 flex flex-wrap gap-2 text-xs font-bold uppercase tracking-[0.16em] text-brand-muted">
              <span className="rounded-full bg-brand-mist px-3 py-2">Conseil parfum</span>
              <span className="rounded-full bg-brand-mist px-3 py-2">Avant-premieres</span>
              <span className="rounded-full bg-brand-mist px-3 py-2">Offres membres</span>
            </div>
          </div>
        </div>
      </section>

      <section className="premium-shell py-24">
        <SectionIntro eyebrow="Temoignages" title="Une perception plus premium des le premier ecran." align="center" />
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {testimonials.map((item, index) => (
            <motion.article key={item.name} custom={index} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={fadeUp} className="premium-card p-7">
              <Quote className="text-brand-copper" size={24} />
              <p className="mt-7 text-pretty text-lg leading-8 text-brand-ink">{item.quote}</p>
              <div className="mt-8 border-t border-black/10 pt-5">
                <p className="font-display font-black">{item.name}</p>
                <p className="mt-1 text-sm text-brand-muted">{item.role}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="premium-shell pb-24">
        <div className="gsap-reveal relative overflow-hidden rounded-[34px] bg-brand-pine px-6 py-14 text-center text-white shadow-[0_35px_110px_rgba(16,35,31,0.2)] sm:px-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(215,181,109,0.24),transparent_28rem)]" />
          <div className="relative mx-auto max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.32em] text-brand-gold">Contact</p>
            <h2 className="mt-4 font-display text-4xl font-black leading-[1.02] tracking-[-0.04em] sm:text-6xl">Pret a choisir votre prochaine signature ?</h2>
            <p className="mt-5 text-lg leading-8 text-white/68">Explorez la boutique, ajoutez vos parfums favoris et confirmez votre commande en quelques clics.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button as={Link} to="/shop" className="bg-white text-brand-ink hover:bg-brand-gold">Voir le catalogue</Button>
              <Button as={Link} to="/contact" variant="outline" className="border-white/20 bg-white/10 text-white hover:bg-white/20"><Gift size={17} /> Nous contacter</Button>
            </div>
          </div>
        </div>
      </section>

      <section className="premium-shell pb-24">
        <SectionIntro eyebrow="Nouveautes" title="Dernieres arrivees" align="center" />
        <div className="mt-12">
          <ProductGrid products={newProducts} />
        </div>
      </section>
    </main>
  );
};
