import partners from "@/data/partners.json";
import { SectionHeading } from "@/components/common/SectionHeading";

export function Partners() {
  const loop = [...partners, ...partners];
  return (
    <section className="relative py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          eyebrow="Hiring Partners"
          title="Where our graduates work"
          subtitle="40+ companies actively hire from Techogies cohorts every year."
        />
      </div>
      <div className="relative mt-14 overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_15%,black_85%,transparent)]">
        <div className="flex w-max animate-marquee gap-4">
          {loop.map((p, i) => (
            <div
              key={`${p}-${i}`}
              className="grid h-20 w-48 shrink-0 place-items-center rounded-2xl border border-border bg-card font-display text-xl font-bold tracking-tight text-foreground"
            >
              {p}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}