export const PageHeader = ({ eyebrow, title, text, children }) => (
  <header className="relative overflow-hidden bg-brand-night pb-14 pt-28 text-white sm:pb-16 sm:pt-32">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_88%_0%,rgba(201,164,92,0.2),transparent_26rem),radial-gradient(circle_at_0%_100%,rgba(27,58,49,0.7),transparent_24rem)]" />
    <div className="page-shell relative">
      {eyebrow && <p className="eyebrow-light rise">{eyebrow}</p>}
      <h1 className="rise mt-4 max-w-3xl font-display text-display-lg font-medium" style={{ "--d": "0.06s" }}>{title}</h1>
      {text && <p className="rise mt-4 max-w-2xl text-base leading-7 text-white/70 sm:text-lg" style={{ "--d": "0.12s" }}>{text}</p>}
      {children}
    </div>
  </header>
);
