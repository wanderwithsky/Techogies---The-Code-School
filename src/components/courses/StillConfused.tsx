import { motion } from "framer-motion";
import { Phone, MessageSquare } from "lucide-react";
import site from "@/data/site.json";

export function StillConfused() {
  const telHref = `tel:${site.phone.replace(/\s+/g, "")}`;
  return (
    <section className="relative overflow-hidden border-t border-border/60 py-16 lg:py-20">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 [background:radial-gradient(50%_60%_at_50%_50%,hsl(var(--primary)/0.14),transparent_70%)]"
      />
      <div className="mx-auto max-w-3xl px-5 text-center lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
        >
          Still <span className="text-primary">Confused?</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="mx-auto mt-4 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground"
        >
          Talk to our academic counsellors to learn about course fees, scholarships,
          batches, and the right learning path for your career.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.16 }}
          className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <a
            href={telHref}
            className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[0_12px_36px_-14px_hsl(var(--primary)/0.6)] transition-all hover:-translate-y-0.5 hover:shadow-[0_16px_48px_-14px_hsl(var(--primary)/0.7)] sm:w-auto"
          >
            <Phone size={16} /> Call Now
          </a>
          <a
            href="/#contact"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-border/70 bg-background/70 px-6 py-3 text-sm font-semibold text-foreground backdrop-blur transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:text-primary sm:w-auto"
          >
            <MessageSquare size={16} /> Contact Us
          </a>
        </motion.div>
      </div>
    </section>
  );
}