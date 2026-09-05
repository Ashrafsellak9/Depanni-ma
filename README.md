# DEPANNI.ma

Monorepo [Turborepo](https://turbo.build) pour la plateforme de dépannage et services à domicile au Maroc.

## Structure

```
depanni/
├── apps/
│   ├── api/                 # Node.js 20 + Express 5 + Prisma 5
│   ├── web/                 # Next.js 14 (App Router) — citoyen
│   ├── admin/               # Next.js 14 — dashboard admin
│   ├── mobile-citizen/      # React Native 0.73 + Expo SDK 50
│   └── mobile-artisan/      # React Native 0.73 + Expo SDK 50
├── packages/
│   ├── ui/                  # Composants partagés (shadcn/ui base)
│   ├── types/               # Types TypeScript globaux
│   ├── utils/               # Helpers partagés
│   ├── config/              # ESLint, TypeScript, Tailwind, Prettier
│   └── validators/          # Schémas Zod partagés
├── turbo.json
├── pnpm-workspace.yaml
└── docker-compose.yml
```

## Stack technique

| Domaine | Technologies |
|---------|-------------|
| **Backend** | Node.js 20 LTS, Express 5, Prisma 5, PostgreSQL 16 + PostGIS |
| **Cache** | Redis 7 (sessions, rate limit, pub/sub Socket.io) |
| **Realtime** | Socket.io 4 + Redis adapter |
| **Web** | Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui |
| **Mobile** | React Native 0.73, Expo SDK 50, Expo Router v3 |
| **Auth** | JWT (access 15 min) + refresh (7 j) + OTP SMS (Twilio) |
| **Paiement** | CMI Maroc + wallet interne |
| **Maps** | Google Maps Platform |
| **Push** | FCM + Expo Notifications |
| **Storage** | Cloudflare R2 (S3 API) ; fallback local `.uploads` en dev uniquement |
| **Monitoring** | Sentry, Prometheus, Grafana |
| **CI/CD** | GitHub Actions, Docker, Nginx, PM2 |

## Prérequis

- **Node.js** ≥ 20 LTS
- **pnpm** ≥ 9
- **Docker** & Docker Compose (PostgreSQL, Redis, pgAdmin)
- **Expo CLI** (pour les apps mobile) : `npm i -g expo-cli` ou `npx expo`

## Installation

```bash
# Cloner et entrer dans le projet
cd Depanni

# Installer les dépendances
pnpm install

# Variables d'environnement
cp .env.example .env
# Guide détaillé variable par variable : voir ENV.md

# Démarrer PostgreSQL + Redis + pgAdmin
pnpm docker:up

# Générer le client Prisma et appliquer les migrations
pnpm db:generate
pnpm db:migrate
```

## Développement

```bash
# Stack web (API + site + admin) — recommandé
pnpm dev

# Stack web + les 2 apps Expo (ports Metro séparés)
pnpm dev:all

# Apps mobiles seules
pnpm dev:mobile

# Un workspace spécifique
pnpm --filter @depanni/web dev
pnpm --filter @depanni/api dev
pnpm --filter @depanni/admin dev
pnpm --filter @depanni/mobile-citizen dev
pnpm --filter @depanni/mobile-artisan dev
```

### Ports par défaut

| Service | URL |
|---------|-----|
| API | http://localhost:4000 |
| Web (citoyen) | http://localhost:3000 |
| Admin | http://localhost:3001 |
| Metro citoyen | http://localhost:8081 |
| Metro artisan | http://localhost:8082 |
| pgAdmin | http://localhost:5050 |
| PostgreSQL | localhost:5433 (Docker — le port 5432 est souvent pris par PostgreSQL Windows) |
| Redis | localhost:6379 |

### Dépannage base de données

**Postgres en boucle `Restarting`** — volume incompatible (ex. PG 15 → 16) :

```bash
docker compose down -v
docker compose up -d
```

**Erreur Prisma P1000** — deux causes fréquentes sous Windows :

1. **Conflit de port** : un PostgreSQL local écoute sur `5432`. Docker DEPANNI utilise **`5433`** (`DATABASE_URL` doit contenir `:5433`).
2. **Variable système Conda** : si `echo $env:DATABASE_URL` affiche `:5432`, elle écrase le `.env`. Supprimer ou corriger :

```powershell
# Vérifier
echo $env:DATABASE_URL

# Supprimer (session courante)
Remove-Item Env:DATABASE_URL

# Puis relancer (le flag -o dans les scripts force le .env du projet)
pnpm db:migrate
```

Alternative rapide sans historique de migrations : `pnpm --filter @depanni/api run db:push`

## Scripts racine

| Commande | Description |
|----------|-------------|
| `pnpm build` | Build tous les workspaces (ordre Turbo) |
| `pnpm dev` | Dev web (API + site + admin) |
| `pnpm dev:all` | Dev web + apps Expo |
| `pnpm dev:mobile` | Apps Expo seules |
| `pnpm lint` | ESLint sur tout le monorepo |
| `pnpm test` | Tests unitaires |
| `pnpm typecheck` | Vérification TypeScript |
| `pnpm format` | Prettier |
| `pnpm docker:up` | Docker Compose up |
| `pnpm db:studio` | Prisma Studio |

## Packages partagés

| Alias | Package | Description |
|-------|---------|-------------|
| `@depanni/ui` | `packages/ui` | Button, Card, utilitaires shadcn |
| `@depanni/types` | `packages/types` | User, Artisan, Job, Offer, Payment, Mission, Chat, Notification |
| `@depanni/validators` | `packages/validators` | AuthSchema, JobSchema, OfferSchema, ProfileSchema (Zod) |
| `@depanni/utils` | `packages/utils` | distanceKm, formatMAD, pagination… |
| `@depanni/config` | `packages/config` | Configs ESLint, TS, Tailwind, Prettier |

TypeScript **strict mode** est activé dans tous les `tsconfig`.

## Production — checklist

Avant un déploiement réel, vérifier :

1. **PostgreSQL 16 + PostGIS** — image Docker `postgis/postgis` (déjà dans `docker-compose.yml`). Le seed ignore `artisans.location` si la colonne geography est absente.
2. **JWT RS256** — `JWT_PRIVATE_KEY` + `JWT_PUBLIC_KEY` obligatoires (`openssl genrsa` / `openssl rsa -pubout`). L’API refuse de démarrer sans ces clés.
3. **Cloudflare R2** — `S3_ENDPOINT`, `S3_BUCKET`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`, `S3_PUBLIC_URL`. Pas de fallback `.uploads` hors dev/test.
4. **CMI Maroc** — `CMI_MERCHANT_ID`, `CMI_STORE_KEY`, `CMI_CALLBACK_URL` (API publique HTTPS), `CMI_RETURN_URL` (`/payment/success`), `CMI_FAIL_URL` (`/payment/fail`). Sans merchant, le checkout carte répond 503 (espèces restent possibles).
5. **Twilio OTP** — requis en production. En local, le champ `devOtp` est renvoyé si Twilio est vide.
6. **Cookies** — `COOKIE_SECURE=true`, `COOKIE_DOMAIN=.depanni.ma`, CORS limité aux origines HTTPS.
7. **Ports** — Postgres Docker sur **5433** (évite le conflit avec PostgreSQL Windows / autres stacks). Redis **6379**.

Les images Docker / Nginx / PM2 seront ajoutées dans `.github/workflows` et `infra/`.

## Landing page (web)

La home citoyen (`apps/web`) utilise une direction artistique dédiée, isolée des dashboards artisan / auth.

- **Prérequis** : Node.js ≥ 20 LTS, pnpm ≥ 9
- **Lancer** : `pnpm --filter @depanni/web dev` puis http://localhost:3000
- **Build prod** : `pnpm --filter @depanni/web build` puis `pnpm --filter @depanni/web start`
- **Tokens** : `apps/web/tailwind.config.ts` — couleurs `ink` `#0B1B2B`, `paper` `#F5EFE6`, `rust` `#D9451F`, `line` `#DDD3C1`, `success` `#2F7D5B` ; typos `font-display` Fraunces, `font-ui` Inter Tight, `font-data` JetBrains Mono
- **Styles globaux** : `.landing-root`, `.landing-container`, `.font-display-soft`, `.num`, `.grain-ink` dans `apps/web/src/app/globals.css`
- **Sections** : `apps/web/src/components/landing/` — un fichier par bandeau (Navbar, Hero, Stats, Services…)
- **Modal demande** : `apps/web/src/components/landing/request/` + store `apps/web/src/store/requestModalStore.ts`
- **Backend du formulaire** : aujourd’hui `POST /api/requests` logue le payload (`apps/web/src/app/api/requests/route.ts`). Remplacer le `console.log` par un appel CRM / DB (Airtable, Supabase, HubSpot) avant la mise en production.
- **Cookies / analytics** : `CookieBanner` + event `cookieConsentChange` (`apps/web/src/lib/cookieConsent.ts`). Brancher Plausible / GA4 dans `apps/web/src/components/landing/Analytics.tsx`.
- **CTA analytics** : attributs `data-event` prêts pour Plausible / PostHog
- Les dashboards gardent Syne / DM Sans et les tokens `navy` / `orange` existants

Pour ajouter une section : créer le composant dans `components/landing/`, l’importer dans `src/app/(public)/page.tsx`, réutiliser `landing-container` + `py-24 md:py-32`.

## Licence

Propriétaire — DEPANNI.ma © 2026
