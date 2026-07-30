import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { scrollToId } from "@/lib/scroll";

export function CounsellingCTA() {
  return (
    <section className="relative py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-brand p-10 shadow-elegant sm:p-16"
        >
          <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute -bottom-20 -left-10 h-64 w-64 rounded-full bg-black/30 blur-3xl" />
          <div className="relative grid gap-8 md:grid-cols-[1.4fr_1fr] md:items-center">
            <div>
              <span className="inline-flex rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                Free · 1-on-1 · 30 mins
              </span>
              <h2 className="mt-4 font-display text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl">
                Confused About Your Career?
              </h2>
              <p className="mt-4 max-w-xl text-base text-white/85">
                Book a FREE 1-on-1 career counselling session with our mentors and get a personalised roadmap.
              </p>
            </div>
            <div className="flex md:justify-end">
              <button
                onClick={() => scrollToId("contact")}
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black shadow-elegant transition hover:-translate-y-0.5"
              >
                Book Free Counselling <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}