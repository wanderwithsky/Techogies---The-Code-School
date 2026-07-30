import { memo } from "react";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@tanstack/react-router";

export type ImpactItem = {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  category: string;
  location: string;
  year: string;
};

type Props = {
  item: ImpactItem;
};

function ImpactCardBase({ item }: Props) {
  const alt = `${item.title} at ${item.location}, ${item.year}`;
  
  return (
    <article
      role="group"
      tabIndex={0}
      aria-label={`${item.title} — ${item.subtitle}`}
      className="group relative w-full h-full overflow-hidden rounded-[28px] lg:rounded-[32px] border border-border bg-card shadow-soft transition-all duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background hover:shadow-elegant"
    >
      {item.image ? (
        <img
          src={item.image}
          alt={alt}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-out will-change-transform group-hover:scale-105 group-focus-within:scale-105"
        />
      ) : (
        <div
          aria-hidden="true"
          className="relative h-full w-full overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, color-mix(in oklab, var(--brand) 22%, var(--card)) 0%, var(--card) 55%, color-mix(in oklab, var(--brand) 12%, var(--card)) 100%)",
          }}
        >
          <div
            className="absolute inset-0 opacity-60"
            style={{ background: "var(--gradient-glow)" }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-display text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
              {item.category}
            </span>
          </div>
        </div>
      )}

      {/* Top-right arrow button */}
      <Link
        to="/stories/$slug"
        params={{ slug: item.id }}
        aria-label={`Open ${item.title} story`}
        className="absolute right-5 top-5 lg:right-6 lg:top-6 grid h-10 w-10 lg:h-11 lg:w-11 place-items-center rounded-full border border-white/20 bg-black/60 text-white shadow-soft backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-[var(--brand)] hover:text-[var(--brand-foreground)] opacity-0 -translate-y-4 group-hover:opacity-100 group-hover:translate-y-0"
      >
        <ArrowUpRight
          size={18}
          className="transition-transform duration-300 group-hover:rotate-[15deg]"
        />
      </Link>

      {/* Bottom overlay (Hover functionality) */}
      <div 
        className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-8 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-6 lg:p-8 pt-20 lg:pt-24 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100"
      >
        <p className="text-[10px] lg:text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--brand)]">
          {item.category}
        </p>
        <h3 className="mt-1.5 lg:mt-2 font-display text-lg sm:text-xl lg:text-2xl font-semibold text-white tracking-tight">
          {item.title}
        </h3>
        <p className="mt-1.5 lg:mt-2 text-xs sm:text-sm lg:text-base text-white/80 max-w-[90%] leading-relaxed line-clamp-2">{item.subtitle}</p>
        <Link
          to="/stories/$slug"
          params={{ slug: item.id }}
          className="pointer-events-auto mt-3 lg:mt-4 inline-flex items-center gap-1.5 text-xs lg:text-sm font-semibold text-white transition-colors hover:text-[color:var(--brand)]"
        >
          Our Story <span aria-hidden="true" className="text-base lg:text-lg leading-none">→</span>
        </Link>
      </div>
    </article>
  );
}

export const ImpactCard = memo(ImpactCardBase);