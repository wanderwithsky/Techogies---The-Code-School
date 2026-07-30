import { useEffect, type RefObject } from "react";
import { lerp } from "@/utils/lerp";

type Opts = {
  containerRef: RefObject<HTMLElement | null>;
  svgRef: RefObject<SVGSVGElement | null>;
  circleRef: RefObject<SVGCircleElement | null>;
};

export function useSpotlight({ containerRef, svgRef, circleRef }: Opts) {
  useEffect(() => {
    const container = containerRef.current;
    const svg = svgRef.current;
    const circle = circleRef.current;
    if (!container || !svg || !circle) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(max-width: 640px)").matches) return;

    let targetX = 0;
    let targetY = 0;
    let curX = 0;
    let curY = 0;
    let active = false;
    let raf = 0;

    const toSvgPoint = (clientX: number, clientY: number) => {
      const ctm = svg.getScreenCTM();
      if (!ctm) return { x: 0, y: 0 };
      const pt = svg.createSVGPoint();
      pt.x = clientX;
      pt.y = clientY;
      const p = pt.matrixTransform(ctm.inverse());
      return { x: p.x, y: p.y };
    };

    const tick = () => {
      curX = lerp(curX, targetX, 0.12);
      curY = lerp(curY, targetY, 0.12);
      circle.setAttribute("cx", String(curX));
      circle.setAttribute("cy", String(curY));
      if (active || Math.abs(targetX - curX) > 0.3 || Math.abs(targetY - curY) > 0.3) {
        raf = requestAnimationFrame(tick);
      } else {
        raf = 0;
      }
    };
    const ensureLoop = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      const p = toSvgPoint(e.clientX, e.clientY);
      targetX = p.x;
      targetY = p.y;
      ensureLoop();
    };
    const onEnter = (e: PointerEvent) => {
      const p = toSvgPoint(e.clientX, e.clientY);
      curX = targetX = p.x;
      curY = targetY = p.y;
      active = true;
      container.style.setProperty("--spot-reveal", "1");
      ensureLoop();
    };
    const onLeave = () => {
      active = false;
      container.style.setProperty("--spot-reveal", "0");
    };

    container.addEventListener("pointermove", onMove);
    container.addEventListener("pointerenter", onEnter);
    container.addEventListener("pointerleave", onLeave);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      container.removeEventListener("pointermove", onMove);
      container.removeEventListener("pointerenter", onEnter);
      container.removeEventListener("pointerleave", onLeave);
    };
  }, [containerRef, svgRef, circleRef]);
}