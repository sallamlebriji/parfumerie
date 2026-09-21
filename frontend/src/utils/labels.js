// Les catégories viennent de la base, parfois saisies sans accents : on corrige l'affichage seulement.
const categoryLabels = {
  boise: "Boisé",
  epice: "Épicé",
  fruite: "Fruité",
  musque: "Musqué",
  aromatique: "Aromatique",
  gourmand: "Gourmand",
  floral: "Floral",
  frais: "Frais",
  oriental: "Oriental",
  luxe: "Luxe",
  oud: "Oud",
  ambre: "Ambré",
  musc: "Musc",
  cuir: "Cuir",
  coffrets: "Coffrets"
};

const strip = (value) => String(value || "").normalize("NFD").replace(/\p{M}/gu, "").toLowerCase().trim();

export const categoryLabel = (name) => categoryLabels[strip(name)] || name || "";

export const orderStatusKeys = ["pending", "confirmed", "delivered", "cancelled"];

export const familyKey = strip;
