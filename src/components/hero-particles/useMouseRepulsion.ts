import { useEffect, useRef, type RefObject } from "react";

export type CursorRef = { x: number; y: number; active: boolean };

export function useMouseRepulsion(containerRef: RefObject<HTMLElement | null>) {
  const cursor = useRef<CursorRef>({ x: -9999, y: -9999, active: false });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      cursor.current.x = e.clientX - rect.left;
      cursor.current.y = e.clientY - rect.top;
      cursor.current.active = true;
    };
    const onLeave = () => {
      cursor.current.active = false;
      cursor.current.x = -9999;
      cursor.current.y = -9999;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [containerRef]);

  return cursor;
}