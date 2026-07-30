import { motion } from "framer-motion";
import stats from "@/data/stats.json";
import { AnimatedCounter } from "@/components/common/AnimatedCounter";

export function Stats() {
  return (
    <section className="relative border-y border-border bg-card/40">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-5 py-14 sm:grid-cols-3 lg:grid-cols-5 lg:px-8">
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
    </section>
  );
}