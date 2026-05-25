import { io, type Socket } from "socket.io-client";

import { API_URL } from "@/src/lib/config";
import { getAccessToken } from "@/src/lib/session";

function createSocket(namespace: string): Socket {
  const url = namespace ? `${API_URL}${namespace}` : API_URL;
  return io(url, {
    path: "/socket.io",
    autoConnect: false,
    transports: ["websocket"],
    auth: (cb) => {
      cb({ token: getAccessToken() ?? "" });
    },
  });
}

let jobsSocket: Socket | null = null;
let trackingSocket: Socket | null = null;
let chatSocket: Socket | null = null;

export function getJobsSocket(): Socket {
  if (!jobsSocket) jobsSocket = createSocket("");
  return jobsSocket;
}

export function getTrackingSocket(): Socket {
  if (!trackingSocket) trackingSocket = createSocket("/tracking");
  return trackingSocket;
}

export function getChatSocket(): Socket {
  if (!chatSocket) chatSocket = createSocket("/chat");
  return chatSocket;
}
