import { useTranslation } from "react-i18next";

// Pyramide olfactive : les notes légères en haut, les notes durables à la base.
export const NotesPyramid = ({ notes = {} }) => {
  const { t } = useTranslation();
  const tiers = [
    { key: "top", label: t("product.top"), text: notes.top, style: "w-[66%] rounded-t-[2.75rem] rounded-b-md bg-brand-goldsoft text-brand-ink" },
    { key: "middle", label: t("product.heart"), text: notes.middle, style: "w-[84%] rounded-md bg-brand-gold text-brand-night" },
    { key: "base", label: t("product.base"), text: notes.base, style: "w-full rounded-t-md rounded-b-[1.25rem] bg-brand-pine text-brand-goldsoft" }
  ];
  if (!tiers.some((tier) => tier.text)) return <p className="text-sm text-brand-muted">{t("product.noNotes")}</p>;
  return (
    <ol className="mx-auto flex w-full max-w-lg flex-col items-center gap-1.5" aria-label={t("product.pyramid")}>
      {tiers.map((tier) => (
        <li key={tier.key} className={`px-5 py-4 text-center ${tier.style}`}>
          <p className="text-[0.64rem] font-bold uppercase tracking-[0.22em] opacity-70">{tier.label}</p>
          <p className="mt-1 font-display text-lg leading-snug sm:text-xl">{tier.text || "—"}</p>
        </li>
      ))}
    </ol>
  );
};
