import { redirectToAdmin } from "@/lib/legacyRedirects";

export default function LegacyNotificationsRedirect() {
  redirectToAdmin("/admin/notifications");
}
