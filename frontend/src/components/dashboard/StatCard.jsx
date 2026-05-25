import { motion } from "framer-motion";

export const StatCard = ({ icon: Icon, label, value, tone = "gold", trend }) => (
  <motion.div
    whileHover={{ y: -4, scale: 1.01 }}
    transition={{ type: "spring", stiffness: 260, damping: 20 }}
    className="rounded-[26px] border border-[#D8B87E]/28 bg-[#FFFDF8] p-6 shadow-[0_22px_60px_rgba(82,55,37,0.09)]"
  >
    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${tone === "dark" ? "bg-[#211817] text-[#FFF9EF]" : "bg-[#F6E7CA] text-[#B98D4B]"}`}>
      <Icon size={22} />
    </div>
    <p className="mt-5 text-sm font-semibold text-[#9E8C7E]">{label}</p>
    <div className="mt-1 flex items-end justify-between gap-3">
      <p className="text-3xl font-black text-[#211817]">{value}</p>
      {trend && <span className="rounded-full bg-[#211817] px-3 py-1 text-xs font-black text-[#FFF9EF]">{trend}</span>}
    </div>
  </motion.div>
);
