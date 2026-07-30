import { forwardRef } from "react";

type Props = {
  circleRef: React.RefObject<SVGCircleElement | null>;
  radius: number;
  text: string;
  viewBox: { w: number; h: number };
};

// SVG spotlight system:
// - Layer 1: outlined text (always visible)
// - Layer 2: gradient-filled text revealed only through a radial mask that follows the cursor
export const SpotlightText = forwardRef<SVGSVGElement, Props>(function SpotlightText(
  { circleRef, radius, text, viewBox },
  ref,
) {
  const { w, h } = viewBox;
  return (
    <svg
      ref={ref}
      className="footer-brand-svg"
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      <defs>
        {/* Dark theme warm gradient */}
        <linearGradient id="fb-grad-dark" x1="0%" y1="0%" x2="100%" y2="0%" className="footer-brand-anim-grad">
          <stop offset="0%" stopColor="#FF6A00" />
          <stop offset="50%" stopColor="#FF8A00" />
          <stop offset="100%" stopColor="#FFB347" />
        </linearGradient>
        {/* Light theme metallic gradient */}
        <linearGradient id="fb-grad-light" x1="0%" y1="0%" x2="100%" y2="0%" className="footer-brand-anim-grad">
          <stop offset="0%" stopColor="#1F1F1F" />
          <stop offset="35%" stopColor="#5A5A5A" />
          <stop offset="70%" stopColor="#AFAFAF" />
          <stop offset="100%" stopColor="#F2F2F2" />
        </linearGradient>
        {/* Soft-edged spotlight mask */}
        <radialGradient id="fb-mask-grad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff" stopOpacity="1" />
          <stop offset="55%" stopColor="#fff" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <mask id="fb-spot-mask" maskUnits="userSpaceOnUse">
          <rect x="0" y="0" width={w} height={h} fill="#000" />
          <circle ref={circleRef} cx={-9999} cy={-9999} r={radius} fill="url(#fb-mask-grad)" />
        </mask>
        <filter id="fb-bloom" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.2" />
        </filter>
      </defs>

      {/* Layer 1: outline */}
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        className="footer-brand-text footer-brand-outline"
      >
        {text}
      </text>

      {/* Layer 2: illuminated, revealed through mask */}
      <g className="footer-brand-glow-group" mask="url(#fb-spot-mask)" filter="url(#fb-bloom)">
        {/* Light-mode fill */}
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          className="footer-brand-text"
          style={{ fill: "url(#fb-grad-light)", mixBlendMode: "multiply" }}
        >
          {text}
        </text>
        {/* Dark-mode fill, only visible in .dark scope */}
        <g className="hidden dark:block">
          <text
            x="50%"
            y="50%"
            textAnchor="middle"
            dominantBaseline="middle"
            className="footer-brand-text"
            style={{ fill: "url(#fb-grad-dark)", mixBlendMode: "screen" }}
          >
            {text}
          </text>
        </g>
      </g>
    </svg>
  );
});