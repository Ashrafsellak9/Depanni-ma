import { redirectToAdmin } from "@/lib/legacyRedirects";

export default function LegacyArtisansRedirect() {
  redirectToAdmin("/admin/artisans");
}
