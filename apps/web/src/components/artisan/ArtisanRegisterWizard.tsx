"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Award,
  Camera,
  Check,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Eye,
  EyeOff,
  FileText,
  Shield,
  User,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { artisanAuth } from "@/lib/artisanAuth";
import { useArtisanAuthStore } from "@/store/artisanAuthStore";

const STEPS = [
  { id: 1, label: "Informations", icon: User },
  { id: 2, label: "Spécialité", icon: Wrench },
  { id: 3, label: "Documents", icon: FileText },
  { id: 4, label: "Confirmation", icon: CheckCircle },
];

const SERVICES = [
  { id: "plomberie", emoji: "🔧", label: "Plomberie" },
  { id: "electricite", emoji: "⚡", label: "Électricité" },
  { id: "serrurerie", emoji: "🔑", label: "Serrurerie" },
  { id: "mecanique", emoji: "🚗", label: "Mécanique" },
  { id: "peinture", emoji: "🎨", label: "Peinture" },
  { id: "menage", emoji: "🧹", label: "Ménage" },
  { id: "electromenager", emoji: "🛠️", label: "Électroménager" },
  { id: "maconnerie", emoji: "🏗️", label: "Maçonnerie" },
];

const DOCUMENTS = [
  { id: "cin_front", label: "CIN Recto", required: true, icon: CreditCard },
  { id: "cin_back", label: "CIN Verso", required: true, icon: CreditCard },
  { id: "diploma", label: "Attestation / Diplôme", required: false, icon: Award },
  { id: "photo", label: "Photo de profil", required: true, icon: Camera },
];

const VILLES = ["El Jadida", "Casablanca", "Rabat", "Marrakech"];

