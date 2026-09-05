"use client";

import { ImageIcon, Info, Plus, Trash2 } from "lucide-react";

import type { ArtisanProfileForm } from "@/components/artisan/profile/useArtisanProfileForm";
import { DisplayTitle } from "@/components/ui/display-title";

const PHOTO_LABELS = ["Avant/Après", "Installation", "Réparation"];

export function ProfilePhotosSection({ form }: { form: ArtisanProfileForm }) {
  return (
    <div className="mb-5 rounded-2xl border border-dep-border bg-white p-6">
      <div className="mb-4 flex items-center justify-between">
        <DisplayTitle as="h3" size="sm" className="flex items-center gap-2 text-[14px] font-semibold">
          <ImageIcon size={15} className="text-orange" />
          Photos de réalisations
        </DisplayTitle>
        <span className="text-[11px] text-dep-gray">{form.photoCount}/6 ajoutées</span>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {Array.from({ length: form.photoCount }).map((_, i) => (
          <div
            key={i}
            className="group relative aspect-square cursor-pointer overflow-hidden rounded-xl border border-dep-border bg-gradient-to-br from-[#d4e8d4] to-[#b0ccb0]"
          >
            <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all group-hover:bg-black/30">
              <button
                type="button"
                onClick={() => {
                  form.setPhotoCount((c) => Math.max(0, c - 1));
                  form.markChanged();
                }}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-dep-red opacity-0 transition-opacity group-hover:opacity-100"
              >
                <Trash2 size={13} className="text-white" />
              </button>
            </div>
            <div className="absolute bottom-1.5 right-1.5 rounded-lg bg-black/50 px-1.5 py-0.5 text-[8px] text-white">
              {PHOTO_LABELS[i] ?? "Réalisation"}
            </div>
          </div>
        ))}

        {Array.from({ length: Math.max(0, 6 - form.photoCount) }).map((_, i) => (
          <label
            key={`add-${i}`}
            className="group flex aspect-square cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-dep-border transition-all hover:border-orange hover:bg-orange/[0.03]"
          >
            <Plus
              size={20}
              className="mb-1 text-dep-gray transition-colors group-hover:text-orange"
            />
            <span className="text-[10px] text-dep-gray transition-colors group-hover:text-orange">
              Ajouter
            </span>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={() => {
                if (form.photoCount < 6) {
                  form.setPhotoCount((c) => c + 1);
                  form.markChanged();
                }
              }}
            />
          </label>
        ))}
      </div>

      <p className="mt-3 flex items-center gap-1.5 text-[11px] text-dep-gray">
        <Info size={11} />
        Les photos augmentent votre taux de sélection de +40% en moyenne
      </p>
    </div>
  );
}
