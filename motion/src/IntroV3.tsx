// Интро v3: фон БЕДЫЧА (сепия), объёмный текст, 3D-логотипы, интро ≤ 20 с
import React from 'react';
import {AbsoluteFill, Img, Sequence, Freeze, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing, Audio, random} from 'remotion';
import {loadFonts} from './theme';
import {Fx} from './style2';
import {Globe} from './Globe';
import {B6, Thumb} from './IntroV2';
import {continueRender, delayRender} from 'remotion';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const P = {cream: '#f3dcb8', orange: '#ff6a13', red: '#ff2b1f', dark: '#1d130c', brown: '#3a2618'};

let dela = false;
const loadDela = () => {
  if (dela || typeof document === 'undefined') return; dela = true;
  const h = delayRender('dela');
  new FontFace('Dela Gothic One', `url(${staticFile('fonts/DelaGothicOne.ttf')})`).load().then((l) => { document.fonts.add(l); continueRender(h); });
};

// ---------- moving background (user's BEDYCH frame), punch-zoom on hits
const Bg: React.FC<{hits: number[]}> = ({hits}) => {
  const f = useCurrentFrame();
  let bump = 0;
  for (const h of hits) { const d = f - h; if (d >= 0 && d < 18) bump += 0.06 * Math.exp(-d / 4); }
  const x = Math.sin(f / 70) * 40 + Math.sin(f / 23) * 6;
  const y = Math.cos(f / 85) * 22;
  const rot = Math.sin(f / 120) * 1.2;
  const sc = 1.22 + 0.03 * Math.sin(f / 50) + bump;
  const flick = 0.92 + 0.08 * random(`fl${Math.floor(f / 2)}`);
  return (
    <AbsoluteFill style={{background: P.dark, overflow: 'hidden'}}>
      <Img src={staticFile('img/bg_bedych.jpg')} style={{position: 'absolute', width: 1920, height: 1080, objectFit: 'cover',
        transform: `translate(${x}px,${y}px) rotate(${rot}deg) scale(${sc})`, filter: `brightness(${flick})`}} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at center, transparent 35%, rgba(20,10,4,0.8) 100%)'}} />
    </AbsoluteFill>
  );
};

const Shake: React.FC<{hits: number[]; amount?: number; children: React.ReactNode}> = ({hits, amount = 18, children}) => {
  const f = useCurrentFrame(); let k = 0;
  for (const h of hits) { const d = f - h; if (d >= 0 && d < 14) k += (1 - d / 14) * amount; }
  return <AbsoluteFill style={{transform: `translate(${(random(`x${f}`) - 0.5) * 2 * k}px,${(random(`y${f}`) - 0.5) * 2 * k}px)`}}>{children}</AbsoluteFill>;
};

const Center: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', ...style}}>{children}</AbsoluteFill>
);

const pop = (f: number, at: number, fps: number, stiff = 260) => spring({frame: f - at, fps, config: {damping: 11, stiffness: stiff, mass: 0.6}});

// ---------- volumetric 3D text
const extrude = (depth: number, c1: string, c2: string) => {
  const layers: string[] = [];
  for (let i = 1; i <= depth; i++) {
    const t = i / depth;
    const r = Math.round(parseInt(c1.slice(1, 3), 16) * (1 - t) + parseInt(c2.slice(1, 3), 16) * t);
    const g = Math.round(parseInt(c1.slice(3, 5), 16) * (1 - t) + parseInt(c2.slice(3, 5), 16) * t);
    const b = Math.round(parseInt(c1.slice(5, 7), 16) * (1 - t) + parseInt(c2.slice(5, 7), 16) * t);
    layers.push(`${i * 0.9}px ${i * 1.3}px 0 rgb(${r},${g},${b})`);
  }
  layers.push(`${depth * 0.9 + 6}px ${depth * 1.3 + 14}px 24px rgba(0,0,0,0.6)`);
  return layers.join(',');
};
const Word3D: React.FC<{text: string; at: number; size: number; face?: string; side1?: string; side2?: string; tilt?: number}> = ({text, at, size, face = '#fff7ea', side1 = '#ff7a1a', side2 = '#5a1d00', tilt = -4}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = pop(f, at, fps);
  const wob = Math.sin((f - at) / 9) * 2.2 * Math.exp(-(f - at) / 60);
  return (
    <div style={{perspective: 1200}}>
      <div style={{fontFamily: 'Dela Gothic One', fontSize: size, lineHeight: 1, color: face, textShadow: extrude(16, side1, side2), letterSpacing: 2,
        transform: `scale(${interpolate(s, [0, 1], [0.1, 1])}) rotateX(${(1 - s) * 70 + wob}deg) rotateY(${wob * 2}deg) rotate(${tilt * s}deg)`,
        opacity: interpolate(f - at, [0, 3], [0, 1], clamp), WebkitTextStroke: '0px'}}>{text}</div>
    </div>
  );
};

