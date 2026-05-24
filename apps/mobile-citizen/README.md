# DEPANNI — App mobile citoyen

Application Expo (SDK 50) avec **Expo Router v3**, authentification JWT (Secure Store) et navigation par fichiers.

## Démarrage

```powershell
# Depuis la racine du monorepo
pnpm docker:up
pnpm --filter @depanni/api dev

# Copier la config
cp apps/mobile-citizen/.env.example apps/mobile-citizen/.env

# Lancer l'app
pnpm --filter @depanni/mobile-citizen dev
```

Variables :

| Variable | Description |
|----------|-------------|
| `EXPO_PUBLIC_API_URL` | API (ex. `http://192.168.x.x:4000` sur appareil physique) |
| `EXPO_PUBLIC_GOOGLE_MAPS_API_KEY` | Clé Maps (Android/iOS) |

Compte seed : `fatima@example.ma` / `Depanni@2026!`

## Structure `app/`

| Route | Rôle |
|-------|------|
| `(auth)/welcome` | Onboarding |
| `(auth)/login` | Connexion |
| `(auth)/register` | Inscription |
| `(auth)/verify-otp` | OTP SMS |
| `(tabs)/` | Accueil, missions, chat, profil |
| `request/new` | Wizard demande |
| `mission/[id]` | Détail + tracking |
| `artisan/[id]` | Profil artisan public |

## Navigation & auth

- **Stack** racine : auth, tabs, modales mission/request/artisan
- **Tabs** : app authentifiée
- **Redirection** : `useProtectedRoute` + `authStore` (Zustand) après `hydrate()`
- **Deep links** : `depanni://mission/<id>` → `app/mission/[id].tsx`

## Build EAS

```powershell
cd apps/mobile-citizen
eas login
eas init   # remplace projectId dans app.json
eas build --profile preview --platform android
eas build --profile production --platform ios   # TestFlight
```

Profils : `development`, `preview`, `production` (`eas.json`).

## Prochaines étapes

- Wizard demande complet (validators partagés `@depanni/validators`)
- Socket.io chat + notifications push
- Carte tracking mission (react-native-maps + socket tracking)
