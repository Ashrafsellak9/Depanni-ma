import { redirectToAdmin } from "@/lib/legacyRedirects";

export default function LegacyRevenusRedirect() {
  redirectToAdmin("/admin/finances");
}
