// TikTok-ролик «Карта, которой нет — de_irkutsk» (9:16, ≈59,9 с). Мистика от первого лица.
// Исходники пользователя: мап пул CS2 (public/home/pool.png, аватарки размыты), куски HUD (h_*.png) и граффити «B» (graf_b.png).
// Двор, дом, комната и экран загрузки нарисованы кодом.
import React from 'react';
import {AbsoluteFill, Audio, Img, Sequence, interpolate, random, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {loadFonts} from '../theme';
import {FPS, fr} from '../tilt/script';
import {VO, TOTAL, CUES, v} from './script';
import {Captions, clamp, pop} from '../tilt/UI';
import {Scene, Cam, Flash, loadCaveat} from '../money/Money';
import {H, RED} from '../money/Props';

export const IRK_FRAMES = fr(TOTAL);

const S = {
  hook: 0, search: v(13) - 4, name: v(27) - 4, era: v(34) - 4, load: v(41) - 6, yard: v(45) - 4, house: v(69) - 4,
  window: v(83) - 4, monitor: v(99) - 4, turn: v(112) - 4, room: v(115) - 4, gone: v(127) - 4, ask: v(140) - 4, end: fr(58.2),
};
const NIGHT = '#070a14', LAMP = '#ffc861', CYAN = '#7fd0ff';

const Big: React.FC<{x: number; y: number; s: number; size: number; color?: string; font?: string; children: React.ReactNode}> = ({x, y, s, size, color = '#fff', font = 'Montserrat', children}) => (
  <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%, -50%) scale(${s})`, opacity: Math.min(1, s * 2), fontFamily: font, fontWeight: 900, fontSize: size,
    color, whiteSpace: 'nowrap', textAlign: 'center', lineHeight: 1.05, textShadow: color === '#fff' ? '0 4px 0 rgba(0,0,0,0.6)' : `0 0 34px ${color}88, 0 4px 0 rgba(0,0,0,0.6)`}}>{children}</div>
);
const Chip: React.FC<{x: number; y: number; s: number; bg: string; color?: string; size?: number; children: React.ReactNode}> = ({x, y, s, bg, color = '#fff', size = 40, children}) => (
  <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%, -50%) scale(${s})`, opacity: Math.min(1, s * 2), background: bg, color, fontFamily: 'Montserrat', fontWeight: 900,
    fontSize: size, padding: '12px 30px', borderRadius: 50, whiteSpace: 'nowrap', boxShadow: `0 0 30px ${bg}88`}}>{children}</div>
);
// плёночное зерно + виньетка
const Grain: React.FC<{k?: number}> = ({k = 1}) => {
  const f = useCurrentFrame();
  return (
    <>
      <AbsoluteFill style={{height: H, opacity: 0.07 * k, backgroundImage: 'radial-gradient(rgba(255,255,255,0.9) 1px, transparent 1px)', backgroundSize: '5px 5px', backgroundPosition: `${(f * 37) % 50}px ${(f * 53) % 50}px`}} />
      <AbsoluteFill style={{height: H, background: 'radial-gradient(ellipse at 50% 50%, transparent 45%, rgba(0,0,0,0.75))'}} />
    </>
  );
};

