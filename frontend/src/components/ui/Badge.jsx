const tones = {
  gold: "bg-brand-gold/15 text-brand-golddeep",
  green: "bg-emerald-600/10 text-emerald-800",
  red: "bg-brand-wine/10 text-brand-wine",
  dark: "bg-brand-pine text-brand-porcelain",
  soft: "bg-brand-ink/5 text-brand-ink/70",
  light: "bg-white/90 text-brand-ink"
};

export const Badge = ({ tone = "gold", className = "", children }) => (
  <span className={`inline-flex items-center rounded-full px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.12em] ${tones[tone] || tones.gold} ${className}`}>{children}</span>
);
