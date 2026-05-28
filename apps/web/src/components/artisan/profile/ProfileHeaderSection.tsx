"use client";

import { BadgeCheck, Camera, Mail, Phone } from "lucide-react";

import type { ArtisanProfileForm } from "@/components/artisan/profile/useArtisanProfileForm";

export function ProfileHeaderSection({ form }: { form: ArtisanProfileForm }) {
  const bioLen = form.bio.length;

  return (
    <div className="mb-5 rounded-2xl border border-dep-border bg-white p-6">
      <div className="mb-6 flex items-start gap-5 border-b border-dep-border pb-6">
        <div className="relative shrink-0">
          <div
            className="group relative flex h-20 w-20 cursor-pointer items-center justify-center overflow-hidden rounded-2xl text-[26px] font-bold text-white"
            style={{ background: "linear-gradient(135deg, #F05A1A, #FF7A3D)" }}
          >
            {form.initials}
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
              <Camera size={20} className="text-white" />
            </div>
          </div>
          <button
            type="button"
            className="absolute -bottom-1 -right-1 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-orange"
          >
            <Camera size={12} className="text-white" />
          </button>
        </div>
        <div className="min-w-0 flex-1">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="field-label">Prénom</label>
              <input
                value={form.firstName}
                onChange={(e) => {
                  form.setFirstName(e.target.value);
                  form.markChanged();
                }}
                className="field-input"
              />
            </div>
            <div>
              <label className="field-label">Nom</label>
              <input
                value={form.lastName}
                onChange={(e) => {
                  form.setLastName(e.target.value);
                  form.markChanged();
                }}
                className="field-input"
              />
            </div>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 rounded-full border border-green/20 bg-green/10 px-3 py-1.5">
              <BadgeCheck size={13} className="text-green" />
              <span className="text-[11px] font-semibold text-green">Artisan Vérifié DEPANNI</span>
            </div>
            <div className="rounded-full border border-orange/20 bg-orange/10 px-3 py-1.5">
              <span className="text-[11px] font-semibold text-orange">★ Top Artisan</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="field-label">Email</label>
          <div className="relative">
            <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dep-gray" />
            <input
              type="email"
              value={form.email}
              onChange={(e) => {
                form.setEmail(e.target.value);
                form.markChanged();
              }}
              className="field-input pl-10"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="field-label">Téléphone</label>
            <div className="relative">
              <Phone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dep-gray" />
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => {
                  form.setPhone(e.target.value);
                  form.markChanged();
                }}
                className="field-input pl-10"
              />
            </div>
          </div>
          <div>
            <label className="field-label">Ville</label>
            <select
              value={form.ville}
              onChange={(e) => {
                form.setVille(e.target.value);
                form.markChanged();
              }}
              className="field-input cursor-pointer"
            >
              <option>El Jadida</option>
              <option>Casablanca</option>
              <option>Rabat</option>
              <option>Marrakech</option>
            </select>
          </div>
        </div>
        <div>
          <label className="field-label">Bio / Présentation</label>
          <textarea
            value={form.bio}
            maxLength={300}
            onChange={(e) => {
              form.setBio(e.target.value);
              form.markChanged();
            }}
            className="field-input h-20 resize-none"
          />
          <div className="mt-1 text-right text-[10px] text-dep-gray">{bioLen}/300 caractères</div>
        </div>
      </div>
    </div>
  );
}
