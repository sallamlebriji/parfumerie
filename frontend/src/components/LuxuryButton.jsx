import { motion } from "framer-motion";

const styles = {
  gold: "btn-gold",
  dark: "btn-primary",
  outline: "btn-outline",
  whatsapp: "btn-whatsapp"
};

const LuxuryButton = ({ as: Component = "button", variant = "gold", className = "", children, ...props }) => (
  <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} className="inline-flex">
    <Component className={`${styles[variant] || styles.gold} ${className}`} {...props}>
      {children}
    </Component>
  </motion.div>
);

export default LuxuryButton;
