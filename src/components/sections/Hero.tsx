import { motion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { scrollToId } from "@/lib/scroll";
import { useRef } from "react";
import { Workspace } from "@/components/hero-workspace/Workspace";
import { HeroParticles } from "@/components/hero-particles/HeroParticles";
import { CursorSparkle } from "@/components/effects/CursorSparkle";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
} as const;

export function Hero() {
  const heroRef = useRef<HTMLElement>(null!);
  
  return (
    <section
      ref={heroRef}
      id="home"
      className="relative min-h-screen overflow-hidden bg-background"
    >
      {/* Background: radial glow + subtle grid */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_75%_35%,color-mix(in_oklab,var(--brand)_25%,transparent),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(45%_40%_at_15%_80%,color-mix(in_oklab,var(--brand)_12%,transparent),transparent_70%)]" />
        <HeroParticles />
        <div
          className="absolute inset-0 opacity-[0.06] dark:opacity-[0.06] opacity-[0.1]"
          style={{
            backgroundImage:
              "linear-gradient(to right, var(--color-foreground) 1px, transparent 1px), linear-gradient(to bottom, var(--color-foreground) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage: "radial-gradient(ellipse at center, black 40%, transparent 80%)",
          }}
        />
      </div>

      <CursorSparkle containerRef={heroRef} />

      <div className="relative z-10 mx-auto grid min-h-screen max-w-[1400px] grid-cols-1 items-center gap-12 px-5 pt-28 pb-20 lg:grid-cols-[42%_58%] lg:gap-10 lg:px-8 lg:pt-24 xl:pr-6">
        {/* Left column */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.08 } } }}
          className="flex flex-col"
        >
          <motion.span
            variants={fadeUp}
            className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-secondary/50 px-4 py-1.5 text-xs font-medium text-foreground backdrop-blur"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[color:var(--brand)] opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[color:var(--brand)]" />
            </span>
            New cohort · Live in 14 days
          </motion.span>

          <motion.h1
            variants={fadeUp}
            className="mt-5 max-w-[620px] font-display text-4xl font-bold leading-[1.05] tracking-[-0.03em] text-foreground sm:text-5xl lg:text-6xl xl:text-7xl"
          >
            <span className="block text-3xl sm:text-4xl lg:text-5xl xl:text-6xl">
              <span className="gradient-text">Code</span>,{" "}
              <span className="gradient-text">Build</span>,{" "}
              <span className="gradient-text">Deploy</span>.
            </span>
            <span className="block">Become an Industry-Ready Developer.</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-6 max-w-[540px] text-lg leading-[1.7] text-muted-foreground"
          >
            Learn modern web development, secure applications, APIs, databases, cloud
            deployment, and analytics by building real projects with expert mentors and
            hands-on experience.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center"
          >
            <Link
              to="/courses"
              className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-gradient-brand px-7 text-sm font-semibold text-white shadow-elegant transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_50px_-15px_color-mix(in_oklab,var(--brand)_60%,transparent)] sm:w-auto"
            >
              Explore Courses
              <ArrowRight size={16} className="transition group-hover:translate-x-1" />
            </Link>
            <button
              onClick={() => scrollToId("contact")}
              className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-full border-2 border-[color:var(--brand)] bg-transparent px-7 text-sm font-semibold text-foreground transition duration-300 hover:bg-[color:var(--brand)] hover:text-white sm:w-auto"
            >
              Book Free Career Consultation
            </button>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="mt-12 flex items-center gap-4 text-xs text-muted-foreground"
          >
            <div className="flex -space-x-2">
              {[12, 47, 33, 25, 52].map((n) => (
                <img
                  key={n}
                  src={`https://i.pravatar.cc/60?img=${n}`}
                  alt=""
                  className="h-8 w-8 rounded-full border-2 border-background object-cover"
                  loading="lazy"
                />
              ))}
            </div>
            <span>500+ students already learning</span>
          </motion.div>
        </motion.div>

        {/* Right column: hero image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: "easeOut", delay: 0.2 }}
          className="relative mx-auto w-full max-w-[980px] hidden lg:block lg:ml-auto lg:mr-0 xl:max-w-[1040px]"
        >
          {/* soft glow */}
          <div className="absolute -inset-6 -z-10 rounded-[32px] bg-[radial-gradient(60%_60%_at_50%_50%,color-mix(in_oklab,var(--brand)_35%,transparent),transparent_70%)] blur-2xl" />
          <Workspace />
        </motion.div>
      </div>

      <button
        onClick={() => scrollToId("stats")}
        aria-label="Scroll down"
        className="absolute inset-x-0 bottom-6 z-10 mx-auto grid h-10 w-10 place-items-center rounded-full border border-border bg-secondary/50 text-foreground backdrop-blur"
      >
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity }}
          className="grid place-items-center"
        >
          <ChevronDown size={18} />
        </motion.span>
      </button>
    </section>
  );
}