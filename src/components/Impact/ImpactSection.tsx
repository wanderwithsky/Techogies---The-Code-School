import { useRef } from "react";
import { useScroll, useSpring } from "framer-motion";
import { ImpactHeading } from "./ImpactHeading";
import { ImpactGallery } from "./ImpactGallery";

export function ImpactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  
  // Track the natural scroll of this specific section across the viewport.
  // "start end" = top of section hits bottom of screen (progress = 0)
  // "end start" = bottom of section hits top of screen (progress = 1)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Smooth the raw scroll value for a premium parallax feel
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <section 
      ref={sectionRef} 
      id="impact" 
      className="relative w-full overflow-x-hidden py-24 sm:py-32 bg-background flex flex-col gap-16"
    >
      {/* Decorative background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[500px] opacity-70"
        style={{ background: "var(--gradient-glow)" }}
      />
      
      {/* Heading is just a normal block in the document flow */}
      <div className="relative mx-auto w-full max-w-7xl px-5 lg:px-8 z-20">
        <ImpactHeading />
      </div>
      
      {/* Gallery is just a normal block below the heading */}
      <div className="relative w-full z-10">
        <ImpactGallery scrollYProgress={smoothProgress} />
      </div>
    </section>
  );
}