import { motion } from "framer-motion";

const SectionTitle = ({ eyebrow, title, text, align = "left" }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-80px" }}
    transition={{ duration: 0.6, ease: "easeOut" }}
    className={align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}
  >
    {eyebrow && <p className="text-xs font-extrabold uppercase tracking-[0.35em] text-gold">{eyebrow}</p>}
    <h2 className="mt-3 text-4xl font-black leading-tight text-ink sm:text-5xl">{title}</h2>
    {text && <p className="mt-5 text-base leading-8 text-elegantgray">{text}</p>}
    <div className={`gold-divider mt-6 ${align === "center" ? "mx-auto" : ""}`} />
  </motion.div>
);

export default SectionTitle;
