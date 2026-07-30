import { useRef } from "react";
import { useScroll } from "framer-motion";
import { ImpactHeading } from "./ImpactHeading";
import { ImpactGallery } from "./ImpactGallery";

export function ImpactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  return (
    <section ref={sectionRef} id="impact" className="relative overflow-x-clip py-24 sm:py-32">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[520px] opacity-70"
        style={{ background: "var(--gradient-glow)" }}
      />
      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        <ImpactHeading />
      </div>
      <ImpactGallery scrollYProgress={scrollYProgress} />
    </section>
  );
}