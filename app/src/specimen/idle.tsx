// ════════════════════════════════════════════════════════════
// IDLE SCREENSAVER — the page comes alive when you don't.
//   • DRIFT  (~45s idle): a soft vignette fades in, an inspector
//     reticle starts roaming the screen and trailing ripples
//     through the dot-field, plus a quiet "still there?" hint.
//   • DEEP   (~110s idle): the vignette deepens, registration
//     marks orbit the centre, ripples come faster, and a breathing
//     message appears.
//   ANY input (move, key, scroll, tap) instantly snaps back awake.
// Honours reduced-motion: skips the roaming/ripples/orbit and just
// shows the quiet message so it never moves for those who opt out.
// ════════════════════════════════════════════════════════════
import { useEffect, useMemo, useRef, useState } from "react";
import { fireRipple } from "./runtime";
import { REDUCED } from "./motion";
import { COPY } from "./copy";

const DRIFT_MS = 45_000;
const DEEP_MS = 110_000;

type Phase = "awake" | "drift" | "deep";

export function IdleSequence() {
  const [phase, setPhase] = useState<Phase>("awake");
  const phaseRef = useRef<Phase>("awake");
  phaseRef.current = phase;
  const reticleRef = useRef<HTMLDivElement | null>(null);

  // ── idle clock ────────────────────────────────────────────
  useEffect(() => {
    let driftT: ReturnType<typeof setTimeout>;
    let deepT: ReturnType<typeof setTimeout>;
    const arm = () => {
      clearTimeout(driftT);
      clearTimeout(deepT);
      driftT = setTimeout(() => setPhase("drift"), DRIFT_MS);
      deepT = setTimeout(() => setPhase("deep"), DEEP_MS);
    };
    const wake = () => {
      if (phaseRef.current !== "awake") setPhase("awake");
      arm();
    };
    const evs = ["mousemove", "mousedown", "keydown", "wheel", "scroll", "touchstart", "pointerdown"];
    evs.forEach((e) => window.addEventListener(e, wake, { passive: true }));
    arm();
    return () => {
      clearTimeout(driftT);
      clearTimeout(deepT);
      evs.forEach((e) => window.removeEventListener(e, wake));
    };
  }, []);

  // ── roaming reticle + ambient ripples (drift & deep) ──────
  useEffect(() => {
    if (phase === "awake" || REDUCED) return;
    let raf = 0;
    let lastRipple = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = (now - start) / 1000;
      const W = window.innerWidth;
      const H = window.innerHeight;
      // slow Lissajous wander so the reticle never repeats too obviously
      const x = W / 2 + Math.sin(t * 0.27) * W * 0.34 + Math.sin(t * 0.11) * W * 0.10;
      const y = H / 2 + Math.cos(t * 0.19) * H * 0.32 + Math.sin(t * 0.07) * H * 0.12;
      const el = reticleRef.current;
      if (el) el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
      const interval = phaseRef.current === "deep" ? 620 : 1100;
      if (now - lastRipple > interval) {
        lastRipple = now;
        fireRipple(x, y);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [phase]);

  // a steady line for the deep message, re-rolled each deep entry
  const deepLine = useMemo(
    () => COPY.idle.deepLines[Math.floor(Math.random() * COPY.idle.deepLines.length)],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [phase === "deep"],
  );

  if (phase === "awake") return null;
  return (
    <div className={"idle-screen " + phase} aria-hidden="true">
      <div className="idle-vignette" />

      {!REDUCED && (
        <div className="idle-reticle" ref={reticleRef}>
          <span className="idle-reticle-h" />
          <span className="idle-reticle-v" />
          <span className="idle-reticle-ring" />
        </div>
      )}

      {!REDUCED && phase === "deep" && (
        <div className="idle-orbit">
          <i /><i /><i /><i />
        </div>
      )}

      {phase === "drift" && (
        <div className="idle-hint mono">{COPY.idle.driftHint}</div>
      )}

      {phase === "deep" && (
        <div className="idle-deep">
          <div className="idle-deep-card">
            <div className="idle-deep-kicker mono">— IDLE · SCREENSAVER —</div>
            <div className="idle-deep-title serif">{COPY.idle.deepTitle}</div>
            <div className="idle-deep-line mono">{deepLine}</div>
            <div className="idle-deep-hint mono">{COPY.idle.wakeHint}</div>
          </div>
        </div>
      )}
    </div>
  );
}
