// Реквизит ролика «Проснулся в 2013 году»: керамбит (ножи образца 2013, без бабочки — она вышла позже),
// ЭЛТ-монитор, меню CS:GO 2013, торговая площадка, голо-наклейки, настенный календарь, мессенджер, вид из окна.
import React from 'react';
import {random} from 'remotion';
import {LyokhaBust, L} from '../money/Lyokha';

const INK = '#15131a';
export const W = 1080, H = 1180;

// ---------------------------------------------------------------- керамбит с расцветкой
export type Skin = 'fade' | 'doppler' | 'tiger' | 'crimson' | 'slaughter' | 'marble';
const SKINS: Record<Skin, [string, string, string]> = {
  fade: ['#ffd23f', '#ff5fa2', '#8a5cff'], doppler: ['#1b1036', '#c13cff', '#ff4fa0'], tiger: ['#f2a73b', '#1a1208', '#f2a73b'],
  crimson: ['#5a0d12', '#d42a2a', '#3a0a0e'], slaughter: ['#ff9aa6', '#c2163a', '#ffd1d6'], marble: ['#3aa0ff', '#ff3a6a', '#ffe14a'],
};
export const Karambit: React.FC<{skin?: Skin; w?: number; id: string; glow?: string}> = ({skin = 'fade', w = 220, id, glow}) => {
  const [a, b, c] = SKINS[skin];
  return (
    <svg width={w} height={w * 0.62} viewBox="0 0 220 136" style={{overflow: 'visible', filter: glow ? `drop-shadow(0 0 12px ${glow})` : undefined}}>
      <defs>
        <linearGradient id={`kb-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={a} /><stop offset="0.5" stopColor={b} /><stop offset="1" stopColor={c} />
        </linearGradient>
      </defs>
      {/* лезвие-коготь */}
      <path d="M96 70 C70 40 40 20 8 22 C30 30 52 46 66 70 C74 84 82 92 96 92 Z" fill={`url(#kb-${id})`} stroke={INK} strokeWidth={4} strokeLinejoin="round" />
      {skin === 'tiger' && <path d="M30 28 l10 10 M46 34 l10 12 M60 46 l8 12" stroke="#1a1208" strokeWidth={6} />}
      {/* рукоять и кольцо */}
      <path d="M92 70 L170 66 Q182 66 184 78 L186 90 Q186 98 176 98 L94 94 Z" fill="#2a2d36" stroke={INK} strokeWidth={4} />
      <circle cx={196} cy={86} r={18} fill="none" stroke="#2a2d36" strokeWidth={9} />
      <circle cx={196} cy={86} r={18} fill="none" stroke={INK} strokeWidth={2} />
      <path d="M112 76 h50" stroke="#3a3e4a" strokeWidth={5} strokeLinecap="round" />
    </svg>
  );
};

// ---------------------------------------------------------------- ЭЛТ-монитор (4:3)
export const CRT: React.FC<{children: React.ReactNode; s?: number; x?: number; y?: number; flicker?: number}> = ({children, s = 1, x = 540, y = 560, flicker = 1}) => (
  <div style={{position: 'absolute', left: x, top: y, width: 900, height: 780, transform: `translate(-50%, -50%) scale(${s})`}}>
    {/* корпус */}
    <div style={{position: 'absolute', inset: 0, borderRadius: 44, background: 'linear-gradient(#d8d2c0, #b9b29d)', border: `6px solid ${INK}`, boxShadow: '0 40px 80px rgba(0,0,0,0.6)'}} />
    <div style={{position: 'absolute', left: 60, top: 50, width: 780, height: 590, borderRadius: 30, background: '#2a2a2a', border: `5px solid ${INK}`}} />
    {/* экран */}
    <div style={{position: 'absolute', left: 90, top: 78, width: 720, height: 540, borderRadius: 40, overflow: 'hidden', background: '#000', opacity: flicker}}>
      <svg width={720} height={540} viewBox="0 0 640 480">{children}</svg>
      <div style={{position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(rgba(0,0,0,0.22) 0 2px, transparent 2px 4px)'}} />
      <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(0,0,0,0.65))'}} />
    </div>
    {/* кнопки */}
    <div style={{position: 'absolute', left: 90, bottom: 52, width: 120, height: 22, borderRadius: 6, background: '#8f8873', border: `3px solid ${INK}`}} />
    <div style={{position: 'absolute', right: 100, bottom: 46, width: 34, height: 34, borderRadius: 17, background: '#5a5546', border: `3px solid ${INK}`}} />
    <div style={{position: 'absolute', right: 150, bottom: 58, width: 10, height: 10, borderRadius: 5, background: '#3bff5a', boxShadow: '0 0 10px #3bff5a'}} />
  </div>
);

// меню CS:GO образца 2013 года (в координатах 640×480)
export const OldMenu: React.FC<{banner: number; f: number}> = ({banner, f}) => (
  <g>
    <defs>
      <linearGradient id="om-bg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#2b3a4f" /><stop offset="1" stopColor="#0d141e" />
      </linearGradient>
    </defs>
    <rect width={640} height={480} fill="url(#om-bg)" />
    <text x={30} y={60} fontFamily="Russo One" fontSize={30} fill="#e9eef5">COUNTER-STRIKE</text>
    <text x={30} y={88} fontFamily="Russo One" fontSize={20} fill="#f2a73b" letterSpacing={3}>GLOBAL OFFENSIVE</text>
    {['ИГРАТЬ', 'ИНВЕНТАРЬ', 'НАСТРОЙКИ', 'ВЫХОД'].map((t, i) => (
      <text key={t} x={30} y={160 + i * 44} fontFamily="Montserrat" fontWeight={900} fontSize={24} fill={i === 1 ? '#fff' : '#8fa3bd'}>{t}</text>
    ))}
    {banner > 0 && (
      <g opacity={Math.min(1, banner * 2)} transform={`translate(400, 260) scale(${0.8 + 0.2 * banner})`}>
        <rect x={-200} y={-150} width={400} height={300} rx={14} fill="#1a2433" stroke="#f2a73b" strokeWidth={5} />
        <rect x={-200} y={-150} width={400} height={56} rx={14} fill="#f2a73b" />
        <text x={0} y={-112} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={26} fill="#1a1208">НОВОЕ ОБНОВЛЕНИЕ</text>
        <text x={0} y={-40} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={44} fill="#fff">СКИНЫ</text>
        <text x={0} y={0} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={26} fill="#8fa3bd">ДЛЯ ОРУЖИЯ И НОЖЕЙ</text>
        <g transform={`translate(-110, 30) rotate(${Math.sin(f / 10) * 4})`}><Karambit id="om" skin="fade" w={220} /></g>
      </g>
    )}
  </g>
);

// ---------------------------------------------------------------- значки сравнения цены
export const PlateIcon: React.FC<{s?: number}> = ({s = 1}) => (
  <svg width={90 * s} height={60 * s} viewBox="0 0 90 60">
    <ellipse cx={45} cy={40} rx={42} ry={16} fill="#f1ead8" stroke={INK} strokeWidth={4} />
    <path d="M20 36 Q45 6 70 36 Z" fill="#c9844a" stroke={INK} strokeWidth={4} />
    <path d="M30 30 h30" stroke="#7a4a22" strokeWidth={3} />
  </svg>
);
export const CarIcon: React.FC<{s?: number}> = ({s = 1}) => (
  <svg width={120 * s} height={64 * s} viewBox="0 0 120 64">
    <path d="M10 44 L16 26 Q20 18 30 18 L80 18 Q90 18 96 26 L108 40 Q114 42 114 48 L114 52 L6 52 L6 48 Q6 44 10 44 Z" fill="#ff3b47" stroke={INK} strokeWidth={4} />
    <path d="M30 24 L44 24 L44 38 L22 38 Z M52 24 L78 24 L90 38 L52 38 Z" fill="#bfe3ff" stroke={INK} strokeWidth={3} />
    <circle cx={32} cy={54} r={9} fill="#2a2d36" stroke={INK} strokeWidth={3} /><circle cx={90} cy={54} r={9} fill="#2a2d36" stroke={INK} strokeWidth={3} />
  </svg>
);
export const ShawarmaIcon: React.FC<{s?: number}> = ({s = 1}) => (
  <svg width={70 * s} height={90 * s} viewBox="0 0 70 90">
    <path d="M14 30 Q35 4 56 30 L50 86 L20 86 Z" fill="#e8c38a" stroke={INK} strokeWidth={4} />
    <path d="M16 32 Q35 14 54 32 L52 44 Q35 30 18 44 Z" fill="#7aa83a" stroke={INK} strokeWidth={3} />
    <path d="M22 56 h26 M24 68 h22" stroke="#b98a4a" strokeWidth={3} />
  </svg>
);

// ---------------------------------------------------------------- голо-наклейка «Катовице 2014» (без логотипов команд)
export const Sticker: React.FC<{hue: number; s?: number; f: number; label?: string}> = ({hue, s = 1, f, label = 'KATOWICE'}) => {
  const sh = (f * 3 + hue) % 360;
  return (
    <div style={{width: 170 * s, height: 170 * s, borderRadius: '50%', border: `${6 * s}px solid #fff`, boxShadow: `0 10px 20px rgba(0,0,0,0.5), 0 0 ${18 * s}px hsla(${sh},90%,65%,0.6)`,
      background: `conic-gradient(from ${sh}deg, hsl(${hue},90%,60%), hsl(${hue + 60},90%,65%), hsl(${hue + 140},90%,60%), hsl(${hue + 220},90%,65%), hsl(${hue},90%,60%))`,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'Montserrat', fontWeight: 900, color: '#fff', textShadow: '0 2px 0 rgba(0,0,0,0.5)'}}>
      <div style={{fontSize: 22 * s, letterSpacing: 1}}>{label}</div>
      <div style={{fontSize: 40 * s, lineHeight: 1}}>2014</div>
      <div style={{fontSize: 14 * s, marginTop: 4 * s, background: 'rgba(0,0,0,0.35)', padding: `${2 * s}px ${8 * s}px`, borderRadius: 8}}>HOLO</div>
    </div>
  );
};

// ---------------------------------------------------------------- настенный календарь
export const WallCalendar: React.FC<{month: string; year: string; flip?: number; circle?: number}> = ({month, year, flip = 0, circle = 0}) => (
  <div style={{position: 'absolute', left: 540, top: 560, width: 620, height: 720, transform: 'translate(-50%, -50%)', perspective: 1400}}>
    <div style={{position: 'absolute', left: 290, top: -26, width: 40, height: 40, borderRadius: 20, background: '#55585f', border: `4px solid ${INK}`, zIndex: 3}} />
    <div style={{position: 'absolute', inset: 0, background: '#f1ead8', border: `6px solid ${INK}`, borderRadius: 14, boxShadow: '0 30px 60px rgba(0,0,0,0.6)', overflow: 'hidden'}}>
      <div style={{height: 160, background: '#c4232d', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'Montserrat', fontWeight: 900, color: '#fff'}}>
        <div style={{fontSize: 70, lineHeight: 1}}>{month}</div>
        <div style={{fontSize: 44, opacity: 0.9}}>{year}</div>
      </div>
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8, padding: 24}}>
        {Array.from({length: 35}).map((_, i) => {
          const d = i - 3;
          const today = d === 13;
          return (
            <div key={i} style={{height: 62, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 30,
              color: d < 1 || d > 31 ? 'transparent' : i % 7 >= 5 ? '#c4232d' : '#23262f', position: 'relative'}}>
              {d}
              {today && circle > 0 && <div style={{position: 'absolute', width: 70, height: 70, borderRadius: 35, border: '6px solid #c4232d', transform: `scale(${circle})`, opacity: circle}} />}
            </div>
          );
        })}
      </div>
    </div>
    {flip > 0 && flip < 1 && (
      <div style={{position: 'absolute', inset: 0, background: '#e8dfca', border: `6px solid ${INK}`, borderRadius: 14, transformOrigin: 'top', transform: `rotateX(${flip * 110}deg)`, opacity: 1 - flip * 0.6}} />
    )}
  </div>
);

// ---------------------------------------------------------------- старый мессенджер (без бренда)
export const Messenger: React.FC<{msgs: {name: string; text: string; color: string; p: number}[]}> = ({msgs}) => (
  <div style={{position: 'absolute', left: 540, top: 520, width: 880, transform: 'translate(-50%, -50%)', background: '#eaf3fb', borderRadius: 16, border: `5px solid ${INK}`,
    boxShadow: '0 30px 60px rgba(0,0,0,0.6)', overflow: 'hidden', fontFamily: 'Montserrat'}}>
    <div style={{height: 70, background: 'linear-gradient(#36a3e0, #1d7fbf)', display: 'flex', alignItems: 'center', padding: '0 24px', gap: 14, color: '#fff', fontWeight: 900, fontSize: 30}}>
      <div style={{width: 22, height: 22, borderRadius: 11, background: '#7dff6a', border: '3px solid #fff'}} /> Чат «Пацаны CS» · 2013
    </div>
    <div style={{padding: 26, display: 'flex', flexDirection: 'column', gap: 16}}>
      {msgs.map((m, i) => (
        <div key={i} style={{opacity: Math.min(1, m.p * 2), transform: `translateY(${(1 - Math.min(1, m.p)) * 20}px)`, background: '#fff', borderRadius: 14, padding: '14px 20px', border: '3px solid #c5d9ea'}}>
          <div style={{fontSize: 28, fontWeight: 900, color: m.color}}>{m.name}</div>
          <div style={{fontSize: 36, fontWeight: 600, color: '#1d2330'}}>{m.text}</div>
        </div>
      ))}
    </div>
  </div>
);

// ---------------------------------------------------------------- вид из окна 2013: Лёха со спины
export const Window2013: React.FC<{f: number; year: number}> = ({f, year}) => (
  <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute', inset: 0}}>
    <defs>
      <linearGradient id="w13-sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#ffb36b" /><stop offset="0.6" stopColor="#ff7a6b" /><stop offset="1" stopColor="#6a4a8a" />
      </linearGradient>
    </defs>
    <rect width={W} height={H} fill="#1a1c24" />
    {/* окно */}
    <rect x={120} y={90} width={840} height={760} fill="url(#w13-sky)" stroke={INK} strokeWidth={10} />
    <circle cx={720} cy={300} r={70} fill="#ffe7a8" opacity={0.9} />
    {[[120, 420, 220], [330, 360, 200], [530, 450, 190], [720, 390, 240]].map(([x, y, w], i) => (
      <g key={i}>
        <rect x={x} y={y} width={w} height={850 - y} fill="#3a2f4a" stroke={INK} strokeWidth={5} />
        {Array.from({length: 6}).map((_, r) => Array.from({length: 3}).map((__, c) => (
          <rect key={`${r}${c}`} x={x + 24 + c * 64} y={y + 26 + r * 66} width={30} height={36} fill={random(`w13${i}${r}${c}`) > 0.6 ? '#ffd27a' : '#2a2238'} />
        )))}
      </g>
    ))}
    {/* баннер с годом на крыше */}
    <g opacity={year} transform={`translate(430, 300) scale(${0.8 + 0.2 * year})`}>
      <rect x={-130} y={-60} width={260} height={110} rx={10} fill="#0b0c10" stroke="#ffd23f" strokeWidth={6} />
      <text x={0} y={30} textAnchor="middle" fontFamily="Russo One" fontSize={84} fill="#ffd23f" style={{filter: 'drop-shadow(0 0 10px #ffd23f)'}}>2013</text>
    </g>
    <line x1={540} y1={90} x2={540} y2={850} stroke={INK} strokeWidth={10} />
    <line x1={120} y1={470} x2={960} y2={470} stroke={INK} strokeWidth={10} />
    <rect x={90} y={850} width={900} height={40} fill="#3a3d4a" stroke={INK} strokeWidth={6} />
    {/* Лёха со спины */}
    <g transform={`translate(540, ${1180 + Math.sin(f / 20) * 3})`}>
      <path d="M-200 0 L-186 -250 Q-172 -330 -80 -342 L80 -342 Q172 -330 186 -250 L200 0 Z" fill={L.hood} stroke={INK} strokeWidth={6} />
      <path d="M-86 -342 Q0 -296 86 -342 L74 -386 Q0 -350 -74 -386 Z" fill={L.hoodL} stroke={INK} strokeWidth={5} />
      <circle cx={0} cy={-450} r={100} fill={L.hair} stroke={INK} strokeWidth={6} />
      <ellipse cx={-100} cy={-440} rx={18} ry={28} fill={L.skin} stroke={INK} strokeWidth={4} />
      <ellipse cx={100} cy={-440} rx={18} ry={28} fill={L.skin} stroke={INK} strokeWidth={4} />
      <path d="M-104 -372 Q0 -320 104 -372" stroke="#0e0f14" strokeWidth={16} fill="none" />
    </g>
  </svg>
);

export const Bust: typeof LyokhaBust = LyokhaBust;
