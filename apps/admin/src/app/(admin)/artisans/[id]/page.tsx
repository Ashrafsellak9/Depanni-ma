import { redirectToAdmin } from "@/lib/legacyRedirects";

export default function LegacyArtisanDetailRedirect({ params }: { params: { id: string } }) {
  redirectToAdmin(`/admin/artisans/${params.id}`);
}
