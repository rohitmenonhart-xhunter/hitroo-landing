'use client';

import { useEffect, useRef, useState, type RefObject } from 'react';
import { cn } from '@/lib/utils';
import { boxBlur, signedField } from './field';
import { GRADIENT_CSS, GRADIENT_GLSL, quadProgram, watchVisible } from './gl';

const WORD = 'hitroo';
const MAX_DROPS = 16;

/** How the hero's wordmark is drawn: the face, and the shape of its glass. */
export interface HeroStyle {
  family: string;
  weight: number;
  /** Canvas font-stretch. */
  stretch?: 'normal' | 'expanded';
  lower?: boolean;
  /** What to draw (default the name). */
  text?: string;
  /** Never break onto two lines, even in a tall box. */
  oneLine?: boolean;
  /** Fit by the font's tallest and lowest letters rather than this word's own, so different words drawn in
   *  the same box come out at one letter size on one baseline. */
  fontFit?: boolean;
  /** The dot on the i becomes a glass sphere. */
  orb?: boolean;
  /** Cross-section of the glass: a rounded edge, a full tube, two cut facets, or a soft pillow. */
  profile: 'round' | 'tube' | 'chamfer' | 'pillow';
  /** Vertical flutes inside the letters. */
  flutes?: boolean;
  /** Corner rounding, as a share of the font size. */
  corner: number;
  /** Letter spacing, as a share of the font size. */
  track: number;
  /** Spread between the red, green and blue indices: the colour fringing. */
  dispersion: number;
}

const PROFILES = { round: 0, tube: 1, chamfer: 2, pillow: 3 } as const;
/** Bevel width per profile, as a share of half the stroke width. */
const BEVEL = { round: 0.8, tube: 1, chamfer: 0.75, pillow: 0.95 } as const;

/** Draws the word (on two lines on portrait screens), rounds its corners (an erode-then-grow
 *  "opening"), and returns its smoothed distance field and typical half stroke width. */
function buildField(w: number, h: number, st: HeroStyle) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d', { willReadFrequently: true })!;
  const source = st.text ?? WORD;
  const word = st.lower ? source.toLowerCase() : source;
  const lines = h > w && !st.oneLine ? [word.slice(0, Math.ceil(word.length / 2)), word.slice(Math.ceil(word.length / 2))] : [word];
  const glyph = (ch: string) => (st.orb && ch === 'i' ? 'ı' : ch);
  const font = (px: number) => `${st.weight} ${px}px ${st.family}`;
  const setFont = (px: number) => {
    ctx.font = font(px);
    if ('fontStretch' in ctx) (ctx as CanvasRenderingContext2D & { fontStretch: 'normal' | 'expanded' }).fontStretch = st.stretch ?? 'normal';
  };
  const probe = 100;
  setFont(probe);
  const track = st.track * probe;
  const lead = 0.2;
  const ref = st.fontFit ? { ascent: ctx.measureText('Hbdfhklt').actualBoundingBoxAscent, descent: ctx.measureText('gjpqy').actualBoundingBoxDescent } : null;
  const measured = lines.map((line) => {
    const widths = [...line].map((ch) => ctx.measureText(glyph(ch)).width);
    const m = ctx.measureText(line);
    return {
      line,
      widths,
      total: widths.reduce((x, y) => x + y, 0) + track * (line.length - 1),
      ascent: ref?.ascent ?? m.actualBoundingBoxAscent,
      descent: ref?.descent ?? Math.max(0, m.actualBoundingBoxDescent),
    };
  });
  const widest = Math.max(...measured.map((m) => m.total));
  const block = measured.reduce((sum, m) => sum + m.ascent + m.descent, 0) + lead * probe * (lines.length - 1);
  const size = Math.min((w * 0.97) / (widest / probe), (h * 0.84) / (block / probe));
  const k = size / probe;
  const xHeight = ctx.measureText('x').actualBoundingBoxAscent * k;
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = '#fff';
  setFont(size);
  ctx.textBaseline = 'alphabetic';
  let y = (h - block * k) / 2;
  measured.forEach((m) => {
    const baseline = y + m.ascent * k;
    let x = (w - m.total * k) / 2;
    [...m.line].forEach((ch, i) => {
      ctx.fillText(glyph(ch), x, baseline);
      if (st.orb && ch === 'i') {
        const r = size * 0.12;
        ctx.beginPath();
        ctx.arc(x + (m.widths[i] * k) / 2, baseline - xHeight - size * 0.07 - r, r, 0, Math.PI * 2);
        ctx.fill();
      }
      x += (m.widths[i] + track) * k;
    });
    y += (m.ascent + m.descent + lead * probe) * k;
  });
  const px = ctx.getImageData(0, 0, w, h).data;
  let field = signedField((i) => px[i * 4] > 127, w, h);
  const r = st.corner * size;
  if (r > 0.5) {
    const raw = field;
    field = signedField((i) => raw[i] < -r, w, h);
    for (let i = 0; i < field.length; i++) field[i] -= r;
  }
  // An exact transform of a pixel mask is stepped on curves and diagonals; a light blur
  // keeps it a distance field but makes its slope (the glass normal) smooth.
  for (let pass = 0; pass < 3; pass++) boxBlur(field, w, h, 2);
  // Typical half stroke width: a high percentile of how deep inside the letters a pixel sits.
  let deepest = 0;
  for (let i = 0; i < field.length; i++) deepest = Math.max(deepest, -field[i]);
  const bins = new Uint32Array(256);
  let inside = 0;
  for (let i = 0; i < field.length; i++) {
    if (field[i] < 0) {
      bins[Math.min(255, Math.floor((-field[i] / deepest) * 255))]++;
      inside++;
    }
  }
  let seen = 0;
  let half = deepest;
  for (let b = 0; b < 256; b++) {
    seen += bins[b];
    if (seen >= inside * 0.97) {
      half = ((b + 1) / 255) * deepest;
      break;
    }
  }
  return { field, half };
}

