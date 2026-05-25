import { redirectToAdmin } from "@/lib/legacyRedirects";

export default function LegacyMissionsRedirect() {
  redirectToAdmin("/admin/missions");
}
