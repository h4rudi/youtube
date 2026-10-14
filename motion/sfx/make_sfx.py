# Синтез звуковых эффектов для интро (без внешних библиотек звука): python3 sfx/make_sfx.py
import numpy as np, wave, os
SR = 48000
rng = np.random.default_rng(7)
OUT = os.path.join(os.path.dirname(__file__), "..", "public", "sfx")

def save(name, x, peak=0.7):
    x = np.asarray(x, dtype=float)
    if x.ndim == 1: x = np.stack([x, x], 1)
    x = x / (np.abs(x).max() + 1e-9) * peak
    with wave.open(os.path.join(OUT, name + ".wav"), "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((x * 32767).astype(np.int16).tobytes())

def t(d): return np.arange(int(SR * d)) / SR

def bandpass_sweep(noise, f0, f1, q=3.0):
    # time-varying band-pass via short FFT blocks
    n = len(noise); out = np.zeros(n); blk = 1024; hop = 512; win = np.hanning(blk)
    for i in range(0, n - blk, hop):
        c = f0 * (f1 / f0) ** (i / n)
        spec = np.fft.rfft(noise[i:i+blk] * win)
        fr = np.fft.rfftfreq(blk, 1 / SR)
        g = np.exp(-0.5 * ((np.log(fr + 1) - np.log(c)) * q) ** 2)
        out[i:i+blk] += np.fft.irfft(spec * g) * win
    return out

def env(n, a, d):  # attack/decay in seconds, smooth
    x = np.ones(n); A = int(a * SR); D = int(d * SR)
    if A: x[:A] = np.linspace(0, 1, A) ** 2
    if D: x[-D:] *= np.linspace(1, 0, D) ** 2
    return x

def reverb(x, dec=0.35, mix=0.25):
    ir = rng.standard_normal(int(SR * dec)) * np.exp(-np.linspace(0, 6, int(SR * dec)))
    return x + np.convolve(x, ir)[:len(x)] * mix / np.abs(ir).sum() * 20

# whoosh: noise sweep up then down
d = 0.55; n = len(t(d))
w = bandpass_sweep(rng.standard_normal(n), 300, 3500, 2.5) * np.sin(np.linspace(0, np.pi, n)) ** 2
pan = np.linspace(-0.6, 0.6, n)
save("whoosh", np.stack([w * (1 - pan) , w * (1 + pan)], 1), 0.5)

# fast whoosh (short)
d = 0.3; n = len(t(d))
w = bandpass_sweep(rng.standard_normal(n), 800, 6000, 2.0) * np.sin(np.linspace(0, np.pi, n)) ** 3
save("swish", w, 0.45)

# impact: pitch-dropping sub + transient + noise tail
d = 1.2; tt = t(d)
f = 70 * np.exp(-tt * 3) + 32
sub = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 3.2)
trans = rng.standard_normal(len(tt)) * np.exp(-tt * 45)
body = bandpass_sweep(rng.standard_normal(len(tt)), 1200, 200, 2) * np.exp(-tt * 7)
save("impact", reverb(sub * 1.0 + trans * 0.5 + body * 0.6, 0.6, 0.3), 0.9)

# soft impact (smaller hits)
d = 0.6; tt = t(d)
sub = np.sin(2 * np.pi * np.cumsum(90 * np.exp(-tt * 6) + 45) / SR) * np.exp(-tt * 7)
save("hit", sub + rng.standard_normal(len(tt)) * np.exp(-tt * 60) * 0.4, 0.7)

# glitch: chopped square/noise bursts, bitcrushed
d = 0.45; n = len(t(d)); g = np.zeros(n); i = 0
while i < n:
    L = int(rng.integers(300, 2500)); kind = rng.integers(0, 3); seg = np.arange(min(L, n - i))
    if kind == 0: s = np.sign(np.sin(2 * np.pi * rng.integers(80, 900) * seg / SR))
    elif kind == 1: s = rng.standard_normal(len(seg))
    else: s = np.zeros(len(seg))
    g[i:i+len(seg)] = s * rng.uniform(0.3, 1); i += L
g = np.round(g * 6) / 6
save("glitch", g * env(n, 0.002, 0.05), 0.35)

# riser: rising tone + noise
d = 1.4; tt = t(d)
f = 200 * (8 ** (tt / d))
r = np.sin(2 * np.pi * np.cumsum(f) / SR) * 0.4 + bandpass_sweep(rng.standard_normal(len(tt)), 400, 7000, 2) * 0.8
save("riser", r * (tt / d) ** 2, 0.45)

# mouse click
d = 0.06; tt = t(d)
c = rng.standard_normal(len(tt)) * np.exp(-tt * 300) + np.sin(2 * np.pi * 3200 * tt) * np.exp(-tt * 200)
save("click", c, 0.5)

# UI pop
d = 0.18; tt = t(d)
f = 500 + 900 * (tt / d)
save("pop", np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 22), 0.45)

# ding (like/subscribe confirm)
d = 0.9; tt = t(d)
dd = sum(a * np.sin(2 * np.pi * fr * tt) * np.exp(-tt * k) for fr, a, k in [(1318, 1, 5), (2637, 0.4, 8), (1975, 0.3, 6)])
save("ding", reverb(dd, 0.5, 0.2), 0.45)

# tick (counter)
d = 0.025; tt = t(d)
save("tick", np.sin(2 * np.pi * 2000 * tt) * np.exp(-tt * 250), 0.25)

# nav beep (two-tone)
d = 0.35; tt = t(d)
b = np.where(tt < 0.12, np.sin(2 * np.pi * 988 * tt), np.sin(2 * np.pi * 1319 * tt)) * env(len(tt), 0.005, 0.15)
save("navbeep", b, 0.35)

# low drone bed for background (loopable 4s)
d = 4.0; tt = t(d)
dr = (np.sin(2 * np.pi * 55 * tt) * 0.5 + np.sin(2 * np.pi * 82.4 * tt) * 0.25) * (0.8 + 0.2 * np.sin(2 * np.pi * 0.25 * tt))
dr += bandpass_sweep(rng.standard_normal(len(tt)), 300, 300, 1.5) * 0.15
save("drone", dr * env(len(tt), 0.05, 0.05), 0.25)
print("ok", sorted(os.listdir(OUT)))
