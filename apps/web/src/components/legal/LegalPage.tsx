import { PublicPageShell } from "@/components/landing/PublicPageShell";
import { DisplayTitle } from "@/components/ui/display-title";

export function LegalPage({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <PublicPageShell>
      <article className="container mx-auto max-w-3xl px-4 py-16">
        <DisplayTitle as="h1" size="display-2">
          {title}
        </DisplayTitle>
        <div className="mt-8 space-y-5 text-sm leading-relaxed text-navy/80">{children}</div>
      </article>
    </PublicPageShell>
  );
}
