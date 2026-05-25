import Link from "next/link";

export function AdminStubPage({
  title,
  description,
  legacyHref,
}: {
  title: string;
  description: string;
  legacyHref?: string;
}) {
  return (
    <div className="rounded-2xl border border-dep-border bg-white p-10 text-center">
      <h2 className="font-syne text-2xl font-bold text-navy">{title}</h2>
      <p className="mx-auto mt-3 max-w-md text-sm text-dep-gray">{description}</p>
      {legacyHref && (
        <Link
          href={legacyHref}
          className="mt-6 inline-flex rounded-full bg-orange px-6 py-3 text-sm font-medium text-white hover:bg-orange-2"
        >
          Ouvrir la version connectée à l&apos;API →
        </Link>
      )}
    </div>
  );
}
