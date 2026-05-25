"use client";

import { motion } from "framer-motion";
import { Plus } from "lucide-react";

import { SectionTag } from "@/components/landing/SectionTag";
import { fadeInUp, viewportOnce } from "@/components/landing/motion";
const SERVICES = [
  { icon: "🔧", name: "Plomberie", desc: "Fuite, robinet, chauffe-eau", urgent: true },
  { icon: "⚡", name: "Électricité", desc: "Panne, tableau, installation", urgent: true },
  { icon: "🔑", name: "Serrurerie", desc: "Ouverture, changement serrure", urgent: true },
  { icon: "🚗", name: "Mécanique Auto", desc: "Dépannage, batterie, pneu" },
  { icon: "🎨", name: "Peinture", desc: "Intérieur, façade, retouches" },
  { icon: "🧹", name: "Ménage & Nettoyage", desc: "Maison, bureau, fin de chantier" },
  { icon: "🛠️", name: "Électroménager", desc: "Réparation, installation" },
] as const;

function ServiceCard(
  props:
    | { featured: true; icon?: string; name?: string; desc?: string; urgent?: boolean }
    | { featured?: false; icon: string; name: string; desc: string; urgent?: boolean },
) {
  const { featured } = props;
  if (featured === true) {
    return (
      <motion.div
        variants={fadeInUp}
        className="group relative flex min-h-[200px] flex-col items-center justify-center overflow-hidden rounded-[20px] bg-navy p-6 text-center transition-transform duration-300 hover:-translate-y-1"
      >
        <Plus className="mb-3 h-10 w-10 text-orange transition-transform group-hover:scale-110" />
        <p className="font-syne text-xl font-extrabold text-white">Et bien plus...</p>
        <p className="mt-2 text-sm text-white/55">Demandez, on trouve l&apos;artisan</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={fadeInUp}
      className="group relative min-h-[200px] overflow-hidden rounded-[20px] border border-dep-border bg-white transition-transform duration-300 hover:-translate-y-1"
    >
      <div className="relative z-10 flex h-full flex-col p-6 transition-colors duration-300 group-hover:text-white">
        {"urgent" in props && props.urgent && (
          <span className="mb-3 w-fit rounded-full bg-orange/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-orange group-hover:bg-white/20 group-hover:text-white">
            Urgent
          </span>
        )}
        <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-cream-2 text-2xl transition-colors group-hover:bg-white/15">
          {props.icon}
        </span>
        <h3 className="font-syne text-lg font-extrabold text-navy group-hover:text-white">{props.name}</h3>
        <p className="mt-2 text-sm text-dep-gray group-hover:text-white/75">{props.desc}</p>
      </div>
      <div className="absolute inset-x-0 bottom-0 z-0 h-0 bg-navy transition-all duration-300 group-hover:h-full" />
    </motion.div>
  );
}

export function ServicesSection() {
  return (
    <section id="services" className="bg-cream py-24 md:py-28">
      <div className="container mx-auto px-4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
          className="mb-14 max-w-2xl"
        >
          <motion.div variants={fadeInUp}>
            <SectionTag>Nos services</SectionTag>
          </motion.div>
          <motion.h2
            variants={fadeInUp}
            className="mt-4 font-syne text-[32px] font-extrabold tracking-tight2 text-navy md:text-[44px]"
          >
            Tous les dépannages dont vous avez besoin
          </motion.h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          {SERVICES.map((s) => (
            <ServiceCard key={s.name} {...s} />
          ))}
          <ServiceCard featured />
        </motion.div>
      </div>
    </section>
  );
}
