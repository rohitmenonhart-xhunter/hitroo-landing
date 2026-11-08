#!/usr/bin/env python3
"""Even out a studio photo's backdrop to the brand paper colour (#FCF8F6).

Fits a smooth light field (2nd-order polynomial per channel) to the backdrop pixels, then divides it out and
multiplies by paper, so the backdrop becomes flat paper while objects, shadows and refractions keep their
relative tones. The result sits seamlessly on a paper page at any crop or canvas size.

    flatten.py <in.png> <out.png> [--tol 14]
"""
import sys
import numpy as np
from PIL import Image

PAPER = np.array([0xFC, 0xF8, 0xF6], dtype=float)


def main() -> None:
    src, dst = sys.argv[1], sys.argv[2]
    tol = float(sys.argv[sys.argv.index('--tol') + 1]) if '--tol' in sys.argv else 14.0
    img = np.asarray(Image.open(src).convert('RGB')).astype(float)
    h, w, _ = img.shape
    # Backdrop guess: pixels close to the median of the outer border.
    border = np.concatenate([img[:24].reshape(-1, 3), img[-24:].reshape(-1, 3), img[:, :24].reshape(-1, 3), img[:, -24:].reshape(-1, 3)])
    ref = np.median(border, axis=0)
    # Allow for light falloff: compare luminance-normalised colour and brightness separately.
    lum = img.mean(axis=2)
    chroma = img / np.maximum(lum[..., None], 1)
    ref_chroma = ref / ref.mean()
    chroma_ok = np.abs(chroma - ref_chroma).max(axis=2) < 0.035
    bright_ok = np.abs(lum - ref.mean()) < tol * 2.2
    mask = chroma_ok & bright_ok
    ys, xs = np.nonzero(mask)
    step = max(1, len(xs) // 60000)
    ys, xs = ys[::step], xs[::step]
    xn, yn = xs / w - 0.5, ys / h - 0.5
    A = np.stack([np.ones_like(xn), xn, yn, xn * xn, yn * yn, xn * yn], axis=1)
    gx, gy = np.meshgrid(np.arange(w) / w - 0.5, np.arange(h) / h - 0.5)
    G = np.stack([np.ones_like(gx), gx, gy, gx * gx, gy * gy, gx * gy], axis=2)
    out = np.empty_like(img)
    for c in range(3):
        coef, *_ = np.linalg.lstsq(A, img[ys, xs, c], rcond=None)
        field = G @ coef
        out[..., c] = img[..., c] * (PAPER[c] / field)
    out = np.clip(out, 0, 255).astype(np.uint8)
    Image.fromarray(out).save(dst, optimize=True)
    res = out.astype(float)[mask]
    print(f'{dst}: backdrop {mask.mean() * 100:.0f}% of pixels; median after {np.median(res, axis=0)} (paper {PAPER}); spread {np.percentile(res, 95, axis=0) - np.percentile(res, 5, axis=0)}')


if __name__ == '__main__':
    main()
