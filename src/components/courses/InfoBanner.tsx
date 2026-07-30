import { motion } from "framer-motion";
import { GraduationCap, Phone } from "lucide-react";

export function InfoBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5 }}
      className="mb-8 overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 via-background/60 to-background/40 p-5 backdrop-blur-xl shadow-[0_20px_60px_-30px_hsl(var(--primary)/0.5)] sm:p-6"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/15 text-primary">
          <GraduationCap size={20} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-foreground sm:text-base">
            We offer industry-focused professional training programs.
          </p>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            Course fees are shared personally to ensure you receive the latest offers,
            scholarships, and batch details.
          </p>
          <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
            <Phone size={12} /> Contact our team for complete pricing and counselling.
          </p>
        </div>
      </div>
    </motion.div>
  );
}