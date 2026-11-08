#!/usr/bin/env python3
"""Sound for the Diwali Reel: the music bed ("Lakshmi", Epidemic Sound, fitted to 14.4 s) plus one effect per visible
action, each placed so its peak lands a frame after its picture. Writes assets/audio/sfx.wav and
assets/audio/master.wav (12.5 s, 48 kHz stereo, loudness-normalised to -14 LUFS, true peak -1.5 dBTP).
    python3 work/mix.py        (from the reel folder)
"""
import json
import subprocess

import numpy as np

SR = 48000
LEN = 12.5
LIB = '/Users/rohit/Desktop/rg/viral-shorts/assets/sfx-library/packs/200-sound-effects/200 Sound Effects /'
FX = {
    'swoosh': (LIB + 'clean-fast-swooshaiff-14784.mp3', 0.34),
    'click1': (LIB + 'rm click (1).wav', 0.05), 'click2': (LIB + 'rm click (2).wav', 0.04), 'click3': (LIB + 'rm click (3).wav', 0.12),
    'whoosh-fire': (LIB + 'WHOOSH FIRE TRANSITION.mp3', 2.72),
    'glass-hit': (LIB + 'mixkit-cinematic-glass-hit-suspense-677.wav', 0.07),
    'riser': (LIB + 'ES_Riser Suction 5 - SFX Producer.mp3', 2.77),
    'impact': (LIB + '05 Impact.wav', 0.33),
    'flame-1': ('assets/audio/sfx/flame-1.mp3', 0.03), 'flame-2': ('assets/audio/sfx/flame-2.mp3', 0.37), 'flame-3': ('assets/audio/sfx/flame-3.mp3', 0.03),
}
FRAME = 1 / 30
LAMPS = [3.155 + t for t in (0.0, 0.36, 0.71, 1.06, 1.43, 1.8, 2.15)]   # front to back, on the half-beats
# (sound, time its peak should land, gain dB, seconds to keep before the peak or None for all, max seconds, fade-out seconds)
EVENTS = [
    ('swoosh', 0.05, -16, 0.05, 0.6, 0.2),                               # the camera lands at frame 0
    ('click2', 0.10, -26, None, 0.2, 0.05), ('click1', 0.20, -27, None, 0.2, 0.05),
    ('click3', 0.30, -27, None, 0.2, 0.05), ('click2', 0.40, -28, None, 0.2, 0.05),   # caption types on
    ('whoosh-fire', 3.12, -12, 1.1, 1.6, 0.25),                          # the dive into the flame, peaking on the cut
    ('glass-hit', 3.155 + FRAME, -17, None, 1.6, 0.7),                   # through the flash, onto the glass row
] + [
    (('flame-3', 'flame-1', 'flame-2')[i % 3], t + 0.02 + FRAME, -11 - i + (9 if i % 3 == 2 else 0), None, 0.7, 0.15)
    for i, t in enumerate(LAMPS)                                         # each lamp catches, front ones nearer
] + [
    ('riser', 8.24, -14, 1.35, 1.5, 0.05),                              # into the sign-off
    ('impact', 8.265 + 0.12 + FRAME, -18, None, 2.6, 1.2),              # the name lands
]


def load(path):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-ac', '2', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.float32).reshape(-1, 2).astype(np.float64)


def main():
    n = int(LEN * SR)
    sfx = np.zeros((n, 2))
    for name, t_peak, gain, pre, max_len, fade in EVENTS:
        path, peak = FX[name]
        x = load(path)
        x = x / (np.abs(x).max() or 1)
        start_in = 0 if pre is None else max(0, int((peak - pre) * SR))
        x = x[start_in:]
        if pre is not None and start_in > 0:           # fade in what we kept of a long build
            k = min(len(x), int(0.15 * SR)); x[:k] *= np.linspace(0, 1, k)[:, None]
        x = x[: int(max_len * SR)]
        k = min(len(x), int(fade * SR))
        if k: x[-k:] *= np.linspace(1, 0, k)[:, None]
        at = int((t_peak - (peak - start_in / SR)) * SR)
        a0, b0 = max(0, at), min(n, at + len(x))
        if b0 > a0:
            sfx[a0:b0] += x[a0 - at: b0 - at] * 10 ** (gain / 20)
    music = load('assets/audio/music-lakshmi.wav')[:n]
    music = np.pad(music, ((0, max(0, n - len(music))), (0, 0)))
    f0, f1 = int(11.6 * SR), n
    music[f0:f1] *= np.linspace(1, 0, f1 - f0)[:, None] ** 1.5
    music *= 10 ** (-3 / 20)                                             # leave room for the hits
    write('assets/audio/sfx.wav', sfx)
    write('work/premix.wav', music + sfx)
    # Two-pass loudness normalisation to -14 LUFS / -1 dBTP.
    meas = subprocess.run(['ffmpeg', '-hide_banner', '-i', 'work/premix.wav', '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json', '-f', 'null', '-'],
                          capture_output=True, text=True).stderr
    m = json.loads(meas[meas.rindex('{'): meas.rindex('}') + 1])
    af = (f"loudnorm=I=-14:TP=-1.5:LRA=11:measured_I={m['input_i']}:measured_TP={m['input_tp']}:measured_LRA={m['input_lra']}"
          f":measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true,alimiter=limit=0.79:level=false")   # AAC adds overshoot: keep 2 dB headroom
    subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', 'work/premix.wav', '-af', af, '-ar', str(SR), '-t', str(LEN), 'assets/audio/master.wav'], check=True)
    print('premix measured', m['input_i'], 'LUFS, TP', m['input_tp'])


def write(path, x):
    pcm = np.clip(x, -1, 1).astype(np.float32).tobytes()
    subprocess.run(['ffmpeg', '-y', '-v', 'error', '-f', 'f32le', '-ar', str(SR), '-ac', '2', '-i', '-', '-c:a', 'pcm_s16le', path], input=pcm, check=True)


if __name__ == '__main__':
    main()
