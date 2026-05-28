"use client";

import toast from "react-hot-toast";

import { ProfileHeaderSection } from "@/components/artisan/profile/ProfileHeaderSection";
import { ProfilePhotosSection } from "@/components/artisan/profile/ProfilePhotosSection";
import { ProfileSaveBar } from "@/components/artisan/profile/ProfileSaveBar";
import { ProfileSecuritySection } from "@/components/artisan/profile/ProfileSecuritySection";
import { ProfileSidebar } from "@/components/artisan/profile/ProfileSidebar";
import { ProfileSkillsSection } from "@/components/artisan/profile/ProfileSkillsSection";
import { ProfileZoneSection } from "@/components/artisan/profile/ProfileZoneSection";
import { useArtisanProfileForm } from "@/components/artisan/profile/useArtisanProfileForm";

export function ArtisanProfileManager() {
  const form = useArtisanProfileForm();

  const handleSave = async () => {
    await form.handleSave();
    toast.success("Profil mis à jour avec succès");
  };

  return (
    <div className="pb-4">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <ProfileHeaderSection form={form} />
          <ProfileSkillsSection form={form} />
          <ProfileZoneSection form={form} />
          <ProfilePhotosSection form={form} />
          <ProfileSecuritySection />
        </div>
        <div className="lg:col-span-2">
          <ProfileSidebar form={form} />
        </div>
      </div>

      <ProfileSaveBar form={form} onSave={handleSave} />
    </div>
  );
}
