"use client";

import { motion } from "framer-motion";
import { Filter, X } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";

import {
  INBOX_FILTERS,
  countByType,
  filterNotifications,
  unreadCount,
  type AdminNotification,
  type InboxFilterId,
} from "@/components/admin/notifications/adminNotificationsMock";

type NotificationsInboxProps = {
  notifications: AdminNotification[];
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  onDismiss: (id: string) => void;
};

export function NotificationsInbox({
  notifications,
  onMarkRead,
  onMarkAllRead,
  onDismiss,
}: NotificationsInboxProps) {
  const [inboxFilter, setInboxFilter] = useState<InboxFilterId>("all");

  const filtered = useMemo(
    () => filterNotifications(notifications, inboxFilter),
    [notifications, inboxFilter],
  );

  const newCount = unreadCount(notifications);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h2 className="font-['Syne'] text-[16px] font-bold text-[#0F1E35]">
            Notifications
          </h2>
          {newCount > 0 && (
            <span className="rounded-full bg-[#F05A1A] px-2 py-0.5 text-[10px] font-bold text-white">
              {newCount} nouvelle{newCount > 1 ? "s" : ""}
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onMarkAllRead}
            className="text-[12px] font-semibold text-[#F05A1A] transition-colors hover:text-[#FF7A3D]"
          >
            Tout marquer comme lu
          </button>
          <button
            type="button"
            onClick={() => toast.success("Filtres avancés — bientôt disponible")}
            className="flex items-center gap-1.5 rounded-xl border border-[#E5E0D8] bg-white px-3 py-1.5 text-[12px] text-[#0F1E35] hover:bg-[#FAF7F2]"
          >
            <Filter size={12} />
            Filtrer
          </button>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {INBOX_FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setInboxFilter(f.id)}
            className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-[11px] font-medium transition-all ${
              inboxFilter === f.id
                ? "border-[#0F1E35] bg-[#0F1E35] text-white"
                : "border-[#E5E0D8] bg-white text-[#6B7280] hover:border-[#0F1E35]"
            }`}
          >
            {f.label}
            <span
              className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                inboxFilter === f.id ? "bg-[rgba(255,255,255,0.2)]" : "bg-[#F4F0E8]"
              }`}
            >
              {countByType(notifications, f.id)}
            </span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-[#E5E0D8] bg-[#FAF7F2] py-12 text-center text-[13px] text-[#6B7280]">
          Aucune notification dans cette catégorie
        </div>
      ) : (
        filtered.map((n) => (
          <motion.div
            key={n.id}
            layout
            className={`group mb-2 flex cursor-pointer gap-4 rounded-2xl border p-4 transition-all hover:shadow-sm ${
              !n.read
                ? "border-[#E5E0D8] bg-white shadow-sm"
                : "border-[rgba(229,224,216,0.5)] bg-[rgba(250,247,242,0.5)]"
            }`}
            onClick={() => onMarkRead(n.id)}
          >
            <div className="flex flex-shrink-0 flex-col items-center gap-2">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl text-[20px]"
                style={{ background: `${n.color}15` }}
              >
                {n.icon}
              </div>
              {!n.read && <div className="h-2 w-2 rounded-full bg-[#F05A1A]" />}
            </div>

            <div className="min-w-0 flex-1">
              <div className="mb-0.5 flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[13px] font-semibold ${
                      !n.read ? "text-[#0F1E35]" : "text-[#6B7280]"
                    }`}
                  >
                    {n.title}
                  </span>
                  {n.priority === "urgent" && (
                    <span className="rounded-full bg-[rgba(220,38,38,0.1)] px-1.5 py-0.5 text-[9px] font-bold text-[#DC2626]">
                      URGENT
                    </span>
                  )}
                </div>
                <span className="flex-shrink-0 whitespace-nowrap text-[10px] text-[#9CA3AF]">
                  {n.time}
                </span>
              </div>
              <p className="mb-2 text-[12px] leading-[1.5] text-[#6B7280]">{n.message}</p>
              {n.action && (
                <Link
                  href={n.action.href}
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-1 text-[11px] font-semibold text-[#F05A1A] opacity-0 transition-opacity hover:text-[#FF7A3D] group-hover:opacity-100"
                >
                  {n.action.label} →
                </Link>
              )}
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDismiss(n.id);
              }}
              className="flex h-6 w-6 flex-shrink-0 items-center justify-center text-[#9CA3AF] opacity-0 transition-opacity hover:text-[#DC2626] group-hover:opacity-100"
            >
              <X size={13} />
            </button>
          </motion.div>
        ))
      )}
    </div>
  );
}
