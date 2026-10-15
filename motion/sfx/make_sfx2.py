# Набор звуков v2 (мягче и «дороже»): python3 sfx/make_sfx2.py -> public/sfx2/*.wav
import numpy as np, wave, os
SR = 48000
rng = np.random.default_rng(11)
OUT = os.path.join(os.path.dirname(__file__), "..", "public", "sfx2")
os.makedirs(OUT, exist_ok=True)

def t(d): return np.arange(int(SR * d)) / SR

def save(name, x, peak=0.7):
    x = np.asarray(x, float)
    if x.ndim == 1: x = np.stack([x, x], 1)
    x = np.tanh(x / (np.abs(x).max() + 1e-9) * 1.2) / np.tanh(1.2) * peak
    with wave.open(os.path.join(OUT, name + ".wav"), "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((x * 32767).astype(np.int16).tobytes())

def lp(x, fc):  # one-pole lowpass, fc may be array
    y = np.zeros_like(x); a = np.exp(-2 * np.pi * np.broadcast_to(fc, x.shape) / SR); s = 0.0
    for i in range(len(x)): s = (1 - a[i]) * x[i] + a[i] * s; y[i] = s
    return y

def hp(x, fc): return x - lp(x, fc)

def verb(x, dec=0.8, mix=0.25, seed=1):
    r = np.random.default_rng(seed); n = int(SR * dec)
    ir = r.standard_normal(n) * np.exp(-np.linspace(0, 7, n)); ir = lp(ir, 5000)
    L = np.convolve(x, ir)[:len(x)]; R = np.convolve(x, np.roll(ir, 113))[:len(x)]
    k = mix / (np.abs(ir).sum() / 30)
    return np.stack([x + L * k, x + R * k], 1)

def pad(x, d): return np.concatenate([x, np.zeros(int(SR * d))])

# whoosh: airy noise, band sweeping up then down, panning
d = 0.7; tt = t(d); n = len(tt)
env = np.sin(np.pi * np.clip(tt / d, 0, 1)) ** 2.5
fc = 400 + 4200 * np.sin(np.pi * tt / d) ** 2
w = hp(lp(rng.standard_normal(n), fc), 200) * env
pan = np.linspace(-0.7, 0.7, n)
save("whoosh", np.stack([w * (1 - pan), w * (1 + pan)], 1), 0.45)

# whip (fast swish)
d = 0.28; tt = t(d); n = len(tt)
w = hp(lp(rng.standard_normal(n), 2500 + 9000 * (tt / d)), 900) * np.sin(np.pi * tt / d) ** 3
save("whip", w, 0.45)

# text pop: bubbly blip with pitch drop + soft click + room
d = 0.35; tt = t(d)
f = 900 * np.exp(-tt * 18) + 420
b = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 16)
b += lp(rng.standard_normal(len(tt)), 3000) * np.exp(-tt * 120) * 0.4
save("pop", verb(pad(b, 0.3), 0.5, 0.18), 0.55)

# deep impact: sub drop + punchy body + noise tail + reverb
d = 1.6; tt = t(d)
sub = np.sin(2 * np.pi * np.cumsum(55 * np.exp(-tt * 2.5) + 38) / SR) * np.exp(-tt * 2.6)
kick = np.sin(2 * np.pi * np.cumsum(160 * np.exp(-tt * 30) + 50) / SR) * np.exp(-tt * 12)
nz = lp(rng.standard_normal(len(tt)), 1800 * np.exp(-tt * 3) + 200) * np.exp(-tt * 6)
save("impact", verb(sub * 1.0 + kick * 0.8 + nz * 0.5, 1.2, 0.35, 3), 0.9)

# soft hit (smaller)
d = 0.7; tt = t(d)
k = np.sin(2 * np.pi * np.cumsum(140 * np.exp(-tt * 25) + 60) / SR) * np.exp(-tt * 9)
save("hit", verb(k + lp(rng.standard_normal(len(tt)), 2500) * np.exp(-tt * 50) * 0.3, 0.6, 0.2, 4), 0.7)

# shimmer / sparkle (for shine sweeps)
d = 1.4; tt = t(d); s = np.zeros(len(tt))
for i in range(14):
    st = rng.uniform(0, 0.5); fr = rng.choice([2093, 2637, 3136, 3520, 4186]) * rng.uniform(0.99, 1.01)
    m = tt >= st; s[m] += np.sin(2 * np.pi * fr * (tt[m] - st)) * np.exp(-(tt[m] - st) * 7) * rng.uniform(0.3, 1)
save("shimmer", verb(s, 0.9, 0.4, 5), 0.35)

