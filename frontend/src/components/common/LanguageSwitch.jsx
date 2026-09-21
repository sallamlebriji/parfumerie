import { useTranslation } from "react-i18next";
import { languages } from "../../i18n";

export const LanguageSwitch = ({ className = "border-white/25" }) => {
  const { i18n, t } = useTranslation();
  return (
    <div role="group" aria-label={t("nav.language")} className={`inline-flex items-center rounded-full border p-0.5 text-[0.72rem] font-bold ${className}`}>
      {languages.map(({ code, label, name }) => {
        const active = i18n.language === code;
        return (
          <button
            key={code}
            type="button"
            lang={code}
            title={name}
            aria-pressed={active}
            onClick={() => i18n.changeLanguage(code)}
            className={`min-w-[2.1rem] rounded-full px-2.5 py-1.5 transition ${active ? "bg-brand-gold text-brand-night" : "opacity-75 hover:opacity-100"}`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
};
