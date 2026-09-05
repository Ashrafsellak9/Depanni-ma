import { Analytics } from "@/components/landing/Analytics";
import { CookieBanner } from "@/components/landing/CookieBanner";
import { RequestModalHost } from "@/components/landing/request/RequestModalHost";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="landing-root min-h-screen">
      {children}
      <RequestModalHost />
      <CookieBanner />
      <Analytics />
    </div>
  );
}
