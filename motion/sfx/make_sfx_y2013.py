# Звуки для ролика «Проснулся в 2013 году»: python3 sfx/make_sfx_y2013.py
import numpy as np, wave, os
SR = 48000
rng = np.random.default_rng(13)
OUT = os.path.join(os.path.dirname(__file__), "..", "public", "y2013")

def save(name, x, peak=0.7):
    x = np.asarray(x, dtype=float)
    if x.ndim == 1: x = np.stack([x, x], 1)
    x = x / (np.abs(x).max() + 1e-9) * peak
    with wave.open(os.path.join(OUT, name + ".wav"), "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((x * 32767).astype(np.int16).tobytes())

def t(d): return np.arange(int(SR * d)) / SR

# включение ЭЛТ-монитора: глухой щелчок + писк строчной развёртки
tt = t(1.2)
thump = np.sin(2 * np.pi * 60 * tt) * np.exp(-tt * 12) + rng.standard_normal(len(tt)) * np.exp(-tt * 60) * 0.5
whine = np.sin(2 * np.pi * 7800 * tt) * np.minimum(1, tt * 8) * np.exp(-tt * 1.5) * 0.15
save("crt", thump + whine, 0.6)

# перемотка времени назад: «зажёванная» плёнка, тон падает
tt = t(2.2)
f0 = 900 * np.exp(-tt * 1.2) + 120
rew = np.sign(np.sin(2 * np.pi * np.cumsum(f0) / SR)) * 0.3 + np.sin(2 * np.pi * np.cumsum(f0 * 2.01) / SR) * 0.4
flutter = 0.6 + 0.4 * np.sin(2 * np.pi * 18 * tt)
save("rewind", rew * flutter * np.minimum(1, tt * 10) * np.minimum(1, (2.2 - tt) * 4), 0.4)

# быстрое перелистывание страниц
tt = t(1.4)
x = np.zeros(len(tt))
for k in range(18):
    s = int(SR * (k * 0.07 + rng.uniform(0, 0.02)))
    n = int(SR * 0.05)
    if s + n < len(x): x[s:s + n] += rng.standard_normal(n) * np.hanning(n)
save("pages", x, 0.4)
