"use client";

import { Wrench, X } from "lucide-react";

import type { ArtisanProfileForm } from "@/components/artisan/profile/useArtisanProfileForm";
import { DisplayTitle } from "@/components/ui/display-title";

export function ProfileSkillsSection({ form }: { form: ArtisanProfileForm }) {
  return (
    <div className="mb-5 rounded-2xl border border-dep-border bg-white p-6">
      <DisplayTitle as="h3" size="sm" className="mb-4 flex items-center gap-2 text-[14px] font-semibold">
        <Wrench size={15} className="text-orange" />
        Métier & Spécialités
      </DisplayTitle>

      <div className="mb-4">
        <label className="field-label">Service principal</label>
        <select
          value={form.mainService}
          onChange={(e) => {
            form.setMainService(e.target.value);
            form.markChanged();
          }}
          className="field-input cursor-pointer"
        >
          <option>🔧 Plomberie</option>
          <option>⚡ Électricité</option>
          <option>🔑 Serrurerie</option>
          <option>🚗 Mécanique Auto</option>
          <option>🎨 Peinture</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="field-label">Services secondaires</label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {form.secondaryServices.map((s) => {
            const selected = form.selectedServices.includes(s);
            return (
              <button
                key={s}
                type="button"
                onClick={() => form.toggleService(s)}
                className={`rounded-xl border p-2 text-center text-[11px] font-medium transition-all ${
                  selected
                    ? "border-navy bg-navy/[0.07] text-navy"
                    : "border-dep-border bg-cream text-dep-gray hover:border-navy"
                }`}
              >
                {s}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label className="field-label">Mots-clés / sous-spécialités</label>
        <div className="flex min-h-[52px] flex-wrap gap-2 rounded-xl border border-dep-border bg-cream p-3">
          {form.tags.map((tag) => (
            <div
              key={tag}
              className="flex items-center gap-1.5 rounded-full border border-dep-border bg-white px-3 py-1.5 text-[12px] text-navy"
            >
              {tag}
              <button
                type="button"
                onClick={() => form.removeTag(tag)}
                className="ml-0.5 text-dep-gray hover:text-dep-red"
              >
                <X size={11} />
              </button>
            </div>
          ))}
          <input
            placeholder="+ Ajouter un mot-clé"
            className="min-w-[140px] border-none bg-transparent text-[12px] text-dep-gray outline-none placeholder:text-[#9CA3AF]"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                const v = e.currentTarget.value;
                if (v) {
                  form.addTag(v);
                  e.currentTarget.value = "";
                }
              }
            }}
          />
        </div>
        <p className="mt-1 text-[10px] text-dep-gray">
          Appuyez sur Entrée pour ajouter · Ces mots-clés améliorent votre visibilité dans les recherches
        </p>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className="field-label">Années d&apos;expérience</label>
          <select
            value={form.experience}
            onChange={(e) => {
              form.setExperience(e.target.value);
              form.markChanged();
            }}
            className="field-input cursor-pointer"
          >
            <option>1-2 ans</option>
            <option>5-10 ans</option>
            <option>+10 ans</option>
          </select>
        </div>
        <div>
          <label className="field-label">Tarif indicatif (MAD/h)</label>
          <div className="relative">
            <input
              type="number"
              value={form.hourlyRate}
              onChange={(e) => {
                form.setHourlyRate(Number(e.target.value));
                form.markChanged();
              }}
              className="field-input pr-14"
            />
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[12px] text-dep-gray">
              MAD/h
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
