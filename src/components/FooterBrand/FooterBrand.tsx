import { useRef } from "react";
import { motion } from "framer-motion";
import { SpotlightText } from "./SpotlightText";
import { useSpotlight } from "./useSpotlight";
import "./footerBrand.css";

const VIEW_W = 1200;
const VIEW_H = 260;

export function FooterBrand() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const circleRef = useRef<SVGCircleElement | null>(null);

  useSpotlight({ containerRef, svgRef, circleRef });

  return (
    <section className="footer-brand-section bg-white dark:bg-[#050505]">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="text-center"
      >
        <div ref={containerRef} className="relative mx-auto w-full">
          <SpotlightText
            ref={svgRef}
            circleRef={circleRef}
            radius={180}
            text="Techogies"
            viewBox={{ w: VIEW_W, h: VIEW_H }}
          />
        </div>
      </motion.div>
    </section>
  );
}