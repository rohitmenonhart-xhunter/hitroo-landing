"""The edit pass that takes a raw image generation to the HITROO look (see docs/art/photos-briefs.md).

Photos:   python3 scripts/art/edit-photo.py photo|colour <in.png> <out.png> [--crop 0.05] [--shift x,y]
Drawings: python3 scripts/art/edit-photo.py drawing <in.png> <out.png> [--disc x,y,r] [--square x,y,s] [--rect x0,y0,x1,y1 ...]

Photo: crop a little tighter (models centre everything), soften the over-crisp detail, mute every colour
except ember, map blacks to char #12110B and whites to paper #FCF8F6, add clumped monochrome film grain
and a faint vignette.
Drawing: grey to a char-on-paper duotone, then flat ember shapes laid on with multiply (positions as
fractions of width/height), then light grain.
"""
import argparse
import numpy as np
from PIL import Image, ImageFilter

CHAR = np.array([0x12, 0x11, 0x0B], dtype=np.float32)
PAPER = np.array([0xFC, 0xF8, 0xF6], dtype=np.float32)
EMBER = np.array([0xF5, 0x50, 0x2F], dtype=np.float32)
rng = np.random.default_rng(7)


def crop(im, amount, shift):
    w, h = im.size
    cw, ch = int(w * (1 - amount)), int(h * (1 - amount))
    sx, sy = shift
    x = int((w - cw) * (0.5 + sx / 2))
    y = int((h - ch) * (0.5 + sy / 2))
    return im.crop((x, y, x + cw, y + ch)).resize((w, h), Image.LANCZOS)


def grain(a, strength):
    h, w = a.shape[:2]
    n = rng.normal(0, 1, (h, w)).astype(np.float32)
    n = np.asarray(Image.fromarray(((n * 32) + 128).clip(0, 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.7)), dtype=np.float32) - 128
    # Grain shows most in the midtones, as on film.
    lum = a.mean(axis=2, keepdims=True) / 255
    weight = 1 - np.abs(lum - 0.5) * 1.2
    return a + n[..., None] * strength * weight


def vignette(a, amount):
    h, w = a.shape[:2]
    y, x = np.mgrid[0:h, 0:w].astype(np.float32)
    d = np.sqrt(((x - w / 2) / (w / 2)) ** 2 + ((y - h / 2) / (h / 2)) ** 2) / np.sqrt(2)
    return a * (1 - amount * d[..., None] ** 2)


def photo(im, args):
    im = crop(im, args.crop, args.shift).filter(ImageFilter.GaussianBlur(0.45))
    hsv = np.asarray(im.convert('HSV'), dtype=np.float32)
    hue = hsv[..., 0] * 360 / 255
    ember = ((hue < 28) | (hue > 345)) & (hsv[..., 1] > 90)
    hsv[..., 1] = np.where(ember, hsv[..., 1], hsv[..., 1] * 0.35)
    a = np.asarray(Image.fromarray(hsv.clip(0, 255).astype(np.uint8), 'HSV').convert('RGB'), dtype=np.float32)
    a = CHAR + (PAPER - CHAR) * (a / 255)
    a = vignette(a, 0.10)
    a = grain(a, 0.10)
    return Image.fromarray(a.clip(0, 255).astype(np.uint8))


def colour(im, args):
    """Campaign photos keep their colour: crop, a touch of softness, warm highlights, film grain."""
    im = crop(im, args.crop, args.shift).filter(ImageFilter.GaussianBlur(0.35))
    a = np.asarray(im, dtype=np.float32)
    a = a * np.array([1.015, 1.0, 0.975], np.float32)  # a little warmer
    a = 8 + a * (247 / 255)  # lift the blacks, ease the whites, like film
    a = vignette(a, 0.08)
    a = grain(a, 0.09)
    return Image.fromarray(a.clip(0, 255).astype(np.uint8))


def drawing(im, args):
    g = np.asarray(im.convert('L'), dtype=np.float32) / 255
    g = np.clip((g - 0.04) / 0.9, 0, 1)  # paper to pure paper, ink to char
    a = CHAR + (PAPER - CHAR) * g[..., None]
    h, w = g.shape
    y, x = np.mgrid[0:h, 0:w].astype(np.float32)
    mask = np.zeros((h, w), dtype=np.float32)
    for d in args.disc or []:
        cx, cy, r = (float(v) for v in d.split(','))
        mask = np.maximum(mask, (((x - cx * w) ** 2 + (y - cy * h) ** 2) <= (r * w) ** 2).astype(np.float32))
    for rc in args.rect or []:
        x0, y0, x1, y1 = (float(v) for v in rc.split(','))
        mask = np.maximum(mask, ((x >= x0 * w) & (x <= x1 * w) & (y >= y0 * h) & (y <= y1 * h)).astype(np.float32))
    for s in args.square or []:
        sx, sy, size = (float(v) for v in s.split(','))
        half = size * w / 2
        mask = np.maximum(mask, ((np.abs(x - sx * w) <= half) & (np.abs(y - sy * h) <= half)).astype(np.float32))
    mask = np.asarray(Image.fromarray((mask * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.8)), dtype=np.float32)[..., None] / 255
    a = a * (1 - mask) + (a * EMBER / 255) * mask  # multiply: the ink shows through the ember
    a = grain(a, 0.05)
    return Image.fromarray(a.clip(0, 255).astype(np.uint8))


p = argparse.ArgumentParser()
p.add_argument('kind', choices=['photo', 'colour', 'drawing'])
p.add_argument('src')
p.add_argument('out')
p.add_argument('--crop', type=float, default=0.05)
p.add_argument('--shift', type=lambda s: tuple(float(v) for v in s.split(',')), default=(0.0, 0.0))
p.add_argument('--disc', action='append')
p.add_argument('--square', action='append')
p.add_argument('--rect', action='append')
args = p.parse_args()
src = Image.open(args.src).convert('RGB')
{'photo': photo, 'colour': colour, 'drawing': drawing}[args.kind](src, args).save(args.out)
print(args.out)
