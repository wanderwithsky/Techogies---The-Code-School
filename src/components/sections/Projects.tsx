import { useRef } from "react";
import { motion, useScroll, useTransform, useMotionTemplate } from "framer-motion";
import { CheckCircle2, ArrowUpRight } from "lucide-react";
import projects from "@/data/projects.json";
import { SectionHeading } from "@/components/common/SectionHeading";

export function Projects() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Total container height is enough to allow all cards to scroll smoothly.
  // 4 cards = 400vh
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const total = projects.length;
  // step is the progress distance between each card hitting the center.
  // For 4 cards, steps are at 0, 0.333, 0.666, 1
  const step = 1 / (total - 1);

  return (
    <section id="projects" className="relative bg-background pt-24 sm:pt-32">
      {/* Normal Document Flow Heading */}
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          eyebrow="Student Projects"
          title="Real projects. Real portfolios."
          subtitle="Every learner ships production-grade projects that showcase real engineering skill."
        />
      </div>

      {/* Sticky Scroll Region - Starts after fixed responsive spacing */}
      <div ref={containerRef} className="relative mt-[clamp(64px,7vw,110px)]" style={{ height: "400vh" }}>
        <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden">
          
          {/* Project Cards */}
        {projects.map((project, i) => {
          const entryStart = (i - 1) * step;
          const center = i * step;
          const exitEnd = (i + 1) * step;

          // Y translation: card slides up from 100vh to 0vh
          const yInput = [entryStart, center];
          const yOutput = ["100vh", "0vh"];
          const y = useTransform(scrollYProgress, yInput, yOutput, { clamp: true });
          const yValue = i === 0 ? "0vh" : y;

          // Scale: starts at 0.97, scales to 1.02 at center, then shrinks to 0.98 when covered
          let scaleInput = [];
          let scaleOutput = [];
          let glowOutput = [];

          if (i === 0) {
            scaleInput = [0, step];
            scaleOutput = [1.02, 0.98];
            glowOutput = [1, 0];
          } else if (i === total - 1) {
            scaleInput = [entryStart, center];
            scaleOutput = [0.97, 1.02];
            glowOutput = [0, 1];
          } else {
            scaleInput = [entryStart, center, exitEnd];
            scaleOutput = [0.97, 1.02, 0.98];
            glowOutput = [0, 1, 0];
          }

          const scale = useTransform(scrollYProgress, scaleInput, scaleOutput, { clamp: true });
          const glowOpacity = useTransform(scrollYProgress, scaleInput, glowOutput, { clamp: true });
          
          // Image zoom: slightly zooms when card is active
          const imageScaleOutput = scaleOutput.map(s => s === 1.02 ? 1.04 : 1);
          const imageScale = useTransform(scrollYProgress, scaleInput, imageScaleOutput, { clamp: true });

          return (
            <motion.div
              key={project.title}
              style={{ y: yValue, scale, zIndex: i }}
              className="absolute inset-0 m-auto flex h-auto max-h-[90vh] min-h-[420px] w-[90vw] max-w-[1500px] flex-col overflow-hidden rounded-[2rem] border border-border/50 bg-card shadow-elegant lg:h-[480px] lg:flex-row"
            >
              {/* Premium Glow Overlay */}
              <motion.div 
                style={{ opacity: glowOpacity }}
                className="pointer-events-none absolute inset-0 z-50 rounded-[2rem] border border-primary shadow-[0_0_40px_rgba(255,107,0,0.15)]"
              />

              {/* Left Column (Image) - 40% */}
              <div className="relative h-64 w-full overflow-hidden lg:h-full lg:w-[40%]">
                <motion.img 
                  style={{ scale: imageScale }}
                  src={project.image} 
                  alt={project.title}
                  loading="lazy"
                  className="h-full w-full origin-center object-cover" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent lg:hidden z-10" />
              </div>

              {/* Right Column (Content) - 60% */}
              <div className="flex flex-col justify-between bg-card p-8 sm:p-12 lg:w-[60%] lg:border-l lg:border-border/50">
                <div className="flex flex-col">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                      {project.title}
                    </h3>
                  </div>
                  
                  <p className="mt-4 max-w-2xl text-lg text-muted-foreground leading-relaxed">
                    {project.description}
                  </p>

                  <div className="mt-8 flex flex-wrap gap-2">
                    {project.tags.map(t => (
                      <span key={t} className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
                        {t}
                      </span>
                    ))}
                  </div>
                  
                  <div className="mt-8 grid grid-cols-2 gap-8 lg:flex lg:gap-12">
                    {project.stats.map(s => (
                      <div key={s} className="flex flex-col gap-1">
                        <span className="font-display text-2xl font-bold text-primary">
                          {s.split(' ')[0]}
                        </span>
                        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          {s.substring(s.indexOf(' ') + 1)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {project.features.map(f => (
                      <li key={f} className="flex items-center gap-3 text-sm font-medium text-foreground/80">
                        <CheckCircle2 size={16} className="text-primary" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          );
        })}
        </div>
      </div>
    </section>
  );
}