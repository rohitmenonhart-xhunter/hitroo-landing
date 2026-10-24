"""Turn the cut grids and the single images into public/photos/library/** WebP files and lib/creatives-library.ts.
Run from anywhere; paths are absolute."""
import hashlib, json, os, subprocess, sys
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import spec  # noqa: E402

REPO = '/Users/rohit/Desktop/Hitroo_internal_Apps/hitroo/hitroo_landing'
OUT = f'{REPO}/public/photos/library'
SINGLES = os.path.join(HERE, '..', 'photos-v4')
manifest = json.load(open(os.path.join(HERE, 'manifest.json')))

SHORT = dict(vox='Explainer', faceless='Faceless', ads='Ad', characters='Character', trends='Trend', animation='Stop-motion', podcast='Podcast', local='Local business', campaign='Campaign')

# The single, higher-resolution images go first in their style (the page's hero fan and winner use them).
SINGLE = {
    'vox': [('r-vox', 'A paper collage of a 1950s city street with a red marker circle around a tower', 'How cities got their skyline')],
    'faceless': [('r-faceless-cook', 'Hands tossing pasta with basil and tomatoes in a pan', 'Five-minute pasta, no recipe'),
                 ('r-faceless-desk', 'Hands writing in a notebook beside a matcha latte', 'Study with me, 25 minutes')],
    'ads': [('r-ad-perfume', 'A glass perfume bottle in a splash of hot-pink liquid', 'Bloom, bottled'),
            ('r-ad-soda', 'A can bursting through sparkling water with lemon and lime slices on yellow', 'Sparkling, squeezed, cold')],
    'characters': [('r-grandma', 'A grandmother laughing while kneading bread', 'Nonna’s Sunday bread'),
                   ('r-skater', 'A skateboarder mid-ollie in a lime hoodie against a pink wall', 'Day 37 of learning the ollie'),
                   ('r-fitness', 'A coach mid box-jump in a teal gym', 'Leg day, no excuses')],
    'trends': [('r-grwm', 'A mirror selfie in a peach bedroom, the phone hiding the face', 'Get ready with me: brunch'),
               ('r-unbox', 'Hands lifting white sneakers out of a lilac shoebox', 'Unboxing the new drop')],
    'animation': [('r-clay', 'A clay chef flipping a pancake in a miniature kitchen', 'Pancake Friday')],
    'podcast': [('r-podcast', 'Two podcast hosts laughing at a table with microphones', 'The story we never told')],
}
CAMPAIGN = [  # the approved campaign set, already in public/
    ('/photos/reels/studio.webp', 'A creator in an ember boiler suit framing a shot on a phone', 'Behind the shoot'),
    ('/photos/reels/drop.webp', 'Hands lifting a ceramic bottle out of ember tissue paper', 'Unboxing day'),
    ('/photos/divisions/creatives-prism.webp', 'A woman holding a glass prism that throws a rainbow across her face', 'Light, refracted'),
    ('/photos/reels/sneaker.webp', 'An ember sneaker splashing into a puddle', 'Every step, louder'),
    ('/photos/reels/rooftop.webp', 'Friends on a rooftop at dusk, one spinning while the other films', 'Friday feeling'),
    ('/photos/reels/noodles.webp', 'Chopsticks lifting noodles out of an ember bowl of chilli broth', 'Chilli oil, extra'),
    ('/photos/reels/maker.webp', 'A ceramicist talking to a phone camera in her workshop', 'Meet the maker'),
    ('/photos/reels/florist.webp', 'Hands wrapping ember poppies in kraft paper', 'Poppies, wrapped to go'),
    ('/photos/reels/coffee.webp', 'A barista pouring latte art into an ember cup', 'Latte art, slowed down'),
    ('/photos/divisions/creatives-leap.webp', 'A man in an ember suit leaping across a blue sky', 'Jump into the weekend'),
    ('/photos/divisions/creatives-market.webp', 'A creator filming herself walking through a market', 'Market run with me'),
]
POST_SINGLES = [('p-illustration', 'Illustration', 'ember', 'An illustration of a woman watering plants on a sunny balcony'),
                ('p-flatlay', 'Flat lay', 'yellow', 'Unlabelled skincare jars on terracotta tiles with dried oranges'),
                ('p-3d', '3D', 'lilac', 'A 3D pastel bakery shopfront with a giant croissant'),
                ('p-beforeafter', 'Before & after', 'teal', 'A messy desk and the same desk tidy, side by side')]


def tone(path):
    """The picture's average colour, shown while it loads."""
    r, g, b = Image.open(path).convert('RGB').resize((1, 1), Image.BOX).getpixel((0, 0))
    return f'#{r:02x}{g:02x}{b:02x}'


def fp(dst):
    """The file's URL with a content fingerprint, so the static file can be cached for a year."""
    return dst.replace(REPO + '/public', '') + '?v=' + hashlib.sha1(open(dst, 'rb').read()).hexdigest()[:8]