// ---------------------------------------------------------------- рисованные объекты двора
// панелька: сетка окон, часть горит тёплым
const Panel: React.FC<{x: number; y: number; w: number; floors: number; cols: number; seed: string; lit?: number; tone?: string; hi?: [number, number]; hiOn?: number}> = ({x, y, w, floors, cols, seed, lit = 0.12, tone = '#1a2030', hi, hiOn = 0}) => {
  const fh = 74, h = floors * fh + 30, cw = w / cols;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill={tone} />
      {Array.from({length: floors}).map((_, r) => Array.from({length: cols}).map((__, c) => {
        const isHi = hi && hi[0] === r && hi[1] === c;
        const on = isHi ? hiOn : random(`${seed}${r}-${c}`) < lit ? 1 : 0;
        const wx = x + c * cw + cw * 0.22, wy = y + 22 + r * fh;
        return (
          <g key={`${r}-${c}`}>
            {on > 0 && <rect x={wx - 14} y={wy - 14} width={cw * 0.56 + 28} height={40 + 28} fill={LAMP} opacity={0.18 * on} rx={20} />}
            <rect x={wx} y={wy} width={cw * 0.56} height={40} fill={on > 0 ? `rgba(255,200,97,${0.25 + 0.75 * on})` : '#0b0e16'} stroke="#2c3446" strokeWidth={3} />
            <line x1={wx + cw * 0.28} y1={wy} x2={wx + cw * 0.28} y2={wy + 40} stroke="#2c3446" strokeWidth={3} />
          </g>
        );
      }))}
      {Array.from({length: floors}).map((_, r) => <line key={r} x1={x} y1={y + 12 + r * fh} x2={x + w} y2={y + 12 + r * fh} stroke="#121722" strokeWidth={4} />)}
    </g>
  );
};
const Slide: React.FC<{x: number; y: number}> = ({x, y}) => (
  <g transform={`translate(${x} ${y})`}>
    <line x1={0} y1={0} x2={0} y2={-260} stroke="#5a2a14" strokeWidth={12} />
    <line x1={70} y1={0} x2={70} y2={-260} stroke="#5a2a14" strokeWidth={12} />
    {[40, 90, 140, 190, 240].map((d) => <line key={d} x1={0} y1={-d} x2={70} y2={-d} stroke="#6b3418" strokeWidth={8} />)}
    <rect x={-10} y={-272} width={110} height={18} fill="#7a3b1e" />
    <path d="M100 -262 C 220 -240, 260 -60, 380 -12 L 380 8 C 250 -40, 210 -220, 100 -238 Z" fill="#8a4521" stroke="#4a200e" strokeWidth={4} />
    <path d="M120 -250 C 220 -225, 255 -70, 370 -20" stroke="#c0683a" strokeWidth={4} fill="none" opacity={0.5} />
    {[[150, -230], [260, -110], [320, -40]].map(([a, b], i) => <circle key={i} cx={a} cy={b} r={9} fill="#3a1608" opacity={0.7} />)}
  </g>
);
const Garages: React.FC<{x: number; y: number}> = ({x, y}) => (
  <g transform={`translate(${x} ${y})`}>
    {[0, 1, 2].map((i) => (
      <g key={i}>
        <rect x={i * 240} y={-250} width={232} height={250} fill={['#262d3a', '#2b3341', '#232a36'][i]} />
        <rect x={i * 240} y={-262} width={240} height={16} fill="#1a1f29" />
        <rect x={i * 240 + 22} y={-210} width={188} height={210} fill="#1d232e" stroke="#151a22" strokeWidth={5} />
        <line x1={i * 240 + 116} y1={-210} x2={i * 240 + 116} y2={0} stroke="#151a22" strokeWidth={5} />
        <rect x={i * 240 + 104} y={-110} width={24} height={10} fill="#5a4a32" />
      </g>
    ))}
    <text x={360} y={-120} textAnchor="middle" fontFamily="Caveat" fontWeight={700} fontSize={92} fill="#e9e6dd" opacity={0.85} transform="rotate(-4 360 -120)">ЦОЙ ЖИВ</text>
  </g>
);
const Entrance: React.FC<{x: number; y: number; lamp?: number}> = ({x, y, lamp = 1}) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={-40} y={-620} width={560} height={620} fill="#1c2232" />
    {[0, 1, 2].map((r) => [0, 1].map((c) => <rect key={`${r}${c}`} x={30 + c * 300} y={-590 + r * 150} width={120} height={70} fill={r === 1 && c === 0 ? 'rgba(255,200,97,0.8)' : '#0b0e16'} stroke="#2c3446" strokeWidth={4} />))}
    <rect x={150} y={-180} width={180} height={18} fill="#2c3446" />
    <circle cx={240} cy={-200} r={60} fill={LAMP} opacity={0.18 * lamp} />
    <rect x={226} y={-212} width={28} height={16} fill={LAMP} opacity={lamp} />
    <rect x={180} y={-160} width={120} height={160} fill="#3a2a22" stroke="#141820" strokeWidth={6} />
    <circle cx={280} cy={-80} r={6} fill="#aaa" />
    <rect x={186} y={-150} width={50} height={36} fill="#1a1f29" />
    <text x={240} y={-30} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={20} fill="#c9c2b0" opacity={0.6}>2</text>
    <rect x={360} y={-40} width={140} height={12} fill="#3a2a1c" />
    <rect x={370} y={-28} width={10} height={28} fill="#222" /><rect x={480} y={-28} width={10} height={28} fill="#222" />
  </g>
);
// двор в полный размер: 3300 × 1180, камера едет по X
const YARD_W = 3300, GROUND = 760;
const Yard: React.FC<{cam: number; bob?: number; zoom?: number}> = ({cam, bob = 0, zoom = 1}) => (
  <svg width={1080} height={H} viewBox={`0 0 1080 ${H}`} style={{position: 'absolute', inset: 0}}>
    <defs>
      <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#03050c" /><stop offset="1" stopColor="#1a2440" /></linearGradient>
      <linearGradient id="fog" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8aa0c8" stopOpacity="0" /><stop offset="0.55" stopColor="#8aa0c8" stopOpacity="0.18" /><stop offset="1" stopColor="#8aa0c8" stopOpacity="0" /></linearGradient>
    </defs>
    <rect width={1080} height={H} fill="url(#sky)" />
    <g transform={`translate(540 ${H / 2 + bob}) scale(${zoom}) translate(${-540 - cam} ${-H / 2})`}>
      <g transform={`translate(${cam * 0.45} 0)`}>
        {[0, 1, 2, 3, 4, 5].map((i) => <Panel key={i} x={-200 + i * 620} y={GROUND - 640 - (i % 2) * 60} w={520} floors={8 + (i % 2)} cols={7} seed={`b${i}`} lit={0.08} tone="#121827" />)}
      </g>
      <rect x={-600} y={GROUND} width={YARD_W + 1600} height={H} fill="#0d1018" />
      <rect x={-600} y={GROUND} width={YARD_W + 1600} height={14} fill="#1a1f2a" />
      {[300, 1000, 1700, 2400, 3000].map((p) => <ellipse key={p} cx={p} cy={GROUND + 180} rx={160} ry={18} fill="#2a3550" opacity={0.5} />)}
      <Slide x={420} y={GROUND} />
      <Garages x={1080} y={GROUND} />
      <Entrance x={1950} y={GROUND} />
      <rect x={2620} y={GROUND - 560} width={560} height={560} fill="#262b33" />
      <rect x={2620} y={GROUND - 560} width={560} height={560} fill="url(#fog)" opacity={0.4} />
      <image href={staticFile('home/graf_b.png')} x={2770} y={GROUND - 470} width={240} height={354} />
      <rect x={-600} y={GROUND - 420} width={YARD_W + 1600} height={600} fill="url(#fog)" />
    </g>
  </svg>
);

// ---------------------------------------------------------------- HUD (вырезан из скринов пользователя)
const Radar: React.FC<{f: number}> = ({f}) => (
  <svg width={250} height={250} viewBox="0 0 250 250" style={{position: 'absolute', left: 18, top: 18}}>
    <circle cx={125} cy={125} r={120} fill="rgba(10,14,20,0.7)" stroke="rgba(160,200,230,0.5)" strokeWidth={3} />
    <rect x={40} y={60} width={160} height={46} fill="#2a5d6a" opacity={0.8} />
    <rect x={150} y={60} width={46} height={150} fill="#2a5d6a" opacity={0.8} />
    <rect x={60} y={150} width={90} height={30} fill="#2a5d6a" opacity={0.6} />
    <text x={205} y={70} fontFamily="Montserrat" fontWeight={900} fontSize={26} fill="#f2b632">A</text>
    <text x={205} y={205} fontFamily="Montserrat" fontWeight={900} fontSize={26} fill="#f2b632">B</text>
    <circle cx={110 + Math.sin(f / 20) * 6} cy={128} r={8} fill="#f6d34a" />
    <text x={125} y={276} textAnchor="middle" fontFamily="Montserrat" fontWeight={600} fontSize={22} fill="#cfe3f3">Двор</text>
  </svg>
);
const Hud: React.FC<{f: number; time?: string; knife?: boolean; bob?: number}> = ({f, time = '1:53', knife = true, bob = 0}) => (
  <AbsoluteFill style={{height: H}}>
    <Radar f={f} />
    <div style={{position: 'absolute', left: 300, top: 300 - 290, display: 'flex', alignItems: 'flex-start', gap: 0, transform: 'scale(0.82)', transformOrigin: '0 0'}}>
      <Img src={staticFile('home/h_ct.png')} style={{width: 290 * 0.85, height: 64 * 0.85}} />
      <div style={{width: 84 * 0.85, height: 92 * 0.85, background: 'rgba(10,14,22,0.75)', color: '#fff', fontFamily: 'Montserrat', fontWeight: 600, textAlign: 'center', fontSize: 24, lineHeight: 1.25}}>
        {time}<div style={{fontSize: 22}}><span style={{color: '#9cc3ff'}}>0</span>&nbsp;&nbsp;<span style={{color: '#f2c94c'}}>2</span></div>
      </div>
      <Img src={staticFile('home/h_t.png')} style={{width: 290 * 0.85, height: 64 * 0.85}} />
    </div>
    <Img src={staticFile('home/h_weap.png')} style={{position: 'absolute', right: 6, top: 760, width: 139 * 0.9, height: 240 * 0.9}} />
    <Img src={staticFile('home/h_money.png')} style={{position: 'absolute', left: 14, top: 1100, width: 130, height: 60}} />
    <Img src={staticFile('home/h_hp.png')} style={{position: 'absolute', left: 300, top: 1100, width: 125, height: 60}} />
    <Img src={staticFile('home/h_emb.png')} style={{position: 'absolute', left: 505, top: 1095, width: 70, height: 70}} />
    {knife && (
      <svg width={520} height={420} viewBox="0 0 520 420" style={{position: 'absolute', right: 30, top: 720 + bob}}>
        <path d="M120 300 L 360 120 L 395 128 L 170 330 Z" fill="#1d2129" stroke="#3a4250" strokeWidth={4} />
        <path d="M140 296 L 360 128" stroke="#6b7486" strokeWidth={3} />
        <path d="M60 330 C 100 290, 190 280, 230 320 L 300 420 L 30 420 Z" fill="#111318" />
        <path d="M380 260 C 430 250, 500 300, 520 340 L 520 420 L 340 420 Z" fill="#14161c" />
      </svg>
    )}
  </AbsoluteFill>
);

