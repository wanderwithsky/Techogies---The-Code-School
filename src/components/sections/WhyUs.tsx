import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import features from "@/data/features.json";
import { SectionHeading } from "@/components/common/SectionHeading";

export function WhyUs() {
  return (
    <section id="why" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          eyebrow="Why Techogies"
          title="Everything you need to launch a tech career"
          subtitle="A learning system engineered end-to-end — from your first line of code to your first offer letter."
        />
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {features.map((f, i) => {
            const Icon = (Icons as unknown as Record<string, React.ComponentType<{ size?: number }>>)[f.icon] ?? Icons.Sparkles;
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.45, delay: (i % 4) * 0.05 }}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-elegant"
              >
                <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-brand opacity-0 blur-2xl transition-opacity group-hover:opacity-40" />
                <div className="relative grid h-11 w-11 place-items-center rounded-xl bg-accent text-primary">
                  <Icon size={20} />
                </div>
                <h3 className="relative mt-4 font-display text-base font-semibold text-foreground">
                  {f.title}
                </h3>
                <p className="relative mt-1.5 text-sm text-muted-foreground">{f.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}