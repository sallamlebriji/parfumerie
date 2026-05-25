import {
  ArrowUpRight,
  BadgeCheck,
  BarChart3,
  Boxes,
  Clock3,
  Gem,
  Headphones,
  PackageCheck,
  ShieldCheck,
  Sparkles,
  Truck,
  Users
} from "lucide-react";

export const brandMarquee = [
  "Maison Noir",
  "Atelier Pure",
  "Velours Paris",
  "Luxe Notes",
  "Urban Essence",
  "Oud Royal"
];

export const heroStats = [
  { value: "12+", label: "fragrances premium" },
  { value: "24h", label: "suivi commande" },
  { value: "4.8/5", label: "experience client" }
];

export const services = [
  {
    icon: Sparkles,
    title: "Selection parfumee",
    text: "Des signatures rares, commerciales et memorables pour homme, femme et mixte."
  },
  {
    icon: Truck,
    title: "Commande fluide",
    text: "Un parcours rapide avec panier, checkout et confirmation WhatsApp integree."
  },
  {
    icon: BarChart3,
    title: "Pilotage boutique",
    text: "Catalogue, stock, commandes et clients structures pour une exploitation serieuse."
  },
  {
    icon: Headphones,
    title: "Conseil premium",
    text: "Une experience claire, humaine et rassurante du premier clic a la livraison."
  }
];

export const processSteps = [
  { icon: Gem, title: "Curater", text: "Choisir des references fortes avec une vraie logique de collection." },
  { icon: Boxes, title: "Organiser", text: "Classer par famille, genre, prix et disponibilite pour faciliter la vente." },
  { icon: PackageCheck, title: "Convertir", text: "Transformer la visite en commande simple, rapide et suivie." }
];

export const achievements = [
  {
    title: "Vitrine e-commerce luxe",
    text: "Hero immersif, cartes produit premium, filtres et parcours d'achat responsive.",
    meta: "UX commerce",
    icon: ArrowUpRight
  },
  {
    title: "Back-office exploitable",
    text: "Modules admin pour produits, categories, marques, stocks et commandes.",
    meta: "Ops boutique",
    icon: ShieldCheck
  },
  {
    title: "Experience client assistee",
    text: "Paiement, panier, suivi et confirmation prepares pour une boutique locale moderne.",
    meta: "Conversion",
    icon: Clock3
  }
];

export const testimonials = [
  {
    quote: "Une presentation premium qui donne confiance immediatement, sans perdre la simplicite du parcours d'achat.",
    name: "Client boutique",
    role: "Parfumerie locale"
  },
  {
    quote: "Le catalogue est plus lisible, les produits respirent mieux et la partie commande devient tres claire.",
    name: "Responsable ventes",
    role: "Maison Parfumee"
  },
  {
    quote: "Le design garde l'esprit parfum tout en apportant une finition proche des sites SaaS modernes.",
    name: "Consultant digital",
    role: "Audit UX"
  }
];

export const trustItems = [
  { icon: BadgeCheck, label: "Qualite garantie" },
  { icon: Users, label: "Conseil humain" },
  { icon: ShieldCheck, label: "Prix transparents" },
  { icon: PackageCheck, label: "Stock visible" }
];
