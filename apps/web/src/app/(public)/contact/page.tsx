import type { Metadata } from "next";

import { LegalPage } from "@/components/legal/LegalPage";
import { WHATSAPP_URL } from "@/lib/siteConstants";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contacter DEPANNI.ma",
};

export default function ContactPage() {
  return (
    <LegalPage title="Contact">
      <p>Une question, un litige ou un partenariat&nbsp;? Écrivez-nous.</p>
      <ul className="list-disc space-y-2 pl-5">
        <li>
          Email :{" "}
          <a className="font-semibold text-orange hover:underline" href="mailto:contact@depanni.ma">
            contact@depanni.ma
          </a>
        </li>
        <li>
          WhatsApp :{" "}
          <a
            className="font-semibold text-orange hover:underline"
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            Discuter
          </a>
        </li>
        <li>Adresse : El Jadida, Maroc</li>
      </ul>
    </LegalPage>
  );
}
