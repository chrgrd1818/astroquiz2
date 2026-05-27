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

###  npm install et package.json


{
  "name": "app",
  "type": "module",
  "version": "0.0.1",
  "engines": {
    "node": ">=22.12.0"
  },
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "astro": "astro"
  },
  "dependencies": {
    "@astrojs/vercel": "^10.0.7",
    "@supabase/ssr": "^0.10.3",
    "@supabase/supabase-js": "^2.106.2",
    "@tailwindcss/vite": "^4.3.0",
    "astro": "^6.3.8",
    "autoprefixer": "^10.5.0",
    "tailwindcss": "^4.3.0",
    "zod": "^4.4.3"
  }
}

---

Via Github, Vercel exécute le build et déploie les fonctions SSR/edge. Les routes /api/* deviennent des fonctions serverless/edge et les pages SSR sont rendues à la demande.

