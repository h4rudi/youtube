// TikTok-ролик «Тело в клатче 1 против 5» (9:16, ≈55 с). Герой — Лёха v2.
// Исходники пользователя (public/clutch): верхняя панель CS2 «1 v 5» (цифры таймера закрашены — время рисуем сами),
// кадр от первого лица с AK (чат с чужим ником заблюрен), строка килфида (из неё иконка хедшота).
import React from 'react';
import {AbsoluteFill, Audio, Img, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {loadFonts} from '../theme';
import {FPS, fr} from '../tilt/script';
import {VO, TOTAL, CUES, v} from './script';
import {Captions, clamp, pop} from '../tilt/UI';
import {ramp} from '../tilt/Tilt';
import {Scene, Cam, Flash} from '../money/Money';
import {Portrait, H, RED} from '../money/Props';
import {Facecam} from '../cases/Rig';
import {Eye, HandMouse} from '../body/Figures';

export const CLUTCH_FRAMES = fr(TOTAL);

const S = {
  hook: 0, sec1: v(13) - 4, sec3: v(26) - 4, sec5: v(43) - 4, kills: v(59) - 4, third: v(68) - 4, breathe: v(74) - 4, ace: v(91) - 4, after: v(94) - 4, end: fr(52.0),
};
const GOLD = '#ffd23f', GREEN = '#2bd96b', CT = '#5d9cec', T = '#e8b23a';
const img = (p: string) => staticFile(`clutch/${p}`);
const KILLS = [v(59), v(61), v(68), v(91), v(92)];
const VICTIMS = ['bibble', 'k4p', 'Dimas', 'shrimp', 'zxc_god'];
const killsAt = (f: number) => KILLS.filter((k) => f >= k).length;

const Bg: React.FC<{glow?: string}> = ({glow = '#3a4a8a'}) => (
  <AbsoluteFill style={{height: H, backgroundColor: '#0b0c12', backgroundImage: `radial-gradient(ellipse at 50% 35%, ${glow}55, #0b0c12 70%), radial-gradient(rgba(120,150,230,0.1) 2px, transparent 2px)`, backgroundSize: 'auto, 44px 44px'}} />
);
const Big: React.FC<{x: number; y: number; s: number; size: number; color?: string; children: React.ReactNode}> = ({x, y, s, size, color = '#fff', children}) => (
  <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%, -50%) scale(${s})`, opacity: Math.min(1, s * 2), fontFamily: 'Montserrat', fontWeight: 900, fontSize: size,
    color, whiteSpace: 'nowrap', textAlign: 'center', lineHeight: 1.05, textShadow: color === '#fff' ? '0 4px 0 rgba(0,0,0,0.6)' : `0 0 34px ${color}88, 0 4px 0 rgba(0,0,0,0.6)`}}>{children}</div>
);
const Chip: React.FC<{x: number; y: number; s: number; bg: string; color?: string; size?: number; children: React.ReactNode}> = ({x, y, s, bg, color = '#fff', size = 40, children}) => (
  <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%, -50%) scale(${s})`, opacity: Math.min(1, s * 2), background: bg, color, fontFamily: 'Montserrat', fontWeight: 900,
    fontSize: size, padding: '12px 30px', borderRadius: 50, whiteSpace: 'nowrap', boxShadow: `0 0 30px ${bg}88`}}>{children}</div>
);

