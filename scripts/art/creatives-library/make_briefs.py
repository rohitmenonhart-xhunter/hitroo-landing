"""Write one brief per 2x2 grid into briefs/<name>.txt and a manifest (manifest.json) of what each panel is."""
import json, os, spec
os.makedirs('briefs', exist_ok=True)
manifest = {}
POS = ['Top-left', 'Top-right', 'Bottom-left', 'Bottom-right']
def grid(name, line, subjects, w, h, shape):
    panels = ' '.join(f"{POS[i]}: {s}." for i, s in enumerate(subjects))
    brief = (f"{line} Make one image of {w}x{h} pixels containing exactly four separate {shape} pictures arranged in a 2x2 grid, "
             f"separated by straight pure white (#FFFFFF) gutters 24 pixels wide, with a 24-pixel pure white border around the outside; "
             f"every panel is a complete, independent picture that fills its cell edge to edge. {panels} {spec.TAIL}")
    open(f'briefs/{name}.txt', 'w').write(brief)
for st in spec.STYLES:
    for g in range(6):
        items = st['items'][g*4:(g+1)*4]
        name = f"{st['key']}-{g+1}"
        grid(name, st['line'], [s for s, _ in items], 1024, 1536, 'vertical portrait')
        manifest[name] = dict(kind='reel', style=st['key'], items=[dict(subject=s, caption=c) for s, c in items])
for fmt, tint, look, subjects in spec.POSTS['groups']:
    key = fmt.lower().replace(' & ', '-').replace(' ', '-')
    for g in range(2):
        items = subjects[g*4:(g+1)*4]
        name = f"post-{key}-{g+1}"
        grid(name, spec.POSTS['line'] + f" Style: {look}.", items, 1024, 1024, 'square')
        manifest[name] = dict(kind='post', format=fmt, tint=tint, items=[dict(subject=s) for s in items])
json.dump(manifest, open('manifest.json', 'w'), indent=1)
print(len(manifest), 'grids')
