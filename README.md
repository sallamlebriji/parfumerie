# Maison Parfumee - MERN Stack

Application web complete pour une parfumerie: catalogue client, panier, commande via WhatsApp, dashboard admin, CRUD parfums avec upload local et gestion des commandes.

## Technologies

- Frontend: React.js, Vite, Tailwind CSS, Framer Motion, React Router DOM, Zustand, TanStack Query, TanStack Table, React Hook Form, Zod, Recharts, jsPDF, html2canvas, i18next, React Hot Toast
- Backend: Node.js, Express.js, MongoDB, Mongoose
- Auth admin: JWT + bcrypt
- Upload images: Multer local
- Commandes: enregistrement MongoDB puis ouverture WhatsApp

## Installation

```bash
cd perfume-shop-mern
npm install
npm run install:all
```

Ou separement:

```bash
cd backend
npm install

cd ../frontend
npm install
```

## Configuration MongoDB

Installez et lancez MongoDB en local, puis gardez cette URI dans `backend/.env`:

```env
MONGO_URI=mongodb://127.0.0.1:27017/perfume_shop
```

## Configuration WhatsApp

Dans `backend/.env`:

```env
WHATSAPP_NUMBER=212600000000
WHATSAPP_ORDER_TO_NUMBER=212600000000
WHATSAPP_PHONE_NUMBER_ID=
WHATSAPP_CLOUD_TOKEN=
WHATSAPP_CLOUD_API_VERSION=v20.0
```

Dans `frontend/.env`:

```env
VITE_WHATSAPP_NUMBER=212600000000
```

Utilisez le format international sans `+`, par exemple `2126XXXXXXXX`.

Pour envoyer le message sans redirection vers WhatsApp, configurez l'API officielle WhatsApp Cloud de Meta:

- `WHATSAPP_PHONE_NUMBER_ID`: ID du numero WhatsApp Business Cloud.
- `WHATSAPP_CLOUD_TOKEN`: token d'acces Meta.
- `WHATSAPP_ORDER_TO_NUMBER`: numero qui recoit les commandes, sans `+`.

Sans ces valeurs, la commande est enregistree mais le backend signale que l'envoi WhatsApp n'est pas configure.

## Creer l'admin par defaut

Modifiez si besoin dans `backend/.env`:

```env
ADMIN_EMAIL=admin@parfumerie.local
ADMIN_PASSWORD=Admin12345
```

Puis lancez:

```bash
cd backend
npm run seed:admin
```

## Lancer le projet

Backend:

```bash
cd backend
npm run dev
```

Frontend:

```bash
cd frontend
npm run dev
```

Ou depuis la racine:

```bash
npm run dev
```

URLs:

- Client: `http://localhost:5173`
- Admin: `http://localhost:5173/admin/login`
- API: `http://localhost:5000/api`

## Endpoints API

Auth:

- `POST /api/auth/login`
- `GET /api/auth/profile`

Parfums:

- `GET /api/perfumes`
- `GET /api/perfumes/:id`
- `GET /api/perfumes/featured/list`
- `POST /api/perfumes` protege JWT
- `PUT /api/perfumes/:id` protege JWT
- `DELETE /api/perfumes/:id` protege JWT

Commandes:

- `POST /api/orders`
- `GET /api/orders` protege JWT
- `GET /api/orders/:id` protege JWT
- `PUT /api/orders/:id/status` protege JWT
- `DELETE /api/orders/:id` protege JWT

## Notes

- Les images uploadees sont stockees dans `backend/uploads`.
- Le panier est conserve dans `localStorage`.
- La commande est d'abord enregistree dans MongoDB, puis le site ouvre `https://wa.me/...` avec le message encode.
- Changez `JWT_SECRET` avant toute utilisation reelle.

## Nouveau frontend premium

Le frontend contient une architecture scalable dans `frontend/src`:

- `components/ui`: Button, Input, Select, Modal, Drawer, Badge, Card
- `components/layout`: layouts public/admin, routes protegees
- `components/product`: ProductCard, ProductGrid, FilterPanel, PriceTag, RatingStars
- `components/cart`: CartItem, QuantitySelector
- `components/dashboard`: StatCard, graphiques Recharts
- `components/tables`: DataTable avec TanStack Table
- `components/forms`: CheckoutForm avec React Hook Form + Zod
- `pages/public`: accueil, boutique, detail, panier, checkout, suivi, pages editoriales
- `pages/admin`: dashboard et modules admin
- `services`: services mock/API
- `store`: store Zustand
- `i18n`: langues FR / AR / EN
- `data`: donnees mockees produits, categories, marques, commandes, clients, stocks, promotions et statistiques

Routes principales:

- Public: `/`, `/shop`, `/shop/:id`, `/collections`, `/brands`, `/cart`, `/checkout`, `/order-success`, `/track-order`, `/about`, `/contact`, `/faq`
- Auth: `/login`, `/register`, `/forgot-password`
- Admin: `/admin/dashboard`, `/admin/products`, `/admin/categories`, `/admin/brands`, `/admin/orders`, `/admin/customers`, `/admin/stocks`, `/admin/promotions`, `/admin/payments`, `/admin/reports`, `/admin/settings`

Le frontend fonctionne avec les donnees mockees meme sans backend. Les anciens chemins `/catalogue`, `/panier` et `/commande` redirigent vers les nouvelles routes.
