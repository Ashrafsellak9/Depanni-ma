import { io, type Socket } from "socket.io-client";

import { API_URL } from "@/src/lib/config";
import { getAccessToken } from "@/src/lib/session";

let jobsSocket: Socket | null = null;

export function getJobsSocket(): Socket {
  if (!jobsSocket) {
    jobsSocket = io(API_URL, {
      path: "/socket.io",
      autoConnect: false,
      transports: ["websocket"],
      auth: (cb) => {
        cb({ token: getAccessToken() ?? "" });
      },
    });
  }
  return jobsSocket;
}

export function disconnectJobsSocket(): void {
  jobsSocket?.disconnect();
  jobsSocket = null;
}
