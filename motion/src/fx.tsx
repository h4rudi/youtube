import React from 'react';
import {AbsoluteFill, interpolate, random, useCurrentFrame, useVideoConfig, spring, Easing} from 'remotion';
import {C} from './theme';

// Animated perspective grid floor + glow + vignette
export const GridBg: React.FC<{accent?: string; speed?: number}> = ({accent = C.orange, speed = 1}) => {
  const f = useCurrentFrame();
  const off = (f * 2.2 * speed) % 80;
  return (
    <AbsoluteFill style={{background: C.bg, overflow: 'hidden'}}>
      <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 55%, ${accent}33 0%, transparent 55%)`}} />
      <div style={{position: 'absolute', left: '-50%', width: '200%', top: '52%', height: '120%',
        transform: 'perspective(600px) rotateX(72deg)', transformOrigin: '50% 0%',
        backgroundImage: `linear-gradient(${accent}55 2px, transparent 2px), linear-gradient(90deg, ${accent}55 2px, transparent 2px)`,
        backgroundSize: '80px 80px', backgroundPosition: `0px ${off}px`,
        maskImage: 'linear-gradient(to bottom, transparent 0%, black 30%, black 100%)'}} />
      <div style={{position: 'absolute', left: '-50%', width: '200%', bottom: '52%', height: '120%',
        transform: 'perspective(600px) rotateX(-72deg)', transformOrigin: '50% 100%',
        backgroundImage: `linear-gradient(${accent}22 2px, transparent 2px), linear-gradient(90deg, ${accent}22 2px, transparent 2px)`,
        backgroundSize: '80px 80px', backgroundPosition: `0px ${-off}px`,
        maskImage: 'linear-gradient(to top, transparent 0%, black 40%, black 100%)'}} />
      <Noise />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.85) 100%)'}} />
    </AbsoluteFill>
  );
};

export const Noise: React.FC = () => {
  const f = useCurrentFrame();
  const lines = Array.from({length: 6}).map((_, i) => {
    const y = random(`ny${i}-${Math.floor(f / 3)}`) * 1080;
    return <div key={i} style={{position: 'absolute', left: 0, right: 0, top: y, height: 1 + random(`nh${i}`) * 2, background: 'rgba(255,255,255,0.04)'}} />;
  });
  return <AbsoluteFill style={{pointerEvents: 'none'}}>{lines}</AbsoluteFill>;
};

// Camera shake wrapper: amount in px, decays after `at`
export const Shake: React.FC<{at: number; dur?: number; amount?: number; children: React.ReactNode}> = ({at, dur = 14, amount = 18, children}) => {
  const f = useCurrentFrame();
  const t = f - at;
  const k = t >= 0 && t < dur ? (1 - t / dur) * amount : 0;
  const x = (random(`sx${f}`) - 0.5) * 2 * k;
  const y = (random(`sy${f}`) - 0.5) * 2 * k;
  return <AbsoluteFill style={{transform: `translate(${x}px, ${y}px)`}}>{children}</AbsoluteFill>;
};

// RGB-split glitch text shadow, active when `on`
export const glitchShadow = (f: number, on: boolean, power = 10) => {
  if (!on) return '0 0 30px rgba(0,0,0,0.6)';
  const a = (random(`g${f}`) - 0.5) * power * 2;
  const b = (random(`h${f}`) - 0.5) * power * 2;
  return `${a}px 0 0 rgba(255,0,60,0.85), ${-b}px 0 0 rgba(0,220,255,0.85), 0 0 30px rgba(0,0,0,0.6)`;
};

// Slam-in: scale from big to 1 with spring
export const useSlam = (at: number, from = 2.4) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: f - at, fps, config: {damping: 13, stiffness: 220, mass: 0.6}});
  return {scale: interpolate(s, [0, 1], [from, 1]), opacity: interpolate(f - at, [0, 3], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}), s};
};

export const Flash: React.FC<{at: number; dur?: number; color?: string}> = ({at, dur = 8, color = '#fff'}) => {
  const f = useCurrentFrame();
  const o = interpolate(f - at, [0, 1, dur], [0, 0.9, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.quad)});
  return <AbsoluteFill style={{background: color, opacity: o, pointerEvents: 'none'}} />;
};

// Ping badge (signal bars + number)
export const PingBadge: React.FC<{value: string | number; scale?: number; glitch?: boolean}> = ({value, scale = 1, glitch = false}) => {
  const f = useCurrentFrame();
  return (
    <div style={{display: 'flex', alignItems: 'center', gap: 22 * scale, padding: `${16 * scale}px ${30 * scale}px`, background: 'rgba(14,14,18,0.95)',
      border: `${5 * scale}px solid ${C.red}`, borderRadius: 26 * scale, boxShadow: `0 0 ${40 * scale}px ${C.red}88`}}>
      <div style={{display: 'flex', alignItems: 'flex-end', gap: 7 * scale, height: 64 * scale, position: 'relative'}}>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} style={{width: 14 * scale, height: (18 + i * 15) * scale, borderRadius: 4 * scale, background: i === 0 ? C.red : '#555560'}} />
        ))}
        <div style={{position: 'absolute', right: -14 * scale, top: -10 * scale, color: C.red, fontFamily: 'Montserrat', fontWeight: 900, fontSize: 30 * scale}}>✕</div>
      </div>
      <div style={{fontFamily: 'Unbounded', fontWeight: 900, fontSize: 72 * scale, color: C.red, textShadow: glitchShadow(f, glitch, 8 * scale), lineHeight: 1}}>{value}</div>
      <div style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 40 * scale, color: C.white, alignSelf: 'flex-end', marginBottom: 4 * scale}}>MS</div>
    </div>
  );
};

// FACEIT-like level gauge: arc + center content
export const Gauge: React.FC<{fill: number; color: string; size?: number; children: React.ReactNode}> = ({fill, color, size = 360, children}) => {
  const r = size / 2 - 22;
  const circ = 2 * Math.PI * r;
  const arc = 0.75; // 270deg arc
  return (
    <div style={{width: size, height: size, position: 'relative'}}>
      <svg width={size} height={size} style={{position: 'absolute', transform: 'rotate(135deg)'}}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#2a2a33" strokeWidth={26} strokeLinecap="round" strokeDasharray={`${circ * arc} ${circ}`} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={26} strokeLinecap="round"
          strokeDasharray={`${Math.max(0.001, circ * arc * fill)} ${circ}`} style={{filter: `drop-shadow(0 0 12px ${color})`, opacity: fill < 0.005 ? 0 : 1}} />
      </svg>
      <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{children}</div>
    </div>
  );
};
