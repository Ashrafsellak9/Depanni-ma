/**
 * Identifiants de développement uniquement.
 * Surcharge possible via SEED_ADMIN_EMAIL / SEED_PASSWORD dans .env
 *
 * Ancien couple compromis (ne plus utiliser) :
 *   admin@depanni.ma / Depanni@2026!
 */
export const LEGACY_ADMIN_EMAIL = "admin@depanni.ma";

export const SEED_ADMIN_EMAIL =
  process.env.SEED_ADMIN_EMAIL?.trim() || "ops@depanni.ma";

export const SEED_ADMIN_PHONE =
  process.env.SEED_ADMIN_PHONE?.trim() || "+212600000001";

/** Mot de passe partagé des comptes seed (admin, citoyens, artisans). */
export const SEED_PASSWORD =
  process.env.SEED_PASSWORD?.trim() || "Seed!Depanni9kQx";
