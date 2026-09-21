export const LogoMark = ({ className = "h-9 w-9" }) => (
  <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
    <path d="M14 54V30c0-10 8-18 18-18s18 8 18 18v24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    <path d="M32 26c-4.2 5.1-6.3 8.6-6.3 11.9a6.3 6.3 0 0 0 12.6 0C38.3 34.6 36.2 31.1 32 26Z" fill="currentColor" />
  </svg>
);

export const Logo = ({ className = "" }) => (
  <span className={`inline-flex items-center gap-3 ${className}`}>
    <LogoMark className="h-9 w-9 text-brand-gold" />
    <span className="flex flex-col leading-none">
      <span className="text-[0.6rem] font-bold uppercase tracking-[0.42em]">Maison</span>
      <span className="mt-1 font-display text-[1.65rem] font-medium tracking-tight">Parfumée</span>
    </span>
  </span>
);
