import { redirectToAdmin } from "@/lib/legacyRedirects";

export default function LegacyVirementsRedirect() {
  redirectToAdmin("/admin/virements");
}
