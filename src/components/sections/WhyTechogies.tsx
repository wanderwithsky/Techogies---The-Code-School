import { motion } from "framer-motion";
import { Check, X } from "lucide-react";

const features = [
  { name: "Course curriculum", typical: true, techogies: true },
  { name: "Assignments & practice", typical: true, techogies: true },
  { name: "Certificates", typical: true, techogies: true },
  { name: "Mentor guidance", typical: true, techogies: true },
  { name: "Real-world projects", typical: false, techogies: true },
  { name: "Team collaboration", typical: false, techogies: true },
  { name: "Production workflows", typical: false, techogies: true },
  { name: "Code reviews & Git", typical: false, techogies: true },
  { name: "Industry-style teamwork", typical: false, techogies: true },
  { name: "Internship opportunity", typical: false, techogies: true },
  { name: "Practical work experience", typical: false, techogies: true },
];

export function WhyTechogies() {
  return (
    <section className="relative overflow-hidden bg-background py-16 sm:py-24">
      <div className="mx-auto max-w-4xl px-5 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground"
          >
            Why Techogies?
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
            className="text-balance font-display text-3xl font-bold tracking-tight text-foreground sm:text-5xl"
          >
            More than a course.<br className="hidden sm:block" />
            A real-world start.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, ease: "easeOut", delay: 0.2 }}
            className="mx-auto mt-4 max-w-md text-balance text-sm text-muted-foreground sm:text-base"
          >
            Everything you expect from a good institute. Plus what actually prepares you for work.
          </motion.p>
        </div>

        {/* Comparison Table */}
        <div className="mx-auto mt-12 max-w-3xl sm:mt-16">
          {/* Header Row */}
          <div className="grid grid-cols-[1fr_80px_80px] gap-2 border-b border-border/80 pb-3 sm:grid-cols-[1fr_140px_140px] sm:gap-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-transparent select-none">
              Feature
            </div>
            <div className="text-center text-[10px] font-semibold uppercase tracking-wider text-muted-foreground sm:text-xs">
              Typical<span className="hidden sm:inline"> Institutes</span>
            </div>
            <div className="text-center text-[10px] font-bold uppercase tracking-wider text-primary sm:text-xs">
              Techogies
            </div>
          </div>

          {/* Rows */}
          <div className="flex flex-col">
            {features.map((feat, i) => (
              <motion.div
                key={feat.name}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.1 + i * 0.04 }}
                className="grid grid-cols-[1fr_80px_80px] items-center gap-2 border-b border-border/30 py-3.5 sm:grid-cols-[1fr_140px_140px] sm:gap-4 sm:py-4"
              >
                <div className={`text-sm tracking-tight sm:text-[15px] ${feat.typical ? "text-muted-foreground/80" : "font-medium text-foreground"}`}>
                  {feat.name}
                </div>
                
                <div className="flex justify-center">
                  {feat.typical ? (
                    <Check size={18} className="text-muted-foreground/50" />
                  ) : (
                    <X size={18} className="text-red-500/40" />
                  )}
                </div>

                <div className="flex justify-center">
                  {feat.techogies && (
                    <Check size={18} strokeWidth={3} className="text-primary drop-shadow-[0_0_8px_rgba(255,107,0,0.5)]" />
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-14 text-center sm:mt-20">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
          >
            Learn here. Build here. <span className="text-primary">Work here.</span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="mx-auto mt-4 max-w-md text-balance text-[11px] text-muted-foreground/60 sm:text-xs"
          >
            Strong performers can earn internship opportunities with our in-house teams and ventures.
          </motion.div>
        </div>

      </div>
    </section>
  );
}
