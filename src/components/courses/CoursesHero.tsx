import { motion } from "framer-motion";
import { Search, Sparkles, X, Flame } from "lucide-react";

export function CoursesHero({
  totalCourses,
  search,
  onSearch,
}: {
  totalCourses: number;
  search: string;
  onSearch: (v: string) => void;
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

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.18 }}
          className="mx-auto mt-8 max-w-2xl"
        >
          <div className="group relative">
            <div className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-primary/20 via-primary/10 to-transparent blur-2xl opacity-70 transition-opacity group-focus-within:opacity-100" />
            <label className="flex items-center gap-3 rounded-full border border-border/70 bg-background/80 pl-5 pr-2 py-2 backdrop-blur-xl shadow-[0_8px_40px_-20px_hsl(var(--primary)/0.35)] transition-all focus-within:border-primary/60 focus-within:shadow-[0_10px_50px_-16px_hsl(var(--primary)/0.5)]">
              <Search size={18} className="shrink-0 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => onSearch(e.target.value)}
                placeholder="Search by course, technology, or career goal…"
                aria-label="Search courses"
                className="min-w-0 flex-1 bg-transparent py-2 text-sm outline-none placeholder:text-muted-foreground sm:text-base"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => onSearch("")}
                  aria-label="Clear search"
                  className="grid h-8 w-8 place-items-center rounded-full text-muted-foreground transition hover:bg-accent hover:text-foreground"
                >
                  <X size={16} />
                </button>
              )}
            </label>
          </div>
        </motion.div>
      </div>
    </section>
  );
}