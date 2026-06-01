"use client";

import { Bell, History, Send } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import toast from "react-hot-toast";

import { NotificationsComposer } from "@/components/admin/notifications/NotificationsComposer";
import { NotificationsHistory } from "@/components/admin/notifications/NotificationsHistory";
import { NotificationsInbox } from "@/components/admin/notifications/NotificationsInbox";
import {
  MOCK_NOTIFICATIONS,
  unreadCount,
  type AdminNotification,
  type NotificationTabId,
} from "@/components/admin/notifications/adminNotificationsMock";

const TABS: {
  id: NotificationTabId;
  label: string;
  icon: typeof Bell;
  badge?: number;
}[] = [
  { id: "inbox", label: "Notifications reçues", icon: Bell, badge: 3 },
  { id: "compose", label: "Envoyer une notification", icon: Send },
  { id: "history", label: "Historique des envois", icon: History },
];

export function AdminNotificationsPage() {
  const [activeTab, setActiveTab] = useState<NotificationTabId>("inbox");
  const [notifications, setNotifications] = useState<AdminNotification[]>(MOCK_NOTIFICATIONS);

  const newCount = unreadCount(notifications);

  const tabsWithBadge = useMemo(
    () =>
      TABS.map((t) =>
        t.id === "inbox" ? { ...t, badge: newCount > 0 ? newCount : undefined } : t,
      ),
    [newCount],
  );

  const markRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    toast.success("Toutes les notifications marquées comme lues");
  }, []);

  const dismissNotif = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    toast.success("Notification supprimée");
  }, []);

  const handleSend = useCallback(
    async (payload: {
      title: string;
      message: string;
      audience: string;
      channels: string[];
      schedule: string;
    }) => {
      await new Promise((r) => setTimeout(r, 1000));
      const count =
        payload.audience === "all_clients"
          ? 1240
          : payload.audience === "all_artisans"
            ? 280
            : payload.audience === "active_artisans"
              ? 38
              : payload.audience === "pending_kyc"
                ? 7
                : payload.audience === "inactive"
                  ? 142
                  : 0;
      toast.success(
        payload.schedule === "now"
          ? `Notification envoyée à ${count.toLocaleString("fr-FR")} destinataires`
          : "Envoi programmé avec succès",
      );
    },
    [],
  );

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-2 border-b border-[#E5E0D8] pb-4">
        {tabsWithBadge.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-[13px] font-medium transition-all ${
              activeTab === tab.id
                ? "bg-[#0F1E35] text-white"
                : "bg-white text-[#6B7280] hover:bg-[#FAF7F2] hover:text-[#0F1E35]"
            }`}
          >
            <tab.icon size={15} />
            {tab.label}
            {tab.badge != null && tab.badge > 0 && (
              <span
                className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                  activeTab === tab.id
                    ? "bg-[rgba(255,255,255,0.2)]"
                    : "bg-[#F05A1A] text-white"
                }`}
              >
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {activeTab === "inbox" && (
        <NotificationsInbox
          notifications={notifications}
          onMarkRead={markRead}
          onMarkAllRead={markAllRead}
          onDismiss={dismissNotif}
        />
      )}
      {activeTab === "compose" && <NotificationsComposer onSend={handleSend} />}
      {activeTab === "history" && <NotificationsHistory />}
    </div>
  );
}
