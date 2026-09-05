import { DisplayTitle } from "@/components/ui/display-title";

export const metadata = { title: "Utilisateurs" };

export default function AdminUsersPage() {
  return (
    <div>
      <DisplayTitle as="h1" size="sm" className="text-2xl">
        Utilisateurs
      </DisplayTitle>
      <p className="mt-2 text-muted-foreground">Liste et modération des comptes</p>
    </div>
  );
}
