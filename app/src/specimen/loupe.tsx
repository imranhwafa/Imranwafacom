// ════════════════════════════════════════════════════════════
// LOUPE — the signature interaction.
//   Examine the page like a specimen under glass: a reticle lens
//   follows the cursor revealing a magnified BLUEPRINT layer —
//   a fine measurement grid, an intensified dot-lattice, a center
//   crosshair, and live coordinate / section / scroll readouts.
//   Conceptually one-of-a-kind, and on-theme with the specimen sheet.
//
//   Toggle:  masthead "INSPECT" button · command palette /inspect ·
//            custom event `iw-loupe-toggle`. State broadcasts on
//            `iw-loupe` (detail: boolean) so controls stay in sync.
//   Disabled on coarse-pointer / mobile (no hover to drive it).
// ════════════════════════════════════════════════════════════
import { useEffect, useRef, useState } from "react";

const LOUPE_EVENT = "iw-loupe";          // detail: boolean (current state)
const LOUPE_TOGGLE = "iw-loupe-toggle";  // request a flip

type RGB = [number, number, number];

function resolveRGB(varName: string, fallback: RGB): RGB {
  try {
    const raw = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
    if (!raw) return fallback;
    const probe = document.createElement("span");
    probe.style.color = raw;
    probe.style.display = "none";
    document.body.appendChild(probe);
    const c = getComputedStyle(probe).color;
    document.body.removeChild(probe);
    const m = c.match(/\d+(\.\d+)?/g);
    return m ? [Math.round(+m[0]), Math.round(+m[1]), Math.round(+m[2])] : fallback;
  } catch { return fallback; }
}

function hueShift([r, g, b]: RGB, shift: number): RGB {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  h = (h + shift) % 1;
  if (h < 0) h += 1;
  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  return [
    Math.round(hue2rgb(p, q, h + 1 / 3) * 255),
    Math.round(hue2rgb(p, q, h) * 255),
    Math.round(hue2rgb(p, q, h - 1 / 3) * 255)
  ];
}

const loupeAvailable = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(hover: hover) and (pointer: fine)").matches;

