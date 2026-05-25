import { io, type Socket } from "socket.io-client";

import { API_URL } from "@/src/lib/config";
import { getAccessToken } from "@/src/lib/session";

let jobsSocket: Socket | null = null;

function createJobsSocket(): Socket {
  return io(API_URL, {
    path: "/socket.io",
    autoConnect: false,
    transports: ["websocket"],
    auth: (cb) => {
      cb({ token: getAccessToken() ?? "" });
    },
  });
}

export function getJobsSocket(): Socket {
  if (!jobsSocket) jobsSocket = createJobsSocket();
  return jobsSocket;
}

export function disconnectJobsSocket(): void {
  if (jobsSocket) {
    jobsSocket.disconnect();
    jobsSocket.removeAllListeners();
    jobsSocket = null;
  }
}

export function connectArtisanJobsSocket(
  artisanId: string,
  zones: string[],
  specialties: string[],
  onNewJob?: (job: Record<string, unknown>) => void,
): Socket {
  const socket = getJobsSocket();
  if (!socket.connected) socket.connect();

  socket.emit("jobs:join", { artisanId });

  for (const city of zones) {
    socket.emit("jobs:subscribe", { city });
  }
  for (const category of specialties) {
    socket.emit("jobs:subscribe", { categoryIds: [category] });
  }

  socket.off("job:new");
  if (onNewJob) {
    socket.on("job:new", (payload: Record<string, unknown>) => onNewJob(payload));
  }

  return socket;
}
