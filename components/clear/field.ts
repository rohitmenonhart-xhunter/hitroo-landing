/* ------------------------------------------------------------------
   Signed distance fields (Felzenszwalb's exact EDT), in canvas pixels:
   negative inside a shape, positive outside. The glass is shaped from them.
   ------------------------------------------------------------------ */

function edt1d(f: Float32Array, n: number, d: Float32Array, v: Int32Array, z: Float32Array) {
  let k = 0;
  v[0] = 0;
  z[0] = -Infinity;
  z[1] = Infinity;
  for (let q = 1; q < n; q++) {
    let s = (f[q] + q * q - (f[v[k]] + v[k] * v[k])) / (2 * q - 2 * v[k]);
    while (s <= z[k]) {
      k--;
      s = (f[q] + q * q - (f[v[k]] + v[k] * v[k])) / (2 * q - 2 * v[k]);
    }
    k++;
    v[k] = q;
    z[k] = s;
    z[k + 1] = Infinity;
  }
  k = 0;
  for (let q = 0; q < n; q++) {
    while (z[k + 1] < q) k++;
    d[q] = (q - v[k]) * (q - v[k]) + f[v[k]];
  }
}

/** Squared distance from every pixel to the nearest pixel where `on` is true. */
function edt(on: (i: number) => boolean, w: number, h: number) {
  const n = Math.max(w, h);
  const f = new Float32Array(n);
  const d = new Float32Array(n);
  const v = new Int32Array(n);
  const z = new Float32Array(n + 1);
  const out = new Float32Array(w * h);
  for (let i = 0; i < w * h; i++) out[i] = on(i) ? 0 : 1e20;
  for (let x = 0; x < w; x++) {
    for (let y = 0; y < h; y++) f[y] = out[y * w + x];
    edt1d(f, h, d, v, z);
    for (let y = 0; y < h; y++) out[y * w + x] = d[y];
  }
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) f[x] = out[y * w + x];
    edt1d(f, w, d, v, z);
    for (let x = 0; x < w; x++) out[y * w + x] = d[x];
  }
  return out;
}

export function signedField(inside: (i: number) => boolean, w: number, h: number) {
  const toIn = edt(inside, w, h);
  const toOut = edt((i) => !inside(i), w, h);
  const sd = new Float32Array(w * h);
  for (let i = 0; i < w * h; i++) sd[i] = Math.sqrt(toIn[i]) - Math.sqrt(toOut[i]);
  return sd;
}

/** In-place separable box blur of radius `r`. */
export function boxBlur(a: Float32Array, w: number, h: number, r: number) {
  const tmp = new Float32Array(Math.max(w, h));
  const span = 2 * r + 1;
  for (let y = 0; y < h; y++) {
    const o = y * w;
    for (let x = 0; x < w; x++) {
      let sum = 0;
      for (let k = -r; k <= r; k++) sum += a[o + Math.min(w - 1, Math.max(0, x + k))];
      tmp[x] = sum / span;
    }
    a.set(tmp.subarray(0, w), o);
  }
  for (let x = 0; x < w; x++) {
    for (let y = 0; y < h; y++) {
      let sum = 0;
      for (let k = -r; k <= r; k++) sum += a[Math.min(h - 1, Math.max(0, y + k)) * w + x];
      tmp[y] = sum / span;
    }
    for (let y = 0; y < h; y++) a[y * w + x] = tmp[y];
  }
}
