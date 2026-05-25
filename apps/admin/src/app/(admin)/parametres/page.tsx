import { redirectToAdmin } from "@/lib/legacyRedirects";

export default function LegacyParametresRedirect() {
  redirectToAdmin("/admin/settings");
}