// ---------- B1 (0-190): НИКОГДА / НЕ ИГРАЛ / ФЕЙСИТ + 3D logo
const B1: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const exitT = interpolate(f, [160, 185], [0, 1], {...clamp, easing: Easing.in(Easing.cubic)});
  const logo = pop(f, 44, fps, 200);
  return (
    <Center style={{transform: `scale(${1 + exitT * 0.6})`, opacity: 1 - exitT}}>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6}}>
        <Word3D text="НИКОГДА" at={2} size={180} tilt={-5} />
        <Word3D text="НЕ ИГРАЛ" at={16} size={150} tilt={3} />
        <div style={{display: 'flex', alignItems: 'center', gap: 30}}>
          <Word3D text="ФЕЙСИТ" at={32} size={170} tilt={-3} face="#ff7a1a" side1="#b33a00" side2="#3a1000" />
          <div style={{transform: `scale(${logo}) rotate(${(1 - logo) * -60}deg) translateY(${Math.sin(f / 12) * 6}px)`, opacity: logo > 0.02 ? 1 : 0}}>
            <Img src={staticFile('img/faceit_3d.png')} style={{width: 250, filter: 'drop-shadow(0 18px 30px rgba(0,0,0,0.55))'}} />
          </div>
        </div>
      </div>
    </Center>
  );
};

// ---------- B2 (190-340): ? -> 10 LVL 3D, 2000 ELO
const B2: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const q = pop(f, 0, fps);
  const draw = interpolate(f, [12, 40], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const lv = pop(f, 38, fps, 200);
  const elo = Math.round(interpolate(f, [44, 95], [0, 2000], {...clamp, easing: Easing.out(Easing.cubic)}));
  const spin = interpolate(lv, [0, 1], [-540, 0]);
  return (
    <Center>
      <div style={{display: 'flex', alignItems: 'center', gap: 36}}>
        <div style={{transform: `scale(${q}) rotate(${(1 - q) * -8}deg)`}}>
          <Img src={staticFile('img/norank_plate.png')} style={{width: 560, borderRadius: 16, boxShadow: '0 20px 50px rgba(0,0,0,0.6)', border: '2px solid #4a3828'}} />
        </div>
        <svg width={330} height={80}>
          <line x1={10} y1={40} x2={10 + 270 * draw} y2={40} stroke={P.cream} strokeWidth={9} strokeDasharray="24 14" strokeDashoffset={-f * 4} strokeLinecap="round" />
          {draw > 0.98 && <polygon points="282,10 322,40 282,70" fill={P.cream} />}
        </svg>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6}}>
          <div style={{transform: `scale(${lv}) rotateY(${spin}deg)`, opacity: lv > 0.02 ? 1 : 0, perspective: 800}}>
            <Img src={staticFile('img/lvl10_3d.png')} style={{width: 380, filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.6)) drop-shadow(0 0 40px rgba(255,40,20,0.35))'}} />
          </div>
          <div style={{fontFamily: 'Dela Gothic One', fontSize: 74, color: '#fff7ea', textShadow: extrude(8, '#ff7a1a', '#5a1d00'), opacity: interpolate(f, [44, 50], [0, 1], clamp)}}>
            {elo} <span style={{fontSize: 44}}>ELO</span>
          </div>
        </div>
      </div>
    </Center>
  );
};

