"use client";

import { motion } from "framer-motion";
import { Camera, MapPin, Phone, Mail } from "lucide-react";

export default function ArtisanProfilPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-2xl space-y-6"
    >
      <div className="rounded-2xl border border-dep-border bg-white p-6">
        <div className="flex flex-col items-center border-b border-dep-border pb-6 sm:flex-row sm:items-start sm:gap-6">
          <div className="relative">
            <div
              className="flex h-24 w-24 items-center justify-center rounded-2xl text-3xl font-bold text-white"
              style={{ background: "linear-gradient(135deg, #F05A1A, #FF7A3D)" }}
            >
              KA
            </div>
            <button
              type="button"
              className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border border-dep-border bg-white shadow-sm"
            >
              <Camera size={14} className="text-navy" />
            </button>
          </div>
          <div className="mt-4 text-center sm:mt-0 sm:text-left">
            <h2 className="font-syne text-2xl font-bold text-navy">Khalid Amrani</h2>
            <p className="text-dep-gray">Plombier · El Jadida</p>
            <div className="mt-2 flex items-center justify-center gap-1 sm:justify-start">
              <span className="font-syne text-xl font-bold text-navy">4.9</span>
              <span className="text-orange">★★★★★</span>
              <span className="text-[12px] text-dep-gray">(200 avis)</span>
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {[
            { icon: Mail, label: "Email", value: "khalid.amrani@email.ma" },
            { icon: Phone, label: "Téléphone", value: "+212 6 12 34 56 78" },
            { icon: MapPin, label: "Zone", value: "El Jadida Centre, Hay Hassani" },
          ].map((row) => (
            <div key={row.label} className="flex items-center gap-3">
              <row.icon size={16} className="text-dep-gray" />
              <div>
                <div className="text-[11px] uppercase text-dep-gray">{row.label}</div>
                <div className="text-[14px] font-medium text-navy">{row.value}</div>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          className="mt-6 w-full rounded-xl bg-navy py-3 text-[14px] font-semibold text-white hover:bg-navy-2"
        >
          Enregistrer les modifications
        </button>
      </div>

      <div className="rounded-2xl border border-dep-border bg-white p-6">
        <h3 className="mb-3 text-[14px] font-semibold text-navy">Spécialités</h3>
        <div className="flex flex-wrap gap-2">
          {["Fuite d'eau", "Chauffe-eau", "Canalisation", "Robinetterie", "Débouchage"].map(
            (tag) => (
              <span
                key={tag}
                className="rounded-full border border-navy/10 bg-cream px-3 py-1.5 text-[12px] font-medium text-navy"
              >
                {tag}
              </span>
            ),
          )}
        </div>
      </div>
    </motion.div>
  );
}
