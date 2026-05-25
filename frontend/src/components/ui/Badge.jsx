const tones = {
  gold: "border-[#D8B87E]/40 bg-[#F6E7CA] text-[#8A6330]",
  green: "border-[#A8B58A]/40 bg-[#EEF3E5] text-[#59693D]",
  red: "border-[#8E2F3C]/25 bg-[#F8E8E8] text-[#7A2633]",
  dark: "border-[#2A1F1D]/15 bg-[#171111] text-[#FFF9EF]",
  soft: "border-[#D8B87E]/30 bg-[#FFF5E7] text-[#6F5A4A]"
};

export const Badge = ({ tone = "gold", children }) => (
  <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-extrabold uppercase tracking-[0.12em] ${tones[tone]}`}>{children}</span>
);
