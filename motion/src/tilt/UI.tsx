// Субтитры (караоке: слова загораются по мере озвучки), стикеры-скотч, красные плашки, пульс-кольца.
import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {CUES, Cue} from './script';

export const COL = {w: '#ffffff', y: '#ffd23f', r: '#ff3b47', dim: '#5b6380', paper: '#ece4cf', ink: '#14161c'};
export const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

export const Captions: React.FC<{cues?: Cue[]}> = ({cues = CUES}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const cue = cues.find((c) => f >= c.at && f < c.end);
  if (!cue) return null;
  const inS = spring({frame: f - cue.at, fps, config: {damping: 16, stiffness: 300, mass: 0.5}});
  const out = interpolate(f, [cue.end - 4, cue.end], [1, 0], clamp);
  return (
    <AbsoluteFill style={{top: 1235, height: 260, alignItems: 'center', justifyContent: 'center', pointerEvents: 'none'}}>
      <div style={{width: 900, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', columnGap: 22, rowGap: 0,
        opacity: out * Math.min(1, inS * 1.5), transform: `translateY(${(1 - inS) * 18}px)`}}>
        {cue.words.map((w, i) => {
          const lit = f >= w.at;
          const s = spring({frame: f - w.at, fps, config: {damping: 10, stiffness: 320, mass: 0.45}});
          const col = lit ? COL[w.color] : COL.dim;
          return (
            <span key={i} style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 74, lineHeight: 1.12, textTransform: 'uppercase',
              color: col, letterSpacing: 1, display: 'inline-block', transform: `scale(${lit ? 1 + (1 - s) * 0.12 : 1})`,
              textShadow: lit && w.color !== 'w' ? `0 0 26px ${col}66, 0 4px 0 rgba(0,0,0,0.6)` : '0 4px 0 rgba(0,0,0,0.6)'}}>{w.text}</span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// стикер «скотч» сверху кадра, как у оригинала
export const Sticker: React.FC<{text: string; at: number; until?: number; y?: number; num?: string; rot?: number}> = ({text, at, until = 1e9, y = 200, num, rot = -1.2}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (f < at || f >= until) return null;
  const s = spring({frame: f - at, fps, config: {damping: 12, stiffness: 260, mass: 0.5}});
  const o = interpolate(f, [until - 5, until], [1, 0], clamp);
  return (
    <AbsoluteFill style={{top: y, height: 120, alignItems: 'center', pointerEvents: 'none'}}>
      <div style={{background: COL.paper, color: COL.ink, fontFamily: 'Montserrat', fontWeight: 900, fontSize: 40, padding: '14px 30px',
        transform: `rotate(${rot}deg) scale(${0.6 + 0.4 * s})`, opacity: o * Math.min(1, s * 2), boxShadow: '0 10px 24px rgba(0,0,0,0.45)', textTransform: 'uppercase',
        clipPath: 'polygon(1% 4%, 99% 0%, 100% 92%, 98% 100%, 2% 97%, 0% 10%)'}}>
        {num && <span style={{color: COL.r, marginRight: 12}}>{num}</span>}
        {text}
      </div>
    </AbsoluteFill>
  );
};

export const Pill: React.FC<{text: string; at: number; until?: number; y?: number; color?: string}> = ({text, at, until = 1e9, y = 200, color = COL.r}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (f < at || f >= until) return null;
  const s = spring({frame: f - at, fps, config: {damping: 9, stiffness: 300, mass: 0.5}});
  const o = interpolate(f, [until - 5, until], [1, 0], clamp);
  return (
    <AbsoluteFill style={{top: y, height: 120, alignItems: 'center', pointerEvents: 'none'}}>
      <div style={{background: color, color: '#fff', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 42, padding: '12px 34px', borderRadius: 60,
        transform: `scale(${0.4 + 0.6 * s})`, opacity: o, boxShadow: `0 0 40px ${color}88, 0 10px 20px rgba(0,0,0,0.4)`, textTransform: 'uppercase'}}>{text}</div>
    </AbsoluteFill>
  );
};

// подпись-указатель (как «АНДРЕЙ» в оригинале)
export const Tag: React.FC<{text: string; x: number; y: number; at: number; until?: number; color?: string; dark?: boolean}> = ({text, x, y, at, until = 1e9, color = '#fff', dark = true}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (f < at || f >= until) return null;
  const s = spring({frame: f - at, fps, config: {damping: 11, stiffness: 280, mass: 0.5}});
  const o = interpolate(f, [until - 5, until], [1, 0], clamp);
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%, -50%) scale(${s})`, opacity: o,
      background: dark ? 'rgba(10,12,20,0.9)' : color, color: dark ? color : '#fff', border: `3px solid ${color}`, borderRadius: 40,
      fontFamily: 'Montserrat', fontWeight: 900, fontSize: 34, padding: '8px 22px', whiteSpace: 'nowrap', textTransform: 'uppercase'}}>{text}</div>
  );
};

// расходящиеся кольца (гул/вибрация/внимание)
export const Rings: React.FC<{x: number; y: number; at: number; until?: number; color?: string; size?: number}> = ({x, y, at, until = 1e9, color = '#cfd8ff', size = 160}) => {
  const f = useCurrentFrame();
  if (f < at || f >= until) return null;
  const t = f - at;
  return (
    <svg style={{position: 'absolute', left: x - size, top: y - size}} width={size * 2} height={size * 2}>
      {[0, 1, 2].map((k) => {
        const p = ((t + k * 12) % 36) / 36;
        return <circle key={k} cx={size} cy={size} r={size * (0.25 + p * 0.75)} fill="none" stroke={color} strokeWidth={4} opacity={(1 - p) * 0.8} />;
      })}
    </svg>
  );
};

export const pop = (f: number, at: number, fps: number, stiffness = 260, damping = 12) =>
  f < at ? 0 : spring({frame: f - at, fps, config: {damping, stiffness, mass: 0.5}});