// ---------------------------------------------------------------- карточка карты de_irkutsk (в стиле карточек мап пула)
const IrkEmblem: React.FC<{size: number}> = ({size}) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <path d="M50 4 L94 22 L86 74 L50 96 L14 74 L6 22 Z" fill="#1b2a4a" stroke="#d8dfe8" strokeWidth={4} />
    <path d="M50 12 L86 27 L79 70 L50 88 L21 70 L14 27 Z" fill="#8b1a22" />
    {[0, 1, 2].map((i) => <rect key={i} x={26 + i * 17} y={36 - (i === 1 ? 8 : 0)} width={14} height={36 + (i === 1 ? 8 : 0)} fill="#e7e2d6" />)}
    {[0, 1, 2].map((i) => [0, 1, 2].map((r) => <rect key={`${i}${r}`} x={29 + i * 17} y={40 + r * 10 - (i === 1 ? 8 : 0)} width={8} height={5} fill={i === 2 && r === 1 ? LAMP : '#1b2a4a'} />))}
    <rect x={20} y={74} width={60} height={11} fill="#d8dfe8" />
    <text x={50} y={83} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={8.5} fill="#8b1a22">IRKUTSK</text>
  </svg>
);
const IrkCard: React.FC<{w: number; glow?: number; gone?: number}> = ({w, glow = 0, gone = 0}) => {
  const k = w / 159;
  return (
    <div style={{width: w, height: 389 * k, position: 'relative', overflow: 'hidden', boxShadow: glow > 0 ? `0 0 ${30 * k * glow}px ${RED}` : 'none', outline: glow > 0 ? `${2 * k}px solid rgba(255,43,54,${glow})` : 'none',
      filter: gone > 0 ? `grayscale(${gone}) brightness(${1 - 0.5 * gone})` : 'none'}}>
      <svg width={w} height={389 * k} viewBox="0 0 159 389" style={{position: 'absolute', inset: 0}}>
        <defs><linearGradient id="cardsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#060914" /><stop offset="1" stopColor="#273456" /></linearGradient></defs>
        <rect width={159} height={389} fill="url(#cardsky)" />
        <g transform="scale(0.22) translate(-60 360)"><Panel x={60} y={0} w={640} floors={9} cols={6} seed="card" lit={0.18} tone="#1a2134" /></g>
        <rect y={300} width={159} height={89} fill="#0b0e16" />
        <rect y={300} width={159} height={89} fill="url(#cardsky)" opacity={0.25} />
      </svg>
      <div style={{position: 'absolute', left: 8 * k, top: 8 * k, width: 22 * k, height: 22 * k, background: RED, borderRadius: 3 * k, color: '#fff', fontSize: 16 * k, fontWeight: 900, fontFamily: 'Montserrat', textAlign: 'center', lineHeight: `${22 * k}px`}}>!</div>
      <div style={{position: 'absolute', right: 10 * k, top: 8 * k, width: 22 * k, height: 22 * k, border: `${2 * k}px solid rgba(255,255,255,0.6)`, borderRadius: 2 * k}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 140 * k, display: 'flex', justifyContent: 'center'}}><IrkEmblem size={100 * k} /></div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 326 * k, textAlign: 'center', color: '#fff', fontFamily: 'Montserrat', fontWeight: 600, fontSize: 19 * k, letterSpacing: -0.5 * k}}>Irkutsk</div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 357 * k, textAlign: 'center', color: '#c9d1dc', fontFamily: 'Montserrat', fontWeight: 600, fontSize: 9.5 * k}}>Время ожидания --:--</div>
      {gone > 0 && <div style={{position: 'absolute', left: 0, right: 0, top: 230 * k, textAlign: 'center', color: '#fff', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 15 * k, opacity: gone, background: 'rgba(0,0,0,0.7)', padding: `${6 * k}px 0`}}>КАРТА УДАЛЕНА</div>}
    </div>
  );
};
// мап пул (скрин пользователя) + новая карточка в пустой ячейке
const SLOT = {x: 1573, y: 577};
const Pool: React.FC<{glow: number; gone?: number; cursor?: [number, number]}> = ({glow, gone = 0, cursor}) => (
  <div style={{position: 'absolute', left: 0, top: 0, width: 1919, height: 1079}}>
    <Img src={staticFile('home/pool.png')} style={{width: 1919, height: 1079}} />
    <div style={{position: 'absolute', left: SLOT.x, top: SLOT.y}}><IrkCard w={159} glow={glow} gone={gone} /></div>
    {cursor && (
      <svg width={40} height={52} viewBox="0 0 20 26" style={{position: 'absolute', left: cursor[0], top: cursor[1]}}>
        <path d="M1 1 L1 21 L6 16 L10 25 L13 24 L9 15 L16 15 Z" fill="#fff" stroke="#000" strokeWidth={1.4} />
      </svg>
    )}
  </div>
);