/* ------------------------------------------------------------------
   Shader: the hero is one full-bleed picture. Behind: the colour field
   (gradient, fluted glass, grain). In front: the letters as a slab of
   real glass. The distance field gives each letter a rounded edge, so
   every pixel has a surface normal; a straight view ray is refracted in
   through that surface and out through the flat back (Snell's law, with
   a slightly different index for red, green and blue), and that ray
   picks the colour behind it. The rims also reflect a simple studio
   (Fresnel), which draws their dark bands. Cursor ripples are waves on
   the glass, so they bend the light too.
   ------------------------------------------------------------------ */

const FRAG = `#version 300 es
precision highp float;
in vec2 v;
out vec4 o;
uniform sampler2D uField;
uniform vec2 uSize;
uniform vec4 uBox;
uniform float uScale;
uniform float uBevel;
uniform float uDepth;
uniform int uProfile;
uniform float uFlute;
uniform float uDisp;
uniform vec4 uDrops[${MAX_DROPS}];
uniform int uCount;
${GRADIENT_GLSL}

float field(vec2 p) { return texture(uField, (p - uBox.xy) / uBox.zw).r / uScale; }
float bump(float x, float c, float w) { return exp(-pow((x - c) / w, 2.0)); }

// Slope of the glass across its bevel, from u = 0 at the edge to u = 1 at the crest.
float slopeOf(float u) {
  float w = 1.0 - u;
  if (uProfile == 2) return u < 0.45 ? 1.6 : (u < 1.0 ? 0.5 : 0.0);
  if (uProfile == 3) return min(pow(w, 3.0) / pow(max(1.0 - pow(w, 4.0), 1e-4), 0.75), 7.0);
  return min(w / sqrt(max(1.0 - w * w, 1e-4)), 7.0);
}

// The studio, seen along direction r (x right, y up, z towards the viewer).
float studio(vec3 r) {
  float c = 1.0;
  c -= 0.9 * smoothstep(0.18, 0.5, -r.y);
  c -= 0.6 * bump(r.y, 0.3, 0.05);
  c -= 0.25 * smoothstep(0.55, 0.9, r.y);
  float ax = abs(r.x);
  c -= 0.7 * bump(ax, 0.34, 0.03) + 0.45 * bump(ax, 0.56, 0.03) + 0.3 * bump(ax, 0.78, 0.035);
  return clamp(c, 0.0, 1.0);
}

void main() {
  vec2 p = vec2(v.x, 1.0 - v.y) * uSize;

  // Waves from recent cursor positions: their slope (screen space).
  vec2 g = vec2(0.0);
  for (int i = 0; i < ${MAX_DROPS}; i++) {
    if (i >= uCount) break;
    vec4 d = uDrops[i];
    vec2 dp = p - d.xy;
    float r = length(dp) + 0.001;
    float age = d.z;
    float s = 16.0 + 70.0 * age;
    float env = d.w * exp(-age * 1.6) * exp(-r * r / (2.0 * s * s));
    float ph = 0.06 * r - age * 6.0;
    g += env * (0.06 * cos(ph) - r / (s * s) * sin(ph)) * dp / r;
  }

  vec3 back = backdrop(p - g * 14.0);
  float dist = field(p);
  float inside = smoothstep(0.6, -0.6, dist);
  if (inside <= 0.0) { o = vec4(grain(gl_FragCoord.xy, back, uPlain > 0.5 ? 0.0 : 0.055), 1.0); return; }

  // Surface normal: the bevel's slope along the outward direction, plus the waves.
  vec2 e = vec2(2.0, 0.0);
  vec2 out2 = normalize(vec2(field(p + e.xy) - field(p - e.xy), field(p + e.yx) - field(p - e.yx)) + 1e-5);
  float u = clamp(-dist / uBevel, 0.0, 1.0);
  vec2 tilt = out2 * slopeOf(u) - g * 32.0;
  if (uFlute > 0.0) {
    float f = fract(p.x / uFlute) * 2.0 - 1.0;
    tilt.x += 0.7 * f / sqrt(max(1.0 - 0.85 * f * f, 0.05)) * smoothstep(0.35, 0.9, u);
  }
  vec3 n = normalize(vec3(tilt.x, -tilt.y, 1.0));

  vec3 view = vec3(0.0, 0.0, -1.0);
  float fres = 0.04 + 0.96 * pow(1.0 - n.z, 5.0);
  float refl = studio(reflect(view, n));

  vec3 col;
  for (int c = 0; c < 3; c++) {
    float ior = 1.47 + uDisp * float(c);
    vec3 t1 = refract(view, n, 1.0 / ior);
    vec3 t2 = refract(t1, vec3(0.0, 0.0, 1.0), ior);
    float seen;
    if (dot(t2, t2) < 1e-6) {
      seen = studio(reflect(t1, vec3(0.0, 0.0, 1.0)));
    } else {
      vec2 off = vec2(t2.x, -t2.y) / max(t2.z, 0.25) * uDepth;
      seen = blob(p + off - g * 14.0)[c];
    }
    col[c] = mix(seen, refl, fres);
  }
  // The front face is lightly frosted, so the letters read as smooth glass over the flutes.
  col = mix(col, vec3(1.0), 0.3 * smoothstep(0.7, 1.0, u));
  // On plain white the glass would all but vanish: its rims mirror more of the studio instead.
  if (uPlain > 0.5) col = mix(col, vec3(studio(reflect(view, n))), 0.9 * smoothstep(0.02, 0.5, 1.0 - n.z));
  // A studio key light from the upper left: one sharp glint and a soft sheen.
  vec3 hv = normalize(normalize(vec3(-0.5, 0.65, 0.6)) + vec3(0.0, 0.0, 1.0));
  float nh = max(dot(n, hv), 0.0);
  col += vec3(pow(nh, 140.0) * 0.95 + pow(nh, 14.0) * 0.08);
  col = mix(back, col, inside);
  o = vec4(grain(gl_FragCoord.xy, col, uPlain > 0.5 ? 0.0 : 0.055), 1.0);
}`;