export function Loupe() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [on, setOn] = useState(false);
  const onRef = useRef(false);
  onRef.current = on;

  // ── wiring: toggle + external state broadcast ──────────────
  useEffect(() => {
    if (!loupeAvailable()) return;
    const toggle = () => {
      const next = !onRef.current;
      setOn(next);
      window.dispatchEvent(new CustomEvent(LOUPE_EVENT, { detail: next }));
    };
    const onKey = (e: KeyboardEvent) => { if (on && e.key === "Escape") toggle(); };
    window.addEventListener(LOUPE_TOGGLE, toggle);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener(LOUPE_TOGGLE, toggle);
      window.removeEventListener("keydown", onKey);
    };
  }, [on]);

  useEffect(() => {
    document.documentElement.classList.toggle("loupe-on", on);
  }, [on]);

  // ── render loop (only while enabled) ───────────────────────
  useEffect(() => {
    if (!on) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let w = 0, h = 0, dpr = 1, raf = 0, frame = 0;
    const R = Math.min(150, Math.round(Math.min(window.innerWidth, window.innerHeight) * 0.2));
    let tx = window.innerWidth / 2, ty = window.innerHeight / 2;
    let x = tx, y = ty;
    let accent: RGB = [80, 120, 245];
    let washRGB: RGB = [80, 120, 245];
    let section = "";

    const resize = () => {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      w = window.innerWidth; h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      accent = resolveRGB("--accent", accent);
      washRGB = hueShift(accent, 0.35); // complementary wash
    };

    const onMove = (e: MouseEvent) => { tx = e.clientX; ty = e.clientY; };

    const A = (a: number) => `rgba(${accent[0]},${accent[1]},${accent[2]},${a})`;
    // Lens reveals a *different* colour than the page accent via a calculated hue shift.
    const W = (a: number) => `rgba(${washRGB[0]},${washRGB[1]},${washRGB[2]},${a})`;

    const draw = () => {
      x += (tx - x) * 0.22;
      y += (ty - y) * 0.22;
      if (frame % 30 === 0) {
        accent = resolveRGB("--accent", accent);
        washRGB = hueShift(accent, 0.35);
      }
      if (frame % 12 === 0) {
        const el = document.elementFromPoint(Math.round(x), Math.round(y));
        section = el?.closest<HTMLElement>("section[id]")?.id || "";
      }
      frame++;

      ctx.clearRect(0, 0, w, h);

      // ── lens interior ──────────────────────────────────────
      ctx.save();
      ctx.beginPath();
      ctx.arc(x, y, R, 0, Math.PI * 2);
      ctx.clip();

      // colour-wash reveal: a distinct hue tints everything under the lens
      const wash = ctx.createRadialGradient(x, y, 0, x, y, R);
      wash.addColorStop(0, W(0.22));
      wash.addColorStop(0.7, W(0.14));
      wash.addColorStop(1, W(0.28));
      ctx.fillStyle = wash;
      ctx.fillRect(x - R, y - R, R * 2, R * 2);

      // fine measurement grid (anchored to world, so it "slides")
      const g = 16;
      ctx.lineWidth = 1;
      ctx.strokeStyle = A(0.16);
      ctx.beginPath();
      for (let gx = Math.floor((x - R) / g) * g; gx <= x + R; gx += g) {
        ctx.moveTo(gx, y - R); ctx.lineTo(gx, y + R);
      }
      for (let gy = Math.floor((y - R) / g) * g; gy <= y + R; gy += g) {
        ctx.moveTo(x - R, gy); ctx.lineTo(x + R, gy);
      }
      ctx.stroke();

      // intensified dot-lattice with glow + constellation links
      const dl = 26;
      const lit: { px: number; py: number }[] = [];
      ctx.fillStyle = A(0.9);
      for (let px = Math.floor((x - R) / dl) * dl; px <= x + R; px += dl) {
        for (let py = Math.floor((y - R) / dl) * dl; py <= y + R; py += dl) {
          const d = Math.hypot(px - x, py - y);
          if (d > R) continue;
          const f = 1 - d / R;            // brighter / bigger toward centre
          ctx.beginPath();
          ctx.arc(px, py, 0.8 + f * 2.2, 0, Math.PI * 2);
          ctx.fillStyle = A(0.25 + f * 0.6);
          ctx.fill();
          if (f > 0.35) lit.push({ px, py });
        }
      }
      ctx.strokeStyle = A(0.18);
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let i = 0; i < lit.length; i++) {
        for (let j = i + 1; j < lit.length; j++) {
          const a = lit[i], b = lit[j];
          if (Math.hypot(a.px - b.px, a.py - b.py) <= dl + 1) {
            ctx.moveTo(a.px, a.py); ctx.lineTo(b.px, b.py);
          }
        }
      }
      ctx.stroke();

      // center crosshair + reticle
      ctx.strokeStyle = A(0.55);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x - R, y); ctx.lineTo(x - 9, y);
      ctx.moveTo(x + 9, y); ctx.lineTo(x + R, y);
      ctx.moveTo(x, y - R); ctx.lineTo(x, y - 9);
      ctx.moveTo(x, y + 9); ctx.lineTo(x, y + R);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(x, y, 9, 0, Math.PI * 2);
      ctx.stroke();
      // inner reticle ring with tick marks
      ctx.beginPath();
      ctx.arc(x, y, R - 16, 0, Math.PI * 2);
      ctx.strokeStyle = A(0.22);
      ctx.stroke();
      ctx.strokeStyle = A(0.5);
      for (let a = 0; a < 360; a += 30) {
        const rad = (a * Math.PI) / 180;
        const r1 = R - 16, r2 = a % 90 === 0 ? R - 24 : R - 20;
        ctx.beginPath();
        ctx.moveTo(x + Math.cos(rad) * r1, y + Math.sin(rad) * r1);
        ctx.lineTo(x + Math.cos(rad) * r2, y + Math.sin(rad) * r2);
        ctx.stroke();
      }
      ctx.restore();

      // ── lens rim (outside the clip) ────────────────────────
      ctx.save();
      ctx.shadowColor = A(0.35);
      ctx.shadowBlur = 18;
      ctx.strokeStyle = A(0.85);
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(x, y, R, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // ── readouts around the rim ────────────────────────────
      ctx.font = "10px 'JetBrains Mono', ui-monospace, monospace";
      ctx.fillStyle = A(0.85);
      ctx.textBaseline = "alphabetic";
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const pct = max > 0 ? Math.round((window.scrollY / max) * 100) : 0;
      // top label, centered
      ctx.textAlign = "center";
      ctx.fillText("◎ INSPECT · 2.0×", x, y - R - 12);
      // coordinates, left under rim
      ctx.textAlign = "left";
      ctx.fillText(`X ${String(Math.round(x)).padStart(4, " ")}  Y ${String(Math.round(y)).padStart(4, " ")}`, x - R, y + R + 18);
      // section + scroll, right under rim
      ctx.textAlign = "right";
      ctx.fillText(`§ ${section || "—"}  ·  ${pct}%`, x + R, y + R + 18);

      raf = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove, { passive: true });
    raf = requestAnimationFrame(draw);
    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
      ctx.clearRect(0, 0, w, h);
    };
  }, [on]);

  if (!on) return null;
  return <canvas className="loupe-canvas" ref={canvasRef} aria-hidden="true" />;
}

// ── INSPECT toggle button (masthead) ────────────────────────
export function LoupeToggle() {
  const [on, setOn] = useState(false);
  const [show] = useState(loupeAvailable); // lazy: evaluated once at first render
  useEffect(() => {
    const onState = (e: Event) => setOn((e as CustomEvent<boolean>).detail);
    window.addEventListener(LOUPE_EVENT, onState);
    return () => window.removeEventListener(LOUPE_EVENT, onState);
  }, []);
  if (!show) return null;
  return (
    <button
      className={"loupe-toggle mono" + (on ? " on" : "")}
      onClick={() => window.dispatchEvent(new CustomEvent(LOUPE_TOGGLE))}
      title="inspect the page like a specimen"
      aria-pressed={on}
    >
      <span className="lt-ring" />{on ? "inspecting" : "inspect"}
    </button>
  );
}