// верхняя панель CS2: аватарки врагов гаснут после каждого фрага, таймер идёт, «1 v N»
const Hud: React.FC<{f: number; y?: number; w?: number}> = ({f, y = 150, w = 1040}) => {
  const sc = w / 1300;
  const k = killsAt(f);
  const t = Math.max(0, 38 - Math.floor(f / FPS / 2));
  const xs = [465, 621, 778, 935, 1092];
  return (
    <div style={{position: 'absolute', left: (1080 - w) / 2, top: y, width: w, height: 180 * sc + 60}}>
      <div style={{position: 'relative', width: w, height: 180 * sc, borderRadius: 12, overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.5)'}}>
        <Img src={img('hud_notimer.png')} style={{width: w, height: 180 * sc}} />
        <div style={{position: 'absolute', left: 300 * sc, top: 62 * sc, transform: 'translate(-50%, -50%)', fontFamily: 'Russo One', fontSize: 78 * sc, color: t <= 10 ? '#ff5a5a' : '#fff'}}>0:{String(t).padStart(2, '0')}</div>
        {xs.map((x, i) => {
          const d = i < k ? Math.min(1, (f - KILLS[i]) / 6) : 0;
          return d > 0 ? <div key={i} style={{position: 'absolute', left: x * sc, top: 22 * sc, width: 133 * sc, height: 130 * sc, background: `rgba(70,70,74,${0.78 * d})`, mixBlendMode: 'normal',
            border: `${4 * sc}px solid rgba(120,120,120,${d})`, boxSizing: 'border-box'}} /> : null;
        })}
      </div>
      <div style={{textAlign: 'center', marginLeft: -(w - 600 * sc) * 0, width: 600 * sc, fontFamily: 'Montserrat', fontWeight: 900, fontSize: 64, color: '#fff', transform: 'skewX(-12deg)',
        textShadow: '0 3px 0 #000'}}>1 v {5 - k}</div>
    </div>
  );
};

// строка килфида в стиле CS2
const KillRow: React.FC<{victim: string; a: number}> = ({victim, a}) => (
  <div style={{display: 'flex', alignItems: 'center', gap: 16, background: 'rgba(30,14,14,0.85)', border: `3px solid ${a > 0 ? '#c8c8c8' : 'transparent'}`, borderRadius: 10, padding: '8px 20px',
    fontFamily: 'Montserrat', fontWeight: 900, fontSize: 36, opacity: Math.min(1, a * 3), transform: `translateX(${(1 - Math.min(1, a * 2)) * 60}px)`}}>
    <span style={{color: CT}}>Лёха</span>
    <Img src={img('ak_w.png')} style={{height: 44}} />
    <Img src={img('hs.png')} style={{height: 40}} />
    <span style={{color: T}}>{victim}</span>
  </div>
);
const Killfeed: React.FC<{f: number; x?: number; y?: number}> = ({f, x = 1050, y = 520}) => (
  <div style={{position: 'absolute', right: 1080 - x, top: y, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10}}>
    {KILLS.map((k, i) => (f >= k ? <KillRow key={i} victim={VICTIMS[i]} a={(f - k) / 8} /> : null))}
  </div>
);

// кадр игры: туннельное зрение (резкий центр, размытые и тёмные края) + тряска прицела
const Game: React.FC<{tunnel: number; shake: number; f: number; y?: number; w?: number}> = ({tunnel, shake, f, y = 560, w = 1080}) => {
  const h = w * (415 / 739);
  const dx = Math.sin(f * 1.9) * 14 * shake, dy = Math.cos(f * 2.6) * 10 * shake;
  const r = 70 - tunnel * 45;
  return (
    <div style={{position: 'absolute', left: (1080 - w) / 2, top: y - h / 2, width: w, height: h, overflow: 'hidden', borderRadius: 18}}>
      <div style={{position: 'absolute', inset: -30, transform: `translate(${dx}px, ${dy}px) scale(${1 + tunnel * 0.15})`}}>
        <Img src={img('game.png')} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: `blur(${tunnel * 10}px) saturate(${1 - tunnel * 0.6})`}} />
        <Img src={img('game.png')} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
          WebkitMaskImage: `radial-gradient(circle at 50% 50%, #000 ${r * 0.6}%, transparent ${r}%)`}} />
      </div>
      <div style={{position: 'absolute', inset: 0, background: `radial-gradient(circle at 50% 50%, transparent ${r * 0.8}%, rgba(0,0,0,${0.85 * tunnel}) ${r + 10}%)`}} />
      {/* прицел */}
      <svg width={w} height={h} style={{position: 'absolute', inset: 0}}>
        <g transform={`translate(${w / 2 + dx * 0.6}, ${h / 2 + dy * 0.6})`} stroke="#4cff6a" strokeWidth={4}>
          <line x1={0} y1={-26} x2={0} y2={-8} /><line x1={0} y1={8} x2={0} y2={26} /><line x1={-26} y1={0} x2={-8} y2={0} /><line x1={8} y1={0} x2={26} y2={0} />
          {tunnel > 0.5 && <circle r={60 + Math.sin(f / 4) * 6} fill="none" stroke="#4cff6a" strokeWidth={3} opacity={0.6} />}
        </g>
      </svg>
    </div>
  );
};