// ---------------------------------------------------------------- сцены
const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const z = interpolate(f, [0, v(10), v(12) + 10], [0.75, 0.9, 2.3], clamp);
  const cx = interpolate(f, [0, v(10), v(12) + 10], [960, 1200, SLOT.x + 80], clamp);
  const cy = interpolate(f, [0, v(10), v(12) + 10], [540, 620, SLOT.y + 200], clamp);
  const glow = f > v(10) ? 0.5 + 0.5 * Math.sin(f / 4) : 0;
  const cur: [number, number] = [interpolate(f, [8, v(11)], [900, SLOT.x + 90], clamp), interpolate(f, [8, v(11)], [850, SLOT.y + 220], clamp)];
  return (
    <>
      <AbsoluteFill style={{height: H, background: NIGHT}} />
      <div style={{position: 'absolute', left: 540, top: H / 2, transform: `scale(${z}) translate(${-cx}px, ${-cy}px)`, transformOrigin: '0 0'}}>
        <Pool glow={glow} cursor={cur} />
      </div>
      <AbsoluteFill style={{height: H, background: 'rgba(10,20,60,0.25)'}} />
      <Big x={540} y={150} s={pop(f, 3, fps)} size={52} color="#fff">03:12 НОЧИ</Big>
      {f >= v(11) && <Chip x={540} y={1040} s={pop(f, v(11), fps)} bg={RED} size={44}>НОВАЯ КАРТА?</Chip>}
      <Grain />
    </>
  );
};

const Nothing: React.FC<{y: number; at: number; title: string; sub: string; logo: React.ReactNode; f: number; fps: number}> = ({y, at, title, sub, logo, f, fps}) => {
  const s = pop(f, at, fps);
  const x = pop(f, at + 9, fps, 400, 12);
  return (
    <div style={{position: 'absolute', left: 540, top: y, width: 900, height: 230, transform: `translate(-50%, -50%) scale(${0.8 + 0.2 * s})`, opacity: Math.min(1, s * 2), background: '#121722', border: '3px solid #2a3244', borderRadius: 26,
      padding: '26px 34px', fontFamily: 'Montserrat', boxShadow: '0 20px 50px rgba(0,0,0,0.5)'}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 20}}>{logo}<div style={{fontWeight: 900, fontSize: 40, color: '#fff'}}>{title}</div></div>
      <div style={{marginTop: 22, background: '#0a0d14', borderRadius: 14, padding: '14px 22px', fontWeight: 600, fontSize: 34, color: '#9aa6bb'}}>🔍 de_irkutsk</div>
      <div style={{position: 'absolute', right: 34, bottom: 30, fontWeight: 900, fontSize: 30, color: RED, opacity: Math.min(1, x * 2)}}>{sub}</div>
      <div style={{position: 'absolute', left: -20, right: -20, top: 112, height: 10, background: RED, transform: `scaleX(${x}) rotate(-6deg)`, transformOrigin: 'left', borderRadius: 6, boxShadow: `0 0 20px ${RED}`}} />
    </div>
  );
};
const Search: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const box = (bg: string, t: string) => <div style={{width: 64, height: 64, borderRadius: 14, background: bg, color: '#fff', fontWeight: 900, fontSize: 30, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{t}</div>;
  return (
    <>
      <AbsoluteFill style={{height: H, background: `radial-gradient(ellipse at 50% 40%, #1a2240, ${NIGHT} 70%)`}} />
      <Nothing f={f} fps={fps} y={260} at={v(13)} title="Патч-ноуты CS2" sub="0 упоминаний" logo={box('#e38b1b', 'CS')} />
      <Nothing f={f} fps={fps} y={560} at={v(19)} title="Паблики" sub="ничего не найдено" logo={box('#2b6be0', 'VK')} />
      <Nothing f={f} fps={fps} y={860} at={v(23)} title="Новости" sub="0 результатов" logo={box('#c22a2a', 'N')} />
      <Grain />
    </>
  );
};

const Name: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = pop(f, S.name, fps, 200, 14);
  const p = pop(f, v(30), fps);
  const y98 = f >= v(32);
  const gl = y98 && f < v(32) + 12 ? (random(`g${f}`) - 0.5) * 30 : 0;
  return (
    <>
      <AbsoluteFill style={{height: H, background: `radial-gradient(ellipse at 50% 40%, #2a0d16, ${NIGHT} 70%)`}} />
      <div style={{position: 'absolute', left: 300, top: 560, transform: `translate(-50%, -50%) scale(${0.6 + 0.5 * s}) rotate(-4deg)`}}><IrkCard w={330} glow={0.6 + 0.4 * Math.sin(f / 5)} /></div>
      {f >= v(28) && <Big x={540} y={110} s={pop(f, v(28), fps, 320, 10)} size={84} color={RED} font="Russo One">de_irkutsk</Big>}
      <div style={{position: 'absolute', left: 520, top: 420, width: 520, background: '#e9e9e9', borderRadius: 10, overflow: 'hidden', fontFamily: 'Montserrat', transform: `scale(${0.85 + 0.15 * p}) translateX(${gl}px)`, opacity: Math.min(1, p * 2),
        boxShadow: '0 30px 60px rgba(0,0,0,0.6)', transformOrigin: 'left top'}}>
        <div style={{background: '#fff', padding: '14px 20px', fontWeight: 600, fontSize: 26, color: '#222', borderBottom: '1px solid #ccc'}}>Свойства: de_irkutsk.vpk</div>
        <div style={{padding: '22px 22px', fontSize: 27, color: '#333', fontWeight: 600, lineHeight: 1.7}}>
          <div>Тип: Карта CS</div>
          <div>Автор: <span style={{color: '#999'}}>неизвестен</span></div>
          <div>Создан: <span style={{color: y98 ? RED : '#333', fontWeight: 900, fontSize: y98 ? 34 : 27}}>14.03.1998</span></div>
          <div>Размер: 66,6 МБ</div>
        </div>
      </div>
      <Grain />
    </>
  );
};

