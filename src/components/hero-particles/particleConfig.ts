export const INTERACTION_RADIUS = 150;
export const REPULSION_STRENGTH = 0.6;
export const FRICTION = 0.92;
export const RETURN_SPRING = 0.015;
export const DRIFT = 0.02;
export const MIN_RADIUS = 2;
export const MAX_RADIUS = 5;
export const MIN_ALPHA = 0.05;
export const MAX_ALPHA = 0.15;

export function getParticleCount(width: number): number {
  if (width < 640) return 12;
  if (width < 1024) return 20;
  if (width < 1440) return 30;
  return 42;
}

export const PALETTES = {
  dark: ["#F59E42", "#FFFFFF", "#FBBF24"],
  light: ["#9CA3AF", "#F59E42", "#4B5563"],
} as const;

export type ThemeMode = keyof typeof PALETTES;