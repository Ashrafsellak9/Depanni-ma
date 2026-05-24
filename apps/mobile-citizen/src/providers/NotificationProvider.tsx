import { useEffect, useState, type ReactElement, type ReactNode } from "react";

import { InAppNotification } from "@/src/components/notifications/InAppNotification";
import {
  configureNotificationHandler,
  setInAppNotificationListener,
  type InAppNotificationPayload,
} from "@/src/services/notifications";

interface NotificationProviderProps {
  children: ReactNode;
}

export function NotificationProvider({ children }: NotificationProviderProps): ReactElement {
  const [current, setCurrent] = useState<InAppNotificationPayload | null>(null);

  useEffect(() => {
    configureNotificationHandler();
    setInAppNotificationListener((payload) => setCurrent(payload));
    return () => setInAppNotificationListener(null);
  }, []);

  return (
    <>
      {children}
      <InAppNotification notification={current} onDismiss={() => setCurrent(null)} />
    </>
  );
}