const Era: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const line = interpolate(f, [S.era, S.era + 20], [0, 1], clamp);
  const dot = (x: number, at: number, top: string, bot: string, col: string) => {
    const s = pop(f, at, fps);
    return (
      <div style={{position: 'absolute', left: x, top: 560, transform: `translate(-50%, -50%) scale(${s})`, textAlign: 'center', fontFamily: 'Montserrat', fontWeight: 900, width: 360}}>
        <div style={{fontSize: 84, color: col, textShadow: `0 0 30px ${col}88`}}>{top}</div>
        <div style={{width: 46, height: 46, borderRadius: 30, background: col, margin: '16px auto', boxShadow: `0 0 30px ${col}`}} />
        <div style={{fontSize: 34, color: '#fff', lineHeight: 1.2, whiteSpace: 'pre-line'}}>{bot}</div>
      </div>
    );
  };
  return (
    <>
      <AbsoluteFill style={{height: H, background: NIGHT}} />
      <div style={{position: 'absolute', left: 80, top: 560, width: 920 * line, height: 8, background: '#3a4560', borderRadius: 4}} />
      {dot(280, S.era, '1998', 'de_irkutsk', RED)}
      {dot(800, v(36), '1999', 'первая бета\nCounter-Strike', '#f2b632')}
      {f >= v(40) && <Big x={540} y={900} s={pop(f, v(40), fps, 320, 10)} size={66} color={RED}>КАК ЭТО ВОЗМОЖНО?</Big>}
      <Grain />
    </>
  );
};

// экран загрузки: перерисованный двор + панель справа в стиле CS2
const Loading: React.FC = () => {
  const f = useCurrentFrame();
  const p = interpolate(f, [S.load, S.yard], [0.35, 1], clamp);
  return (
    <>
      <Cam s={interpolate(f, [S.load, S.yard], [1.05, 1.15], clamp)}><Yard cam={1300} zoom={0.62} /></Cam>
      <div style={{position: 'absolute', right: 40, top: 150, width: 360, height: 820, background: 'rgba(20,24,36,0.82)', fontFamily: 'Montserrat', color: '#fff', padding: '30px 26px', boxSizing: 'border-box'}}>
        <div style={{display: 'flex', justifyContent: 'center'}}><IrkEmblem size={170} /></div>
        <div style={{textAlign: 'center', fontWeight: 600, fontSize: 52, marginTop: 10}}>Irkutsk</div>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, fontSize: 26, fontWeight: 600, marginTop: 14}}><span style={{width: 26, height: 26, background: '#e38b1b', borderRadius: 4}} />Соревновательный</div>
        <div style={{height: 2, background: 'rgba(255,255,255,0.25)', margin: '22px 0'}} />
        <div style={{fontSize: 20, lineHeight: 1.5, color: '#d6dbe4'}}>Закладка бомбы<br /><br />Не выходите из подъезда после 23:00.<br /><br />Настройки:<br />· Огонь по своим включён<br />· Игроков на сервере: <span style={{color: RED}}>1</span></div>
        <div style={{position: 'absolute', left: 26, right: 26, bottom: 30}}>
          <div style={{fontSize: 18, color: '#aab3c2', marginBottom: 10}}>Выкладываем стратегии...</div>
          <div style={{height: 8, background: 'rgba(255,255,255,0.2)'}}><div style={{width: `${p * 100}%`, height: 8, background: '#2f8fe0'}} /></div>
        </div>
      </div>
      <div style={{position: 'absolute', left: 40, top: 1040, fontFamily: 'Montserrat', fontWeight: 600, fontSize: 44, color: '#fff', textShadow: '0 3px 0 #000'}}>Точка закладки B</div>
      <Grain />
    </>
  );
};

const YardScene: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const cam = interpolate(f, [S.yard, v(48), v(52), v(57), v(63), v(68), S.house], [0, 330, 1210, 1950, 2240, 2620, 2640], clamp);
  const running = f > v(63) && f < v(68);
  const bob = Math.sin(f / (running ? 2.2 : 4)) * (running ? 14 : 6);
  const zoom = interpolate(f, [v(63), v(68)], [1, 1.25], clamp);
  const lab = (at: number, t: string, until: number) => f >= at && f < until ? <Chip x={540} y={980} s={pop(f, at, fps)} bg="rgba(10,14,22,0.85)" size={40}>{t}</Chip> : null;
  return (
    <>
      <Yard cam={cam} bob={bob} zoom={zoom} />
      <Hud f={f} bob={bob * 1.4} time={`1:${String(Math.max(0, 53 - Math.floor((f - S.yard) / 30))).padStart(2, '0')}`} />
      {f >= v(45) && f < v(48) && <Big x={540} y={430} s={pop(f, v(45), fps, 300, 10)} size={96} color={RED}>МОЙ ДВОР</Big>}
      {lab(v(48), 'та же горка', v(52))}
      {lab(v(52), 'тот же гараж', v(57))}
      {lab(v(57), 'мой подъезд', v(62))}
      <Grain />
    </>
  );
};

