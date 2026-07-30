## Impact Gallery — Sheryians-Style Scroll-Driven Motion

Replace the current basic scroll transform on the Impact gallery with a premium scroll-linked parallax system. Keep 4 items, 2 desktop rows (2 cards each). No changes to any other section, theme tokens, data shape, or copy.

### Files touched
- `src/components/Impact/ImpactGallery.tsx` — rewrite motion logic
- `src/components/Impact/animations.ts` — retune spring config
- `src/components/Impact/ImpactCard.tsx` — add `will-change: transform` on the motion wrapper, minor hover polish (shadow depth, arrow rotation on hover of the card, not just the button)

No new dependencies. No changes to `impact.json`, `ImpactSection.tsx`, `ImpactHeading.tsx`, or `styles.css`.

### Motion model

Framer Motion only. Horizontal motion is derived from the section's scroll progress — never from time, marquee, or keyframes.

```ts
const { scrollYProgress } = useScroll({
  target: sectionRef,
  offset: ["start end", "end start"], // 0 as it enters, 1 as it leaves
});
```

Two rows, alternating directions, different travel distances for layered parallax:

- Row 1 → `useTransform(scrollYProgress, [0, 1], [220, -220])` (left as you scroll down)
- Row 2 → `useTransform(scrollYProgress, [0, 1], [-320, 320])` (right as you scroll down)

Each raw MotionValue is piped through `useSpring` for inertia and smoothing:

```ts
useSpring(xRaw, { stiffness: 60, damping: 20, mass: 0.6 });
```

Because both rows are bound directly to scroll progress, scrolling up automatically reverses each row's direction — no manual direction detection, no state, no re-renders on scroll.

Applied via `style={{ x: smoothX }}` on `motion.div`, which compiles to GPU `translate3d`. Add `will-change: transform` on the row wrapper.

### Layout (desktop, `lg` and up)

Two rows, each a 2-column grid. Editorial asymmetry via varied card heights and small vertical offsets so it doesn't feel like a plain grid:

- Row 1: heights `[300, 360]`, row offset `translateY(0)`
- Row 2: heights `[380, 300]`, row offset `translateY(28px)`

Row containers get generous negative horizontal padding (`-mx-24`) and `overflow-visible` on the gallery wrapper so the parallax travel never clips against the section edges. The section itself keeps `overflow-hidden` (already set) to contain the effect within the viewport.

Tablet (`sm` to below `lg`): existing 2-column static grid, no motion.  
Mobile (`<sm`): existing single-column stack, no motion.  
`prefers-reduced-motion`: rows render statically without `x` styling.

### Entrance animation

Unchanged behavior, tightened values:
- Section: fade + `y: 24 → 0`, once (already in `sectionVariants`)
- Gallery wrapper: scale `0.98 → 1` alongside the fade
- Cards stagger in via existing `cardVariants` (opacity/scale/y), 60ms stagger

Entrance runs once on view; scroll linkage stays live after.

### Hover polish (no scroll interruption)

On `ImpactCard`:
- Image `scale-105` on hover (already present)
- Overlay slide-up + fade (already present)
- Shadow deepens on hover (swap `hover:shadow-elegant` for a slightly stronger token)
- Arrow button: existing 15° rotate + orange fill
- Add `will-change: transform` to the `motion.article` so hover transforms and row parallax stay on the compositor

Hover state lives on the card; it never touches the row's `x` MotionValue, so scroll motion stays smooth.

### Performance

- Only `transform` and `opacity` animate — no layout properties.
- Two `MotionValue`s created once at the gallery level, reused across cards in each row.
- No `useState` tied to scroll; nothing re-renders on scroll.
- `will-change: transform` on row wrappers and card articles.
- Images keep `loading="lazy"` and `decoding="async"`.

### Out of scope
Hero, Navbar, Testimonials, Mentors, Footer, theme tokens, `impact.json` content, section copy, and section spacing all stay exactly as-is.
