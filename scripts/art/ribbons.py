"""Twisted ribbons of fine dotted strands, ember on paper: the Automation division's imagery.
Each ribbon is a band of evenly spaced parallel lines following a curve; the band twists along its length,
so the lines bunch together (dark) where it turns edge-on and spread apart (light) where it faces you.
Generative code, not an image model.

usage: python3 ribbon.py <variant> <out.png> [--w 3072 --h 2048]
variants: hero (two crossing ribbons), arc (one sweeping ribbon), wide (a long horizontal band), tall (portrait)
"""
import argparse
import numpy as np
from PIL import Image, ImageFilter

PAPER = np.array([0xFC, 0xF8, 0xF6], np.float32) / 255
EMBER = np.array([0xF5, 0x50, 0x2F], np.float32) / 255
DEEP = np.array([0xA8, 0x28, 0x14], np.float32) / 255

p = argparse.ArgumentParser()
p.add_argument('variant', choices=['hero', 'arc', 'wide', 'tall'])
p.add_argument('out')
p.add_argument('--w', type=int, default=3072)
p.add_argument('--h', type=int, default=2048)
a = p.parse_args()
W, H = a.w, a.h
S = W / 1536  # scale relative to the design size
rng = np.random.default_rng(11)


def bezier(pts, t):
    """Cubic Bezier through four control points (in 0..1 frame units), at parameter t."""
    p0, p1, p2, p3 = (np.array(q, np.float32) for q in pts)
    t = t[:, None]
    return (1 - t) ** 3 * p0 + 3 * (1 - t) ** 2 * t * p1 + 3 * (1 - t) * t ** 2 * p2 + t ** 3 * p3


# Each ribbon: control points, half-width (frame units), number of strands, turns of twist, twist phase.
RIBBONS = {
    'hero': [
        ([(-0.10, 0.95), (0.25, 0.20), (0.55, 1.10), (1.10, 0.30)], 0.20, 150, 1.15, 0.2),
        ([(-0.05, 0.25), (0.35, 0.75), (0.70, -0.05), (1.10, 0.70)], 0.14, 110, 0.85, 1.4),
    ],
    'arc': [([(-0.08, 1.05), (0.15, 0.10), (0.85, 0.05), (1.08, 0.85)], 0.19, 160, 1.3, 0.5)],
    'wide': [([(-0.05, 0.62), (0.30, 0.20), (0.70, 0.95), (1.05, 0.40)], 0.22, 170, 1.6, 0.0)],
    'tall': [([(0.15, 1.05), (1.05, 0.70), (-0.10, 0.35), (0.80, -0.05)], 0.24, 160, 1.4, 0.8)],
}

acc = np.zeros((H, W), np.float32)
for ctrl, half, count, turns, phase in RIBBONS[a.variant]:
    t = np.linspace(0, 1, int(1400 * S))
    c = bezier(ctrl, t) * np.array([W, H], np.float32)
    tangent = np.gradient(c, axis=0)
    tangent /= np.linalg.norm(tangent, axis=1, keepdims=True) + 1e-9
    normal = np.stack([-tangent[:, 1], tangent[:, 0]], axis=1)
    twist = phase + turns * np.pi * t
    taper = np.sin(np.pi * np.clip(t * 1.05, 0, 1)) ** 0.35  # ends narrow a little
    width = half * min(W, H) * np.cos(twist) * taper
    lift = half * min(W, H) * 0.18 * np.sin(twist) * taper  # the far edge rises a touch: depth
    fade = np.clip(np.minimum(t, 1 - t) * 7, 0, 1)
    edge = 1 - taper * 0.85 + 0.15
    for j, u in enumerate(np.linspace(-1, 1, count)):
        wander = rng.normal(0, 1) * 6 * S * edge * np.sin(t * rng.uniform(3, 9) + rng.uniform(0, 6))
        pts = c + normal * (width * u + wander)[:, None] + np.array([0, -1.0]) * (lift * u)[:, None]
        # A dot every ~3.2 px along the strand (resampled by arc length), each strand slightly offset.
        seg = np.linalg.norm(np.diff(pts, axis=0), axis=1)
        s = np.concatenate([[0], np.cumsum(seg)])
        stops = np.arange(rng.uniform(0, 3.2 * S), s[-1], 3.2 * S)
        px = np.interp(stops, s, pts[:, 0]).astype(int)
        py = np.interp(stops, s, pts[:, 1]).astype(int)
        f = np.interp(stops, s, fade)
        ok = (px >= 0) & (px < W) & (py >= 0) & (py < H)
        np.add.at(acc, (py[ok], px[ok]), f[ok])

# Blur with headroom (one dot = 40 of 255, so overlaps don't clip), then scale so a 2x render matches 1x.
K = 40
d = np.asarray(Image.fromarray(np.clip(acc * K, 0, 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.55 * S)), np.float32) / K
d = np.clip(d * S * S * 2.7, 0, 1)
tone = np.clip((d - 0.55) / 0.45, 0, 1)[..., None]  # where strands pile up, the ink deepens
ink = EMBER * (1 - tone) + DEEP * tone
out = PAPER * (1 - d[..., None]) + ink * d[..., None]
# Grain only in the ink, so the empty paper stays clean (and compresses well).
out = np.clip(out + rng.normal(0, 0.03, (H, W, 1)).astype(np.float32) * d[..., None], 0, 1)
Image.fromarray((out * 255).astype(np.uint8)).save(a.out)
print(a.out, W, H)
