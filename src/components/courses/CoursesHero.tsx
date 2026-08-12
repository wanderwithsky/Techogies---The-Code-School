import { motion } from "framer-motion";
import { Sparkles, Flame } from "lucide-react";

export function CoursesHero({
  totalCourses,
}: {
  totalCourses: number;
}) {
  return (
    <section className="relative overflow-hidden pt-28 pb-14 sm:pt-32 sm:pb-16">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 [background:radial-gradient(60%_60%_at_50%_0%,hsl(var(--primary)/0.18),transparent_70%),radial-gradient(50%_50%_at_80%_100%,hsl(var(--primary)/0.10),transparent_70%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-full bg-[linear-gradient(to_bottom,hsl(var(--background)/0)_0%,hsl(var(--background))_90%)]"
      />

      <div className="mx-auto max-w-4xl px-5 text-center lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur"
        >
          <Sparkles size={13} className="text-primary" />
          {totalCourses} industry-focused programs
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="mx-auto mt-4 inline-flex max-w-full items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3.5 py-1.5 text-xs font-semibold text-primary backdrop-blur"
        >
          <Flame size={13} className="shrink-0" />
          <span className="truncate">
            Early Bird Offer — exclusive admission benefits till 15 August
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.05 }}
          className="mt-5 text-balance font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl"
        >
          Find the right course for your <span className="text-primary">tech career</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.12 }}
          className="mx-auto mt-4 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg"
        >
          Explore industry-focused programs designed to help you build practical
          skills, real-world projects, and become job-ready.
        </motion.p>
      </div>
    </section>
  );
}