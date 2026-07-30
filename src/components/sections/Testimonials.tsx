import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import testimonials from "@/data/testimonials.json";
import { SectionHeading } from "@/components/common/SectionHeading";

export function Testimonials() {
  const [i, setI] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const count = testimonials.length;

  useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % count), 6000);
    return () => clearInterval(t);
  }, [count]);

  const visible = [testimonials[i], testimonials[(i + 1) % count], testimonials[(i + 2) % count]];

  return (
    <section id="testimonials" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="flex items-end justify-between gap-6">
          <SectionHeading
            align="left"
            eyebrow="Testimonials"
            title="Loved by learners across India"
            subtitle="Real stories from Techogies graduates now working at top companies."
          />
          <div className="hidden gap-2 md:flex">
            <button
              onClick={() => setI((n) => (n - 1 + count) % count)}
              className="grid h-10 w-10 place-items-center rounded-full border border-border bg-card transition hover:bg-accent"
              aria-label="Previous"
            >
              <ChevronLeft size={17} />
            </button>
            <button
              onClick={() => setI((n) => (n + 1) % count)}
              className="grid h-10 w-10 place-items-center rounded-full border border-border bg-card transition hover:bg-accent"
              aria-label="Next"
            >
              <ChevronRight size={17} />
            </button>
          </div>
        </div>
        <div ref={ref} className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {visible.map((t, idx) => (
            <motion.div
              key={`${t.name}-${i}-${idx}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className="flex flex-col justify-between rounded-3xl border border-border bg-card p-6 shadow-soft"
            >
              <div>
                <div className="flex gap-0.5 text-[color:oklch(0.85_0.18_85)]">
                  {Array.from({ length: t.rating }).map((_, k) => (
                    <Star key={k} size={15} fill="currentColor" />
                  ))}
                </div>
                <p className="mt-4 text-sm leading-relaxed text-foreground">“{t.review}”</p>
              </div>
              <div className="mt-6 flex items-center gap-3">
                <img src={t.photo} alt={t.name} className="h-11 w-11 rounded-full object-cover" loading="lazy" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">{t.name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {t.course} · {t.company} · <span className="text-primary font-semibold">{t.package}</span>
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}