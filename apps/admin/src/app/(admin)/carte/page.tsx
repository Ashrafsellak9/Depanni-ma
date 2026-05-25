import { redirectToAdmin } from "@/lib/legacyRedirects";

export default function LegacyCarteRedirect() {
  redirectToAdmin("/admin/map");
}
