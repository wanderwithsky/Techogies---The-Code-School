import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, Search } from "lucide-react";
import faqs from "@/data/faqs.json";
import { SectionHeading } from "@/components/common/SectionHeading";

export function FAQ() {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<number | null>(0);
  const filtered = useMemo(
    () =>
      faqs.filter(
        (f) =>
          f.q.toLowerCase().includes(q.toLowerCase()) ||
          f.a.toLowerCase().includes(q.toLowerCase())
      ),
    [q]
  );
  return (
    <section id="faq" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-3xl px-5 lg:px-8">
        <SectionHeading eyebrow="FAQ" title="Answers to common questions" />
        <div className="mt-10 flex items-center gap-3 rounded-full border border-border bg-card px-4 py-2.5 shadow-soft focus-within:ring-2 focus-within:ring-ring">
          <Search size={16} className="text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search FAQs"
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
        <div className="mt-6 space-y-3">
          {filtered.map((f, i) => {
            const isOpen = open === i;
            return (
              <motion.div
                key={f.q}
                layout
                className="overflow-hidden rounded-2xl border border-border bg-card"
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold text-foreground"
                >
                  {f.q}
                  <ChevronDown
                    size={16}
                    className={`shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="px-5 pb-5 text-sm text-muted-foreground"
                  >
                    {f.a}
                  </motion.div>
                )}
              </motion.div>
            );
          })}
          {filtered.length === 0 && (
            <p className="text-center text-sm text-muted-foreground">No matches found.</p>
          )}
        </div>
      </div>
    </section>
  );
}