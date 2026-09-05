"use client";

import Image from "next/image";

import { ArrowRight } from "@/components/landing/ui/ArrowRight";
import { DisplayTitle } from "@/components/ui/display-title";
import { cn } from "@/lib/utils";
import { useRequestModal } from "@/store/requestModalStore";

export type ServiceCardData = {
  name: string;
  desc: string;
  image: string;
  urgent?: boolean;
  className?: string;
};

function UrgentBadge() {
  return (
    <span className="absolute left-3 top-3 z-10 inline-flex items-center gap-1.5 rounded-full bg-paper px-3 py-1 font-sans text-[10px] font-semibold uppercase tracking-widest text-rust">
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-pulse-soft rounded-full bg-rust" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-rust" />
      </span>
      Urgent
    </span>
  );
}

export function ServiceCard({ name, desc, image, urgent, className }: ServiceCardData) {
  return (
    <article
      className={cn(
        "group relative h-full min-h-[220px] cursor-pointer overflow-hidden rounded-2xl",
        className,
      )}
    >
      <Image
        src={image}
        alt={`Service de ${name.toLowerCase()} à domicile à El Jadida`}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="service-photo object-cover transition-transform duration-700 ease-out group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/20 to-transparent" />
      {urgent ? <UrgentBadge /> : null}
      <div className="absolute inset-x-0 bottom-0 z-10 p-5">
        <DisplayTitle as="h3" size="sm" className="text-lg font-semibold text-white">
          {name}
        </DisplayTitle>
        <p className="mt-1 text-sm text-white/70">{desc}</p>
      </div>
      <ArrowRight className="absolute bottom-5 right-5 z-10 h-4 w-4 translate-x-2 text-white opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100" />
    </article>
  );
}

export function MoreServicesCard() {
  const openModal = useRequestModal((s) => s.openModal);

  return (
    <article className="group relative flex h-full min-h-[220px] flex-col justify-between overflow-hidden rounded-2xl bg-ink p-6 text-white">
      <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden>
        <defs>
          <pattern id="plus-dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="2" fill="#D9451F" fillOpacity="0.1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#plus-dots)" />
      </svg>
      <button
        type="button"
        aria-label="Voir plus de services"
        onClick={() => openModal()}
        className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full border border-white/20 text-white transition-colors duration-200 hover:border-rust"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
          <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </button>
      <button
        type="button"
        onClick={() => openModal()}
        className="relative z-10 text-left"
      >
        <p className="font-display text-xl font-semibold">Et bien plus...</p>
        <p className="mt-2 text-sm text-white/70">Demandez, on trouve l&apos;artisan</p>
      </button>
    </article>
  );
}
