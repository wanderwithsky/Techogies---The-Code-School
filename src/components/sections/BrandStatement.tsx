import { motion } from "framer-motion";

const TYPE_CLASSES =
  "font-['Sora'] text-[60px] font-black leading-[0.85] tracking-[-0.05em] sm:text-[90px] md:text-[110px] lg:text-[150px] xl:text-[180px] 2xl:text-[260px]";

export function BrandStatement() {
  return (
    <section
      className="relative overflow-hidden bg-white py-16 sm:py-24 lg:py-32 dark:bg-[#050505]"
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="text-center"
        aria-hidden="true"
      >
        <span className={`brand-wordmark inline-block ${TYPE_CLASSES}`}>Techogies</span>
      </motion.div>
    </section>
  );
}
