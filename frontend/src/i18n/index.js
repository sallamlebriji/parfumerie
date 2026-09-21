import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { useAppStore } from "../store/appStore";
import ar from "./locales/ar";
import en from "./locales/en";
import fr from "./locales/fr";

export const languages = [
  { code: "fr", label: "FR", name: "Français" },
  { code: "en", label: "EN", name: "English" },
  { code: "ar", label: "AR", name: "العربية" }
];

const supported = languages.map((item) => item.code);
const stored = useAppStore.getState().language;
const initial = supported.includes(stored) ? stored : "fr";

const applyDocument = (lng) => {
  document.documentElement.lang = lng;
  document.documentElement.dir = lng === "ar" ? "rtl" : "ltr";
};

i18n.use(initReactI18next).init({
  resources: { fr: { translation: fr }, en: { translation: en }, ar: { translation: ar } },
  lng: initial,
  fallbackLng: "fr",
  interpolation: { escapeValue: false }
});

applyDocument(initial);
i18n.on("languageChanged", (lng) => {
  applyDocument(lng);
  useAppStore.setState({ language: lng });
});

export default i18n;
