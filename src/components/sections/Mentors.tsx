import { motion } from "framer-motion";
import { Linkedin } from "lucide-react";
import mentors from "@/data/mentors.json";
import { SectionHeading } from "@/components/common/SectionHeading";

export function Mentors() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          eyebrow="Meet Our Mentors"
          title="Learn from engineers who ship"
          subtitle="Every session is led by senior engineers with real production experience."
        />
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {mentors.map((m, i) => (
            <motion.div
              key={m.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="group overflow-hidden rounded-3xl border border-border bg-card"
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={m.photo}
                  alt={m.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
              </div>
              <div className="p-5">
                <p className="text-xs text-muted-foreground">{m.exp}</p>
                <h3 className="mt-1 font-display text-lg font-bold text-foreground">{m.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{m.spec}</p>
                <a
                  href={m.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-foreground transition hover:bg-accent"
                >
                  <Linkedin size={13} /> LinkedIn
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}