export function ArtisanRegisterWizard() {
  const router = useRouter();
  const syncFromCookies = useArtisanAuthStore((s) => s.syncFromCookies);
  const [currentStep, setCurrentStep] = useState(1);
  const [stepError, setStepError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [ville, setVille] = useState("El Jadida");
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);

  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [radiusKm, setRadiusKm] = useState(5);
  const [experience, setExperience] = useState("2-5 ans");

  const [uploaded, setUploaded] = useState<Record<string, boolean>>({});
  const [acceptTerms, setAcceptTerms] = useState(false);

  const toggleService = (id: string) => {
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    );
  };

  const validateStep = (step: number): boolean => {
    setStepError("");
    if (step === 1) {
      if (!firstName.trim() || !lastName.trim()) {
        setStepError("Veuillez renseigner votre prénom et nom.");
        return false;
      }
      if (!phone.trim()) {
        setStepError("Veuillez renseigner votre numéro de téléphone.");
        return false;
      }
      if (password.length < 6) {
        setStepError("Le mot de passe doit contenir au moins 6 caractères.");
        return false;
      }
      if (password !== confirmPassword) {
        setStepError("Les mots de passe ne correspondent pas.");
        return false;
      }
      return true;
    }
    if (step === 2) {
      if (selectedServices.length === 0) {
        setStepError("Sélectionnez au moins une spécialité.");
        return false;
      }
      return true;
    }
    if (step === 3) {
      const missing = DOCUMENTS.filter((d) => d.required && !uploaded[d.id]);
      if (missing.length > 0) {
        setStepError(`Documents obligatoires manquants : ${missing.map((d) => d.label).join(", ")}`);
        return false;
      }
      return true;
    }
    if (step === 4) {
      if (!acceptTerms) {
        setStepError("Vous devez accepter les conditions générales.");
        return false;
      }
      return true;
    }
    return true;
  };

  const handleNext = () => {
    if (!validateStep(currentStep)) return;
    setCurrentStep((s) => s + 1);
  };

  const handleRegister = async () => {
    if (!validateStep(4)) return;
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1500));
    artisanAuth.register({
      firstName,
      lastName,
      phone,
      email: email || undefined,
      password,
      ville,
      services: selectedServices,
      radiusKm,
      experience,
    });
    syncFromCookies();
    router.push("/artisan/pending");
  };

  const serviceLabels = selectedServices.map(
    (id) => SERVICES.find((s) => s.id === id)?.label ?? id,
  );

  return (
    <main className="min-h-screen bg-[#EDE8DF] py-8">
      <div className="container mx-auto max-w-[560px] px-4">
        <div className="mb-6 flex items-center justify-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-orange">
            <Wrench size={18} className="text-white" />
          </div>
          <span className="font-syne text-[20px] font-extrabold text-navy">
            DEPANNI<span className="text-orange">.ma</span>
          </span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-dep-border bg-white p-6 shadow-[0_8px_40px_rgba(15,30,53,0.08)] md:p-8"
        >
          <h1 className="mb-1 text-center font-syne text-[22px] font-extrabold text-navy">
            Créer mon compte artisan
          </h1>
          <p className="mb-6 text-center text-[13px] text-dep-gray">Inscription en 4 étapes</p>

          <div className="mb-8 flex items-center">
            {STEPS.map((step, i) => (
              <div key={step.id} className="contents">
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-full text-[13px] font-semibold transition-all ${
                      currentStep > step.id
                        ? "bg-green text-white"
                        : currentStep === step.id
                          ? "bg-orange text-white"
                          : "bg-dep-border text-dep-gray"
                    }`}
                  >
                    {currentStep > step.id ? <Check size={16} /> : step.id}
                  </div>
                  <span
                    className={`mt-1 text-[10px] ${
                      currentStep === step.id ? "font-semibold text-orange" : "text-dep-gray"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className={`mx-2 mb-4 h-[2px] flex-1 transition-all ${
                      currentStep > step.id + 1
                        ? "bg-green"
                        : currentStep > step.id
                          ? "bg-orange"
                          : "bg-dep-border"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {stepError && (
            <div className="mb-4 rounded-xl border border-dep-red/15 bg-dep-red/[0.06] px-3 py-2.5 text-[12px] text-dep-red">
              {stepError}
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.4px] text-navy">
                    Prénom
                  </label>
                  <input
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full rounded-xl border border-dep-border bg-cream px-4 py-3 text-[14px] text-navy outline-none focus:border-navy focus:bg-white"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.4px] text-navy">
                    Nom
                  </label>
                  <input
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full rounded-xl border border-dep-border bg-cream px-4 py-3 text-[14px] text-navy outline-none focus:border-navy focus:bg-white"
                  />
                </div>
              </div>
              <div>
                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.4px] text-navy">
                  Numéro de téléphone
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 flex -translate-y-1/2 items-center gap-1.5">
                    <span className="text-[13px]">🇲🇦</span>
                    <span className="border-r border-dep-border pr-2 text-[13px] text-dep-gray">+212</span>
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="06 00 00 00 00"
                    className="w-full rounded-xl border border-dep-border bg-cream py-3 pl-[72px] pr-4 text-[14px] text-navy outline-none focus:border-navy focus:bg-white"
                  />
                </div>
              </div>
              <div>
                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.4px] text-navy">
                  Email (optionnel)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-dep-border bg-cream px-4 py-3 text-[14px] text-navy outline-none focus:border-navy focus:bg-white"
                />
              </div>
              <div>
                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.4px] text-navy">
                  Mot de passe
                </label>
                <div className="relative">
                  <input
                    type={showPwd ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-dep-border bg-cream px-4 py-3 pr-10 text-[14px] text-navy outline-none focus:border-navy focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd(!showPwd)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-dep-gray"
                  >
                    {showPwd ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.4px] text-navy">
                  Confirmer mot de passe
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPwd ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full rounded-xl border border-dep-border bg-cream px-4 py-3 pr-10 text-[14px] text-navy outline-none focus:border-navy focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPwd(!showConfirmPwd)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-dep-gray"
                  >
                    {showConfirmPwd ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.4px] text-navy">
                  Ville
                </label>
                <select
                  value={ville}
                  onChange={(e) => setVille(e.target.value)}
                  className="w-full rounded-xl border border-dep-border bg-cream px-4 py-3 text-[14px] text-navy outline-none focus:border-navy focus:bg-white"
                >
                  {VILLES.map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {SERVICES.map((s) => {
                  const selected = selectedServices.includes(s.id);
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => toggleService(s.id)}
                      className={`rounded-xl border-2 px-3 py-4 text-center transition-all ${
                        selected
                          ? "border-orange bg-navy text-white"
                          : "border-dep-border bg-white text-navy hover:border-orange/40"
                      }`}
                    >
                      <div className="text-2xl">{s.emoji}</div>
                      <div className="mt-1 text-[11px] font-medium">{s.label}</div>
                    </button>
                  );
                })}
              </div>
              <div>
                <label className="mb-2 block text-[12px] font-medium text-navy">
                  Rayon d&apos;intervention : <strong>{radiusKm} km</strong>
                </label>
                <input
                  type="range"
                  min={1}
                  max={20}
                  value={radiusKm}
                  onChange={(e) => setRadiusKm(Number(e.target.value))}
                  className="w-full accent-orange"
                />
                <p className="mt-1 text-[12px] text-dep-gray">Je couvre un rayon de {radiusKm} km</p>
              </div>
              <div>
                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.4px] text-navy">
                  Années d&apos;expérience
                </label>
                <select
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  className="w-full rounded-xl border border-dep-border bg-cream px-4 py-3 text-[14px] text-navy outline-none focus:border-navy focus:bg-white"
                >
                  <option>1 an</option>
                  <option>2-5 ans</option>
                  <option>5-10 ans</option>
                  <option>+10 ans</option>
                </select>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {DOCUMENTS.map((doc) => {
                  const Icon = doc.icon;
                  return (
                    <label
                      key={doc.id}
                      className={`block cursor-pointer rounded-xl border-2 border-dashed p-6 text-center transition-all ${
                        uploaded[doc.id]
                          ? "border-green bg-green/[0.05]"
                          : "border-dep-border bg-cream hover:border-orange hover:bg-orange/[0.03]"
                      }`}
                    >
                      {uploaded[doc.id] ? (
                        <div className="flex flex-col items-center gap-2">
                          <CheckCircle size={28} className="text-green" />
                          <span className="text-[12px] font-semibold text-green">Document ajouté ✓</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2">
                          <Icon size={24} className="text-dep-gray" />
                          <span className="text-[12px] font-medium text-navy">{doc.label}</span>
                          <span className="text-[10px] text-dep-gray">
                            {doc.required ? "Obligatoire" : "Optionnel"} · JPG, PNG, PDF
                          </span>
                        </div>
                      )}
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*,.pdf"
                        onChange={() => setUploaded((prev) => ({ ...prev, [doc.id]: true }))}
                      />
                    </label>
                  );
                })}
              </div>
              <div className="flex gap-3 rounded-xl border border-navy/[0.08] bg-navy/[0.04] p-4">
                <Shield size={18} className="mt-0.5 shrink-0 text-navy" />
                <p className="text-[12px] leading-[1.6] text-navy">
                  <strong>Vos documents sont sécurisés.</strong> Ils sont uniquement utilisés pour
                  vérifier votre identité et ne seront jamais partagés sans votre accord.
                </p>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="rounded-xl border border-dep-border bg-cream p-4">
                <h4 className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-dep-gray">
                  Vos informations
                </h4>
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy text-[16px] font-bold text-white">
                    {firstName[0]}
                    {lastName[0]}
                  </div>
                  <div>
                    <div className="font-semibold text-navy">
                      {firstName} {lastName}
                    </div>
                    <div className="text-[12px] text-dep-gray">
                      {phone} · {ville}
                    </div>
                  </div>
                </div>
              </div>
              <div className="rounded-xl border border-dep-border bg-cream p-4">
                <h4 className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-dep-gray">
                  Spécialités ({serviceLabels.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {serviceLabels.map((s) => (
                    <span
                      key={s}
                      className="rounded-full bg-orange/10 px-3 py-1 text-[12px] font-medium text-orange"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              <div className="rounded-xl border border-dep-border bg-cream p-4">
                <h4 className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-dep-gray">
                  Documents
                </h4>
                <div className="space-y-2">
                  {DOCUMENTS.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between">
                      <span className="text-[12px] text-navy">{doc.label}</span>
                      {uploaded[doc.id] ? (
                        <span className="text-[11px] font-semibold text-green">✓ Ajouté</span>
                      ) : (
                        <span className="text-[11px] text-dep-gray">Non fourni</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="mt-0.5 accent-orange"
                />
                <span className="text-[12px] leading-[1.6] text-dep-gray">
                  J&apos;accepte les{" "}
                  <a href="#" className="text-orange underline" onClick={(e) => e.preventDefault()}>
                    Conditions générales d&apos;utilisation
                  </a>{" "}
                  et la{" "}
                  <a href="#" className="text-orange underline" onClick={(e) => e.preventDefault()}>
                    Politique de confidentialité
                  </a>{" "}
                  de DEPANNI.ma
                </span>
              </label>
            </div>
          )}

          <div className="mt-6 flex gap-3">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={() => {
                  setStepError("");
                  setCurrentStep((s) => s - 1);
                }}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-dep-border bg-cream py-3 text-[14px] font-semibold text-navy transition-colors hover:bg-[#F0EBE1]"
              >
                <ChevronLeft size={16} /> Retour
              </button>
            )}
            <motion.button
              type="button"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              disabled={isSubmitting}
              onClick={currentStep < 4 ? handleNext : handleRegister}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-orange py-3 text-[14px] font-semibold text-white transition-colors hover:bg-orange-2 disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Création...
                </>
              ) : currentStep < 4 ? (
                <>
                  Continuer <ChevronRight size={16} />
                </>
              ) : (
                <>
                  Créer mon compte <ArrowRight size={16} />
                </>
              )}
            </motion.button>
          </div>

          <div className="mt-5 border-t border-dep-border pt-4 text-center">
            <span className="text-[13px] text-dep-gray">Déjà inscrit ? </span>
            <Link href="/artisan/login" className="text-[13px] font-semibold text-orange hover:text-orange-2">
              Se connecter →
            </Link>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
