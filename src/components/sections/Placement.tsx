import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import placement from "@/data/placement.json";
import { SectionHeading } from "@/components/common/SectionHeading";

export function Placement() {
  return (
    <section id="placements" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          eyebrow="Placement Assistance"
          title="An entire team behind your first job"
          subtitle="From resume to offer letter — we don't stop until you're placed."
        />
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {placement.map((p, i) => {
            const Icon = (Icons as unknown as Record<string, React.ComponentType<{ size?: number }>>)[p.icon] ?? Icons.CheckCircle2;
            return (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: (i % 4) * 0.05 }}
                className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-5 transition hover:-translate-y-0.5 hover:shadow-soft"
              >
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-brand text-primary-foreground shadow-elegant">
                  <Icon size={19} />
                </span>
                <p className="font-medium text-foreground">{p.title}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}