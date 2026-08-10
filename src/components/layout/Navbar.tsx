import { useEffect, useRef, useState } from "react";
import { ChevronDown, Menu, Moon, Sun, X } from "lucide-react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { Link, useRouter, useRouterState } from "@tanstack/react-router";
import nav from "@/data/nav.json";
import site from "@/data/site.json";
import { useTheme } from "@/context/ThemeContext";
import { useEnroll } from "@/context/EnrollContext";
import { useActiveSection } from "@/hooks/useActiveSection";
import { useHoverIntent } from "@/hooks/useHoverIntent";
import { scrollToId } from "@/lib/scroll";
import { cn } from "@/lib/utils";
import { AboutDropdown } from "./nav/AboutDropdown";
import { MobileNav } from "./nav/MobileNav";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const { theme, toggle } = useTheme();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isHome = pathname === "/";
  const scrollIds = ["home", ...nav.filter((n) => !(n as { href?: string }).href).map((n) => n.id)];
  const activeSection = useActiveSection(isHome ? scrollIds : []);
  const active = !isHome
    ? (nav.find((n) => (n as { href?: string }).href === pathname)?.id ?? "")
    : activeSection;
  const router = useRouter();
  const headerRef = useRef<HTMLElement>(null);
  const isTop = isHome && !scrolled && !openMenu;
  const { openEnroll } = useEnroll();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const lastYRef = useRef(0);

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest < 50) {
      setHidden(false);
      lastYRef.current = latest;
      return;
    }

    const diff = latest - lastYRef.current;

    // Scrolling down (ignore small jitters < 20px)
    if (diff > 20) {
      setHidden(true);
      lastYRef.current = latest;
    } 
    // Scrolling up (instant reveal, low threshold)
    else if (diff < -5) {
      setHidden(false);
      lastYRef.current = latest;
    }
  });

  // Close menu on outside click / ESC / scroll
  useEffect(() => {
    if (!openMenu) return;
    const onDown = (e: PointerEvent) => {
      if (!headerRef.current) return;
      if (!headerRef.current.contains(e.target as Node)) setOpenMenu(null);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenMenu(null);
    };
    const onScroll = () => setOpenMenu(null);
    
    const onCloseMobile = () => setOpen(false);

    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    document.addEventListener("close-mobile-menu", onCloseMobile);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("close-mobile-menu", onCloseMobile);
      window.removeEventListener("scroll", onScroll);
    };
  }, [openMenu]);

  const go = (id: string) => {
    setOpen(false);
    setOpenMenu(null);
    
    if (!isHome) {
      router.navigate({ to: "/" }).then(() => {
        setTimeout(() => {
          if (id === "home") {
            window.scrollTo({ top: 0, behavior: "smooth" });
          } else {
            scrollToId(id);
          }
        }, 100);
      });
      return;
    }
    
    if (id === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    
    scrollToId(id);
  };

  return (
    <motion.header
      ref={headerRef}
      variants={{
        visible: { y: 0, opacity: 1 },
        hidden: { y: "-100%", opacity: 0.95 }
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ ease: [0.22, 1, 0.36, 1], duration: 0.3 }}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,box-shadow,backdrop-filter] duration-300",
        "border-b",
        !isTop
          ? "bg-card/85 backdrop-blur-xl backdrop-saturate-150 border-border/60 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.35)]"
          : "bg-black/[0.12] backdrop-blur-[12px] border-transparent text-white"
      )}
    >
      <nav
        className={cn(
          "mx-auto flex max-w-7xl items-center justify-between pl-6 pr-5 lg:grid lg:grid-cols-[auto_1fr_auto] lg:items-center lg:gap-6 lg:pl-10 lg:pr-8 transition-all duration-300",
          scrolled ? "py-2.5" : "py-3.5 sm:py-4"
        )}
      >
        <Link
          to="/"
          onClick={() => {
            setOpen(false);
            setOpenMenu(null);
            if (isHome) window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="group flex items-center gap-3"
          aria-label={site.brand}
        >
          <img
            src="/favicon.png"
            alt={site.brand}
            className="h-11 w-11 rounded-2xl object-contain shadow-elegant transition-transform duration-300 group-hover:scale-[1.06]"
          />
          <span
            className={cn(
              "inline-flex flex-col justify-center leading-none transition-[text-shadow] duration-300",
              isTop
                ? "text-white [text-shadow:0_1px_8px_rgba(0,0,0,0.35)]"
                : "text-foreground"
            )}
          >
            <span className="brand-name">
              TECH<span className="brand-o">O</span>GIES
            </span>
            <span className="brand-tagline">
              <span className="brand-bracket">&lt;/</span>The Code School<span className="brand-bracket">/&gt;</span>
            </span>
          </span>
        </Link>

        <div className="hidden lg:flex lg:justify-center">
          <ul
            className={cn(
              "inline-flex items-center gap-1 rounded-full border px-2 py-1.5 backdrop-blur-xl backdrop-saturate-150 transition-all duration-300",
              isTop
                ? "border-white/15 bg-white/10 shadow-[0_10px_40px_-20px_rgba(0,0,0,0.5)]"
                : scrolled
                ? "border-border/60 bg-background/75 shadow-[0_12px_40px_-16px_rgba(0,0,0,0.35)]"
                : "border-border/60 bg-background/50 shadow-[0_10px_40px_-20px_rgba(0,0,0,0.35)]"
            )}
          >
            {nav.map((item) => (
              <NavListItem
                key={item.id}
                item={item}
                active={active}
                openMenu={openMenu}
                setOpenMenu={setOpenMenu}
                go={go}
                isTop={isTop}
              />
            ))}
          </ul>
        </div>

        <div className="flex items-center gap-2.5 lg:gap-3 lg:justify-self-end">
          <button
            onClick={toggle}
            aria-label="Toggle theme"
            className="grid h-10 w-10 place-items-center rounded-full border border-border/60 bg-background/40 text-foreground backdrop-blur-md transition-all duration-300 hover:border-primary/40 hover:text-primary hover:shadow-[0_0_20px_-4px_hsl(var(--primary)/0.4)]"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={theme}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="grid place-items-center"
              >
                {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
              </motion.span>
            </AnimatePresence>
          </button>
          <button
            onClick={() => openEnroll()}
            className="group relative hidden md:inline-flex items-center overflow-hidden rounded-2xl bg-gradient-brand px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-elegant transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.03] hover:shadow-[0_10px_32px_-8px_hsl(var(--primary)/0.6)]"
          >
            <span className="relative z-10">Enroll</span>
            <span
              aria-hidden
              className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full"
            />
          </button>
          <button
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
            className="grid h-10 w-10 place-items-center rounded-full border border-border/60 bg-background/40 text-foreground backdrop-blur-md transition hover:border-primary/40 hover:text-primary lg:hidden"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="border-t border-border/60 bg-background/80 backdrop-blur-xl lg:hidden"
          >
            <MobileNav activeId={active} onNavigate={() => setOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

type NavItemShape = { id: string; label: string; type?: string; menu?: string; href?: string };

function NavListItem({
  item,
  active,
  openMenu,
  setOpenMenu,
  go,
  isTop,
}: {
  item: NavItemShape;
  active: string;
  openMenu: string | null;
  setOpenMenu: (v: string | null) => void;
  go: (id: string) => void;
  isTop: boolean;
}) {
  const hover = useHoverIntent(140);
  const isDropdown = item.type === "dropdown" || item.type === "mega";
  const isOpen = isDropdown && openMenu === item.id;

  useEffect(() => {
    if (!isDropdown) return;
    if (hover.open) setOpenMenu(item.id);
    else if (openMenu === item.id) setOpenMenu(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hover.open]);

  // Sync external close (e.g. outside click) back into hover state
  useEffect(() => {
    if (!isDropdown) return;
    if (openMenu !== item.id && hover.open) hover.closeNow();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openMenu]);

  if (!isDropdown) {
    const linkClass = cn(
            "relative rounded-full px-4 py-1.5 text-[0.85rem] font-medium transition-colors duration-300",
            active === item.id
              ? isTop
                ? "text-white"
                : "text-primary"
              : isTop
              ? "text-white/85 hover:text-white"
              : "text-muted-foreground hover:text-primary"
          );
    const pillAndLabel = (
      <>
        {active === item.id && (
            <motion.span
              layoutId="nav-pill"
              transition={{ type: "spring", stiffness: 380, damping: 32 }}
              className={cn(
                "absolute inset-0 -z-10 rounded-full ring-1",
                isTop
                  ? "bg-white/15 ring-white/25"
                  : "bg-primary/12 ring-primary/25"
              )}
            />
          )}
        <span className="relative">{item.label}</span>
      </>
    );
    return (
      <li className="relative">
        {item.href ? (
          <Link to={item.href} onClick={() => { setOpenMenu(null); document.dispatchEvent(new Event("close-mobile-menu")); }} className={linkClass}>
            {pillAndLabel}
          </Link>
        ) : (
          <button onClick={() => go(item.id)} className={linkClass}>
            {pillAndLabel}
          </button>
        )}
      </li>
    );
  }

  return (
    <li
      className={cn(item.type === "mega" ? "static" : "relative")}
      onPointerEnter={hover.openNow}
      onPointerLeave={hover.closeSoon}
    >
      <button
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={() => setOpenMenu(isOpen ? null : item.id)}
        onFocus={hover.openNow}
        className={cn(
          "group relative inline-flex items-center gap-1.5 px-3 py-2 text-[0.9rem] outline-none transition-all duration-300 hover:-translate-y-[1px] focus-visible:ring-2 focus-visible:ring-ring rounded-md",
          isTop ? "font-semibold" : "font-medium",
          isOpen
            ? (isTop ? "text-white" : "text-foreground")
            : (isTop ? "text-white/95 hover:text-primary" : "text-muted-foreground/90 hover:text-foreground")
        )}
      >
        <span
          className={cn(
            "transition-[text-shadow] duration-300",
            isTop && "[text-shadow:0_1px_8px_rgba(0,0,0,0.35)]"
          )}
        >
          {item.label}
        </span>
        <ChevronDown
          size={14}
          className={cn(
            "transition-all duration-300",
            isTop
              ? "text-white/90 group-hover:text-primary"
              : "text-muted-foreground/90 group-hover:text-primary",
            isOpen && "rotate-180 text-primary"
          )}
          aria-hidden="true"
        />
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute left-3 right-3 -bottom-0.5 h-[2px] origin-left rounded-full transition-transform duration-300",
            isOpen
              ? "scale-x-100 bg-gradient-brand shadow-[0_0_10px_hsl(var(--primary)/0.7)]"
              : `scale-x-0 group-hover:scale-x-100 ${isTop ? "bg-primary shadow-[0_0_10px_hsl(var(--primary)/0.7)]" : "bg-primary/70"}`
          )}
        />
      </button>
      <AnimatePresence>
        {isOpen && item.menu === "about" && (
          <AboutDropdown onClose={() => setOpenMenu(null)} />
        )}
      </AnimatePresence>
    </li>
  );
}