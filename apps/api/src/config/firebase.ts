import admin from "firebase-admin";

import { env } from "./env.js";
import { logger } from "../utils/logger.js";

let initialized = false;

export function getFirebaseAdmin(): admin.app.App | null {
  if (initialized) {
    return admin.apps[0] ?? null;
  }

  if (!env.FIREBASE_PROJECT_ID || !env.FIREBASE_CLIENT_EMAIL || !env.FIREBASE_PRIVATE_KEY) {
    logger.warn("Firebase credentials missing — push notifications disabled");
    return null;
  }

  const privateKey = env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n");

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: env.FIREBASE_PROJECT_ID,
      clientEmail: env.FIREBASE_CLIENT_EMAIL,
      privateKey,
    }),
  });

  initialized = true;
  logger.info("Firebase Admin initialized");
  return admin.app();
}

export function getMessaging(): admin.messaging.Messaging | null {
  const app = getFirebaseAdmin();
  return app ? admin.messaging(app) : null;
}