// ---------- B3 (340-540): ping — net graph + signal loss + LAG freeze + slam 150
const PingScene: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  // ping value follows a jittery rising curve
  const base = interpolate(f, [10, 120], [18, 150], {...clamp, easing: Easing.in(Easing.quad)});
  const jitter = f < 120 ? (random(`pv${Math.floor(f / 3)}`) - 0.5) * base * 0.35 : 0;
  const v = Math.max(12, Math.round(f >= 120 ? 150 : base + jitter));
  const col = v < 60 ? '#35e07a' : v < 110 ? '#ffc400' : P.red;
  const bars = v < 50 ? 4 : v < 85 ? 3 : v < 120 ? 2 : 1;
  const slam = pop(f, 140, fps, 300);
  const enter = pop(f, 0, fps);
  // graph points
  const pts: string[] = [];
  const N = 60;
  for (let i = 0; i < N; i++) {
    const ff = f - (N - 1 - i) * 2;
    const b = interpolate(ff, [10, 120], [18, 150], {...clamp, easing: Easing.in(Easing.quad)});
    const j = ff < 120 ? (random(`pv${Math.floor(ff / 3)}`) - 0.5) * b * 0.35 : 0;
    const val = ff < 0 ? 18 : ff >= 120 ? 150 : b + j;
    pts.push(`${i * (900 / (N - 1))},${220 - Math.min(210, val * 1.3)}`);
  }
  const crack = f >= 140;
  return (
    <Center>
      <div style={{transform: `scale(${enter * (f >= 140 ? interpolate(slam, [0, 1], [1.35, 1]) : 1)})`, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24}}>
        <div style={{position: 'relative', display: 'flex', alignItems: 'center', gap: 44, padding: '30px 60px', borderRadius: 36, background: 'rgba(22,14,9,0.92)',
          border: `6px solid ${col}`, boxShadow: `0 0 60px ${col}88, 0 24px 50px rgba(0,0,0,0.6)`}}>
          <div style={{display: 'flex', alignItems: 'flex-end', gap: 10, height: 130, position: 'relative'}}>
            {[0, 1, 2, 3].map((i) => <div key={i} style={{width: 28, height: 34 + i * 30, borderRadius: 6, background: i < bars ? col : '#4a3b30',
              transform: `scaleY(${i >= bars ? 0.92 : 1})`}} />)}
            {bars === 1 && <div style={{position: 'absolute', right: -26, top: -24, color: P.red, fontFamily: 'Montserrat', fontWeight: 900, fontSize: 56}}>✕</div>}
          </div>
          <div style={{fontFamily: 'Dela Gothic One', fontSize: 190, lineHeight: 1, color: col, textShadow: extrude(10, '#000000', '#000000') + (crack && f < 175 ? `, 8px 0 0 rgba(0,220,255,.7), -8px 0 0 rgba(255,0,60,.7)` : ''), minWidth: 380, textAlign: 'right'}}>{v}</div>
          <div style={{fontFamily: 'Dela Gothic One', fontSize: 80, color: '#fff7ea', alignSelf: 'flex-end', marginBottom: 16}}>MS</div>
          {crack && (
            <svg width={900} height={260} style={{position: 'absolute', left: 0, top: 0, pointerEvents: 'none'}}>
              <path d="M520 0 L500 70 L540 110 L505 170 L530 260" stroke="#fff7ea" strokeWidth={4} fill="none" opacity={0.85} />
              <path d="M540 110 L610 130 L660 120" stroke="#fff7ea" strokeWidth={3} fill="none" opacity={0.7} />
              <path d="M505 170 L440 190 L400 230" stroke="#fff7ea" strokeWidth={3} fill="none" opacity={0.7} />
            </svg>
          )}
        </div>
        {/* net graph */}
        <svg width={900} height={230} style={{background: 'rgba(22,14,9,0.75)', borderRadius: 18, border: '2px solid #5a4430'}}>
          {[50, 100, 150].map((y) => <line key={y} x1={0} x2={900} y1={220 - y * 1.3} y2={220 - y * 1.3} stroke="#5a4430" strokeDasharray="6 8" />)}
          <polyline points={pts.join(' ')} fill="none" stroke={col} strokeWidth={5} strokeLinejoin="round" />
          <text x={12} y={220 - 150 * 1.3 - 8} fill="#9c8a78" style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 22}}>150</text>
        </svg>
      </div>
    </Center>
  );
};
const B3: React.FC = () => {
  const f = useCurrentFrame();
  // LAG: stutter between 100-140 (low fps freeze), with loading spinner
  const lag = f >= 100 && f < 140;
  const q = lag ? 100 + Math.floor((f - 100) / 9) * 9 : f;
  return (
    <AbsoluteFill>
      <Freeze frame={q} active={lag}><PingScene /></Freeze>
      {lag && (
        <Center>
          <div style={{width: 120, height: 120, borderRadius: '50%', border: '14px solid rgba(255,247,234,0.25)', borderTopColor: '#fff7ea', transform: `rotate(${f * 14}deg)`, marginTop: 300}} />
        </Center>
      )}
    </AbsoluteFill>
  );
};

