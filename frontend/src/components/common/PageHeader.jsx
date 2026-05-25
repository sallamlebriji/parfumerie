import { motion } from "framer-motion";

export const PageHeader = ({ eyebrow, title, text, image }) => (
  <header className="relative overflow-hidden bg-brand-ink pt-28 text-white">
    {image && <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-30" />}
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_18%,rgba(215,181,109,0.22),transparent_28rem),linear-gradient(115deg,rgba(7,18,15,0.96),rgba(17,19,24,0.82),rgba(16,35,31,0.56))]" />
    <div className="animated-grain absolute inset-0 opacity-60" />
    <div className="premium-shell relative flex min-h-[430px] items-end pb-16">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl">
        <p className="text-xs font-extrabold uppercase tracking-[0.35em] text-brand-gold">{eyebrow}</p>
        <h1 className="mt-4 font-display text-5xl font-black leading-[0.98] tracking-[-0.05em] sm:text-7xl">{title}</h1>
        {text && <p className="mt-5 max-w-2xl text-lg leading-8 text-white/70">{text}</p>}
      </motion.div>
    </div>
  </header>
);
