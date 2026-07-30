import { motion, type MotionValue, useTransform } from "framer-motion";
import impactData from "@/data/impact.json";
import { ImpactCard, type ImpactItem } from "./ImpactCard";

type ImpactGalleryProps = {
  scrollYProgress: MotionValue<number>;
};

export function ImpactGallery({ scrollYProgress }: ImpactGalleryProps) {
  const items = impactData as ImpactItem[];

  // Purely custom mapping for horizontal translation:
  // 0.0 -> 0.3: Stay completely locked at 25vw to center the first card.
  // 0.3 -> 1.0: Linearly translate to -50vw to bring the next cards into the center.
  const x = useTransform(
    scrollYProgress, 
    [0, 0.3, 1], 
    ["25vw", "25vw", "-50vw"]
  );

  return (
    <div className="relative w-full overflow-visible py-10">
      {/* The gallery track itself */}
      <motion.div 
        className="flex w-max items-start gap-6 md:gap-8 lg:gap-10 px-5 md:px-10 xl:px-20 will-change-transform"
        style={{ x }}
      >
        {items.map((item, index) => {
          // Editorial Staircase Pattern
          // Every odd-indexed card sits lower to break the grid organically.
          const isOffset = index % 2 !== 0;
          
          return (
            <div 
              key={item.id}
              className={`w-[75vw] sm:w-[45vw] md:w-[32vw] lg:w-[28vw] xl:w-[24vw] shrink-0 aspect-square transition-all ${isOffset ? "mt-12 md:mt-16 lg:mt-24" : "mt-0"}`}
            >
              <ImpactCard item={item} />
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}