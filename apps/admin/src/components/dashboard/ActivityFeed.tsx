"use client";

import { formatDistanceToNow, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@depanni/ui";

import type { ActivityItem } from "@/types/admin";

export function ActivityFeed({ items }: { items: ActivityItem[] }) {
  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-base">Activité récente</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {items.length === 0 ? (
            <li className="text-sm text-slate-400">Aucune activité</li>
          ) : (
            items.map((item) => (
              <li key={item.id} className="flex gap-3 border-b border-slate-100 pb-3 last:border-0">
                <span
                  className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
                    item.type === "kyc" ? "bg-amber-500" : "bg-indigo-500"
                  }`}
                />
                <div>
                  <p className="text-sm text-slate-800">{item.message}</p>
                  <p className="text-xs text-slate-400">
                    {formatDistanceToNow(parseISO(item.at), { addSuffix: true, locale: fr })}
                  </p>
                </div>
              </li>
            ))
          )}
        </ul>
      </CardContent>
    </Card>
  );
}
