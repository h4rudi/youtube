# Звуки для ролика «Ещё одна катка» (TikTok): python3 sfx/make_sfx_tilt.py
import numpy as np, wave, os
SR = 48000
rng = np.random.default_rng(11)
OUT = os.path.join(os.path.dirname(__file__), "..", "public", "tilt")

def save(name, x, peak=0.7):
    x = np.asarray(x, dtype=float)
    if x.ndim == 1: x = np.stack([x, x], 1)
    x = x / (np.abs(x).max() + 1e-9) * peak
    with wave.open(os.path.join(OUT, name + ".wav"), "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((x * 32767).astype(np.int16).tobytes())

def t(d): return np.arange(int(SR * d)) / SR

def lowpass(x, a):  # one-pole
    y = np.zeros_like(x); acc = 0.0
    for i in range(len(x)):
        acc += a * (x[i] - acc); y[i] = acc
    return y

# phone vibration: two buzzes of 175 Hz with rattle
tt = t(1.1)
gate = ((tt % 0.55) < 0.38).astype(float)
gate = np.convolve(gate, np.ones(400) / 400, "same")
buzz = np.sign(np.sin(2 * np.pi * 175 * tt)) * 0.6 + np.sin(2 * np.pi * 350 * tt) * 0.3
save("vibrate", lowpass(buzz, 0.15) * gate, 0.55)

# rifle shot: noise crack + low thump, short tail
tt = t(0.5)
crack = rng.standard_normal(len(tt)) * np.exp(-tt * 38)
thump = np.sin(2 * np.pi * np.cumsum(120 * np.exp(-tt * 18) + 50) / SR) * np.exp(-tt * 14)
save("shot", lowpass(crack, 0.5) * 0.9 + thump, 0.85)

# headshot ding (metallic)
tt = t(0.6)
ding = sum(np.sin(2 * np.pi * f * tt) * np.exp(-tt * d) for f, d in [(2100, 9), (3170, 12), (4430, 16)])
save("hs", ding * (1 - np.exp(-tt * 400)), 0.5)

# heartbeat (lub-dub)
def beat(tt):
    return np.sin(2 * np.pi * 48 * tt) * np.exp(-tt * 22) * (tt >= 0)
tt = t(1.0)
hb = beat(tt) + 0.7 * beat(tt - 0.22)
save("heart", hb, 0.8)

# dark ambient pad (loopable 12 s): detuned low saws through slow lowpass, + room hum
tt = t(12.0)
pad = np.zeros(len(tt))
for f in [55, 55.4, 82.4, 110.3, 130.8]:
    ph = 2 * np.pi * f * tt
    pad += np.sin(ph) + 0.35 * np.sin(2 * ph) + 0.15 * np.sin(3 * ph)
lfo = 0.6 + 0.4 * np.sin(2 * np.pi * tt / 12.0) ** 2
air = lowpass(rng.standard_normal(len(tt)), 0.02) * 4
pad = pad * lfo + air
fade = int(SR * 0.5)
pad[:fade] *= np.linspace(0, 1, fade); pad[-fade:] *= np.linspace(1, 0, fade)
L = pad + lowpass(rng.standard_normal(len(tt)), 0.01) * 2
R = pad + lowpass(rng.standard_normal(len(tt)), 0.01) * 2
save("pad", np.stack([L, R], 1), 0.5)

# soft notification chime (phone)
tt = t(0.9)
n1 = np.sin(2 * np.pi * 1318 * tt) * np.exp(-tt * 7)
n2 = np.sin(2 * np.pi * 1760 * (tt - 0.12)) * np.exp(-np.clip(tt - 0.12, 0, None) * 7) * (tt > 0.12)
save("notif", n1 + n2, 0.45)

# matchmaking accept beep
tt = t(0.35)
save("accept", np.sin(2 * np.pi * 880 * tt) * np.exp(-tt * 8) + 0.5 * np.sin(2 * np.pi * 1320 * tt) * np.exp(-tt * 10), 0.5)

# light switch click
tt = t(0.12)
save("switch", rng.standard_normal(len(tt)) * np.exp(-tt * 120) + np.sin(2 * np.pi * 900 * tt) * np.exp(-tt * 90), 0.6)
