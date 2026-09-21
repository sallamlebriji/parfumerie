# Maison Parfumée — boutique de parfums (MERN)

Boutique en ligne de parfums : catalogue, panier, commande enregistrée en base puis confirmée sur WhatsApp, suivi de commande, tableau de bord d'administration multi-boutiques.

## Fonctionnalités

**Boutique (client)**
- Accueil, boutique avec filtres partageables par URL (famille, marque, genre, budget, stock, promotions, tri), collections, marques, favoris.
- Fiche produit avec pyramide olfactive (notes de tête, de cœur et de fond).
- Panier et favoris conservés dans le navigateur (`localStorage`).
- Commande sans compte : la commande est **enregistrée en base**, puis le client la confirme sur WhatsApp (message pré-rempli avec la référence).
- Suivi de commande : référence à 6 caractères + numéro de téléphone (`/track-order`).
- Trois langues (FR, EN, AR) avec bascule de sens de lecture, choix mémorisé.
- FAQ, à propos, contact (via WhatsApp).

**Administration** (`/login`, puis `/admin`)
- Parfums (CRUD avec téléversement d'image), catégories, marques, stocks, promotions, clients, utilisateurs, paramètres.
- Commandes : changement de statut en un clic (en attente, confirmée, livrée, annulée), fiche détaillée, contact WhatsApp, export PDF et CSV.
- Multi-boutiques (rôle `SUPER_ADMIN`), abonnements et modules activables par boutique.

## Technologies

- Frontend : React 18, Vite, Tailwind CSS, React Router, TanStack Query et Table, Zustand, React Hook Form + Zod, i18next, Recharts, Framer Motion (admin).
- Backend : Node.js, Express, MongoDB (Mongoose), JWT + bcrypt, Multer (images).
- Typographie : Bodoni Moda (titres), Manrope (interface), Amiri et Tajawal (arabe).

## Installation

```bash
cd perfume-shop-mern
npm install
npm run install:all
```

## Configuration

`backend/.env`

```env
PORT=5001
CLIENT_URL=http://localhost:5174
MONGO_URI=mongodb://127.0.0.1:27017/perfume_shop
MONGO_DB=perfume_shop
JWT_SECRET=une-longue-chaine-aleatoire
WHATSAPP_NUMBER=2126XXXXXXXX
```

- `MONGO_URI` : MongoDB local ou MongoDB Atlas.
- `CLIENT_URL` : adresse du site (pour le CORS). En production, l'adresse exacte du frontend.
- `JWT_SECRET` : obligatoire, sinon la connexion échoue avec une erreur 500.
- Envoi WhatsApp automatique (facultatif) : `WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_CLOUD_TOKEN`, `WHATSAPP_ORDER_TO_NUMBER`, `WHATSAPP_CLOUD_API_VERSION`.

`frontend/.env`

```env
VITE_API_URL=http://localhost:5001/api
VITE_UPLOADS_URL=http://localhost:5001/uploads
VITE_WHATSAPP_NUMBER=2126XXXXXXXX
VITE_TENANT_SLUG=maison-parfumee
```

- Numéro WhatsApp au format international, sans `+`.
- `VITE_DEMO_DATA=true` (développement uniquement) affiche des produits fictifs quand l'API ne répond pas. Sans cette variable, la boutique affiche un message d'erreur clair.

## Créer le compte administrateur

Le compte n'est **pas** créé automatiquement : `ADMIN_EMAIL` et `ADMIN_PASSWORD` ne sont lus que par le script ci-dessous. Ajoutez-les dans `backend/.env` (mot de passe de 8 caractères minimum, jamais celui d'un exemple), puis lancez le script une fois :

```bash
cd backend
npm run seed:admin
```

Il crée un `SUPER_ADMIN` (ou met à jour celui qui porte le même e-mail). Il utilise la base pointée par `MONGO_URI` : pour le site en ligne, lancez-le avec la même base que celle du serveur déployé.

## Lancer le projet

```bash
npm run dev
```

- Boutique : http://localhost:5174
- Connexion admin : http://localhost:5174/login
- API : http://localhost:5001/api

Backend seul : `cd backend && npm run dev`. Frontend seul : `cd frontend && npm run dev`.

## API

Publique
- `GET /api/perfumes`, `GET /api/perfumes/:id`, `GET /api/perfumes/featured/list`
- `POST /api/orders` : enregistre une commande (nom, téléphone, adresse, ville, produits).
- `GET /api/orders/track?ref=ABC123&phone=06…` : suivi (référence + téléphone requis, limité en fréquence).

Protégée (JWT)
- `POST /api/auth/login`, `GET /api/auth/profile`
- `POST|PUT|DELETE /api/perfumes`
- `GET /api/orders`, `GET /api/orders/:id`, `PUT /api/orders/:id/status`, `DELETE /api/orders/:id`
- `/api/admin/*` (tableau de bord, clients, stocks, utilisateurs, paramètres), `/api/tenants/*` (super admin)

## Déploiement (Vercel + Render)

- Frontend (Vercel) : définir `VITE_API_URL`, `VITE_UPLOADS_URL`, `VITE_WHATSAPP_NUMBER`, `VITE_TENANT_SLUG`.
- Backend (Render) : définir `MONGO_URI`, `MONGO_DB`, `JWT_SECRET`, `CLIENT_URL` (adresse du site Vercel) et `WHATSAPP_NUMBER`.
- Les images téléversées sont stockées dans `backend/uploads` : sur Render, ce disque est effacé à chaque déploiement. Utilisez de préférence des URL d'images hébergées ailleurs.
- Les fichiers de journaux (`.logs/`) sont ignorés par git.

## Design

- Palette : vert pin (`brand-pine`, `brand-night`), or laiton (`brand-gold`), parchemin (`brand-ivory`), définie dans `frontend/tailwind.config.js`.
- Motif signature : les cadres en arche (`.arch`) et la pyramide olfactive.
- Les textes de la boutique sont dans `frontend/src/i18n/locales/` (un fichier par langue).