# tick (counters): glassy
d = 0.05; tt = t(d)
save("tick", np.sin(2 * np.pi * 3100 * tt) * np.exp(-tt * 140) + np.sin(2 * np.pi * 1550 * tt) * np.exp(-tt * 90) * 0.5, 0.22)

# packet blip (ping travel)
d = 0.16; tt = t(d)
save("blip", verb(pad(np.sin(2 * np.pi * 1760 * tt) * np.exp(-tt * 30), 0.2), 0.4, 0.2, 6), 0.35)
save("blip_low", verb(pad(np.sin(2 * np.pi * 880 * tt) * np.exp(-tt * 25), 0.2), 0.4, 0.2, 7), 0.35)

# error buzz (ping goes red)
d = 0.45; tt = t(d)
sq = np.sign(np.sin(2 * np.pi * 110 * tt)) + np.sign(np.sin(2 * np.pi * 116.5 * tt))
save("error", lp(sq, 1800) * (np.sin(2 * np.pi * 6 * tt) > -0.2) * np.exp(-tt * 3), 0.35)

# lag: stuttering chopped buffer + pitch-down
d = 1.0; tt = t(d)
src = np.sin(2 * np.pi * np.cumsum(420 * np.exp(-tt * 1.5) + 60) / SR) + lp(rng.standard_normal(len(tt)), 2500) * 0.5
out = np.zeros_like(src); i = 0; seg = int(SR * 0.045)
while i < len(src):
    L = int(seg * rng.uniform(0.6, 1.8)); rep = rng.integers(1, 4); chunk = src[i:i + L]
    for r in range(rep):
        j = i + r * len(chunk)
        if j >= len(src): break
        k = min(len(chunk), len(src) - j); out[j:j + k] = chunk[:k] * (0.9 ** r)
    i += L * rep
save("lag", np.round(out * 5) / 5 * np.exp(-tt * 1.2), 0.4)

# glitch burst
d = 0.35; tt = t(d); g = np.zeros(len(tt)); i = 0
while i < len(tt):
    L = int(rng.integers(200, 1600)); seg_ = np.arange(min(L, len(tt) - i)); kind = rng.integers(0, 3)
    g[i:i + len(seg_)] = (np.sign(np.sin(2 * np.pi * rng.integers(150, 1200) * seg_ / SR)) if kind == 0 else rng.standard_normal(len(seg_)) if kind == 1 else 0) * rng.uniform(0.3, 1)
    i += L
save("glitch", np.round(g * 5) / 5, 0.3)

# riser
d = 1.2; tt = t(d)
r = np.sin(2 * np.pi * np.cumsum(180 * 6 ** (tt / d)) / SR) * 0.3 + hp(lp(rng.standard_normal(len(tt)), 500 + 7000 * (tt / d) ** 2), 300)
save("riser", r * (tt / d) ** 2.2, 0.4)

# mouse click
d = 0.05; tt = t(d)
save("click", lp(rng.standard_normal(len(tt)), 6000) * np.exp(-tt * 400) + np.sin(2 * np.pi * 2600 * tt) * np.exp(-tt * 250) * 0.6, 0.55)

# ding (subscribe / goal) — two bells
d = 1.4; tt = t(d)
dd = sum(a * np.sin(2 * np.pi * fr * tt) * np.exp(-tt * k) for fr, a, k in [(1046.5, 1, 3.5), (2093, 0.35, 6), (1568, 0.5, 4), (3136, 0.15, 9)])
dd2 = np.concatenate([np.zeros(int(SR * 0.09)), dd])[:len(dd)]
save("ding", verb(dd * 0.7 + dd2 * 0.5 * (1.0), 1.0, 0.3, 8), 0.45)

# like pop (heart-ish)
d = 0.4; tt = t(d)
f = 500 + 700 * (1 - np.exp(-tt * 30))
save("likepop", verb(np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 12), 0.5, 0.2, 9), 0.5)

# ambient bed: dark pad with slow movement (8 s loop)
d = 8.0; tt = t(d)
pad_ = sum(np.sin(2 * np.pi * fr * tt + rng.uniform(0, 6)) * a for fr, a in [(55, 0.6), (82.4, 0.35), (110, 0.25), (164.8, 0.12)])
pad_ *= 0.75 + 0.25 * np.sin(2 * np.pi * tt / 8)
pad_ += lp(rng.standard_normal(len(tt)), 400) * 0.25
fade = np.minimum(1, np.minimum(tt / 0.3, (d - tt) / 0.3))
save("bed", verb(pad_ * fade, 1.5, 0.3, 10), 0.3)
print(sorted(os.listdir(OUT)))