def webp(src, dst, size, q=72):
    os.makedirs(os.path.dirname(dst), exist_ok=True)
    im = Image.open(src).convert('RGB')
    w, h = size
    # cover-crop to the target aspect, then resize
    r = max(w / im.width, h / im.height)
    im = im.resize((round(im.width * r), round(im.height * r)), Image.LANCZOS)
    x, y = (im.width - w) // 2, (im.height - h) // 2
    tmp = dst + '.png'
    im.crop((x, y, x + w, y + h)).save(tmp)
    subprocess.run(['cwebp', '-quiet', '-q', str(q), '-m', '6', '-sharp_yuv', tmp, '-o', dst], check=True)
    os.remove(tmp)


def esc(s):
    return s.replace('\\', '\\\\').replace("'", "\\'")


# Styles the owner cut on 2026-10-24 ("not too wide"): kept in spec.py, left out of the page.
SKIP = {'podcast', 'local'}
INCLUDE_CAMPAIGN = False

styles = []
for st in spec.STYLES:
    if st['key'] in SKIP:
        continue
    reels = []
    for i, (name, alt, cap) in enumerate(SINGLE.get(st['key'], [])):
        src = os.path.join(SINGLES, 'edited', f'{name}.png')
        src = src if os.path.exists(src) else os.path.join(SINGLES, f'{name}.png')
        if os.path.exists(src):
            dst = f"{OUT}/{st['key']}/s{i + 1}.webp"
            webp(src, dst, (600, 1067))
            reels.append(dict(src=fp(dst), alt=alt, caption=cap, tone=tone(src)))
    n = 0
    for g in range(6):
        grid = f"{st['key']}-{g + 1}"
        for k, item in enumerate(manifest[grid]['items']):
            cut = os.path.join(HERE, 'cut', f'{grid}-{k + 1}.png')
            if not os.path.exists(cut):
                continue
            n += 1
            dst = f"{OUT}/{st['key']}/{n:02d}.webp"
            webp(cut, dst, (450, 800))
            subject = item['subject'][0].upper() + item['subject'][1:]
            reels.append(dict(src=fp(dst), alt=subject, caption=item['caption'], tone=tone(cut)))
    styles.append(dict(key=st['key'], name=st['name'], short=SHORT[st['key']], tint=st['tint'], reels=reels))
campaign = []
for i, (s, a, c) in enumerate(CAMPAIGN if INCLUDE_CAMPAIGN else []):
    dst = f'{OUT}/campaign/{i + 1:02d}.webp'
    webp(REPO + '/public' + s, dst, (600, 1067))
    campaign.append(dict(src=fp(dst), alt=a, caption=c, tone=tone(REPO + '/public' + s)))
if campaign:
    styles.append(dict(key='campaign', name='Campaigns', short='Campaign', tint='cobalt', reels=campaign))

posts = []
for name, fmt, tint, alt in POST_SINGLES:
    src = os.path.join(SINGLES, f'{name}.png')
    if os.path.exists(src):
        dst = f'{OUT}/posts/{name}.webp'
        webp(src, dst, (600, 600))
        posts.append(dict(src=fp(dst), alt=alt, format=fmt, tint=tint, tone=tone(src)))
for grid, m in manifest.items():
    if m['kind'] != 'post':
        continue
    for k, item in enumerate(m['items']):
        cut = os.path.join(HERE, 'cut', f'{grid}-{k + 1}.png')
        if not os.path.exists(cut):
            continue
        dst = f'{OUT}/posts/{grid}-{k + 1}.webp'
        webp(cut, dst, (480, 480))
        posts.append(dict(src=fp(dst), alt=f"{m['format']}: {item['subject']}", format=m['format'], tint=m['tint'], tone=tone(cut)))
# Interleave the post formats so the strip mixes them.
by = {}
for p in posts:
    by.setdefault(p['format'], []).append(p)
mixed = []
while any(by.values()):
    for f in list(by):
        if by[f]:
            mixed.append(by[f].pop(0))

lines = ["/* Generated by the image pipeline (see docs/art/photos-briefs.md): every reel and post on the Creatives page, with captions. */",
         "import type { CreativeTint, Post } from './division-pages';", "",
         "export interface LibraryReel {", "  src: string;", "  alt: string;", "  caption: string;", "  /** Average colour, shown while the picture loads. */", "  tone: string;", "}", "",
         "export interface ReelStyle {", "  key: string;", "  name: string;", "  /** The chip on each reel. */", "  short: string;",
         "  tint: CreativeTint;", "  reels: LibraryReel[];", "}", "",
         "export const REEL_STYLES: ReelStyle[] = ["]
for s in styles:
    lines.append(f"  {{ key: '{s['key']}', name: '{esc(s['name'])}', short: '{esc(s['short'])}', tint: '{s['tint']}', reels: [")
    for r in s['reels']:
        lines.append(f"    {{ src: '{r['src']}', alt: '{esc(r['alt'])}', caption: '{esc(r['caption'])}', tone: '{r['tone']}' }},")
    lines.append("  ] },")
lines += ["];", "", "export const LIBRARY_POSTS: Post[] = ["]
for p in mixed:
    lines.append(f"  {{ src: '{p['src']}', alt: '{esc(p['alt'])}', format: '{esc(p['format'])}', tint: '{p['tint']}', tone: '{p['tone']}' }},")
lines += ["];", ""]
open(f'{REPO}/lib/creatives-library.ts', 'w').write('\n'.join(lines))
print({s['key']: len(s['reels']) for s in styles}, 'posts', len(mixed))