// дом: панелька анфас, точка B у подъезда, окно 5-го этажа
const HOUSE_HI: [number, number] = [3, 2]; // строка сверху (9 этажей → 5-й этаж = 4-я сверху... индекс 4 от низа)
const House: React.FC<{light: number; mark?: number; me?: number; tilt?: number}> = ({light, mark = 0, me = 0, tilt = 0}) => (
  <svg width={1080} height={H} viewBox={`0 0 1080 ${H}`} style={{position: 'absolute', inset: 0}}>
    <defs>
      <linearGradient id="hsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#03050c" /><stop offset="1" stopColor="#1a2440" /></linearGradient>
      <radialGradient id="glowwin"><stop offset="0" stopColor={LAMP} stopOpacity="0.7" /><stop offset="1" stopColor={LAMP} stopOpacity="0" /></radialGradient>
    </defs>
    <rect width={1080} height={H} fill="url(#hsky)" />
    <g transform={`translate(0 ${tilt})`}>
      <Panel x={90} y={250} w={900} floors={8} cols={6} seed="home" lit={0.06} tone="#1b2131" hi={HOUSE_HI} hiOn={light} />
      {light > 0 && <circle cx={90 + 2 * 150 + 75} cy={250 + 22 + 3 * 74 + 20} r={150} fill="url(#glowwin)" opacity={light} />}
      <rect x={-50} y={872} width={1180} height={500} fill="#0d1018" />
      <rect x={440} y={760} width={200} height={112} fill="#3a2a22" stroke="#141820" strokeWidth={6} />
      <rect x={420} y={740} width={240} height={16} fill="#2c3446" />
      <circle cx={540} cy={725} r={40} fill={LAMP} opacity={0.25} /><rect x={528} y={716} width={24} height={12} fill={LAMP} />
      {mark > 0 && (
        <g opacity={mark}>
          <ellipse cx={540} cy={990} rx={300} ry={70} fill="none" stroke={RED} strokeWidth={14} strokeDasharray="40 22" />
          <text x={0} y={0} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={150} fill={RED} transform="translate(540 1030) scale(1 0.5)">B</text>
        </g>
      )}
      {me > 0 && (
        <g opacity={me}>
          <ellipse cx={540} cy={975} rx={40} ry={10} fill="#000" opacity={0.6} />
          <rect x={518} y={880} width={44} height={92} rx={14} fill="#c9d3e6" />
          <circle cx={540} cy={862} r={22} fill="#c9d3e6" />
        </g>
      )}
    </g>
  </svg>
);
const HouseScene: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const z = interpolate(f, [S.house, v(74), v(78) + 10, S.window], [1.5, 1.05, 1.9, 2.1], clamp);
  const fy = interpolate(f, [S.house, v(74), v(78) + 10], [900, 600, 520], clamp);
  const fx = interpolate(f, [v(74), v(78) + 10], [540, 375], clamp);
  const light = f >= v(81) ? Math.min(1, (f - v(81)) / 3) * (f < v(81) + 8 ? (f % 4 < 2 ? 1 : 0.3) : 1) : 0;
  return (
    <>
      <Cam s={z} x={fx} y={fy}><House light={light} mark={interpolate(f, [v(70), v(70) + 8], [0, 1], clamp)} /></Cam>
      {f >= v(69) && f < v(74) && <Big x={540} y={160} s={pop(f, v(69), fps, 300, 10)} size={110} color={RED}>ТОЧКА B</Big>}
      {f >= v(74) && f < v(81) && <Chip x={540} y={160} s={pop(f, v(74), fps)} bg="rgba(10,14,22,0.85)" size={42}>5 этаж. моё окно</Chip>}
      <Grain />
    </>
  );
};

// фигура со спины в капюшоне за компьютером; turn 0..1 — поворачивается
const Hooded: React.FC<{x: number; y: number; s: number; turn?: number; hi?: number}> = ({x, y, s, turn = 0, hi = 0}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-190 260 C -190 120, -120 60, 0 60 C 120 60, 190 120, 190 260 Z" fill="#20283a" stroke={hi > 0 ? `rgba(255,43,54,${hi})` : 'none'} strokeWidth={8} />
    <path d="M-30 70 L 0 150 L 30 70" stroke="#141a26" strokeWidth={6} fill="none" />
    <g transform={`translate(${turn * 40} 0)`}>
      <ellipse cx={0} cy={-10} rx={92} ry={108} fill="#262f44" stroke={hi > 0 ? `rgba(255,43,54,${hi})` : 'none'} strokeWidth={8} />
      {turn > 0 && <ellipse cx={-30 + turn * 30} cy={0} rx={60 * turn} ry={80} fill="#020203" />}
      {turn > 0.85 && (
        <g opacity={(turn - 0.85) / 0.15}>
          <circle cx={-18} cy={-8} r={5} fill="#f2f2f2" /><circle cx={22} cy={-8} r={5} fill="#f2f2f2" />
        </g>
      )}
    </g>
    <path d="M-120 140 C -80 120, -50 110, -20 120" stroke="#141a26" strokeWidth={6} fill="none" />
  </g>
);
// мини-экран с игрой (двор и фигура под окном)
const GameOnMonitor: React.FC<{me: number}> = ({me}) => (
  <div style={{position: 'absolute', inset: 0, overflow: 'hidden'}}>
    <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: H, transform: `scale(${1 / 1})`}}><House light={1} mark={1} me={me} /></div>
  </div>
);
const WindowScene: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const z = interpolate(f, [S.window, v(86), S.monitor], [1, 1.25, 1.45], clamp);
  return (
    <>
      <AbsoluteFill style={{height: H, background: '#05070d'}} />
      <Cam s={z} y={560}>
        <svg width={1080} height={H} viewBox={`0 0 1080 ${H}`} style={{position: 'absolute', inset: 0}}>
          <rect width={1080} height={H} fill="#151a26" />
          <rect x={90} y={120} width={900} height={880} fill="#2a2216" />
          <rect x={90} y={120} width={900} height={880} fill="url(#roomlamp)" />
          <defs><radialGradient id="roomlamp" cx="0.5" cy="0.5" r="0.6"><stop offset="0" stopColor="#5a8acb" stopOpacity="0.55" /><stop offset="1" stopColor="#000" stopOpacity="0.2" /></radialGradient></defs>
          <rect x={160} y={190} width={140} height={190} fill="#3a2f22" stroke="#1a140e" strokeWidth={6} />
          <text x={230} y={300} textAnchor="middle" fontFamily="Russo One" fontSize={40} fill="#a88a5a">CS</text>
          <rect x={150} y={720} width={780} height={30} fill="#1a1410" />
          <rect x={370} y={420} width={340} height={220} rx={8} fill="#0a0c12" />
          <rect x={382} y={432} width={316} height={196} fill={CYAN} opacity={0.9} />
          <rect x={530} y={640} width={20} height={80} fill="#0a0c12" />
          <Hooded x={540} y={760} s={1.05} hi={f >= v(93) ? interpolate(f, [v(93), v(93) + 8], [0, 1], clamp) : 0} />
          <rect x={60} y={90} width={960} height={940} fill="none" stroke="#d8d8d2" strokeWidth={60} />
          <rect x={0} y={1030} width={1080} height={150} fill="#1b2131" />
        </svg>
      </Cam>
      {f >= v(90) && f < v(93) && <Big x={540} y={150} s={pop(f, v(90), fps, 300, 10)} size={90} color={RED}>КТО ЭТО?</Big>}
      {f >= v(93) && f < v(95) && <Chip x={540} y={150} s={pop(f, v(93), fps)} bg={RED} size={42}>МОЯ ТОЛСТОВКА</Chip>}
      <Grain />
    </>
  );
};

