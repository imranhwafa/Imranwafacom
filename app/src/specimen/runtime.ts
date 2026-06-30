// Shared runtime state for the Specimen Sheet.
// Replaces the prototype's loose window.* cross-component globals with typed
// module singletons. (Browser-only SPA — evaluated once.)

import type Lenis from "lenis";

// ── Page start (used by live session metrics) ───────────────
export const pageStart = Date.now();

// ── Per-section active reading time (filled by useSectionTracker) ──
export const sectionTimes: Record<string, number> = {};

// ── Background ripple registry ──────────────────────────────
// InteractiveBG registers a ripple emitter here; quirks/features fire it.
type RippleFn = (x: number, y: number) => void;
let rippleFn: RippleFn | null = null;
export function setRippleFn(fn: RippleFn | null) { rippleFn = fn; }
export function fireRipple(x: number, y: number) { rippleFn?.(x, y); }

// ── Lenis smooth-scroll instance holder (StartupIntro stops/starts it) ──
let lenisInstance: Lenis | null = null;
export function setLenis(l: Lenis | null) { lenisInstance = l; }
export function getLenis(): Lenis | null { return lenisInstance; }
