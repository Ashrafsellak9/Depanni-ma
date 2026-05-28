"use client";

import { useCallback, useMemo, useState } from "react";

export interface ScheduleSlot {
  day: string;
  from: string;
  to: string;
  active: boolean;
}

const INITIAL_SCHEDULE: ScheduleSlot[] = [
  { day: "Lun–Ven", from: "08:00", to: "20:00", active: true },
  { day: "Samedi", from: "09:00", to: "18:00", active: true },
  { day: "Dimanche", from: "", to: "", active: false },
];

const SECONDARY_SERVICES = [
  "⚡ Électricité",
  "🔑 Serrurerie",
  "🛠️ Électroménager",
  "🪟 Vitrier",
  "🎨 Peinture",
  "🧹 Ménage",
];

export function useArtisanProfileForm() {
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [firstName, setFirstName] = useState("Khalid");
  const [lastName, setLastName] = useState("Amrani");
  const [email, setEmail] = useState("khalid.amrani@email.ma");
  const [phone, setPhone] = useState("+212 6 12 34 56 78");
  const [ville, setVille] = useState("El Jadida");
  const [bio, setBio] = useState(
    "Plombier professionnel avec 8 ans d'expérience. Spécialisé en dépannage urgent, installation et rénovation. Disponible 7j/7 à El Jadida et environs.",
  );

  const [mainService, setMainService] = useState("🔧 Plomberie");
  const [selectedServices, setSelectedServices] = useState<string[]>(["⚡ Électricité"]);
  const [tags, setTags] = useState([
    "Fuite d'eau",
    "Chauffe-eau",
    "Canalisation",
    "Robinetterie",
    "Débouchage",
  ]);
  const [experience, setExperience] = useState("5-10 ans");
  const [hourlyRate, setHourlyRate] = useState(150);

  const [radius, setRadius] = useState(8);
  const [schedule, setSchedule] = useState<ScheduleSlot[]>(INITIAL_SCHEDULE);
  const [nightUrgency, setNightUrgency] = useState(false);

  const [photoCount, setPhotoCount] = useState(3);

  const markChanged = useCallback(() => setHasChanges(true), []);

  const toggleService = (s: string) => {
    setSelectedServices((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s],
    );
    markChanged();
  };

  const addTag = (tag: string) => {
    const t = tag.trim();
    if (!t || tags.includes(t)) return;
    setTags((prev) => [...prev, t]);
    markChanged();
  };

  const removeTag = (tag: string) => {
    setTags((prev) => prev.filter((t) => t !== tag));
    markChanged();
  };

  const toggleDay = (index: number) => {
    setSchedule((prev) =>
      prev.map((slot, i) =>
        i === index ? { ...slot, active: !slot.active } : slot,
      ),
    );
    markChanged();
  };

  const updateSchedule = (index: number, field: "from" | "to", value: string) => {
    setSchedule((prev) =>
      prev.map((slot, i) => (i === index ? { ...slot, [field]: value } : slot)),
    );
    markChanged();
  };

  const profileScore = useMemo(() => {
    let score = 0;
    if (firstName && lastName && email && phone) score += 20;
    if (bio.length >= 50) score += 12;
    if (tags.length >= 3) score += 10;
    if (selectedServices.length >= 0) score += 8;
    if (radius > 0) score += 10;
    if (schedule.some((s) => s.active)) score += 10;
    if (photoCount >= 3) score += 10;
    if (hourlyRate > 0) score += 4;
    return Math.min(100, score);
  }, [firstName, lastName, email, phone, bio, tags, selectedServices, radius, schedule, photoCount, hourlyRate]);

  const zonePreview = useMemo(() => {
    if (radius <= 5) return "El Jadida Centre, Hay Hassani";
    if (radius <= 10) return "El Jadida Centre, Hay Hassani, Sidi Bouzid";
    return "El Jadida Centre, Hay Hassani, Sidi Bouzid, Azemmour";
  }, [radius]);

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setIsSaving(false);
    setHasChanges(false);
  };

  return {
    hasChanges,
    isSaving,
    markChanged,
    handleSave,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    email,
    setEmail,
    phone,
    setPhone,
    ville,
    setVille,
    bio,
    setBio,
    mainService,
    setMainService,
    selectedServices,
    toggleService,
    secondaryServices: SECONDARY_SERVICES,
    tags,
    addTag,
    removeTag,
    experience,
    setExperience,
    hourlyRate,
    setHourlyRate,
    radius,
    setRadius,
    schedule,
    toggleDay,
    updateSchedule,
    nightUrgency,
    setNightUrgency,
    photoCount,
    setPhotoCount,
    profileScore,
    zonePreview,
    initials: `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase(),
    fullName: `${firstName} ${lastName}`,
  };
}

export type ArtisanProfileForm = ReturnType<typeof useArtisanProfileForm>;
