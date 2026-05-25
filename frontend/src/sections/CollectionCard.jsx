import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const CollectionCard = ({ title, to, image }) => (
  <motion.div whileHover={{ y: -8 }} className="group relative min-h-[360px] overflow-hidden rounded-[28px] shadow-luxury">
    <img src={image} alt={title} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-110" />
    <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/40 to-transparent" />
    <div className="absolute inset-x-0 bottom-0 p-8 text-white">
      <h3 className="text-3xl font-black">{title}</h3>
      <Link to={to} className="mt-5 inline-flex rounded-full border border-gold/60 px-5 py-2 text-sm font-bold text-lightgold transition hover:bg-gold hover:text-ink">Decouvrir</Link>
    </div>
  </motion.div>
);

export default CollectionCard;
