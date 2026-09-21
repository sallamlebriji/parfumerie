import { Search } from "lucide-react";

export const EmptyState = ({ title = "Aucun résultat", text = "Essayez de modifier vos filtres.", action, icon: Icon = Search }) => (
  <div className="rounded-3xl border border-dashed border-brand-ink/20 bg-white/50 px-6 py-14 text-center">
    <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-brand-gold/15 text-brand-golddeep"><Icon size={24} /></span>
    <h3 className="mt-5 font-display text-2xl font-semibold">{title}</h3>
    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-brand-muted">{text}</p>
    {action && <div className="mt-6 flex justify-center">{action}</div>}
  </div>
);
