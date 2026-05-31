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
| **Storage** | AWS S3 compatible (Cloudflare R2) |
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
# Tous les workspaces en parallèle
pnpm dev

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
| `pnpm dev` | Mode développement |
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

## Docker (production)

Les images Docker et la configuration Nginx / PM2 seront ajoutées dans `.github/workflows` et `infra/` lors de la phase déploiement.

## Licence

Propriétaire — DEPANNI.ma © 2026
