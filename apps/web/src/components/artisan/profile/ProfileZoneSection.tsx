"use client";

import { MapPin } from "lucide-react";

import type { ArtisanProfileForm } from "@/components/artisan/profile/useArtisanProfileForm";
import { DisplayTitle } from "@/components/ui/display-title";

export function ProfileZoneSection({ form }: { form: ArtisanProfileForm }) {
  return (
    <div className="mb-5 rounded-2xl border border-dep-border bg-white p-6">
      <DisplayTitle as="h3" size="sm" className="mb-4 flex items-center gap-2 text-[14px] font-semibold">
        <MapPin size={15} className="text-orange" />
        Zone & Disponibilités
      </DisplayTitle>

      <div className="mb-5">
        <div className="mb-2 flex items-center justify-between">
          <label className="field-label !mb-0">Rayon d&apos;intervention</label>
          <div className="rounded-full bg-orange/10 px-3 py-1 text-[12px] font-bold text-orange">
            {form.radius} km
          </div>
        </div>
        <input
          type="range"
          min={1}
          max={30}
          value={form.radius}
          onChange={(e) => {
            form.setRadius(Number(e.target.value));
            form.markChanged();
          }}
          className="h-1.5 w-full accent-orange"
        />
        <div className="mt-1 flex justify-between text-[10px] text-dep-gray">
          <span>1 km</span>
          <span>15 km</span>
          <span>30 km</span>
        </div>
        <p className="mt-2 flex items-center gap-1.5 text-[11px] text-dep-gray">
          <MapPin size={11} />
          Vous couvrez : {form.zonePreview}
        </p>
      </div>

      <div>
        <label className="field-label">Horaires de disponibilité</label>
        <div className="space-y-0">
          {form.schedule.map((slot, i) => (
            <div
              key={slot.day}
              className="flex flex-wrap items-center gap-3 border-b border-dep-border/50 py-2.5 last:border-0"
            >
              <div className="w-20 text-[12px] font-medium text-navy">{slot.day}</div>
              {slot.active ? (
                <>
                  <select
                    value={slot.from}
                    onChange={(e) => form.updateSchedule(i, "from", e.target.value)}
                    className="flex-1 rounded-lg border border-dep-border bg-cream px-2 py-1.5 text-[12px] outline-none"
                  >
                    {["07:00", "08:00", "09:00", "10:00"].map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>
                  <span className="text-[11px] text-dep-gray">à</span>
                  <select
                    value={slot.to}
                    onChange={(e) => form.updateSchedule(i, "to", e.target.value)}
                    className="flex-1 rounded-lg border border-dep-border bg-cream px-2 py-1.5 text-[12px] outline-none"
                  >
                    {["18:00", "19:00", "20:00", "21:00", "22:00"].map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>
                </>
              ) : (
                <span className="flex-1 text-[12px] italic text-dep-gray">Non disponible</span>
              )}
              <button
                type="button"
                onClick={() => form.toggleDay(i)}
                className={`relative h-6 w-10 shrink-0 rounded-full transition-all ${
                  slot.active ? "bg-green" : "bg-dep-border"
                }`}
                aria-pressed={slot.active}
              >
                <div
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
                    slot.active ? "left-[calc(100%-22px)]" : "left-0.5"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-orange/15 bg-orange/[0.05] p-4">
        <div>
          <div className="text-[13px] font-semibold text-navy">🚨 Disponible pour urgences nocturnes</div>
          <div className="mt-0.5 text-[11px] text-dep-gray">
            22h–7h · Commission réduite 5% pour ces missions
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            form.setNightUrgency(!form.nightUrgency);
            form.markChanged();
          }}
          className={`relative h-6 w-12 shrink-0 cursor-pointer rounded-full transition-all ${
            form.nightUrgency ? "bg-orange" : "bg-dep-border"
          }`}
          aria-pressed={form.nightUrgency}
        >
          <div
            className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
              form.nightUrgency ? "left-[calc(100%-22px)]" : "left-0.5"
            }`}
          />
        </button>
      </div>
    </div>
  );
}
