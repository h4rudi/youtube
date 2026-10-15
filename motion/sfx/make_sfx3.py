# Доп. звуки для финала: клавиши, «сдувание», штамп. python3 sfx/make_sfx3.py
import numpy as np, wave, os
SR = 48000; rng = np.random.default_rng(21)
OUT = os.path.join(os.path.dirname(__file__), "..", "public", "sfx2")
def t(d): return np.arange(int(SR * d)) / SR
def save(name, x, peak):
    x = np.asarray(x, float); x = x / (np.abs(x).max() + 1e-9) * peak
    if x.ndim == 1: x = np.stack([x, x], 1)
    with wave.open(os.path.join(OUT, name + ".wav"), "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((x * 32767).astype(np.int16).tobytes())
def lp(x, fc):
    a = np.exp(-2 * np.pi * fc / SR); y = np.zeros_like(x); s = 0.0
    for i in range(len(x)): s = (1 - a) * x[i] + a * s; y[i] = s
    return y
# keyboard key: short filtered click + tiny body, 3 variants
for k in range(3):
    tt = t(0.06); f0 = [1800, 2300, 2000][k]
    c = lp(rng.standard_normal(len(tt)), 5000) * np.exp(-tt * 260) + np.sin(2 * np.pi * f0 * tt) * np.exp(-tt * 180) * 0.4 + np.sin(2 * np.pi * 220 * tt) * np.exp(-tt * 90) * 0.3
    save(f"key{k}", c, 0.3)
# deflate: descending tone + air
tt = t(0.9); f = 520 * np.exp(-tt * 1.6) + 90
d = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 2.2) * (1 + 0.3 * np.sin(2 * np.pi * 9 * tt))
save("deflate", d + lp(rng.standard_normal(len(tt)), 900) * np.exp(-tt * 3) * 0.25, 0.4)
# stamp: thud + paper slap
tt = t(0.5)
st = np.sin(2 * np.pi * np.cumsum(120 * np.exp(-tt * 20) + 55) / SR) * np.exp(-tt * 14) + lp(rng.standard_normal(len(tt)), 3000) * np.exp(-tt * 70) * 0.8
save("stamp", st, 0.7)
print("ok")