type Drop = { x: number; y: number; t: number; s: number };

/**
 * The hero picture (WebGL2), full-bleed behind the hero's content: the moving gradient through
 * fluted glass (or, `plain`, a flat `background` colour), and the wordmark as refractive glass
 * inside the element `boxRef` points to.
 * Moving the cursor or a finger sends ripples through the glass; one sweep plays on load. It
 * animates only while on screen; reduced motion gets a still frame; no WebGL2 gets CSS.
 */
export default function GlassWordmark({
  hero,
  boxRef,
  plain = false,
  background = '#FFFFFF',
  glow = 0,
  glowColor = '#F5502F',
  pixelRatio,
  fieldLimit = 1600,
}: {
  hero: HeroStyle;
  boxRef: RefObject<HTMLElement>;
  plain?: boolean;
  /** The plain field's colour (hex). */
  background?: string;
  /** A soft glow behind the glass on a plain field (0 to 1), so the glass has light to bend. */
  glow?: number;
  glowColor?: string;
  /** Canvas pixels per CSS pixel; defaults to the screen's, capped at 1.5. The still-image export renders at 2. */
  pixelRatio?: number;
  /** Widest the glyph field may be, in texture pixels; larger is sharper and slower to build. */
  fieldLimit?: number;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fallback, setFallback] = useState(false);
  const heroKey = JSON.stringify(hero);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    const box = boxRef.current;
    if (!wrap || !canvas || !box) return;
    const gl = canvas.getContext('webgl2', { antialias: false, premultipliedAlpha: false });
    if (!gl) {
      setFallback(true);
      return;
    }
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let quad: ReturnType<typeof quadProgram>;
    try {
      quad = quadProgram(gl, FRAG);
    } catch {
      setFallback(true);
      return;
    }
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    const uSize = quad.uniform('uSize');
    const uBox = quad.uniform('uBox');
    const uScale = quad.uniform('uScale');
    const uBevel = quad.uniform('uBevel');
    const uDepth = quad.uniform('uDepth');
    const uProfile = quad.uniform('uProfile');
    const uFlute = quad.uniform('uFlute');
    const uDisp = quad.uniform('uDisp');
    const uTime = quad.uniform('uTime');
    const uBlob = quad.uniform('uBlob');
    const uStrip = quad.uniform('uStrip');
    const uPlain = quad.uniform('uPlain');
    const uBg = quad.uniform('uBg');
    const uGlow = quad.uniform('uGlow');
    const uGlowColor = quad.uniform('uGlowColor');
    const uDrops = quad.uniform('uDrops');
    const uCount = quad.uniform('uCount');

    let alive = true;
    let visible = true;
    let ready = false;
    let frame = 0;
    let bx = 0;
    let by = 0;
    let bw = 1;
    let bh = 1;
    let drops: Drop[] = [];
    const dropData = new Float32Array(MAX_DROPS * 4);
    const t0 = performance.now();

    const draw = () => {
      frame = 0;
      if (!ready) return;
      const now = performance.now() / 1000;
      drops = drops.filter((d) => now - d.t < 3.2);
      drops.forEach((d, i) => dropData.set([d.x, d.y, now - d.t, d.s], i * 4));
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform1f(uTime, still ? 0 : (performance.now() - t0) / 1000);
      gl.uniform4fv(uDrops, dropData);
      gl.uniform1i(uCount, drops.length);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      // A plain field doesn't move: only ripples need more frames.
      if (!still && visible && (!plain || drops.length)) frame = requestAnimationFrame(draw);
    };
    const request = () => {
      if (!frame) frame = requestAnimationFrame(draw);
    };

    const build = async () => {
      const wr = wrap.getBoundingClientRect();
      const br = box.getBoundingClientRect();
      const cw = Math.max(1, Math.round(wr.width));
      const ch = Math.max(1, Math.round(wr.height));
      bx = br.left - wr.left;
      by = br.top - wr.top;
      bw = Math.max(1, Math.round(br.width));
      bh = Math.max(1, Math.round(br.height));
      const dpr = pixelRatio ?? Math.min(1.5, window.devicePixelRatio || 1);
      canvas.width = Math.round(cw * dpr);
      canvas.height = Math.round(ch * dpr);
      try {
        await document.fonts.load(`${hero.weight} 100px ${hero.family}`);
      } catch {
        /* draw with whatever font is available */
      }
      if (!alive) return;
      const scale = Math.min(2, fieldLimit / bw);
      const w = Math.round(bw * scale);
      const h = Math.round(bh * scale);
      const { field, half } = buildField(w, h, hero);
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.R16F, w, h, 0, gl.RED, gl.FLOAT, field);
      const stroke = half / scale;
      const portrait = bh > bw;
      gl.uniform2f(uSize, cw, ch);
      gl.uniform4f(uBox, bx, by, bw, bh);
      gl.uniform1f(uScale, scale);
      gl.uniform1f(uBevel, Math.max(6, stroke * BEVEL[hero.profile]));
      gl.uniform1f(uDepth, Math.max(10, stroke * 3.2));
      gl.uniform1i(uProfile, PROFILES[hero.profile]);
      gl.uniform1f(uFlute, hero.flutes ? Math.max(10, stroke * 0.9) : 0);
      gl.uniform1f(uDisp, hero.dispersion);
      gl.uniform4f(uBlob, bx + bw / 2, by + bh / 2, cw * (portrait ? 0.78 : 0.46), ch * (portrait ? 0.36 : 0.5));
      gl.uniform1f(uStrip, plain ? 0 : cw * (portrait ? 0.25 : 0.13));
      gl.uniform1f(uPlain, plain ? 1 : 0);
      const hex = background.replace('#', '');
      gl.uniform3f(uBg, parseInt(hex.slice(0, 2), 16) / 255, parseInt(hex.slice(2, 4), 16) / 255, parseInt(hex.slice(4, 6), 16) / 255);
      const glowHex = glowColor.replace('#', '');
      gl.uniform1f(uGlow, glow);
      gl.uniform3f(uGlowColor, parseInt(glowHex.slice(0, 2), 16) / 255, parseInt(glowHex.slice(2, 4), 16) / 255, parseInt(glowHex.slice(4, 6), 16) / 255);
      ready = true;
      request();
    };

    let last: Drop | null = null;
    const add = (x: number, y: number, strength = 1) => {
      if (still) return;
      const t = performance.now() / 1000;
      if (last && Math.hypot(x - last.x, y - last.y) < 16 && t - last.t < 0.06) return;
      const speed = last ? Math.min(1, Math.hypot(x - last.x, y - last.y) / 60) : 0.6;
      last = { x, y, t, s: strength * (0.45 + 0.55 * speed) };
      drops.push(last);
      if (drops.length > MAX_DROPS) drops.shift();
      request();
    };
    const local = (cx: number, cy: number) => {
      const r = canvas.getBoundingClientRect();
      return [cx - r.left, cy - r.top] as const;
    };
    const target = wrap.parentElement ?? wrap;
    const onPointer = (e: PointerEvent) => add(...local(e.clientX, e.clientY));
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) add(...local(t.clientX, t.clientY));
    };
    target.addEventListener('pointermove', onPointer);
    target.addEventListener('touchmove', onTouch, { passive: true });

    // One sweep across the word on load, so the glass shows it is alive.
    let sweep = 0;
    const startSweep = () => {
      if (still) return;
      const start = performance.now();
      const step = () => {
        const k = (performance.now() - start) / 1700;
        if (k > 1) return;
        add(bx + bw * (0.08 + 0.84 * k), by + bh * (0.5 + 0.22 * Math.sin(k * Math.PI * 2.4)), 0.8);
        sweep = requestAnimationFrame(step);
      };
      sweep = requestAnimationFrame(step);
    };

    let timer = 0;
    const ro = new ResizeObserver(() => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => void build(), 120);
    });
    build().then(() => alive && !plain && startSweep());
    ro.observe(wrap);
    ro.observe(box);
    const unwatch = watchVisible(wrap, (v) => {
      visible = v;
      if (v) request();
    });

    return () => {
      alive = false;
      ro.disconnect();
      unwatch();
      window.clearTimeout(timer);
      cancelAnimationFrame(frame);
      cancelAnimationFrame(sweep);
      target.removeEventListener('pointermove', onPointer);
      target.removeEventListener('touchmove', onTouch);
      gl.deleteTexture(tex);
      quad.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `heroKey` stands for `hero`
  }, [heroKey, boxRef, plain, background, glow, glowColor, pixelRatio, fieldLimit]);

  return (
    <div ref={wrapRef} aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden">
      {fallback ? (
        <div className="flex h-full items-center justify-center" style={plain ? { background } : { backgroundImage: GRADIENT_CSS }}>
          <p
            className={cn('text-[22vw] leading-none tracking-[-0.02em]', plain ? 'text-transparent [-webkit-text-stroke:2px_#12110B]' : 'text-white/80')}
            style={{ fontFamily: hero.family, fontWeight: hero.weight }}
          >
            {hero.lower ? (hero.text ?? WORD).toLowerCase() : hero.text ?? WORD}
          </p>
        </div>
      ) : (
        <canvas ref={canvasRef} className="h-full w-full" />
      )}
    </div>
  );
}
