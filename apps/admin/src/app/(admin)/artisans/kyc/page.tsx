import { redirectToAdmin } from "@/lib/legacyRedirects";

export default function LegacyKycRedirect() {
  redirectToAdmin("/admin/kyc");
}
