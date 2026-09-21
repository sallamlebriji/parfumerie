export default {
  nav: {
    home: "Accueil",
    shop: "Boutique",
    collections: "Collections",
    brands: "Marques",
    about: "À propos",
    contact: "Contact",
    track: "Suivre ma commande",
    favorites: "Favoris",
    cart: "Panier",
    language: "Langue",
    menu: "Menu",
    close: "Fermer",
    orderNow: "Commander",
    skip: "Aller au contenu"
  },
  common: {
    addToCart: "Ajouter au panier",
    added: "{{name}} ajouté au panier",
    viewProduct: "Voir le parfum",
    outOfStock: "Rupture de stock",
    inStock: "En stock",
    lowStock: "Plus que {{count}} en stock",
    promo: "Promo",
    new: "Nouveau",
    loading: "Chargement…",
    backToShop: "Retour à la boutique",
    seeAll: "Tout voir",
    orderOnWhatsapp: "Commander sur WhatsApp",
    writeOnWhatsapp: "Écrire sur WhatsApp",
    search: "Rechercher",
    reset: "Réinitialiser",
    remove: "Retirer",
    quantity: "Quantité",
    total: "Total",
    subtotal: "Sous-total",
    results_one: "{{count}} parfum",
    results_other: "{{count}} parfums",
    decrease: "Diminuer la quantité",
    increase: "Augmenter la quantité",
    addFavorite: "Ajouter aux favoris",
    removeFavorite: "Retirer des favoris",
    error: "Une erreur est survenue. Réessayez dans un instant."
  },
  genders: { Homme: "Homme", Femme: "Femme", Mixte: "Mixte" },
  families: {
    oud: "Oud", ambre: "Ambré", musc: "Musc", floral: "Floral", boise: "Boisé", frais: "Frais", gourmand: "Gourmand",
    aromatique: "Aromatique", oriental: "Oriental", luxe: "Luxe", cuir: "Cuir", epice: "Épicé", fruite: "Fruité", musque: "Musqué", coffrets: "Coffrets"
  },
  home: {
    hero: {
      eyebrow: "Parfumerie en ligne",
      title: "Oud, ambre, musc : choisissez votre signature.",
      text: "Des grandes maisons aux essences orientales, une sélection de parfums à commander en quelques clics. Nous confirmons chaque commande avec vous sur WhatsApp.",
      primary: "Découvrir la boutique",
      pick: "Notre coup de cœur"
    },
    families: {
      eyebrow: "Familles olfactives",
      title: "Partez de ce que vous aimez",
      text: "Boisé, ambré, floral ou frais : parcourez la boutique par famille."
    },
    featured: {
      eyebrow: "Sélection",
      title: "La sélection du moment",
      text: "Des parfums à découvrir, à s'offrir ou à offrir."
    },
    ritual: {
      eyebrow: "Commander",
      title: "Simple comme un message",
      text: "Pas de compte à créer : choisissez vos parfums, laissez vos coordonnées et confirmez sur WhatsApp.",
      steps: [
        { title: "Choisissez", text: "Parcourez la boutique et ajoutez vos parfums au panier." },
        { title: "Laissez vos coordonnées", text: "Nom, téléphone, adresse. Rien d'autre." },
        { title: "Confirmez sur WhatsApp", text: "Nous vérifions la disponibilité et organisons la livraison avec vous." }
      ],
      videoLabel: "Lire la vidéo",
      pauseLabel: "Mettre la vidéo en pause"
    },
    offers: { eyebrow: "Promotions", title: "Prix réduits en ce moment" },
    brands: { eyebrow: "Maisons", title: "Les marques en boutique", text: "Retrouvez leurs parfums en un clic." },
    newest: { eyebrow: "Nouveautés", title: "Derniers arrivages" },
    cta: { title: "Vous hésitez entre deux parfums ?", text: "Écrivez-nous sur WhatsApp, nous vous répondons avec plaisir." }
  },
  shop: {
    eyebrow: "Boutique",
    title: "Tous les parfums",
    text: "Filtrez par famille, marque ou budget pour trouver le vôtre.",
    searchPlaceholder: "Rechercher un parfum ou une marque",
    filters: "Filtres",
    allFamilies: "Toutes les familles",
    sortLabel: "Trier par",
    sort: { recommended: "Sélection", priceAsc: "Prix croissant", priceDesc: "Prix décroissant", newest: "Nouveautés" },
    gender: "Pour",
    allGenders: "Tous",
    brand: "Marque",
    allBrands: "Toutes les marques",
    price: "Budget (DH)",
    min: "Min",
    max: "Max",
    availableOnly: "Uniquement les parfums en stock",
    promoOnly: "Uniquement les promotions",
    clear: "Effacer les filtres",
    none: { title: "Aucun parfum ne correspond", text: "Essayez une autre famille ou élargissez votre budget." }
  },
  product: {
    pyramid: "Pyramide olfactive",
    notesEyebrow: "Notes olfactives",
    top: "Notes de tête",
    heart: "Notes de cœur",
    base: "Notes de fond",
    pyramidText: "Les notes de tête s'ouvrent en premier, celles de cœur donnent son caractère au parfum, celles de fond restent sur la peau.",
    noNotes: "Les notes de ce parfum seront bientôt renseignées.",
    description: "Description",
    similar: "Vous aimerez aussi",
    volume: "Contenance",
    orderMessage: "Bonjour, je souhaite commander {{name}} ({{volume}}).",
    reassurance: ["Commande confirmée par WhatsApp", "Paiement à la livraison ou par virement"],
    notFound: { title: "Ce parfum est introuvable", text: "Il n'est plus au catalogue ou le lien est incorrect." }
  },
  cart: {
    eyebrow: "Panier",
    title: "Votre panier",
    empty: { title: "Votre panier est vide", text: "Ajoutez un parfum pour commencer votre commande." },
    deliveryNote: "Les frais de livraison éventuels sont confirmés avec vous sur WhatsApp.",
    checkout: "Passer la commande",
    continue: "Continuer mes achats",
    items_one: "{{count}} article",
    items_other: "{{count}} articles"
  },
  checkout: {
    eyebrow: "Commande",
    title: "Finaliser la commande",
    text: "Aucun compte à créer. Vos informations servent uniquement à livrer votre commande.",
    contact: "Vos coordonnées",
    fullName: "Nom complet",
    phone: "Téléphone",
    phoneHint: "Numéro sur lequel nous pouvons vous joindre, de préférence WhatsApp.",
    city: "Ville",
    address: "Adresse de livraison",
    notes: "Note pour la boutique (facultatif)",
    delivery: { label: "Livraison", home: "À domicile", pickup: "Retrait en boutique" },
    payment: { label: "Paiement", cash: "À la livraison", transfer: "Par virement" },
    submit: "Envoyer la commande",
    submitting: "Envoi en cours…",
    summary: "Récapitulatif",
    consent: "En envoyant la commande, vous acceptez d'être contacté sur WhatsApp au numéro indiqué.",
    errors: {
      name: "Saisissez votre nom complet.",
      phone: "Saisissez un numéro de téléphone valide.",
      city: "Indiquez votre ville.",
      address: "Indiquez votre adresse."
    },
    failed: "La commande n'a pas pu être enregistrée. Vérifiez votre connexion ou envoyez-la directement sur WhatsApp.",
    sendAnyway: "Envoyer sur WhatsApp sans l'enregistrer",
    empty: { title: "Rien à commander pour l'instant", text: "Ajoutez d'abord un parfum à votre panier." },
    pickupAddress: "Retrait en boutique"
  },
  success: {
    eyebrow: "Commande envoyée",
    title: "Merci, nous avons bien reçu votre commande",
    text: "Dernière étape : confirmez-la sur WhatsApp pour que nous puissions la traiter plus vite.",
    reference: "Votre référence",
    keep: "Conservez cette référence : elle vous permet de suivre votre commande.",
    whatsapp: "Confirmer sur WhatsApp",
    track: "Suivre ma commande",
    home: "Retour à l'accueil",
    noOrder: "Aucune commande récente à afficher."
  },
  track: {
    eyebrow: "Suivi",
    title: "Où en est ma commande ?",
    text: "Entrez la référence reçue à la commande et le numéro de téléphone utilisé.",
    reference: "Référence",
    referencePlaceholder: "Ex. 8F3A2C",
    phone: "Téléphone",
    submit: "Suivre ma commande",
    searching: "Recherche…",
    notFound: "Aucune commande ne correspond à ces informations.",
    placedOn: "Commande du {{date}}",
    items: "Articles",
    help: "Une question sur cette commande ?",
    status: { pending: "Reçue", confirmed: "Confirmée", delivered: "Livrée", cancelled: "Annulée" },
    statusText: {
      pending: "Nous avons reçu votre commande et allons la confirmer avec vous.",
      confirmed: "Votre commande est confirmée et en préparation.",
      delivered: "Votre commande a été livrée.",
      cancelled: "Cette commande a été annulée. Écrivez-nous si c'est une erreur."
    }
  },
  collections: {
    eyebrow: "Collections",
    title: "Explorer par famille olfactive",
    text: "Chaque famille regroupe des parfums aux notes voisines."
  },
  brandsPage: {
    eyebrow: "Marques",
    title: "Les maisons en boutique",
    text: "Choisissez une marque pour voir ses parfums."
  },
  faq: {
    eyebrow: "Aide",
    title: "Questions fréquentes",
    text: "L'essentiel pour commander sereinement.",
    items: [
      { q: "Comment passer commande ?", a: "Ajoutez vos parfums au panier, renseignez vos coordonnées puis envoyez la commande. Nous la confirmons avec vous sur WhatsApp." },
      { q: "Faut-il créer un compte ?", a: "Non. Votre nom, votre téléphone et votre adresse suffisent." },
      { q: "Quels sont les modes de paiement ?", a: "Paiement à la livraison ou par virement bancaire. Les détails sont confirmés avec vous sur WhatsApp." },
      { q: "Quels sont les délais et les frais de livraison ?", a: "Ils dépendent de votre ville. Nous vous les indiquons avant de valider la livraison." },
      { q: "Comment suivre ma commande ?", a: "Rendez-vous sur la page de suivi et saisissez votre référence ainsi que votre numéro de téléphone." },
      { q: "Un parfum est en rupture de stock, que faire ?", a: "Écrivez-nous sur WhatsApp pour connaître les prochaines disponibilités." },
      { q: "Puis-je modifier ou annuler ma commande ?", a: "Contactez-nous au plus vite sur WhatsApp en indiquant votre référence." }
    ]
  },
  about: {
    eyebrow: "À propos",
    title: "Des parfums choisis, une commande simple.",
    text: "Maison Parfumée réunit des parfums de grandes maisons et des essences orientales. Chaque commande est confirmée avec vous sur WhatsApp, pour que vous receviez le bon parfum.",
    blocks: [
      { title: "Une sélection lisible", text: "Chaque fiche indique les notes de tête, de cœur et de fond pour choisir sans deviner." },
      { title: "Une commande sans détour", text: "Pas de compte à créer. Vous laissez vos coordonnées, nous confirmons par WhatsApp." },
      { title: "Un suivi simple", text: "Votre référence et votre numéro de téléphone suffisent pour suivre votre commande." }
    ]
  },
  contact: {
    eyebrow: "Contact",
    title: "Parlons de votre prochain parfum",
    text: "Le plus rapide : un message WhatsApp. Vous pouvez aussi écrire ci-dessous, le message s'ouvre dans WhatsApp.",
    name: "Votre nom",
    message: "Votre message",
    send: "Envoyer sur WhatsApp",
    direct: "Ou écrivez-nous directement",
    defaultMessage: "Bonjour, j'ai une question sur vos parfums."
  },
  favorites: {
    title: "Vos favoris",
    text: "Les parfums que vous avez mis de côté sur cet appareil.",
    empty: { title: "Aucun favori pour l'instant", text: "Touchez le cœur d'un parfum pour le retrouver ici." }
  },
  footer: {
    tagline: "Parfums de créateurs et essences orientales, à commander en quelques clics.",
    shop: "Boutique",
    help: "Aide",
    confirmation: "Commande confirmée par WhatsApp",
    payments: "Paiement à la livraison ou par virement",
    rights: "© {{year}} Maison Parfumée. Tous droits réservés."
  },
  notFound: { title: "Cette page n'existe pas", text: "Le lien est peut-être incorrect ou la page a été déplacée.", home: "Retour à l'accueil" },
  denied: { title: "Accès refusé", text: "Votre rôle ou votre abonnement ne permet pas d'ouvrir cette page." }
};
