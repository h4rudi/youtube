# Звуки для ролика «Миллион за катку»: python3 sfx/make_sfx_money.py
import numpy as np, wave, os
SR = 48000
rng = np.random.default_rng(23)
OUT = os.path.join(os.path.dirname(__file__), "..", "public", "money")

def save(name, x, peak=0.7):
    x = np.asarray(x, dtype=float)
    if x.ndim == 1: x = np.stack([x, x], 1)
    x = x / (np.abs(x).max() + 1e-9) * peak
    with wave.open(os.path.join(OUT, name + ".wav"), "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((x * 32767).astype(np.int16).tobytes())

def t(d): return np.arange(int(SR * d)) / SR

def hp(x, a=0.9):  # простой ФВЧ
    y = np.zeros_like(x); prev = 0.0; py = 0.0
    for i in range(len(x)):
        py = a * (py + x[i] - prev); prev = x[i]; y[i] = py
    return y

# касса: «дзынь» + шелест купюр
tt = t(1.0)
bell = sum(np.sin(2 * np.pi * f * tt) * np.exp(-tt * d) for f, d in [(2637, 5), (3520, 7), (5274, 10)])
rustle = hp(rng.standard_normal(len(tt)), 0.97) * (np.abs(np.sin(2 * np.pi * 9 * tt)) ** 3) * np.exp(-tt * 3)
save("cash", bell * 0.7 + rustle * 0.6, 0.6)

# шелест купюр (длинный)
tt = t(2.0)
r = hp(rng.standard_normal(len(tt)), 0.98) * (0.4 + 0.6 * np.abs(np.sin(2 * np.pi * 6 * tt + np.sin(tt * 7)))) * np.minimum(1, tt * 6) * np.exp(-tt * 0.8)
save("rustle", r, 0.45)

# перещёлкивание LED-табло
tt = t(0.12)
save("flip", np.sign(np.sin(2 * np.pi * 1800 * tt)) * np.exp(-tt * 60) + rng.standard_normal(len(tt)) * np.exp(-tt * 120) * 0.5, 0.45)

# звонок в дверь: динь-дон
tt = t(1.6)
d1 = np.sin(2 * np.pi * 659 * tt) * np.exp(-tt * 2.5) * (tt < 0.7)
t2 = np.clip(tt - 0.55, 0, None)
d2 = np.sin(2 * np.pi * 523 * t2) * np.exp(-t2 * 2.2) * (tt >= 0.55)
save("doorbell", d1 + d2 + 0.3 * np.sin(2 * np.pi * 1318 * tt) * np.exp(-tt * 4), 0.55)

# скрип двери
tt = t(1.1)
f0 = 380 + 160 * np.sin(2 * np.pi * 1.3 * tt) + 40 * np.sin(2 * np.pi * 7 * tt)
creak = np.sign(np.sin(2 * np.pi * np.cumsum(f0) / SR)) * (0.5 + 0.5 * np.sin(2 * np.pi * 23 * tt)) * np.sin(np.pi * tt / 1.1)
save("creak", creak * 0.6, 0.35)

# бумага (записка под дверью)
tt = t(0.7)
save("paper", hp(rng.standard_normal(len(tt)), 0.95) * np.sin(np.pi * tt / 0.7) ** 2, 0.4)

# победа: мажорный аккорд с блеском
tt = t(1.4)
win = sum(np.sin(2 * np.pi * f * tt) * np.exp(-tt * 2.2) for f in [523, 659, 784, 1046])
save("win", win * np.minimum(1, tt * 40), 0.5)

# низкий удар-«бум» для поворотов сюжета
tt = t(1.8)
boom = np.sin(2 * np.pi * np.cumsum(55 * np.exp(-tt * 1.5) + 30) / SR) * np.exp(-tt * 2)
save("boom", boom + rng.standard_normal(len(tt)) * np.exp(-tt * 30) * 0.3, 0.9)
