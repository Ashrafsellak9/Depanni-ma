import { io, type Socket } from "socket.io-client";

import { API_URL } from "@/lib/api";
import { getAccessToken } from "@/lib/token";

const sockets = new Map<string, Socket>();

function namespaceKey(namespace: string): string {
  return namespace || "/";
}

export function getSocket(namespace = ""): Socket {
  const key = namespaceKey(namespace);
  let socket = sockets.get(key);
  if (!socket) {
    socket = io(`${API_URL}${namespace}`, {
      autoConnect: false,
      withCredentials: true,
      auth: (cb) => {
        cb({ token: getAccessToken() ?? "" });
      },
    });
    sockets.set(key, socket);
  }
  return socket;
}

export function getChatSocket(): Socket {
  return getSocket("/chat");
}

export function getTrackingSocket(): Socket {
  return getSocket("/tracking");
}

export function getJobsSocket(): Socket {
  return getSocket();
}

export function disconnectSocket(): void {
  sockets.forEach((s) => s.disconnect());
  sockets.clear();
}
