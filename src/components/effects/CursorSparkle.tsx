import { useEffect, useRef, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

interface Sparkle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
}

export function CursorSparkle({ containerRef }: { containerRef: React.RefObject<HTMLElement> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const sparklesRef = useRef<Sparkle[]>([]);
  
  // Motion values for ambient glow
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Smooth spring for ambient glow
  const springX = useSpring(mouseX, { stiffness: 300, damping: 28, mass: 0.5 });
  const springY = useSpring(mouseY, { stiffness: 300, damping: 28, mass: 0.5 });

  // Add subtle trail of glowing particles
  const createSparkle = (x: number, y: number) => {
    // Colors: Orange, Warm Amber, Soft White
    const colors = ["#ff6b00", "#ff8c00", "#ffffff"];
    const newSparkle: Sparkle = {
      x,
      y,
      vx: (Math.random() - 0.5) * 1.5,
      vy: (Math.random() - 0.5) * 1.5 + 0.5, // slight downward bias
      life: 1,
      maxLife: Math.random() * 30 + 40, // 40-70 frames
      size: Math.random() * 2 + 1,
      color: colors[Math.floor(Math.random() * colors.length)]
    };
    sparklesRef.current.push(newSparkle);
    if (sparklesRef.current.length > 50) {
      sparklesRef.current.shift(); // Limit max particles
    }
  };

  useEffect(() => {
    // Disable on mobile devices for performance
    if (window.innerWidth < 768) return;

    const container = containerRef.current;
    if (!container) return;

    let isHovering = false;

    const handlePointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Ensure we are inside the container
      if (x < 0 || x > rect.width || y < 0 || y > rect.height) {
        if (isHovering) {
          setIsVisible(false);
          isHovering = false;
        }
        return;
      }
      
      if (!isHovering) {
        setIsVisible(true);
        isHovering = true;
      }
      
      mouseX.set(x - 50); // Center the 100x100 glow
      mouseY.set(y - 50);

      // Random chance to create a sparkle
      if (Math.random() > 0.3) {
        createSparkle(x, y);
      }
    };

    const handlePointerLeave = () => {
      setIsVisible(false);
      isHovering = false;
    };

    container.addEventListener("pointermove", handlePointerMove);
    container.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      container.removeEventListener("pointermove", handlePointerMove);
      container.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, [containerRef, mouseX, mouseY]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    const render = () => {
      // Resize canvas to match container if needed
      const parent = canvas.parentElement;
      if (parent) {
        if (canvas.width !== parent.clientWidth || canvas.height !== parent.clientHeight) {
          canvas.width = parent.clientWidth;
          canvas.height = parent.clientHeight;
        }
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const sparkles = sparklesRef.current;
      
      for (let i = sparkles.length - 1; i >= 0; i--) {
        const s = sparkles[i];
        
        // Update position
        s.x += s.vx;
        s.y += s.vy;
        s.life++;

        // Draw sparkle
        const progress = s.life / s.maxLife;
        const opacity = Math.max(0, 1 - progress);
        
        ctx.beginPath();
        // Pulsating/scaling effect based on progress
        const scale = Math.sin(progress * Math.PI) * s.size;
        
        if (scale > 0) {
          ctx.arc(s.x, s.y, scale, 0, Math.PI * 2);
          ctx.fillStyle = s.color;
          ctx.globalAlpha = opacity;
          
          // Add a slight glow to individual particles
          ctx.shadowBlur = 8;
          ctx.shadowColor = s.color;
          
          ctx.fill();
        }
        
        // Remove dead sparkles
        if (s.life >= s.maxLife) {
          sparkles.splice(i, 1);
        }
      }

      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
      
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full"
      />
      
      <motion.div
        style={{
          x: springX,
          y: springY,
          opacity: isVisible ? 1 : 0,
        }}
        className="absolute left-0 top-0 h-[100px] w-[100px] rounded-full bg-[#ff6b00] mix-blend-screen blur-[50px] transition-opacity duration-300"
      />
    </div>
  );
}
