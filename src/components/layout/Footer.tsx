import { Facebook, Instagram, Linkedin, Twitter, Youtube } from "lucide-react";
import { Link } from "@tanstack/react-router";
import site from "@/data/site.json";
import nav from "@/data/nav.json";
import courses from "@/data/courses.json";
import { scrollToId } from "@/lib/scroll";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/30">
      <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <img
                src="/favicon.png"
                alt={site.brand}
                className="h-9 w-9 rounded-xl object-contain shadow-elegant"
              />
              <span className="font-display text-lg font-bold text-foreground">{site.brand}</span>
            </div>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              {site.tagline} Industry-focused tech training built for the next generation of builders.
            </p>
            <div className="mt-5 flex items-center gap-2">
              {[
                { Icon: Linkedin, href: site.socials.linkedin },
                { Icon: Instagram, href: site.socials.instagram },
                { Icon: Youtube, href: site.socials.youtube },
                { Icon: Twitter, href: site.socials.twitter },
                { Icon: Facebook, href: site.socials.facebook },
              ].map(({ Icon, href }, i) =>
                href ? (
                  <a
                    key={i}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="grid h-9 w-9 place-items-center rounded-full border border-border text-muted-foreground transition hover:bg-accent hover:text-foreground"
                  >
                    <Icon size={16} />
                  </a>
                ) : (
                  <span
                    key={i}
                    className="grid h-9 w-9 place-items-center rounded-full border border-border text-muted-foreground transition hover:bg-accent hover:text-foreground"
                  >
                    <Icon size={16} />
                  </span>
                )
              )}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground">Quick Links</h4>
            <ul className="mt-4 space-y-2 text-sm">
              {nav.map((n) => {
                const href = (n as { href?: string }).href;
                return (
                <li key={n.id}>
                  {href ? (
                    <Link to={href} className="text-muted-foreground transition hover:text-foreground">
                      {n.label}
                    </Link>
                  ) : (
                    <button
                      onClick={() => scrollToId(n.id)}
                      className="text-muted-foreground transition hover:text-foreground"
                    >
                      {n.label}
                    </button>
                  )}
                </li>
                );
              })}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground">Courses</h4>
            <ul className="mt-4 space-y-2 text-sm">
              {courses.map((c) => (
                <li key={c.id}>
                  <Link
                    to="/courses"
                    className="text-muted-foreground transition hover:text-foreground"
                  >
                    {c.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground">Newsletter</h4>
            <p className="mt-4 text-sm text-muted-foreground">
              Get updates on new cohorts, offers and free workshops.
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="mt-3 flex overflow-hidden rounded-full border border-border bg-card"
            >
              <input
                type="email"
                required
                placeholder="you@example.com"
                className="flex-1 bg-transparent px-4 py-2 text-sm outline-none placeholder:text-muted-foreground"
              />
              <button className="bg-gradient-brand px-4 text-sm font-semibold text-primary-foreground">
                Join
              </button>
            </form>
            <p className="mt-6 text-xs text-muted-foreground">
              <a href="#" className="hover:text-foreground">Privacy Policy</a> ·{" "}
              <a href="#" className="hover:text-foreground">Terms</a>
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} {site.brand}. All rights reserved.</p>
          <p>Made with care for future builders.</p>
        </div>
      </div>
    </footer>
  );
}