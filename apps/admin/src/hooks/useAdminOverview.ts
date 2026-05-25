"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { io } from "socket.io-client";

import { getAccessToken } from "@/lib/token";
import { fetchOverview } from "@/services/adminApi";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export function useAdminOverview() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["admin", "overview"],
    queryFn: fetchOverview,
    refetchInterval: 30_000,
  });

  useEffect(() => {
    const token = getAccessToken();
    if (!token) return;

    const socket = io(API_URL, {
      path: "/socket.io",
      auth: { token },
      transports: ["websocket", "polling"],
    });

    const refresh = () => {
      void queryClient.invalidateQueries({ queryKey: ["admin", "overview"] });
    };

    socket.on("job:new", refresh);
    socket.on("job:status", refresh);
    socket.on("job:offer:accepted", refresh);

    return () => {
      socket.disconnect();
    };
  }, [queryClient]);

  return query;
}
