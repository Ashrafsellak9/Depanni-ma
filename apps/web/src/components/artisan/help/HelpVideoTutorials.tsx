"use client";

import { Play } from "lucide-react";

import { VIDEO_TUTORIALS } from "@/components/artisan/help/artisanHelpData";

export function HelpVideoTutorials() {
  return (
    <div className="mb-6">
      <h2 className="mb-3 font-['Syne'] text-[16px] font-bold text-[#0F1E35]">
        Tutoriels vidéo
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {VIDEO_TUTORIALS.map((v) => (
          <button
            key={v.title}
            type="button"
            className="group cursor-pointer overflow-hidden rounded-2xl border border-[#E5E0D8] bg-white text-left transition-all hover:shadow-md"
          >
            <div className="relative flex h-[120px] items-center justify-center bg-gradient-to-br from-[#0F1E35] to-[#1A2E4A]">
              <div className="text-[40px]">{v.thumb}</div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[rgba(240,90,26,0.9)] shadow-lg transition-transform group-hover:scale-110">
                  <Play size={18} className="ml-0.5 text-white" fill="white" />
                </div>
              </div>
              <div className="absolute bottom-2 right-2 rounded bg-[rgba(0,0,0,0.6)] px-2 py-0.5 text-[10px] text-white">
                {v.duration}
              </div>
            </div>
            <div className="p-3">
              <div className="mb-1 text-[12px] font-medium text-[#0F1E35]">{v.title}</div>
              <div className="text-[10px] text-[#6B7280]">{v.views} vues</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
