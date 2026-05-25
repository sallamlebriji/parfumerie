import { motion } from "framer-motion";

const EditorialPageHero = ({ eyebrow, title, text, image, meta }) => (
  <header className="relative overflow-hidden bg-ink pt-28 text-white">
    {image && <img src={image} alt={title} className="absolute inset-0 h-full w-full object-cover opacity-30" />}
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_18%,rgba(201,162,39,0.24),transparent_28rem),linear-gradient(115deg,rgba(0,0,0,0.95),rgba(11,11,11,0.80),rgba(21,21,21,0.55))]" />
    <div className="absolute right-0 top-16 hidden text-[11vw] font-black leading-none text-white/[0.025] lg:block">PARFUM</div>
    <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-ivory to-transparent" />
    <div className="container-page relative grid min-h-[430px] items-end gap-8 pb-20 lg:grid-cols-[1fr_360px]">
      <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <p className="text-xs font-extrabold uppercase tracking-[0.35em] text-lightgold">{eyebrow}</p>
        <h1 className="mt-5 max-w-4xl text-5xl font-black leading-[0.98] sm:text-7xl">{title}</h1>
        {text && <p className="mt-6 max-w-2xl text-lg leading-8 text-white/70">{text}</p>}
      </motion.div>
      {meta && (
        <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.1 }} className="hidden rounded-[28px] border border-gold/25 bg-white/10 p-6 backdrop-blur-xl lg:block">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-lightgold">Maison Parfumee</p>
          <p className="mt-4 text-sm leading-7 text-white/70">{meta}</p>
        </motion.div>
      )}
    </div>
  </header>
);

export default EditorialPageHero;
