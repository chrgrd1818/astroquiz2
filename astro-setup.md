Astro SSR Starter — README

Ce README décrit un starter kit Astro (SSR) minimal et générique, prêt pour GitHub → Vercel. Il inclut : page publique (home), page privée (account), routes API (auth + couche DB centralisée), middleware d’auth, Tailwind, assets main.css / main.js, et une page 404. Aucun code métier spécifique n’est inclus — l’architecture est générique.

Arborescence complète du projet

project-root/
├── astro.config.mjs
├── package.json
├── tailwind.config.cjs
├── postcss.config.cjs
├── public/
│   └── favicon.ico
├── src/
│   ├── pages/
│   │   ├── index.astro
│   │   ├── account.astro
│   │   ├── register.astro
│   │   ├── 404.astro
│   │   
│   ├── pages/api/
│   │   ├── auth/
│   │   │   ├── login.js
│   │   │   ├── logout.js
│   │   │   └── register.js
│   │   └── db.js
│   │   
│   ├── layouts/
│   │   └── BaseLayout.astro
│   │   
│   ├── components/
│   │   └── Nav.astro
│   │   
│   ├── lib/
│   │   └── supabase.js
│   │   
│   ├── middleware/
│   │   └── auth.js
│   │   
│   ├── schemas/
│   │   └── authSchema.js
│   │   
│   └── assets/
│       ├── main.css
│       └── main.js
└── .env.local
```

---

### Rôles synthétiques (ce que contient chaque dossier/fichier)

* **`src/pages/index.astro`** — page publique d’accueil.
* **`src/pages/account.astro`** — page privée ; rendu SSR ; vérifie la session côté serveur.
* **`src/pages/register.astro`** — page d’inscription avec formulaire et validation Zod.
* **`src/pages/404.astro`** — page 404 personnalisée.
* **`src/pages/api/auth/login.js` & `logout.js` & `register.js`** — endpoints d’auth (connexion, déconnexion, inscription), gestion des cookies de session.
* **`src/pages/api/db.js`** — couche modèle / repository centralisée (fonctions métier réutilisables pour lecture/écriture/transformations).
* **`src/lib/supabase.js`** — initialisation du client Supabase compatible SSR (helpers cookies).
* **`src/middleware/auth.js`** — middleware pour protéger les routes privées (vérification session).
* **`src/schemas/authSchema.js`** — schémas Zod pour validation des données d’authentification.
* **`src/assets/main.css`** — entrée CSS globale (Tailwind directives + styles globaux).
* **`src/assets/main.js`** — entrée JS client pour interactions légères.
* **`astro.config.mjs`** — configuration Astro (SSR) + intégration Tailwind + adapter Vercel.
* **`postcss.config.cjs`** — optionnel mais recommandé pour `autoprefixer` et plugins PostCSS.

---

### Commandes npm (initialisation, installation, usage)

**Créer le projet**

```bash
npm create astro@latest my-astro-starter
cd my-astro-starter

Installer dépendances principales

npm install @astrojs/vercel @astrojs/tailwind @supabase/supabase-js @supabase/ssr zod

Installer Tailwind et PostCSS en dev

npm install -D tailwindcss postcss autoprefixer

Initialiser Tailwind (optionnel)

npx tailwindcss init -p

Scripts usuels (déjà présents ou à ajouter dans package.json)

npm run dev — développement local

npm run build — build SSR pour production

npm run preview — prévisualiser le build localement

Variables d’environnement (local & Vercel)

Définir ces variables en local (.env.local) et dans Vercel (Project Settings → Environment Variables) :

PUBLIC_SUPABASE_URL — URL du projet Supabase

PUBLIC_SUPABASE_ANON_KEY — clé anonyme publique

SUPABASE_SERVICE_ROLE_KEY — uniquement côté serveur (ne jamais exposer au client)

Bonnes pratiques : ne jamais exposer la SERVICE_ROLE_KEY côté client ; utiliser httpOnly et secure pour les cookies en production.

Résumé du déploiement GitHub → Vercel (workflow)

Push sur GitHub

Créer un repo, committer le projet et pousser sur GitHub.

Importer sur Vercel

Sur Vercel, créer un nouveau projet et importer depuis GitHub.

Vercel détecte Astro et configure l’adapter SSR automatiquement.

Configurer les variables d’environnement

Ajouter PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, et SUPABASE_SERVICE_ROLE_KEY (si nécessaire).

Paramètres de build recommandés

Build Command : npm run build

Install Command : npm ci ou npm install

Output Directory : laisser vide (géré par l’adapter)

Déploiement

Vercel exécute le build et déploie les fonctions SSR/edge. Les routes /api/* deviennent des fonctions serverless/edge et les pages SSR sont rendues à la demande.

