import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  fr: { translation: { home: "Accueil", shop: "Boutique", collections: "Collections", brands: "Marques", cart: "Panier", admin: "Admin", discover: "Decouvrir la collection", orderNow: "Commander maintenant" } },
  en: { translation: { home: "Home", shop: "Shop", collections: "Collections", brands: "Brands", cart: "Cart", admin: "Admin", discover: "Discover collection", orderNow: "Order now" } },
  ar: { translation: { home: "الرئيسية", shop: "المتجر", collections: "المجموعات", brands: "العلامات", cart: "السلة", admin: "الإدارة", discover: "اكتشف المجموعة", orderNow: "اطلب الآن" } }
};

i18n.use(initReactI18next).init({
  resources,
  lng: "fr",
  fallbackLng: "fr",
  interpolation: { escapeValue: false }
});

export default i18n;
