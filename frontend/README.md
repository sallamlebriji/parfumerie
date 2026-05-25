# Maison Parfumee Frontend

Interface e-commerce premium pour une parfumerie moderne. Le projet combine une vitrine publique elegante, un catalogue produit, un panier, un checkout, un suivi de commande et une zone admin pour piloter les donnees metier.

## Technologies

- React 18 et Vite
- Tailwind CSS
- Framer Motion pour les animations React
- GSAP et ScrollTrigger pour le hero, le parallax et les reveals au scroll
- React Router
- TanStack Query et TanStack Table
- Zustand
- Lucide React
- Axios
- React Hook Form et Zod

## Structure

```txt
src/
  api/          configuration HTTP
  assets/       medias et ressources statiques
  components/   composants UI, layout, produit, dashboard
  data/         contenus et donnees de fallback
  hooks/        hooks reutilisables
  pages/        pages publiques, auth et admin
  routes/       definition des routes
  sections/     sections reutilisables
  services/     services API
  store/        etat global
  utils/        helpers
```

## Installation

```bash
npm install
```

## Lancement local

```bash
npm run dev
```

Par defaut, l'application tourne sur `http://localhost:5173`.

## Build production

```bash
npm run build
```

Le build est genere dans `dist/`. Le script utilise une limite memoire Node plus confortable pour eviter les erreurs de heap sur Windows.

## Preview locale du build

```bash
npm run preview
```

## Variables d'environnement

Creer ou mettre a jour `.env` avec les valeurs suivantes:

```env
VITE_API_URL=http://localhost:5505/api
VITE_UPLOADS_URL=http://localhost:5505/uploads
VITE_WHATSAPP_NUMBER=212600000000
```

## Deploiement

1. Lancer `npm run build`.
2. Deployer le dossier `dist/` sur Vercel, Netlify, Render, Hostinger ou tout hebergeur statique compatible SPA.
3. Configurer une regle fallback vers `index.html` pour que les routes React fonctionnent au rafraichissement.

## Notes qualite

- La home publique est organisee en sections premium: Hero, Services, Realisations, A propos, Collections, Produits, Temoignages et Contact.
- Les animations sont sobres, rapides et respectent `prefers-reduced-motion`.
- Les donnees produit locales servent de fallback si l'API n'est pas disponible pendant le developpement.
