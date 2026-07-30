import { useEffect, useRef, type RefObject } from "react";
import { useTheme } from "@/context/ThemeContext";
import type { CursorRef } from "./useMouseRepulsion";
import {
  DRIFT,
  FRICTION,
  INTERACTION_RADIUS,
  MAX_ALPHA,
  MAX_RADIUS,
  MIN_ALPHA,
  MIN_RADIUS,
  PALETTES,
  REPULSION_STRENGTH,
  RETURN_SPRING,
  getParticleCount,
} from "./particleConfig";

type Particle = {
  x: number;
  y: number;
  ox: number;
  oy: number;
  vx: number;
  vy: number;
  r: number;
  alpha: number;
  color: string;
};

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export function ParticleCanvas({
  containerRef,
  cursor,
}: {
  containerRef: RefObject<HTMLElement | null>;
  cursor: RefObject<CursorRef>;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const palette = PALETTES[theme === "dark" ? "dark" : "light"];
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let particles: Particle[] = [];
    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let visible = true;
    let raf = 0;
    const start = performance.now();
    const FADE_MS = 800;

    const build = () => {
      const rect = container.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = reduced
        ? Math.floor(getParticleCount(width) / 3)
        : getParticleCount(width);
      particles = Array.from({ length: count }, () => {
        const x = rand(0, width);
        const y = rand(0, height);
        return {
          x,
          y,
          ox: x,
          oy: y,
          vx: 0,
          vy: 0,
          r: rand(MIN_RADIUS, MAX_RADIUS),
          alpha: rand(MIN_ALPHA, MAX_ALPHA),
          color: palette[Math.floor(Math.random() * palette.length)],
        };
      });
    };

    build();

    const ro = new ResizeObserver(build);
    ro.observe(container);

    const io = new IntersectionObserver(
      (entries) => {
        visible = entries[0]?.isIntersecting ?? true;
      },
      { threshold: 0 },
    );
    io.observe(container);

    const draw = (now: number) => {
      const fade = Math.min(1, (now - start) / FADE_MS);
      ctx.clearRect(0, 0, width, height);
      ctx.globalAlpha = 1;

      const c = cursor.current;

      for (const p of particles) {
        if (!reduced) {
          // drift
          p.vx += rand(-DRIFT, DRIFT);
          p.vy += rand(-DRIFT, DRIFT);

          // repulsion
          if (c.active) {
            const dx = p.x - c.x;
            const dy = p.y - c.y;
            const dist = Math.hypot(dx, dy);
            if (dist < INTERACTION_RADIUS && dist > 0.01) {
              const force =
                ((INTERACTION_RADIUS - dist) / INTERACTION_RADIUS) *
                REPULSION_STRENGTH;
              p.vx += (dx / dist) * force;
              p.vy += (dy / dist) * force;
            }
          }

          // spring back
          p.vx += (p.ox - p.x) * RETURN_SPRING;
          p.vy += (p.oy - p.y) * RETURN_SPRING;

          // friction
          p.vx *= FRICTION;
          p.vy *= FRICTION;

          p.x += p.vx;
          p.y += p.vy;
        }

        ctx.globalAlpha = p.alpha * fade;
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;

      if (!reduced && visible) {
        raf = requestAnimationFrame(draw);
      } else if (!reduced) {
        // paused; poll cheaply for visibility
        raf = window.setTimeout(() => requestAnimationFrame(draw), 200) as unknown as number;
      }
    };

    if (reduced) {
      draw(performance.now() + FADE_MS);
    } else {
      raf = requestAnimationFrame(draw);
    }

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, [theme, containerRef, cursor]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full"
      aria-hidden="true"
    />
  );
}