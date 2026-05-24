"use client";

import { useEffect, useRef, useState } from "react";

import { getAccessToken } from "@/lib/token";
import type { Socket } from "socket.io-client";

import { disconnectSocket, getChatSocket, getJobsSocket, getTrackingSocket } from "@/lib/socket";
import { useAuth } from "@/hooks/useAuth";

type SocketNamespace = "jobs" | "chat" | "tracking";

export function useSocket(namespace: SocketNamespace = "jobs"): {
  socket: Socket;
  connected: boolean;
} {
  const { isAuthenticated } = useAuth();
  const [connected, setConnected] = useState(false);
  const socketRef = useRef(
    namespace === "chat"
      ? getChatSocket()
      : namespace === "tracking"
        ? getTrackingSocket()
        : getJobsSocket(),
  );

  useEffect(() => {
    const socket = socketRef.current;
    if (!isAuthenticated) {
      socket.disconnect();
      setConnected(false);
      return;
    }

    socket.auth = { token: getAccessToken() ?? "" };
    socket.connect();

    const onConnect = () => setConnected(true);
    const onDisconnect = () => setConnected(false);

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.disconnect();
    };
  }, [isAuthenticated, namespace]);

  useEffect(() => {
    return () => {
      if (namespace === "jobs") disconnectSocket();
    };
  }, [namespace]);

  return { socket: socketRef.current, connected };
}
