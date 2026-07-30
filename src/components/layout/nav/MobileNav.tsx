import { Link, useRouter, useRouterState } from "@tanstack/react-router";
import nav from "@/data/nav.json";
import { useEnroll } from "@/context/EnrollContext";
import { scrollToId } from "@/lib/scroll";
import { cn } from "@/lib/utils";

export function MobileNav({
  activeId,
  onNavigate,
}: {
  activeId: string;
  onNavigate: () => void;
}) {
  const router = useRouter();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isHome = pathname === "/";
  const { openEnroll } = useEnroll();

  const go = (id: string) => {
    onNavigate();
    if (!isHome) {
      router.navigate({ to: "/", hash: id === "home" ? undefined : id });
      return;
    }
    if (id === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    scrollToId(id);
  };

  const handleEnroll = () => {
    onNavigate();
    openEnroll();
  };

  return (
    <div className="mx-auto max-w-7xl px-5 py-4">
      <ul className="flex flex-col" role="menu">
        {nav.map((item) => {
          const href = (item as { href?: string }).href;
          const isActive = activeId === item.id;
          const cls = cn(
            "relative flex w-full items-center justify-between border-b border-border py-4 text-left text-sm transition-colors",
            isActive ? "font-semibold text-foreground" : "font-medium text-muted-foreground"
          );

          const content = (
            <>
              {isActive && (
                <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-primary" />
              )}
              <span>{item.label}</span>
            </>
          );

          if (href) {
            return (
              <li key={item.id} className="relative" role="none">
                <Link
                  to={href}
                  onClick={onNavigate}
                  className={cls}
                  role="menuitem"
                  aria-current={isActive ? "page" : undefined}
                >
                  {content}
                </Link>
              </li>
            );
          }

          return (
            <li key={item.id} className="relative" role="none">
              <button
                onClick={() => go(item.id)}
                className={cls}
                role="menuitem"
                aria-current={isActive ? "page" : undefined}
              >
                {content}
              </button>
            </li>
          );
        })}
      </ul>

      <div className="pt-5">
        <div className="mb-5 border-t border-border" />
        <button
          onClick={handleEnroll}
          className="group relative inline-flex w-full items-center justify-center overflow-hidden rounded-2xl bg-gradient-brand px-5 py-3 text-sm font-semibold text-primary-foreground shadow-elegant transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.03] hover:shadow-[0_10px_32px_-8px_hsl(var(--primary)/0.6)] active:scale-[0.98]"
        >
          <span className="relative z-10">Enroll Now</span>
          <span
            aria-hidden
            className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full"
          />
        </button>
      </div>
    </div>
  );
}
