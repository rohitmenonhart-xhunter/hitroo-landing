/* Shared WebGL2 pieces for the clear theme: a full-screen quad, and the colour field (a slowly
   moving orange-pink-blue gradient seen through fluted glass, with grain) that the hero and the
   gradient panels draw. */

export const VERT = `#version 300 es
in vec2 a;
out vec2 v;
void main() { v = a * 0.5 + 0.5; gl_Position = vec4(a, 0.0, 1.0); }`;

/**
 * GLSL for the colour field. Needs `uTime` (s), `uBlob` (centre xy and radii zw, in px),
 * `uStrip` (flute width in px; 0 for none) and `uPlain` (1 for a plain field of colour `uBg`, lit by
 * a soft `uGlowColor` glow of strength `uGlow` around the blob centre). `blob(p)` is the smooth gradient at pixel p,
 * `backdrop(p)` the same seen through the flutes, `grain(p, amount)` a static film grain.
 */
export const GRADIENT_GLSL = `
uniform float uTime;
uniform vec4 uBlob;
uniform float uStrip;
uniform float uPlain;
uniform vec3 uBg;
uniform float uGlow;
uniform vec3 uGlowColor;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

// 0 = the white page, 1 = the hot core: pale blue, blue, violet, magenta, pink, red, orange.
vec3 ramp(float v) {
  vec3 c = vec3(1.0);
  c = mix(c, vec3(0.686, 0.773, 0.961), smoothstep(0.0, 0.12, v));
  c = mix(c, vec3(0.459, 0.616, 0.937), smoothstep(0.08, 0.26, v));
  c = mix(c, vec3(0.663, 0.427, 0.871), smoothstep(0.24, 0.42, v));
  c = mix(c, vec3(0.847, 0.302, 0.690), smoothstep(0.38, 0.54, v));
  c = mix(c, vec3(0.910, 0.275, 0.498), smoothstep(0.5, 0.66, v));
  c = mix(c, vec3(0.937, 0.318, 0.294), smoothstep(0.64, 0.8, v));
  c = mix(c, vec3(0.941, 0.467, 0.247), smoothstep(0.78, 0.95, v));
  return c;
}

vec3 blob(vec2 p) {
  vec2 q = (p - uBlob.xy) / uBlob.zw;
  if (uPlain > 0.5) return mix(uBg, uGlowColor, uGlow * exp(-dot(q, q) * 2.4));
  float t = uTime * 0.07;
  vec2 warp = vec2(vnoise(q * 1.4 + vec2(t, -0.7 * t)), vnoise(q * 1.4 + vec2(-0.8 * t, t) + 7.3)) - 0.5;
  q += warp * 0.6;
  return ramp(clamp(1.0 - pow(length(q), 1.7), 0.0, 1.0));
}

// Fluted glass: each vertical strip is a lens that squeezes a slice of the gradient, with a
// slight vertical drift per strip, so neighbouring strips break at hard edges.
vec3 backdrop(vec2 p) {
  if (uStrip <= 0.0) return blob(p);
  float i = floor(p.x / uStrip);
  float u = fract(p.x / uStrip) * 2.0 - 1.0;
  float cx = (i + 0.5) * uStrip + uStrip * 0.25 * sin(i * 1.7 + uTime * 0.05);
  vec2 s = vec2(cx + u * uStrip * 0.5 * 0.42, uBlob.y + (p.y - uBlob.y) * (1.0 + 0.1 * sin(i * 2.3)));
  vec3 c = blob(s);
  float colour = 1.0 - min(c.r, min(c.g, c.b));
  c = mix(c, vec3(1.0), colour * 0.14 * smoothstep(0.55, 1.0, u));
  c *= 1.0 - colour * 0.06 * smoothstep(-0.7, -1.0, u);
  return c;
}

vec3 grain(vec2 p, vec3 c, float amount) {
  float colour = 1.0 - min(c.r, min(c.g, c.b));
  return c + (hash(floor(p)) - 0.5) * amount * (0.35 + colour);
}
`;

function compile(gl: WebGL2RenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) ?? 'shader');
  return s;
}

/** Compiles the program and binds a full-screen quad to its `a` attribute. Throws on failure. */
export function quadProgram(gl: WebGL2RenderingContext, frag: string) {
  const program = gl.createProgram()!;
  gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, VERT));
  gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, frag));
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program) ?? 'link');
  gl.useProgram(program);
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(program, 'a');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  return {
    program,
    uniform: (name: string) => gl.getUniformLocation(program, name),
    dispose: () => {
      gl.deleteBuffer(buf);
      gl.deleteProgram(program);
    },
  };
}

/** Calls `onChange(visible)` as the element enters or leaves the viewport. */
export function watchVisible(el: Element, onChange: (visible: boolean) => void) {
  const io = new IntersectionObserver(([e]) => onChange(e.isIntersecting));
  io.observe(el);
  return () => io.disconnect();
}

/** CSS stand-in for the colour field when WebGL2 is missing. */
export const GRADIENT_CSS =
  'radial-gradient(closest-side, #F0773F 0%, #EF514B 22%, #E8467F 38%, #D84DB0 52%, #A96DDE 64%, #759DEF 80%, #AFC5F5 90%, rgba(255,255,255,0) 100%)';
