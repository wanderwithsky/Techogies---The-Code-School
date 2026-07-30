import { motion, type MotionValue, useSpring, useTransform } from "framer-motion";
import impactData from "@/data/impact.json";
import { ImpactCard, type ImpactItem } from "./ImpactCard";

// Staggered editorial offsets applied to each card in the single continuous strip.
// Alternating vertical shifts break the perfect grid without splitting motion.
const STAGGER_CLASSES = ["lg:pt-0", "lg:pt-12", "lg:pt-4", "lg:pt-16"];

const SPRING = { stiffness: 60, damping: 30, mass: 0.6 };

type ImpactGalleryProps = {
  scrollYProgress: MotionValue<number>;
};

export function ImpactGallery({ scrollYProgress }: ImpactGalleryProps) {
  const items = impactData as ImpactItem[];

  // Scroll-linked R→L translation. Stays at 0 until the section is fully in view,
  // then eases slowly through the rest of the scroll range.
  const rawX = useTransform(scrollYProgress, [0.25, 0.95], [0, -12]);
  const xNum = useSpring(rawX, SPRING);
  const x = useTransform(xNum, (v) => `${v}%`);

  return (
    <div className="mt-16 w-full" data-impact-gallery>
      {/* Mobile & tablet: horizontally scrollable strip, native swipe */}
      <div className="lg:hidden">
        <div className="flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-4 sm:gap-6 sm:px-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {items.map((item) => (
            <div
              key={item.id}
              className="w-[78vw] max-w-[20rem] shrink-0 snap-start sm:w-[52vw]"
            >
              <ImpactCard item={item} />
            </div>
          ))}
        </div>
      </div>

      {/* Desktop: full-bleed strip, scroll-linked R→L translation.
          Sheryians-style: first card starts near the left edge, all four fit
          fully at rest, scroll nudges the whole strip slowly to the left. */}
      <div className="relative hidden w-full lg:block">
        <motion.div
          data-impact-strip
          className="flex items-start justify-between gap-5 px-6 will-change-transform xl:gap-6 xl:px-10"
          style={{ x, willChange: "transform" }}
        >
          {items.map((item, idx) => (
            <div
              key={item.id}
              className={`w-[calc((100%-3.75rem)/4)] shrink-0 xl:w-[calc((100%-4.5rem)/4)] ${STAGGER_CLASSES[idx % STAGGER_CLASSES.length]}`}
            >
              <ImpactCard item={item} />
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}