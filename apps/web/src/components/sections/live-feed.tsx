"use client";

import { useReducedMotion } from "framer-motion";
import { Plus, Star, TrendingUp, UserPlus, Users, Zap, type LucideIcon } from "lucide-react";

import { Accent, DisplayTitle } from "@/components/ui/display-title";
import {
  LIVE_FEED_EVENTS,
  type LiveFeedEvent,
  type LiveFeedIcon,
  type LiveFeedRightElement,
} from "@/lib/live-feed-events";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<LiveFeedIcon, LucideIcon> = {
  plus: Plus,
  "user-plus": UserPlus,
  zap: Zap,
  users: Users,
  "trending-up": TrendingUp,
};

const AVATAR_BG: Record<NonNullable<LiveFeedEvent["avatar"]>["color"], string> = {
  sand: "bg-sand",
  "avatar-1": "bg-avatar-1",
  "avatar-2": "bg-avatar-2",
  "avatar-3": "bg-avatar-3",
  "avatar-4": "bg-avatar-4",
  "avatar-5": "bg-avatar-5",
};

function EventMark({ event }: { event: LiveFeedEvent }) {
  if (event.avatar) {
    return (
      <div
        className={cn(
          "flex size-12 shrink-0 items-center justify-center rounded-full",
          AVATAR_BG[event.avatar.color],
        )}
      >
        <span className="font-display text-base font-semibold text-ink">{event.avatar.initial}</span>
      </div>
    );
  }

  const Icon = event.icon ? ICON_MAP[event.icon] : Plus;
  return (
    <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-rust/10">
      <Icon className="size-5 text-rust" strokeWidth={1.5} aria-hidden />
    </div>
  );
}

function RightElement({ kind }: { kind: LiveFeedRightElement }) {
  if (kind === "stars-5") {
    return (
      <div className="flex gap-0.5" aria-label="Note 5 étoiles">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star key={i} className="size-2.5 fill-rust text-rust" aria-hidden />
        ))}
      </div>
    );
  }

  if (kind === "live-dot") {
    return (
      <div className="flex flex-col items-end gap-1">
        <span className="size-2 rounded-full bg-red-500 animate-pulse" aria-hidden />
        <span className="text-[10px] uppercase tracking-widest text-red-500">Live</span>
      </div>
    );
  }

  const badges: Record<Exclude<LiveFeedRightElement, "stars-5" | "live-dot">, { label: string; className: string }> = {
    "badge-urgent": {
      label: "Urgent",
      className: "bg-rust text-white",
    },
    "badge-new": {
      label: "Nouveau",
      className: "bg-success/10 text-success",
    },
    "badge-fast": {
      label: "Rapide",
      className: "bg-sand/20 text-ink",
    },
    "badge-hot": {
      label: "Tendance",
      className: "bg-rust/10 text-rust",
    },
  };

  const badge = badges[kind];
  return (
    <span className={cn("rounded-full px-2 py-1 text-[10px] uppercase tracking-widest", badge.className)}>
      {badge.label}
    </span>
  );
}

function FeedCard({ event }: { event: LiveFeedEvent }) {
  return (
    <article className="flex min-h-24 w-[320px] shrink-0 items-center gap-4 rounded-2xl border border-line bg-white p-4 shadow-[0_1px_2px_rgba(11,27,43,0.04)]">
      <EventMark event={event} />
      <div className="min-w-0 flex-1">
        <p className="line-clamp-2 text-sm font-medium leading-snug text-ink">{event.title}</p>
        <p className="mt-1 truncate font-mono text-xs text-ink/65">{event.meta}</p>
      </div>
      {event.rightElement ? (
        <div className="flex shrink-0 flex-col items-end gap-1">
          <RightElement kind={event.rightElement} />
        </div>
      ) : null}
    </article>
  );
}

function FeedTrack({ events, hidden }: { events: LiveFeedEvent[]; hidden?: boolean }) {
  return (
    <div className="flex gap-4 pr-4" aria-hidden={hidden || undefined}>
      {events.map((event) => (
        <FeedCard key={`${hidden ? "dup" : "src"}-${event.id}`} event={event} />
      ))}
    </div>
  );
}

export function LiveFeed() {
  const reduced = useReducedMotion();

  return (
    <section id="en-ce-moment" className="overflow-hidden bg-paper py-20" aria-labelledby="live-feed-title">
      <div className="landing-container mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 font-mono text-xs uppercase tracking-widest text-ink/65">Activité</p>
          <DisplayTitle as="h2" size="display-3" id="live-feed-title">
            En ce moment sur <Accent>DEPANNI</Accent>
          </DisplayTitle>
        </div>
        <div className="inline-flex items-center gap-2 self-start rounded-full border border-ink/10 bg-ink/5 px-3 py-1.5 sm:self-auto">
          <span className="size-2 rounded-full bg-red-500 animate-pulse" aria-hidden />
          <span className="text-xs font-medium uppercase tracking-widest text-ink">En direct</span>
        </div>
      </div>

      {process.env.NODE_ENV === "development" ? (
        <div className="landing-container mb-4 rounded border border-yellow-500/30 bg-yellow-500/10 p-3 text-xs text-yellow-800">
          Attention : événements hardcodés, pas un flux live. À brancher sur un vrai stream avant
          production.
        </div>
      ) : null}

      <div className={cn("group", reduced ? "landing-container overflow-x-auto pb-1" : "live-feed-mask overflow-hidden")}>
        <div
          className={cn(
            "flex w-max",
            !reduced && "animate-scroll-x hover:[animation-play-state:paused] group-hover:[animation-play-state:paused]",
          )}
        >
          <FeedTrack events={LIVE_FEED_EVENTS} />
          {reduced ? null : <FeedTrack events={LIVE_FEED_EVENTS} hidden />}
        </div>
      </div>

      <p className="mx-auto mt-6 max-w-landing px-6 text-center text-xs text-ink/65">
        Événements représentatifs de l&apos;activité récente. Feed rafraîchi toutes les 30 secondes.
      </p>
    </section>
  );
}
