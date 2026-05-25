import { redirectToAdmin } from "@/lib/legacyRedirects";

export default function LegacyAnalyticsRedirect() {
  redirectToAdmin("/admin/analytics");
}