// ---------- B5 (830-920): 10 LVL slam
const B5: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = pop(f, 0, fps, 230);
  return (
    <Center>
      <div style={{position: 'absolute', width: 1700, height: 1700, opacity: interpolate(f, [4, 16], [0, 0.45], clamp), transform: `rotate(${f * 0.8}deg)`,
        background: 'repeating-conic-gradient(rgba(255,90,30,0.55) 0deg 6deg, transparent 6deg 18deg)', maskImage: 'radial-gradient(circle, black 10%, transparent 60%)'}} />
      <div style={{transform: `scale(${interpolate(s, [0, 1], [3, 1])}) rotate(${(1 - s) * 25}deg)`, opacity: interpolate(f, [0, 3], [0, 1], clamp)}}>
        <Img src={staticFile('img/lvl10_3d.png')} style={{width: 620, filter: 'drop-shadow(0 30px 50px rgba(0,0,0,0.6)) drop-shadow(0 0 60px rgba(255,40,20,0.5))'}} />
      </div>
    </Center>
  );
};

// ---------- B6 (920-1200): channel card (same as v2, 1.6x faster) + 50 likes goal
const B6Fast: React.FC = () => {
  const f = useCurrentFrame();
  const n = Math.round(interpolate(f, [150, 220], [0, 50], {...clamp, easing: Easing.inOut(Easing.quad)}));
  const g = interpolate(f, [140, 155], [0, 1], clamp);
  const done = f >= 222;
  const ds = spring({frame: f - 222, fps: 60, config: {damping: 8, stiffness: 260}});
  const out = interpolate(f, [262, 280], [1, 0], clamp);
  return (
    <AbsoluteFill style={{opacity: out}}>
      <AbsoluteFill style={{transform: `translateY(${-g * 110}px)`}}>
        <Freeze frame={Math.round(f * 1.6)}><B6 /></Freeze>
      </AbsoluteFill>
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 110, opacity: g}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 30, transform: `translateY(${(1 - g) * 80}px)`}}>
          <div style={{transform: `scale(${done ? interpolate(ds, [0, 1], [1.4, 1]) : 1})`, display: 'flex', alignItems: 'center', gap: 20}}>
            <Thumb filled size={84} />
            <div style={{fontFamily: 'Dela Gothic One', fontSize: 92, color: done ? P.orange : '#fff7ea', textShadow: extrude(8, '#000000', '#000000'), minWidth: 130}}>{n}</div>
          </div>
          <div style={{width: 520, height: 28, borderRadius: 14, background: 'rgba(22,14,9,0.85)', border: '2px solid #5a4430', overflow: 'hidden'}}>
            <div style={{width: `${(n / 50) * 100}%`, height: '100%', background: done ? P.orange : P.cream}} />
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: 12, opacity: interpolate(f, [228, 238], [0, 1], clamp)}}>
            <svg width={70} height={46} viewBox="0 0 24 16"><path d="M0 0 L11 8 L0 16 Z M12 0 L23 8 L12 16 Z" fill="#fff7ea" /></svg>
            <div style={{fontFamily: 'Dela Gothic One', fontSize: 74, color: '#fff7ea', textShadow: extrude(8, '#ff7a1a', '#5a1d00')}}>#2</div>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const V3 = {b1: [0, 190], b2: [190, 150], b3: [340, 200], b4: [540, 290], b5: [830, 90], b6: [920, 280]} as const;