// кардиограмма с пульсом
const Ecg: React.FC<{f: number; bpm: number; y: number}> = ({f, bpm, y}) => {
  const period = (60 / bpm) * FPS * 4;
  const pts: string[] = [];
  for (let x = 0; x <= 840; x += 6) {
    const ph = ((x + f * 9) % period) / period;
    const yy = ph > 0.42 && ph < 0.46 ? -70 : ph > 0.46 && ph < 0.5 ? 60 : ph > 0.5 && ph < 0.53 ? -20 : 0;
    pts.push(`${x},${yy}`);
  }
  const beat = Math.sin(((f * 9) / period) * Math.PI * 2) > 0.92;
  return (
    <div style={{position: 'absolute', left: 60, top: y, width: 960, height: 260, background: 'rgba(8,10,16,0.92)', border: '4px solid #2c3350', borderRadius: 26, overflow: 'hidden'}}>
      <svg width={840} height={200} style={{position: 'absolute', left: 20, top: 30}}>
        <polyline points={pts.join(' ')} transform="translate(0,100)" fill="none" stroke={bpm > 115 ? RED : GREEN} strokeWidth={6} strokeLinejoin="round" />
      </svg>
      <div style={{position: 'absolute', right: 30, top: 40, textAlign: 'right', fontFamily: 'Montserrat', fontWeight: 900}}>
        <div style={{fontSize: 96, color: bpm > 115 ? RED : '#fff', lineHeight: 1}}>{Math.round(bpm)}</div>
        <div style={{fontSize: 28, color: '#8e9ab8'}}>УД/МИН</div>
      </div>
      <svg width={80} height={80} viewBox="0 0 100 100" style={{position: 'absolute', right: 230, top: 50, transform: `scale(${beat ? 1.2 : 1})`}}>
        <path d="M50 88 C20 66 6 48 6 30 A22 22 0 0 1 50 22 A22 22 0 0 1 94 30 C94 48 80 66 50 88 Z" fill={RED} />
      </svg>
    </div>
  );
};

