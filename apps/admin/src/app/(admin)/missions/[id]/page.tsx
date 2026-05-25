import { redirectToAdmin } from "@/lib/legacyRedirects";

export default function LegacyMissionDetailRedirect({ params }: { params: { id: string } }) {
  redirectToAdmin(`/admin/missions/${params.id}`);
}
