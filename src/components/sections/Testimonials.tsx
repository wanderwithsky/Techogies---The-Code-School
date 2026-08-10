import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { SectionHeading } from "@/components/common/SectionHeading";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export function Testimonials() {
  const queryClient = useQueryClient();
  const [i, setI] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  const { data: testimonials = [], isLoading } = useQuery({
    queryKey: ["testimonials"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .eq("status", "published")
        .order("display_order", { ascending: true })
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    const channel = supabase
      .channel('public-testimonials-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'testimonials' }, () => {
        queryClient.invalidateQueries({ queryKey: ["testimonials"] });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const count = testimonials.length;

  useEffect(() => {
    if (count === 0) return;
    const t = setInterval(() => setI((n) => (n + 1) % count), 6000);
    return () => clearInterval(t);
  }, [count]);

  const visible = count > 0 ? [
    testimonials[i],
    testimonials[(i + 1) % count],
    testimonials[(i + 2) % count]
  ].filter(Boolean) : [];

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
              className="grid h-10 w-10 place-items-center rounded-full border border-border bg-card transition hover:bg-accent disabled:opacity-50"
              aria-label="Previous"
              disabled={count === 0}
            >
              <ChevronLeft size={17} />
            </button>
            <button
              onClick={() => setI((n) => (n + 1) % count)}
              className="grid h-10 w-10 place-items-center rounded-full border border-border bg-card transition hover:bg-accent disabled:opacity-50"
              aria-label="Next"
              disabled={count === 0}
            >
              <ChevronRight size={17} />
            </button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="mt-12 flex justify-center py-12 text-muted-foreground">
            Loading testimonials...
          </div>
        ) : (
          <div ref={ref} className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {visible.map((t, idx) => (
              <motion.div
                key={`${t.id}-${i}-${idx}`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="flex flex-col justify-between rounded-3xl border border-border bg-card p-6 shadow-soft"
              >
                <div>
                  <div className="flex gap-0.5 text-[color:oklch(0.85_0.18_85)]">
                    {Array.from({ length: t.rating || 5 }).map((_, k) => (
                      <Star key={k} size={15} fill="currentColor" />
                    ))}
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-foreground">“{t.testimonial}”</p>
                </div>
                <div className="mt-6 flex items-center gap-3">
                  {t.image_url && <img src={t.image_url} alt={t.student_name} className="h-11 w-11 rounded-full object-cover" loading="lazy" />}
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-foreground">{t.student_name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {t.course}
                      {/* {t.company && ` · ${t.company}`} */}
                      {/* {t.package && ` · `}<span className="text-primary font-semibold">{t.package}</span> */}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}