import { motion } from "framer-motion";

export const SectionIntro = ({ eyebrow, title, text, align = "left", className = "" }) => (
  <motion.div
    initial={{ opacity: 0, y: 22 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-80px" }}
    transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
    className={`${align === "center" ? "mx-auto text-center" : ""} max-w-3xl ${className}`}
  >
    <p className="text-xs font-black uppercase tracking-[0.32em] text-brand-copper">{eyebrow}</p>
    <h2 className="mt-4 text-balance font-display text-4xl font-black leading-[1.02] text-brand-ink sm:text-5xl lg:text-6xl">{title}</h2>
    {text && <p className="mt-5 text-base leading-8 text-brand-muted sm:text-lg">{text}</p>}
  </motion.div>
);
