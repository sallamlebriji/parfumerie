export const SectionIntro = ({ eyebrow, title, text, align = "start", light = false, className = "", action }) => (
  <div className={`flex flex-wrap items-end justify-between gap-6 ${className}`}>
    <div className={`max-w-2xl ${align === "center" ? "mx-auto text-center" : ""}`}>
      {eyebrow && <p className={light ? "eyebrow-light" : "eyebrow"}>{eyebrow}</p>}
      <h2 className={`mt-3 font-display text-display-lg font-medium ${light ? "text-white" : "text-brand-ink"}`}>{title}</h2>
      {text && <p className={`mt-4 text-base leading-7 sm:text-lg ${light ? "text-white/70" : "text-brand-muted"}`}>{text}</p>}
    </div>
    {action}
  </div>
);
