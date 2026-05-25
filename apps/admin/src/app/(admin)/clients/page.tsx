import { redirectToAdmin } from "@/lib/legacyRedirects";

export default function LegacyClientsRedirect() {
  redirectToAdmin("/admin/clients");
}
