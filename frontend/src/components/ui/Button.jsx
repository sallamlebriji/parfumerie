import { motion } from "framer-motion";

const variants = {
  primary: "border border-[#D8B87E]/45 bg-gradient-to-r from-[#D8B87E] to-[#F0D9A2] text-[#211817] shadow-[0_18px_45px_rgba(184,141,75,0.20)] hover:from-[#E8CAA0] hover:to-[#D8B87E]",
  dark: "border border-[#2A1F1D]/20 bg-[#171111] text-[#FFF9EF] shadow-[0_18px_45px_rgba(33,24,23,0.18)] hover:bg-[#2B1E1A]",
  outline: "border border-[#D8B87E]/45 bg-[#FFFDF8]/72 text-[#211817] shadow-[0_16px_45px_rgba(82,55,37,0.08)] backdrop-blur hover:border-[#B98D4B] hover:bg-[#F8EAD7]",
  ghost: "text-[#211817] hover:bg-[#D8B87E]/12",
  success: "border border-[#A8B58A]/40 bg-[#6F7D4F] text-white hover:brightness-105",
  danger: "border border-[#8E2F3C]/30 bg-[#7A2633] text-white hover:bg-[#8E2F3C]"
};

export const Button = ({ as: Component = "button", variant = "primary", className = "", children, ...props }) => (
  <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} className="inline-flex">
    <Component className={`inline-flex items-center justify-center gap-2 rounded-[18px] px-5 py-3 text-sm font-extrabold tracking-[-0.01em] transition ${variants[variant]} ${className}`} {...props}>
      {children}
    </Component>
  </motion.div>
);
