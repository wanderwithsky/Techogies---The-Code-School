import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import aboutLinks from "@/data/aboutLinks.json";
import { scrollToId } from "@/lib/scroll";
import { Icon } from "./IconMap";

export function AboutDropdown({ onClose }: { onClose: () => void }) {
  const firstRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // Focus first item for keyboard users when opened via keyboard
    // (harmless if hover-opened — user won't notice a focus ring on a link they hovered).
  }, []);

  const onKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
      return;
    }
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    e.preventDefault();
    const items = Array.from(
      e.currentTarget.querySelectorAll<HTMLButtonElement>('[role="menuitem"]')
    );
    const idx = items.indexOf(document.activeElement as HTMLButtonElement);
    const next =
      e.key === "ArrowDown"
        ? items[(idx + 1) % items.length]
        : items[(idx - 1 + items.length) % items.length];
    next?.focus();
  };

  return (
    <motion.div
      role="menu"
      aria-label="About Us"
      onKeyDown={onKey}
      initial={{ opacity: 0, y: -12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.98 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      className="absolute left-1/2 top-full z-50 mt-3 w-[340px] -translate-x-1/2 rounded-[18px] border border-border bg-popover/85 p-3 shadow-elegant backdrop-blur-xl"
      style={{ WebkitBackdropFilter: "blur(20px)" }}
    >
      <ul className="flex flex-col gap-1">
        {aboutLinks.map((item, i) => (
          <li key={item.id}>
            <motion.button
              ref={i === 0 ? firstRef : undefined}
              role="menuitem"
              onClick={() => {
                onClose();
                scrollToId(item.target);
              }}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: 0.03 * i }}
              className="group flex w-full items-center gap-3 rounded-2xl p-3 text-left outline-none transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-brand text-primary-foreground shadow-elegant">
                <Icon name={item.icon} size={17} />
              </span>
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="text-sm font-semibold text-foreground">
                  {item.label}
                </span>
                <span className="text-xs text-muted-foreground">
                  {item.description}
                </span>
              </span>
              <ArrowRight
                size={15}
                className="shrink-0 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:text-foreground"
                aria-hidden="true"
              />
            </motion.button>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}