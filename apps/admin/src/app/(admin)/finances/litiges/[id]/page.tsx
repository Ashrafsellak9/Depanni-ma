import { redirectToAdmin } from "@/lib/legacyRedirects";

export default function LegacyLitigeDetailRedirect({ params }: { params: { id: string } }) {
  redirectToAdmin(`/admin/litiges/${params.id}`);
}
