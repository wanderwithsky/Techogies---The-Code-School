import { useEffect, useState } from "react";

export function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0] ?? "");

  useEffect(() => {
    if (ids.length === 0) return;

    const visible = new Map<string, number>();

    const recompute = () => {
      if (typeof window !== "undefined" && window.scrollY < 80) {
        setActive(ids[0]);
        return;
      }
      let bestId = "";
      let bestRatio = 0;
      for (const id of ids) {
        const ratio = visible.get(id) ?? 0;
        if (ratio > bestRatio + 0.01) {
          bestRatio = ratio;
          bestId = id;
        }
      }
      if (bestId) setActive(bestId);
    };

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          visible.set(e.target.id, e.isIntersecting ? e.intersectionRatio : 0);
        });
        recompute();
      },
      { rootMargin: "-35% 0px -45% 0px", threshold: [0, 0.2, 0.5, 0.75, 1] }
    );

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });

    const onScroll = () => {
      if (window.scrollY < 80) setActive(ids[0]);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      obs.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [ids.join("|")]);

  return active;
}