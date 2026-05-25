import type { Namespace, Server } from "socket.io";

import { verifyAccessToken } from "../config/jwt.js";

export interface SocketUserData {
  userId: string;
  role: string;
  artisanId?: string;
}

/** JWT dans handshake.auth.token — appliqué à un namespace ou au serveur racine. */
export function applySocketAuth(io: Server | Namespace): void {
  io.use((socket, next) => {
    const token = socket.handshake.auth.token as string | undefined;
    if (!token) {
      next(new Error("Authentication required"));
      return;
    }
    try {
      const decoded = verifyAccessToken(token);
      socket.data.userId = decoded.userId;
      socket.data.role = decoded.role;
      socket.data.artisanId = decoded.artisanId;
      next();
    } catch {
      next(new Error("Invalid token"));
    }
  });
}

export function missionRoom(missionId: string): string {
  return `mission:${missionId}`;
}

export function userRoom(userId: string): string {
  return `user:${userId}`;
}

export function artisanRoom(artisanId: string): string {
  return `artisan:${artisanId}`;
}