const MonitorScene: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const z = interpolate(f, [S.monitor, v(105), S.turn], [0.62, 0.7, 1.2], clamp);
  const me = f >= v(105) ? 1 : 0;
  const ring = f >= v(108) ? pop(f, v(108), fps, 300, 10) : 0;
  return (
    <>
      <AbsoluteFill style={{height: H, background: '#05070d'}} />
      <Cam s={z} y={interpolate(f, [v(105), S.turn], [590, 900], clamp)}>
        <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: H, border: '40px solid #0b0d12', boxSizing: 'border-box', overflow: 'hidden', borderRadius: 20}}>
          <GameOnMonitor me={me} />
          <div style={{position: 'absolute', inset: 0, background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.18) 0 2px, transparent 2px 5px)'}} />
        </div>
        {ring > 0 && (
          <div style={{position: 'absolute', left: 540, top: 930, width: 160, height: 160, transform: `translate(-50%, -50%) scale(${ring})`, border: `8px solid ${RED}`, borderRadius: 100, boxShadow: `0 0 30px ${RED}`}} />
        )}
      </Cam>
      {f >= v(99) && f < v(105) && <Chip x={540} y={150} s={pop(f, v(99), fps)} bg="rgba(10,14,22,0.85)" size={42}>его монитор</Chip>}
      {ring > 0 && <Big x={540} y={160} s={ring} size={120} color={RED}>ЭТО Я</Big>}
      <Grain />
    </>
  );
};

const TurnScene: React.FC = () => {
  const f = useCurrentFrame();
  const turn = interpolate(f, [v(112), v(114) + 12], [0, 1], clamp);
  const shake = f > v(114) ? Math.max(0, 1 - (f - v(114)) / 20) : 0;
  return (
    <>
      <AbsoluteFill style={{height: H, background: `radial-gradient(ellipse at 50% 30%, #23314f, #020306 70%)`}} />
      <Cam s={interpolate(f, [S.turn, S.room], [1.6, 2.2], clamp)} y={560} shake={shake}>
        <svg width={1080} height={H} viewBox={`0 0 1080 ${H}`} style={{position: 'absolute', inset: 0}}>
          <Hooded x={540} y={640} s={1.3} turn={turn} />
        </svg>
      </Cam>
      <Grain k={2} />
    </>
  );
};

// моя комната: чёрный монитор, в отражении — я и кто-то за спиной
const RoomScene: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const other = interpolate(f, [v(125), v(125) + 25], [0, 0.55], clamp);
  const off = f < S.room + 10 ? 1 - (f - S.room) / 10 : 0;
  return (
    <>
      <AbsoluteFill style={{height: H, background: '#030408'}} />
      <Cam s={interpolate(f, [S.room, S.gone], [1, 1.2], clamp)} y={520}>
        <svg width={1080} height={H} viewBox={`0 0 1080 ${H}`} style={{position: 'absolute', inset: 0}}>
          <defs><linearGradient id="refl" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#1a2030" /><stop offset="1" stopColor="#05060a" /></linearGradient></defs>
          <rect x={60} y={150} width={960} height={600} rx={16} fill="#0a0b0f" />
          <rect x={84} y={174} width={912} height={552} fill="url(#refl)" />
          {off > 0 && <rect x={84} y={174} width={912} height={552} fill={CYAN} opacity={off} />}
          <g opacity={0.5}>
            <path d="M380 726 C 380 600, 440 560, 540 560 C 640 560, 700 600, 700 726 Z" fill="#000" />
            <ellipse cx={540} cy={500} rx={70} ry={84} fill="#000" />
          </g>
          {other > 0 && (
            <g opacity={other}>
              <path d="M720 726 C 720 640, 760 600, 830 600 C 900 600, 940 640, 940 726 Z" fill="#000" />
              <ellipse cx={830} cy={550} rx={52} ry={62} fill="#000" />
              <circle cx={815} cy={548} r={3.5} fill="#ddd" /><circle cx={845} cy={548} r={3.5} fill="#ddd" />
            </g>
          )}
          <path d="M84 174 L 400 174 L 200 726 L 84 726 Z" fill="#fff" opacity={0.03} />
          <rect x={500} y={750} width={80} height={80} fill="#0a0b0f" />
          <rect x={360} y={830} width={360} height={24} rx={8} fill="#0a0b0f" />
          <rect x={120} y={900} width={500} height={40} rx={8} fill="#0e1016" />
          <rect x={720} y={890} width={90} height={60} rx={30} fill="#0e1016" />
        </svg>
      </Cam>
      {f >= v(119) && f < v(125) && <Big x={540} y={1000} s={pop(f, v(119), fps)} size={60} color="#fff">тишина...</Big>}
      {f >= v(125) && <Big x={540} y={1000} s={pop(f, v(125), fps, 340, 9)} size={88} color={RED}>*щёлк*</Big>}
      <Grain k={1.5} />
    </>
  );
};

const Gone: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const gone = interpolate(f, [v(128), v(128) + 10], [0, 1], clamp);
  const folder = pop(f, v(131), fps, 220, 14);
  const hl = f >= v(139) ? 0.6 + 0.4 * Math.sin(f / 3) : 0;
  const file = (name: string, date: string, red = false) => (
    <div style={{display: 'flex', justifyContent: 'space-between', padding: '14px 22px', fontSize: 28, fontWeight: 600, color: red ? (hl ? '#fff' : '#c0141e') : '#333', background: red && hl ? `rgba(255,43,54,${hl})` : 'transparent', borderRadius: 6}}>
      <span>{name}</span><span style={{color: red ? (hl ? '#fff' : '#c0141e') : '#888'}}>{date}</span>
    </div>
  );
  return (
    <>
      <AbsoluteFill style={{height: H, background: NIGHT}} />
      <div style={{position: 'absolute', left: 540, top: 470, transform: `translate(-50%, -50%) scale(${1 - 0.3 * folder})`, opacity: 1 - 0.6 * folder}}><IrkCard w={300} gone={gone} /></div>
      {f >= v(131) && (
        <div style={{position: 'absolute', left: 540, top: 720, width: 940, transform: `translate(-50%, -50%) scale(${0.8 + 0.2 * folder})`, opacity: Math.min(1, folder * 2), background: '#f3f3f3', borderRadius: 14, overflow: 'hidden', fontFamily: 'Montserrat',
          boxShadow: '0 30px 70px rgba(0,0,0,0.7)'}}>
          <div style={{background: '#fff', padding: '18px 24px', fontWeight: 900, fontSize: 32, color: '#222', borderBottom: '1px solid #ddd'}}>📁 Загрузки</div>
          <div style={{padding: 12}}>
            {file('cfg_aim_2024.cfg', '12.01.2025')}
            {file('crosshair.txt', '03.06.2025')}
            {file('de_irkutsk.vpk', '14.03.1998', true)}
            {file('demo_faceit.dem', '20.10.2026')}
          </div>
        </div>
      )}
      <Grain />
    </>
  );
};

