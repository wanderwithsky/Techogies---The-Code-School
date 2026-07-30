import { useRef } from "react";
import { ParticleCanvas } from "./ParticleCanvas";
import { useMouseRepulsion } from "./useMouseRepulsion";

export function HeroParticles() {
  const ref = useRef<HTMLDivElement | null>(null);
  const cursor = useMouseRepulsion(ref);
  return (
    <div
      ref={ref}
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      <ParticleCanvas containerRef={ref} cursor={cursor} />
    </div>
  );
}