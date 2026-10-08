import { motion } from "framer-motion";
import stats from "@/data/stats.json";
import { AnimatedCounter } from "@/components/common/AnimatedCounter";

export function Stats() {
  return (
    <section className="relative border-y border-border bg-card/40">
      {/* Desktop Grid Layout */}
      <div className="mx-auto hidden max-w-7xl grid-cols-2 gap-6 px-5 py-14 sm:grid sm:grid-cols-3 lg:grid-cols-5 lg:px-8">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.05 }}
            className="text-center"
          >
            <div className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              <span className="gradient-text">
                <AnimatedCounter value={s.value} suffix={s.suffix} decimals={s.decimals ?? 0} />
              </span>
            </div>
            <p className="mt-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {s.label}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Mobile Single-line Marquee */}
      <div className="flex overflow-hidden py-10 sm:hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div className="flex w-max animate-marquee">
          <div className="flex items-center gap-16 pr-16">
            {stats.map((s) => (
              <div key={s.label} className="text-center min-w-[120px]">
                <div className="font-display text-3xl font-bold tracking-tight text-foreground">
                  <span className="gradient-text">
                    <AnimatedCounter value={s.value} suffix={s.suffix} decimals={s.decimals ?? 0} />
                  </span>
                </div>
                <p className="mt-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-16 pr-16" aria-hidden="true">
            {stats.map((s) => (
              <div key={`${s.label}-dup`} className="text-center min-w-[120px]">
                <div className="font-display text-3xl font-bold tracking-tight text-foreground">
                  <span className="gradient-text">
                    <AnimatedCounter value={s.value} suffix={s.suffix} decimals={s.decimals ?? 0} />
                  </span>
                </div>
                <p className="mt-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}