const Ask: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <>
      <AbsoluteFill style={{height: H, background: `radial-gradient(ellipse at 50% 45%, #3a0d14, ${NIGHT} 70%)`}} />
      <div style={{position: 'absolute', left: 540, top: 560, transform: `translate(-50%, -50%) scale(${interpolate(f, [S.ask, S.end], [1.2, 1.45], clamp)})`}}>
        <Img src={staticFile('home/graf_b.png')} style={{width: 380, height: 560}} />
      </div>
      {f >= v(144) && <Big x={800} y={330} s={pop(f, v(144), fps, 320, 9)} size={240} color={RED}>?</Big>}
      <Grain />
    </>
  );
};

const End: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (f < S.end) return null;
  const m = pop(f, S.end, fps, 320, 9), p = pop(f, S.end + 8, fps);
  return (
    <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 45%, #3a0d14, ${NIGHT} 70%)`, alignItems: 'center', justifyContent: 'center', paddingBottom: 260, textAlign: 'center'}}>
      <div style={{transform: `scale(${0.6 + 0.4 * m})`, opacity: Math.min(1, m * 2)}}><IrkCard w={200} glow={1} /></div>
      <div style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 30, color: '#fff', background: RED, padding: '6px 18px', borderRadius: 8, opacity: p, letterSpacing: 3, marginTop: 30}}>ЧАСТЬ 2</div>
      <div style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 70, color: '#fff', marginTop: 16, opacity: p, lineHeight: 1.05}}>Я ЗАШЁЛ<br />В ПОДЪЕЗД</div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- звук (эффекты сильно тише голоса)
type Fx = [number, string, number];
const SFX: Fx[] = [
  [0, 'sfx/drone.wav', 0.35], [8, 'sfx2/click.wav', 0.3], [v(11), 'sfx2/click.wav', 0.4], [v(12), 'sfx2/shimmer.wav', 0.3],
  [v(13), 'sfx2/error.wav', 0.25], [v(19), 'sfx2/error.wav', 0.25], [v(23), 'sfx2/error.wav', 0.25],
  [S.name, 'sfx2/whoosh.wav', 0.3], [v(28), 'sfx2/impact.wav', 0.4], [v(32), 'sfx2/glitch.wav', 0.4], [v(32), 'sfx/hit.wav', 0.35],
  [S.era, 'sfx2/whoosh.wav', 0.3], [v(40), 'sfx2/deflate.wav', 0.35],
  [S.load, 'sfx/drone.wav', 0.3], [v(45), 'sfx2/impact.wav', 0.4],
  ...Array.from({length: 7}).map((_, i): Fx => [v(63) + i * 6, 'sfx2/key1.wav', 0.25]), [v(68), 'sfx2/hit.wav', 0.35],
  [v(70), 'sfx2/stamp.wav', 0.35], [v(81), 'sfx2/click.wav', 0.5], [v(81) + 2, 'money/boom.wav', 0.35],
  [S.window, 'tilt/heart.wav', 0.35], [v(90), 'tilt/heart.wav', 0.4], [v(93), 'tilt/heart.wav', 0.45], [v(97), 'sfx2/key0.wav', 0.25], [v(98), 'sfx2/key2.wav', 0.25],
  [v(108), 'sfx2/impact.wav', 0.45], [v(112), 'sfx2/riser.wav', 0.35], [v(114) + 8, 'sfx2/glitch.wav', 0.5], [v(114) + 8, 'money/boom.wav', 0.45],
  [S.room, 'sfx2/deflate.wav', 0.3], [v(125), 'sfx2/click.wav', 0.9], [v(128), 'sfx2/error.wav', 0.3], [v(139), 'sfx2/glitch.wav', 0.4],
  [v(144), 'sfx2/impact.wav', 0.4], [S.end, 'money/boom.wav', 0.5],
];
const GAIN = 0.55;

const Sound: React.FC = () => (
  <>
    {VO.map((o) => (
      <Sequence key={o.src} from={fr(o.at)} durationInFrames={fr(o.dur) + 6}>
        <Audio src={staticFile(o.src)} volume={1} />
      </Sequence>
    ))}
    {Array.from({length: Math.ceil(TOTAL / 11.5)}).map((_, i) => (
      <Sequence key={i} from={Math.round(i * 11.5 * FPS)} durationInFrames={12 * FPS}>
        <Audio src={staticFile('tilt/pad.wav')} volume={(x) => {
          const g = i * 11.5 * FPS + x;
          return g >= S.room && g < S.gone ? 0.02 : 0.1;
        }} />
      </Sequence>
    ))}
    {SFX.map(([at, src, vol], i) => (
      <Sequence key={i} from={Math.max(0, at)} durationInFrames={FPS * 2}>
        <Audio src={staticFile(src)} volume={vol * GAIN} />
      </Sequence>
    ))}
  </>
);

export const Irk: React.FC = () => {
  loadFonts();
  loadCaveat();
  const order: [number, number, React.FC, boolean?][] = [
    [S.hook, S.search, Hook], [S.search, S.name, Search, true], [S.name, S.era, Name, true], [S.era, S.load, Era, true], [S.load, S.yard, Loading],
    [S.yard, S.house, YardScene, true], [S.house, S.window, HouseScene, true], [S.window, S.monitor, WindowScene, true], [S.monitor, S.turn, MonitorScene, true],
    [S.turn, S.room, TurnScene, true], [S.room, S.gone, RoomScene, true], [S.gone, S.ask, Gone], [S.ask, S.end, Ask, true],
  ];
  return (
    <AbsoluteFill style={{background: NIGHT}}>
      {order.map(([from, to, C, cut], i) => <Scene key={i} from={from} to={to} cut={cut}><C /></Scene>)}
      <Flash at={v(32)} len={10} />
      <Flash at={v(45)} len={10} color="rgba(255,255,255,0.25)" />
      <Flash at={v(81)} len={12} color="rgba(255,200,97,0.4)" />
      <Flash at={v(114) + 8} len={16} />
      <Flash at={v(125)} len={8} color="rgba(255,255,255,0.2)" />
      <AbsoluteFill style={{top: H - 220, height: 220, background: `linear-gradient(rgba(7,10,20,0), ${NIGHT})`}} />
      <Captions cues={CUES} />
      <End />
      <Sound />
    </AbsoluteFill>
  );
};
