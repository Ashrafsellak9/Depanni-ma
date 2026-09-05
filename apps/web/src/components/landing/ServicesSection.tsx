"use client";

import { motion, useReducedMotion } from "framer-motion";

import { SectionTag } from "@/components/landing/SectionTag";
import { MoreServicesCard, ServiceCard } from "@/components/landing/ui/ServiceCard";
import { fadeInUp, viewportOnce } from "@/components/landing/motion";
import { Accent, DisplayTitle } from "@/components/ui/display-title";

const SERVICES = [
  {
    name: "Plomberie",
    desc: "Fuite, robinet, chauffe-eau",
    image: "/images/services/plomberie.jpg",
    urgent: true,
    span: "lg:col-span-2",
  },
  {
    name: "Électricité",
    desc: "Panne, tableau, installation",
    image: "/images/services/electricite.jpg",
    span: "lg:col-span-1",
  },
  {
    name: "Serrurerie",
    desc: "Ouverture, changement serrure",
    image: "/images/services/serrurerie.jpg",
    urgent: true,
    span: "lg:col-span-1",
  },
  {
    name: "Mécanique Auto",
    desc: "Dépannage, batterie, pneu",
    image: "/images/services/mecanique.jpg",
    span: "lg:col-span-1",
  },
  {
    name: "Peinture",
    desc: "Intérieur, façade, retouches",
    image: "/images/services/peinture.jpg",
    span: "lg:col-span-3",
  },
  {
    name: "Ménage & Nettoyage",
    desc: "Maison, bureau, fin de chantier",
    image: "/images/services/menage.jpg",
    span: "lg:col-span-1",
  },
  {
    name: "Électroménager",
    desc: "Réparation, installation",
    image: "/images/services/electromenager.jpg",
    span: "lg:col-span-1",
  },
] as const;

export function ServicesSection() {
  const reduced = useReducedMotion();

  return (
    <section id="services" className="bg-paper py-24 md:py-32" aria-labelledby="services-title">
      <div className="landing-container">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={{ visible: { transition: { staggerChildren: reduced ? 0 : 0.08 } } }}
          className="mb-14 max-w-2xl"
        >
          <motion.div variants={fadeInUp}>
            <SectionTag>Nos services</SectionTag>
          </motion.div>
          <motion.div variants={fadeInUp}>
            <DisplayTitle as="h2" size="display-2" id="services-title" className="mt-4">
              Tous les dépannages dont vous avez <Accent>besoin</Accent>
            </DisplayTitle>
          </motion.div>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={{ visible: { transition: { staggerChildren: reduced ? 0 : 0.06 } } }}
          className="grid auto-rows-[220px] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {SERVICES.map((s) => (
            <motion.div key={s.name} variants={fadeInUp} className={`h-full ${s.span}`}>
              <ServiceCard
                name={s.name}
                desc={s.desc}
                image={s.image}
                urgent={"urgent" in s ? s.urgent : false}
              />
            </motion.div>
          ))}
          <motion.div variants={fadeInUp} className="h-full lg:col-span-2">
            <MoreServicesCard />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
