import { Sparkles } from "lucide-react";

export const EmptyState = ({ title = "Aucun resultat", text = "Essayez de modifier vos filtres.", action }) => (
  <div className="rounded-[28px] border border-[#C8A96A]/20 bg-white/75 p-10 text-center shadow-[0_25px_70px_rgba(0,0,0,0.08)] backdrop-blur">
    <Sparkles className="mx-auto text-[#C8A96A]" size={34} />
    <h3 className="mt-5 font-title text-3xl font-black">{title}</h3>
    <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#8A8A8A]">{text}</p>
    {action && <div className="mt-6">{action}</div>}
  </div>
);
