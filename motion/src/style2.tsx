// Стиль «как у БЕДЫЧА»: тёмно-серый фон, светлая сетка с эффектом линзы, монохром, лучи скорости
import React from 'react';
import {AbsoluteFill, interpolate, random, useCurrentFrame, Audio, Sequence, staticFile} from 'remotion';

export const S = {
  bg0: '#2b2b2b',
  bg1: '#141414',
  line: '#e6e6e6',
  orange: '#ff5f1f',
  red: '#ff2b2b',
  white: '#ffffff',
  grey: '#9a9a9a',
};

// barrel-distorted grid; `punch` = list of hit frames to bump the zoom
export const LensGrid: React.FC<{punch?: number[]; tint?: string; zoom?: number}> = ({punch = [], tint = S.line, zoom = 1}) => {
  const f = useCurrentFrame();
  let bump = 0;
  for (const p of punch) { const d = f - p; if (d >= 0 && d < 20) bump += 0.07 * Math.exp(-d / 5); }
  const sc = zoom * (1 + f * 0.00025) + bump;
  const W = 1920, H = 1080, step = 175, k = 0.12;
  const map = (x: number, y: number) => {
    const u = (x - W / 2) / (W / 2), v = (y - H / 2) / (W / 2);
    const r2 = u * u + v * v, m = (1 + k * r2) * sc;
    return [W / 2 + u * m * (W / 2), H / 2 + v * m * (W / 2)];
  };
  const paths: string[] = [];
  const off = 0;
  for (let gx = -6; gx <= 6; gx++) {
    const x = W / 2 + gx * step + off; let d = '';
    for (let y = -200; y <= H + 200; y += 40) { const [px, py] = map(x, y); d += (d ? 'L' : 'M') + px.toFixed(1) + ' ' + py.toFixed(1); }
    paths.push(d);
  }
  for (let gy = -4; gy <= 4; gy++) {
    const y = H / 2 + gy * step; let d = '';
    for (let x = -300; x <= W + 300; x += 40) { const [px, py] = map(x, y); d += (d ? 'L' : 'M') + px.toFixed(1) + ' ' + py.toFixed(1); }
    paths.push(d);
  }
  return (
    <AbsoluteFill style={{background: `radial-gradient(ellipse at center, ${S.bg0} 0%, ${S.bg1} 100%)`}}>
      <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
        {paths.map((d, i) => <path key={i} d={d} fill="none" stroke={tint} strokeOpacity={0.5} strokeWidth={3} />)}
      </svg>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.75) 100%)'}} />
    </AbsoluteFill>
  );
};

// radial speed lines burst at frame `at`
export const SpeedLines: React.FC<{at: number; dur?: number; count?: number; color?: string}> = ({at, dur = 22, count = 70, color = '#ffffff'}) => {
  const f = useCurrentFrame(); const t = f - at;
  if (t < 0 || t > dur) return null;
  const p = t / dur;
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}>
      {Array.from({length: count}).map((_, i) => {
        const a = random(`sa${at}-${i}`) * Math.PI * 2;
        const r0 = 180 + random(`sr${at}-${i}`) * 300 + p * 900;
        const len = 120 + random(`sl${at}-${i}`) * 380;
        const x1 = 960 + Math.cos(a) * r0, y1 = 540 + Math.sin(a) * r0;
        const x2 = 960 + Math.cos(a) * (r0 + len), y2 = 540 + Math.sin(a) * (r0 + len);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeOpacity={0.35 * (1 - p)} strokeWidth={1.5 + random(`sw${i}`) * 2.5} />;
      })}
    </svg>
  );
};

export const Shake2: React.FC<{hits: number[]; amount?: number; children: React.ReactNode}> = ({hits, amount = 16, children}) => {
  const f = useCurrentFrame(); let k = 0;
  for (const h of hits) { const d = f - h; if (d >= 0 && d < 16) k += (1 - d / 16) * amount; }
  const x = (random(`x${f}`) - 0.5) * 2 * k, y = (random(`y${f}`) - 0.5) * 2 * k;
  return <AbsoluteFill style={{transform: `translate(${x}px,${y}px)`}}>{children}</AbsoluteFill>;
};

export const Fx: React.FC<{at: number; s: string; v?: number}> = ({at, s, v = 1}) => (
  <Sequence from={Math.max(0, Math.round(at))} layout="none"><Audio src={staticFile(`sfx/${s}.wav`)} volume={v} /></Sequence>
);

export const flashOp = (f: number, at: number, dur = 8) => interpolate(f - at, [0, 1, dur], [0, 0.85, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
