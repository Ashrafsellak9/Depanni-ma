/**
 * Génère une paire RSA 2048 pour JWT RS256.
 * Usage: pnpm exec tsx scripts/generate-jwt-keys.ts
 *
 * Rotation: déployer JWT_PUBLIC_KEY + JWT_PRIVATE_KEY,
 * garder l'ancienne publique dans JWT_PREVIOUS_PUBLIC_KEY 24–48h.
 */
import { generateKeyPairSync } from "node:crypto";

const { privateKey, publicKey } = generateKeyPairSync("rsa", {
  modulusLength: 2048,
  publicKeyEncoding: { type: "spki", format: "pem" },
  privateKeyEncoding: { type: "pkcs8", format: "pem" },
});

const esc = (pem: string) => pem.replace(/\n/g, "\\n");

console.log("# Ajoutez à .env (NE PAS committer la clé privée)\n");
console.log(`JWT_KEY_ID=depanni-${new Date().getFullYear()}`);
console.log(`JWT_PRIVATE_KEY="${esc(privateKey)}"`);
console.log(`JWT_PUBLIC_KEY="${esc(publicKey)}"`);
