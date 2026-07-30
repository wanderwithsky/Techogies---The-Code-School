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
      className="group relative aspect-[9/16] w-full overflow-hidden rounded-3xl border border-border bg-card shadow-soft transition-shadow duration-500 [will-change:transform] hover:shadow-elegant focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      {item.image ? (
        <img
          src={item.image}
          alt={alt}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-[900ms] ease-out will-change-transform group-hover:scale-105 group-focus-within:scale-105"
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
        className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full border border-white/20 bg-black/60 text-white shadow-soft backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-[var(--brand)] hover:text-[var(--brand-foreground)]"
      >
        <ArrowUpRight
          size={18}
          className="transition-transform duration-300 group-hover:rotate-[15deg]"
        />
      </Link>

      {/* Bottom overlay */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-4 bg-gradient-to-t from-black/85 via-black/55 to-transparent p-6 pt-16 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--brand)]">
          {item.category}
        </p>
        <h3 className="mt-1.5 font-display text-lg font-semibold text-white">
          {item.title}
        </h3>
        <p className="mt-1 text-sm text-white/80">{item.subtitle}</p>
        <Link
          to="/stories/$slug"
          params={{ slug: item.id }}
          className="pointer-events-auto mt-3 inline-flex items-center gap-1 text-sm font-semibold text-white hover:text-[color:var(--brand)]"
        >
          View Story <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}

export const ImpactCard = memo(ImpactCardBase);