// голосовой канал: тиммейты орут, потом «звук отключён мозгом»
export const Voice: React.FC<{f: number; mute: number; loud?: number; y?: number}> = ({f, mute, loud = 1, y = 300}) => (
  <div style={{position: 'absolute', left: 90, top: y, width: 900, background: '#2b2d31', borderRadius: 24, padding: 26, boxSizing: 'border-box', fontFamily: 'Montserrat', boxShadow: '0 30px 60px rgba(0,0,0,0.5)'}}>
    <div style={{fontSize: 26, fontWeight: 900, color: '#949ba4', marginBottom: 14}}>🔊 ГОЛОСОВОЙ · КЛАТЧ</div>
    {['Санёк', 'Димон', 'kirill', 'Макс'].map((n, i) => {
      const talk = (Math.sin(f / 3 + i * 1.7) * 0.5 + 0.5) * loud * (1 - mute);
      return (
        <div key={n} style={{display: 'flex', alignItems: 'center', gap: 18, padding: '10px 0', opacity: 1 - mute * 0.5}}>
          <div style={{width: 64, height: 64, borderRadius: 32, background: ['#f0a24a', '#5865f2', '#3ba55d', '#eb459e'][i], border: `4px solid ${talk > 0.3 ? '#23a55a' : 'transparent'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: 30}}>{n[0].toUpperCase()}</div>
          <div style={{fontSize: 34, fontWeight: 900, color: '#f2f3f5', width: 200}}>{n}</div>
          <div style={{display: 'flex', gap: 5, alignItems: 'center', height: 50}}>
            {Array.from({length: 16}).map((_, b) => <div key={b} style={{width: 10, height: 6 + Math.abs(Math.sin(f / 2 + b * 0.9 + i)) * 40 * talk, background: '#23a55a', borderRadius: 4}} />)}
          </div>
          {mute > 0.5 && <svg width={44} height={44} viewBox="0 0 24 24" style={{marginLeft: 'auto'}}><path d="M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3zM5 11a7 7 0 0 0 14 0M12 18v3M3 3l18 18" stroke="#f23f43" strokeWidth={2.4} fill="none" strokeLinecap="round" /></svg>}
        </div>
      );
    })}
  </div>
);

// ---------------------------------------------------------------- сцены
const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <>
      <Cam s={interpolate(f, [0, S.sec1], [1.0, 1.1], clamp)} y={800}>
        <Portrait f={f} bg="dorm" mood={f >= v(2) ? 'shocked' : 'neutral'} sweat={f >= v(5)} scale={1.3} y={1040} light="#6a8cff" lightAmt={0.1} />
      </Cam>
      <Hud f={f} y={150} />
      <Big x={540} y={540} s={pop(f, v(5), fps)} size={56} color={GOLD}>ЧТО С ТЕЛОМ?</Big>
    </>
  );
};

const Sec1: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const bpm = f < v(20) ? 75 : f < v(21) ? 100 : f < v(23) ? 120 : 140;
  return (
    <>
      <Bg glow="#5a1a22" />
      <Chip x={540} y={150} s={pop(f, S.sec1 + 2, fps)} bg="#1c2030" size={40}>СЕКУНДА 1</Chip>
      <div style={{position: 'absolute', left: 540, top: 300, transform: `translate(-50%, -50%) scale(${pop(f, v(16), fps, 300, 10)})`, background: 'rgba(10,11,16,0.9)', borderTop: `4px solid ${RED}`,
        borderBottom: `4px solid ${RED}`, padding: '18px 60px', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 64, color: '#fff', letterSpacing: 4, whiteSpace: 'nowrap'}}>ПОСЛЕДНИЙ ИГРОК</div>
      {f >= v(18) && <Ecg f={f} bpm={bpm} y={470} />}
      <Facecam x={540} y={950} r={150} mood={f >= v(23) ? 'shocked' : 'worried'} sweat ring={RED} />
    </>
  );
};

const Sec3: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const showGame = f >= v(32) - 4;
  const tunnel = ramp(f, v(33), v(35) + 6) * 0.75 + ramp(f, v(39), v(42)) * 0.25;
  return (
    <>
      <Bg glow="#5a3a1a" />
      <Chip x={540} y={150} s={pop(f, S.sec3 + 2, fps)} bg="#1c2030" size={40}>СЕКУНДА 3</Chip>
      {!showGame && (
        <div style={{position: 'absolute', left: 540, top: 560, transform: `translate(-50%, -50%) scale(${pop(f, v(29), fps)})`, textAlign: 'center'}}>
          <svg width={260} height={340} viewBox="0 0 100 130">
            <path d="M50 6 C34 40 16 60 16 84 A34 34 0 0 0 84 84 C84 60 66 40 50 6 Z" fill={RED} stroke="#fff" strokeWidth={4} />
            <path d="M34 82 h32 M50 66 v32" stroke="#fff" strokeWidth={8} strokeLinecap="round" />
          </svg>
          <Big x={130} y={400} s={pop(f, v(31), fps, 300, 10)} size={90} color={RED}>АДРЕНАЛИН</Big>
        </div>
      )}
      {showGame && <Game f={f} tunnel={tunnel} shake={0.15} y={600} />}
      {showGame && <Chip x={540} y={980} s={pop(f, v(37), fps)} bg="#1d6a2a" size={40}>ТОЛЬКО ПРИЦЕЛ</Chip>}
    </>
  );
};

const Sec5: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const mute = ramp(f, v(53), v(56) + 6);
  const steps = f >= v(57);
  return (
    <>
      <Bg glow="#2a3a6a" />
      <Chip x={540} y={150} s={pop(f, S.sec5 + 2, fps)} bg="#1c2030" size={40}>СЕКУНДА 5</Chip>
      <Voice f={f} mute={mute} y={250} />
      {mute > 0.3 && <Chip x={540} y={740} s={pop(f, v(55), fps, 300, 10)} bg={RED} size={42}>МОЗГ ВЫКЛЮЧИЛ ЗВУК</Chip>}
      {steps && (
        <svg width={1080} height={300} style={{position: 'absolute', left: 0, top: 800}}>
          {[0, 1, 2, 3].map((i) => {
            const on = Math.floor((f - v(57)) / 6) % 4 === i;
            return (
              <g key={i} transform={`translate(${260 + i * 180}, ${i % 2 ? 140 : 100}) rotate(${i % 2 ? 12 : -12})`} opacity={on ? 1 : 0.35}>
                <ellipse cx={0} cy={0} rx={30} ry={48} fill="#fff" /><ellipse cx={0} cy={70} rx={22} ry={22} fill="#fff" />
                {on && <circle r={90} fill="none" stroke={GOLD} strokeWidth={5} opacity={0.6} />}
              </g>
            );
          })}
        </svg>
      )}
    </>
  );
};

const Kills: React.FC = () => {
  const f = useCurrentFrame();
  const shake = ramp(f, v(63), v(64) + 10) * 0.9;
  return (
    <>
      <Bg glow="#5a1a22" />
      <Hud f={f} y={120} w={900} />
      <Game f={f} tunnel={0.35} shake={shake} y={560} />
      <Killfeed f={f} x={1050} y={330} />
      {f >= v(62) - 4 && (
        <div style={{position: 'absolute', left: 540, top: 1000, transform: `translate(-50%, -50%) translate(${Math.sin(f * 2.4) * 10 * shake}px, ${Math.cos(f * 3.1) * 6 * shake}px) scale(0.9)`}}>
          <HandMouse click={(f % 6) < 3 ? 1 : 0} numb={0} wrist={0} f={f} />
        </div>
      )}
    </>
  );
};

const Third: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const breath = ramp(f, v(69), v(70) + 6);
  const eye = pop(f, v(71), fps);
  const pts: string[] = [];
  for (let x = 0; x <= 760; x += 8) pts.push(`${x},${Math.sin(x / 18 + f / 2) * 30 * (1 + Math.sin(x / 7) * 0.8) * breath}`);
  return (
    <>
      <Bg glow="#5a1a22" />
      <Hud f={f} y={120} w={900} />
      <Killfeed f={f} x={1050} y={330} />
      <div style={{position: 'absolute', left: 90, top: 570, width: 900, opacity: Math.min(1, breath * 3)}}>
        <div style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 38, color: '#fff'}}>ДЫХАНИЕ</div>
        <svg width={900} height={120}><polyline points={pts.join(' ')} transform="translate(60,60)" fill="none" stroke={RED} strokeWidth={6} /></svg>
      </div>
      {eye > 0 && (
        <div style={{position: 'absolute', left: 540, top: 900, transform: `translate(-50%, -50%) scale(${eye})`, textAlign: 'center'}}>
          <Eye blink={0} dry={ramp(f, v(72), v(73) + 10)} size={420} />
          <div style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 40, color: RED, marginTop: 6}}>МОРГАНИЙ: 0</div>
        </div>
      )}
    </>
  );
};

const Breathe: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const inP = ramp(f, v(79), v(84) - 2), outP = ramp(f, v(84), v(87));
  const phase = f < v(84) ? 'ВДОХ' : 'ВЫДОХ';
  const p = f < v(84) ? inP : outP;
  const count = Math.min(4, Math.floor(p * 4) + 1);
  // точка бежит по квадрату: вдох — верх и правая сторона, выдох — низ и левая
  const along = (f < v(84) ? inP * 0.5 : 0.5 + outP * 0.5) * 4;
  const side = Math.floor(along) % 4, t = along - Math.floor(along);
  const L = 420, ox = 540 - L / 2, oy = 500 - L / 2;
  const pt = [[ox + t * L, oy], [ox + L, oy + t * L], [ox + L - t * L, oy + L], [ox, oy + L - t * L]][side];
  const bpm = interpolate(ramp(f, v(87), v(88) + 20), [0, 1], [140, 92]);
  const calm = f >= v(89);
  return (
    <>
      <Bg glow="#1a4a3a" />
      <Chip x={540} y={150} s={pop(f, v(74), fps)} bg={GREEN} size={42}>КАК НЕ СГОРЕТЬ</Chip>
      {f >= v(79) - 4 && (
        <svg width={1080} height={900} style={{position: 'absolute', left: 0, top: 0}}>
          <rect x={ox} y={oy} width={L} height={L} rx={30} fill="none" stroke="#2c3350" strokeWidth={14} />
          <circle cx={pt[0]} cy={pt[1]} r={26} fill={GREEN} style={{filter: `drop-shadow(0 0 14px ${GREEN})`}} />
          <text x={540} y={480} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={70} fill="#fff">{phase}</text>
          <text x={540} y={590} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={130} fill={GREEN}>{count}</text>
        </svg>
      )}
      {f >= v(87) - 4 && (
        <div style={{position: 'absolute', left: 540, top: 880, transform: 'translate(-50%, -50%)', display: 'flex', gap: 24}}>
          <Chip x={0} y={0} s={1} bg={bpm > 115 ? RED : GREEN} size={44}>ПУЛЬС {Math.round(bpm)}</Chip>
        </div>
      )}
      {f >= v(87) - 4 && <div style={{position: 'absolute', left: 340, top: 990}}><Chip x={0} y={0} s={pop(f, v(89), fps)} bg={GREEN} size={40}>РУКИ: СПОКОЙНО ✓</Chip></div>}
      {!calm && f >= v(87) - 4 ? null : null}
    </>
  );
};

const Ace: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <>
      <Bg glow="#5a4a1a" />
      <Hud f={f} y={120} w={900} />
      <Game f={f} tunnel={0.2} shake={0} y={560} />
      <Killfeed f={f} x={1050} y={330} />
      {f >= v(93) && (
        <div style={{position: 'absolute', left: 540, top: 900, transform: `translate(-50%, -50%) rotate(-6deg) scale(${pop(f, v(93), fps, 300, 9)})`, border: `10px solid ${GOLD}`, color: GOLD,
          fontFamily: 'Montserrat', fontWeight: 900, fontSize: 140, padding: '0 50px', borderRadius: 20, background: 'rgba(10,11,16,0.85)', textShadow: `0 0 40px ${GOLD}`}}>ЭЙС</div>
      )}
    </>
  );
};

const After: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <>
      <Cam s={interpolate(f, [S.after, S.end], [1.0, 1.1], clamp)} y={800}>
        <Portrait f={f} bg="dorm" mood="shocked" sweat scale={1.3} y={1060} light={GOLD} lightAmt={0.08} />
      </Cam>
      <Voice f={f} mute={0} loud={1.6} y={130} />
      {f >= v(100) - 6 && (
        <div style={{position: 'absolute', left: 560, top: 670, transform: `translate(-50%, -50%) scale(0.7) translate(${Math.sin(f * 2.2) * 3}px, 0)`}}>
          <HandMouse click={0} numb={0} wrist={0} f={f} />
        </div>
      )}
    </>
  );
};

const End: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (f < S.end) return null;
  const a = pop(f, S.end + 2, fps), b = pop(f, S.end + 16, fps), c = pop(f, S.end + 34, fps);
  return (
    <AbsoluteFill style={{background: '#000', alignItems: 'center', justifyContent: 'center', paddingBottom: 280, textAlign: 'center'}}>
      <div style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 80, color: '#8e9ab8', opacity: a, transform: 'skewX(-12deg)'}}>1 v 5</div>
      <div style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 100, color: '#fff', lineHeight: 1.05, marginTop: 20, opacity: Math.min(1, b * 2), transform: `scale(${0.7 + 0.3 * b})`}}>
        ТВОЙ ЛУЧШИЙ<br /><span style={{color: GOLD, textShadow: `0 0 40px ${GOLD}88`}}>КЛАТЧ?</span>
      </div>
      <div style={{marginTop: 40, background: RED, color: '#fff', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 36, padding: '14px 36px', borderRadius: 50, opacity: c, transform: `scale(${0.6 + 0.4 * c})`}}>ПИШИ В КОММЕНТАРИЯХ</div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- звук (эффекты тише голоса)
type Fx = [number, string, number];
const beats = (from: number, to: number, bpm: number): Fx[] => {
  const out: Fx[] = [];
  for (let t = from; t < to; t += Math.round((60 / bpm) * FPS)) out.push([t, 'tilt/heart.wav', 0.45]);
  return out;
};
const SFX: Fx[] = [
  [0, 'money/boom.wav', 0.45], [v(2), 'sfx2/stamp.wav', 0.4], [v(5), 'sfx2/riser.wav', 0.25],
  [v(16), 'sfx2/impact.wav', 0.5], ...beats(v(18), v(20), 75), ...beats(v(20), v(21), 100), ...beats(v(21), v(23), 120), ...beats(v(23), S.sec3, 140),
  [v(29), 'sfx2/whoosh.wav', 0.35], [v(31), 'money/boom.wav', 0.45], [v(33), 'sfx2/riser.wav', 0.3], ...beats(S.sec3, S.sec5, 140),
  [v(53), 'sfx2/deflate.wav', 0.45], ...Array.from({length: 8}).map((_, i): Fx => [v(57) + i * 6, 'sfx2/tick.wav', 0.7]),
  ...KILLS.flatMap((k): Fx[] => [[k - 2, 'tilt/shot.wav', 0.6], [k, 'tilt/hs.wav', 0.5]]),
  [v(63), 'tilt/heart.wav', 0.5], [v(69), 'tilt/heart.wav', 0.5], [v(71), 'sfx2/blip_low.wav', 0.35],
  [v(74), 'sfx2/shimmer.wav', 0.3], [v(79), 'sfx2/riser.wav', 0.25], [v(84), 'sfx2/deflate.wav', 0.3], ...beats(v(87), S.ace, 92),
  [v(93), 'money/win.wav', 0.6], [v(93), 'sfx2/stamp.wav', 0.5], [S.after, 'sfx2/shimmer.wav', 0.3],
  [S.end, 'money/boom.wav', 0.45], [S.end + 16, 'sfx2/stamp.wav', 0.45], [S.end + 34, 'sfx2/pop.wav', 0.4],
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
        <Audio src={staticFile('tilt/pad.wav')} volume={0.1} />
      </Sequence>
    ))}
    {SFX.map(([at, src, vol], i) => (
      <Sequence key={i} from={Math.max(0, at)} durationInFrames={FPS * 2}>
        <Audio src={staticFile(src)} volume={vol * GAIN} />
      </Sequence>
    ))}
  </>
);

export const Clutch: React.FC = () => {
  loadFonts();
  const order: [number, number, React.FC, boolean?][] = [
    [S.hook, S.sec1, Hook], [S.sec1, S.sec3, Sec1, true], [S.sec3, S.sec5, Sec3, true], [S.sec5, S.kills, Sec5, true], [S.kills, S.third, Kills, true],
    [S.third, S.breathe, Third, true], [S.breathe, S.ace, Breathe], [S.ace, S.after, Ace, true], [S.after, S.end, After],
  ];
  return (
    <AbsoluteFill style={{background: '#07090f'}}>
      {order.map(([from, to, C, cut], i) => <Scene key={i} from={from} to={to} cut={cut}><C /></Scene>)}
      {KILLS.map((k, i) => <Flash key={i} at={k} len={6} color="rgba(255,255,255,0.35)" />)}
      <Flash at={v(16)} len={12} />
      <Flash at={v(93)} len={14} color="rgba(255,210,63,0.5)" />
      <AbsoluteFill style={{top: H - 220, height: 220, background: 'linear-gradient(rgba(7,9,15,0), #07090f)'}} />
      <Captions cues={CUES} />
      <End />
      <Sound />
    </AbsoluteFill>
  );
};
