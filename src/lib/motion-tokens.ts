/**
 * Shared motion tokens — every animated component pulls its duration, easing
 * and distance from here, no hardcoded numbers in component files.
 */

/** Cubic-bezier easing tuple, as motion's `Easing` bezier definition expects. */
type Bezier = [number, number, number, number];

export const motionTokens = {
  duration: {
    fast: 0.18,
    normal: 0.35,
    slow: 0.6,
    /** Hero/landing entrances that want extra weight (frame reveal). */
    deliberate: 0.8,
  },
  easing: {
    /** Decelerate — entrances, slides landing softly. */
    smooth: [0.22, 1, 0.36, 1] as Bezier,
    /** Strong decelerate (expo-out) — landing reveals, blur-up entrances. */
    expo: [0.16, 1, 0.3, 1] as Bezier,
    /** Standard in-out — symmetric reveals (accordion), tab/page slides. */
    sharp: [0.4, 0, 0.2, 1] as Bezier,
  },
  distance: {
    lg: 24,
    xl: 48,
  },
};

export const springs = {
  /** Sliding tab/segment indicator — quick settle with a hint of bounce. */
  pill: { type: "spring", stiffness: 360, damping: 30 },
} as const;

/** Render an easing tuple as a CSS `cubic-bezier(...)` string so CSS-driven
 *  transitions (e.g. the grid-rows `Collapse`) track the same tokens. */
export function cssBezier(easing: Bezier): string {
  return `cubic-bezier(${easing.join(", ")})`;
}