export const V3_FRAMES = 1200;
const HITS = [2, 16, 32, 44, 190 + 38, 340 + 140, 540 + 215, 830, 920 + 222];
const SW = [190, 340, 540, 830, 920];

export const IntroV3: React.FC<{sound?: boolean}> = ({sound = true}) => {
  loadFonts(); loadDela();
  const f = useCurrentFrame();
  const flash = Math.max(...SW.map((s) => interpolate(f - s, [0, 1, 7], [0, 0.55, 0], clamp)), ...[340 + 140, 830].map((s) => interpolate(f - s, [0, 1, 9], [0, 0.8, 0], clamp)));
  const Seq = (k: keyof typeof V3, C: React.FC) => <Sequence from={V3[k][0]} durationInFrames={V3[k][1]}><C /></Sequence>;
  return (
    <AbsoluteFill>
      <Bg hits={HITS} />
      <Shake hits={HITS}>
        {Seq('b1', B1)}
        {Seq('b2', B2)}
        {Seq('b3', B3)}
        <Sequence from={V3.b4[0]} durationInFrames={V3.b4[1]}>
          <Globe speed={1.38} pal={{ocean0: '#5a3e28', ocean1: '#1d130c', line: '#f3dcb8', land: '#e8c9a0'}} />
        </Sequence>
        {Seq('b5', B5)}
        {Seq('b6', B6Fast)}
      </Shake>
      <AbsoluteFill style={{background: '#fff3e0', opacity: flash, pointerEvents: 'none'}} />
      {sound && (
        <>
          <Audio src={staticFile('sfx/drone.wav')} volume={0.3} loop />
          {/* B1 words */}
          <Fx at={0} s="impact" v={0.8} /><Fx at={14} s="hit" v={0.7} /><Fx at={30} s="hit" v={0.8} /><Fx at={40} s="whoosh" v={0.5} /><Fx at={44} s="impact" v={0.7} />
          <Fx at={160} s="whoosh" v={0.6} />
          {/* B2 */}
          <Fx at={190} s="pop" v={0.7} /><Fx at={202} s="swish" v={0.5} /><Fx at={228} s="impact" v={0.8} />
          {Array.from({length: 12}).map((_, i) => <Fx key={'e' + i} at={234 + i * 4.3} s="tick" v={0.5} />)}
          {/* B3 ping */}
          <Fx at={335} s="whoosh" v={0.6} />
          {Array.from({length: 16}).map((_, i) => <Fx key={'p' + i} at={350 + i * 5.5} s="tick" v={0.45} />)}
          <Fx at={340 + 60} s="navbeep" v={0.4} /><Fx at={340 + 85} s="navbeep" v={0.4} />
          <Fx at={340 + 100} s="glitch" v={0.6} /><Fx at={340 + 118} s="glitch" v={0.5} /><Fx at={340 + 140} s="impact" v={1} /><Fx at={340 + 142} s="glitch" v={0.7} />
          {/* B4 globe (speed 1.38) */}
          <Fx at={530} s="whoosh" v={0.6} /><Fx at={540 + 29} s="navbeep" v={0.8} /><Fx at={540 + 51} s="riser" v={0.35} /><Fx at={540 + 210} s="navbeep" v={0.8} /><Fx at={540 + 214} s="hit" v={0.6} />
          {/* B5 */}
          <Fx at={822} s="whoosh" v={0.6} /><Fx at={830} s="impact" v={1} />
          {/* B6 card (1.6x): sub click at 95/1.6, like at 215/1.6 */}
          <Fx at={915} s="whoosh" v={0.5} />
          <Fx at={920 + 59} s="click" v={0.9} /><Fx at={920 + 61} s="ding" v={0.6} />
          <Fx at={920 + 134} s="click" v={0.9} /><Fx at={920 + 136} s="pop" v={0.8} />
          {Array.from({length: 16}).map((_, i) => <Fx key={'l' + i} at={920 + 150 + i * 4.4} s="tick" v={0.45} />)}
          <Fx at={920 + 222} s="ding" v={0.7} /><Fx at={920 + 228} s="swish" v={0.5} />
        </>
      )}
    </AbsoluteFill>
  );
};
