import { redirectToAdmin } from "@/lib/legacyRedirects";

export default function LegacyLitigesRedirect() {
  redirectToAdmin("/admin/litiges");
}
