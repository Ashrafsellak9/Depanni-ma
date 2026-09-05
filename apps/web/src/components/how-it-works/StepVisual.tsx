import type { ReactNode } from "react";

import { PhoneScreen } from "@/components/ui/phone-screen";
import {
  ArtisanAlertsScreen,
  ArtisanEarningsScreen,
  ArtisanPricingScreen,
  ArtisanSignupScreen,
  ClientOffersScreen,
  ClientPaymentScreen,
  ClientRequestScreen,
  ClientTrackingScreen,
} from "@/components/how-it-works/phoneScreens";
import { cn } from "@/lib/utils";

const SCREENS: Record<string, ReactNode> = {
  step1_phone: <ClientRequestScreen />,
  step2_offers: <ClientOffersScreen />,
  step3_tracking: <ClientTrackingScreen />,
  step4_payment: <ClientPaymentScreen />,
  artisan_step1: <ArtisanSignupScreen />,
  artisan_step2: <ArtisanAlertsScreen />,
  artisan_step3: <ArtisanPricingScreen />,
  artisan_step4: <ArtisanEarningsScreen />,
};

const MOCKUP_BLOBS: Record<string, string> = {
  "01": "bg-rust/8",
  "02": "bg-sand/20",
  "03": "bg-success/10",
  "04": "bg-rust/12",
};

export function StepVisual({
  stepId,
  alt,
  stepNum,
}: {
  stepId: string;
  alt: string;
  stepNum: string;
}) {
  const screen = SCREENS[stepId];

  return (
    <figure className="relative flex items-center justify-center" aria-label={alt}>
      <div
        className={cn(
          "pointer-events-none absolute -z-10 size-[420px] rounded-full blur-3xl",
          MOCKUP_BLOBS[stepNum] ?? "bg-rust/8",
        )}
        aria-hidden
      />
      <div className="drop-shadow-[0_24px_48px_rgba(11,27,43,0.15)]">
        {screen ? (
          <PhoneScreen>{screen}</PhoneScreen>
        ) : (
          <PhoneScreen>
            <div className="flex h-full items-center justify-center bg-paper font-sans text-sm text-ink/50">
              Aperçu
            </div>
          </PhoneScreen>
        )}
      </div>
      <figcaption className="sr-only">{alt}</figcaption>
    </figure>
  );
}
