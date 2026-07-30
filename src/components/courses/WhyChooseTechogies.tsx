import { motion } from "framer-motion";
import {
  Users,
  Rocket,
  Briefcase,
  GraduationCap,
  Compass,
  MessageSquare,
  type LucideIcon,
} from "lucide-react";
import meta from "@/data/coursesMeta.json";

const ICONS: Record<string, LucideIcon> = {
  Users,
  Rocket,
  Briefcase,
  GraduationCap,
  Compass,
  MessageSquare,
};

export function WhyChooseTechogies() {
  return (
    <section className="relative border-t border-border/60 bg-card/30 py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Why Techogies
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Everything you need to become job-ready
          </h2>
          <p className="mt-3 text-muted-foreground">
            Beyond lectures — real mentorship, real projects, and a real career team behind you.
          </p>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
          className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {meta.whyChoose.map((item) => {
            const Icon = ICONS[item.iconName] ?? Users;
            return (
              <motion.div
                key={item.title}
                variants={{
                  hidden: { opacity: 0, y: 18 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
                }}
                className="group relative overflow-hidden rounded-2xl border border-border/60 bg-background/60 p-6 backdrop-blur transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-[0_20px_60px_-30px_hsl(var(--primary)/0.5)]"
              >
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-brand text-primary-foreground shadow-elegant">
                  <Icon size={20} />
                </div>
                <h3 className="mt-4 text-base font-semibold text-foreground">{item.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{item.description}</p>
                <span
                  aria-hidden
                  className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-primary/10 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
                />
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}