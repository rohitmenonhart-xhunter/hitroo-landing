"""Cut each 2x2 grid in raw/ into its four pictures (cut/<grid>-<n>.png), finding the white gutters.
usage: python3 cut.py [grid ...]   (default: every raw/*.png not yet cut)"""
import glob, os, sys
import numpy as np
from PIL import Image

os.makedirs('cut', exist_ok=True)


def white_runs(frac, thresh=0.93):
    """Runs (start, end) of rows/columns that are almost entirely white."""
    runs, start = [], None
    for i, f in enumerate(frac):
        if f >= thresh and start is None:
            start = i
        elif f < thresh and start is not None:
            runs.append((start, i)); start = None
    if start is not None:
        runs.append((start, len(frac)))
    return runs


def split(axis_frac, size):
    """Inner content bounds: [(a0, a1), (b0, b1)] for the two halves along one axis."""
    runs = white_runs(axis_frac)
    mid = size / 2
    inner = [r for r in runs if r[0] > size * 0.25 and r[1] < size * 0.75]
    if inner:
        g = min(inner, key=lambda r: abs((r[0] + r[1]) / 2 - mid))
    else:  # no clean gutter: cut at the middle
        g = (int(mid) - 12, int(mid) + 12)
    lead = next((r[1] for r in runs if r[0] == 0), 0)
    trail = next((r[0] for r in runs if r[1] == size), size)
    return [(lead, g[0]), (g[1], trail)]


def cut(path):
    name = os.path.basename(path)[:-4]
    im = Image.open(path).convert('RGB')
    a = np.asarray(im, dtype=np.int16)
    white = (a.min(axis=2) > 236)
    cols, rows = split(white.mean(axis=0), a.shape[1]), split(white.mean(axis=1), a.shape[0])
    n = 0
    for (y0, y1) in rows:
        for (x0, x1) in cols:
            n += 1
            # Trim a couple of pixels so no white edge survives.
            box = (x0 + 3, y0 + 3, x1 - 3, y1 - 3)
            im.crop(box).save(f'cut/{name}-{n}.png')
    return name, [(x1 - x0, y1 - y0) for (y0, y1) in rows for (x0, x1) in cols]


targets = sys.argv[1:] or [p for p in sorted(glob.glob('raw/*.png')) if not os.path.exists(f"cut/{os.path.basename(p)[:-4]}-4.png")]
for t in targets:
    p = t if t.endswith('.png') else f'raw/{t}.png'
    print(*cut(p))
