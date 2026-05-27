"use client";

import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import Image from "next/image";

import { SectionTag } from "@/components/landing/SectionTag";
import { fadeInUp, viewportOnce } from "@/components/landing/motion";

const SERVICES = [
  {
    name: "Plomberie",
    desc: "Fuite, robinet, chauffe-eau",
    image: "/images/services/plomberie.jpeg",
    urgent: true,
  },
  {
    name: "Électricité",
    desc: "Panne, tableau, installation",
    image: "/images/services/electricite.jpeg",
    urgent: true,
  },
  {
    name: "Serrurerie",
    desc: "Ouverture, changement serrure",
    image: "/images/services/serrurerie.jpg",
    urgent: true,
  },
  {
    name: "Mécanique Auto",
    desc: "Dépannage, batterie, pneu",
    image: "/images/services/mecanique.jpg",
  },
  {
    name: "Peinture",
    desc: "Intérieur, façade, retouches",
    image: "/images/services/peinture.jpg",
  },
  {
    name: "Ménage & Nettoyage",
    desc: "Maison, bureau, fin de chantier",
    image: "/images/services/menage.jpg",
  },
  {
    name: "Électroménager",
    desc: "Réparation, installation",
    image: "/images/services/electromenager.jpeg",
  },
] as const;

function ServiceCard(
  props:
    | { featured: true }
    | { featured?: false; image: string; name: string; desc: string; urgent?: boolean },
) {
  if (props.featured === true) {
    return (
      <motion.div
        variants={fadeInUp}
        className="group relative flex min-h-[240px] flex-col items-center justify-center overflow-hidden rounded-[20px] bg-navy p-6 text-center transition-transform duration-300 hover:-translate-y-1"
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
      className="group relative min-h-[240px] overflow-hidden rounded-[20px] border border-dep-border bg-white transition-transform duration-300 hover:-translate-y-1"
    >
      <div className="relative z-10 flex h-full flex-col p-5 transition-colors duration-300 group-hover:text-white">
        <div className="relative mb-4 h-[88px] w-full overflow-hidden rounded-xl bg-cream-2">
          <Image
            src={props.image}
            alt={props.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {props.urgent && (
            <span className="absolute left-2 top-2 z-10 rounded-full bg-orange/95 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white shadow-sm">
              Urgent
            </span>
          )}
        </div>
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
