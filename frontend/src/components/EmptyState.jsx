import { Sparkles } from "lucide-react";

const EmptyState = ({ title = "Aucun resultat", text = "Essayez de modifier vos filtres.", action }) => (
  <div className="glass-panel p-10 text-center">
    <Sparkles className="mx-auto text-gold" size={34} />
    <h3 className="mt-5 text-2xl font-black">{title}</h3>
    <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-elegantgray">{text}</p>
    {action && <div className="mt-6">{action}</div>}
  </div>
);

export default EmptyState;
