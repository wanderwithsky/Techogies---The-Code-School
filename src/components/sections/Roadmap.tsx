import { motion } from "framer-motion";
import roadmap from "@/data/roadmap.json";
import { SectionHeading } from "@/components/common/SectionHeading";

export function Roadmap() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-4xl px-5 lg:px-8">
        <SectionHeading
          eyebrow="Learning Roadmap"
          title="A clear path from beginner to placed"
          subtitle="Every learner follows the same 8-step system that has placed hundreds of graduates."
        />
        <div className="relative mt-16">
          <span className="absolute left-4 top-0 h-full w-px bg-border md:left-1/2" aria-hidden />
          <ul className="space-y-8">
            {roadmap.map((r, i) => (
              <motion.li
                key={r.step}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.45, delay: 0.04 * i }}
                className={`relative pl-14 md:grid md:grid-cols-2 md:gap-10 md:pl-0 ${
                  i % 2 === 0 ? "" : "md:[&>div:first-child]:col-start-2"
                }`}
              >
                <div className={i % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12"}>
                  <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold text-muted-foreground">
                    Step {r.step}
                  </div>
                  <h3 className="mt-3 font-display text-xl font-bold text-foreground">{r.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{r.desc}</p>
                </div>
                <span className="absolute left-4 top-1.5 grid h-5 w-5 -translate-x-1/2 place-items-center rounded-full bg-gradient-brand shadow-elegant md:left-1/2">
                  <span className="h-2 w-2 rounded-full bg-white" />
                </span>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}