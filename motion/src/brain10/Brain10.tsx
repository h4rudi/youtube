// TikTok-ролик «10 каток подряд — что с мозгом» (9:16, 59 с). Герой — Лёха v2.
// Исходники пользователя (public/brain10): история матчей FACEIT, иконка 6 уровня (5-й сделан из неё), флешка, AK-47, M4A1-S,
// экран поражения CS2 (обрезан до баннера и агентов — без чужих ников). ELO: 1325 → −24/−24/−17/−24/−21/−21… как на скрине.
import React from 'react';
import {AbsoluteFill, Audio, Img, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import {loadFonts} from '../theme';
import {FPS, fr} from '../tilt/script';
import {VO, TOTAL, CUES, v} from './script';
import {Captions, clamp, pop} from '../tilt/UI';
import {ramp} from '../tilt/Tilt';
import {Scene, Cam, Flash} from '../money/Money';
import {Portrait, H, RED} from '../money/Props';

export const BRAIN10_FRAMES = fr(TOTAL);

const S = {
  hook: 0, hist: v(15) - 4, balance: v(23) - 4, brain: v(31) - 4, m7: v(41) - 4, peek: v(52) - 4, stress: v(58) - 4,
  doomed: v(68) - 4, m10: v(79) - 4, rules: v(81) - 4, off: v(93) - 4, msg: v(97) - 4, end: fr(55.0),
};
const GREEN = '#2bd96b', GOLD = '#ffd23f', INK = '#15131a';
// ELO после k поражений (первые шесть — как на скрине пользователя)
const ELO = [1325, 1301, 1277, 1260, 1236, 1215, 1194, 1172, 1150, 1129, 1106];
const img = (p: string) => staticFile(`brain10/${p}`);

const Bg: React.FC<{glow?: string}> = ({glow = '#3a4a8a'}) => (
  <AbsoluteFill style={{height: H, backgroundColor: '#0b0c12', backgroundImage: `radial-gradient(ellipse at 50% 35%, ${glow}55, #0b0c12 70%), radial-gradient(rgba(120,150,230,0.1) 2px, transparent 2px)`, backgroundSize: 'auto, 44px 44px'}} />
);
const Big: React.FC<{x: number; y: number; s: number; size: number; color?: string; children: React.ReactNode}> = ({x, y, s, size, color = '#fff', children}) => (
  <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%, -50%) scale(${s})`, opacity: Math.min(1, s * 2), fontFamily: 'Montserrat', fontWeight: 900, fontSize: size,
    color, whiteSpace: 'nowrap', textAlign: 'center', lineHeight: 1.05, textShadow: color === '#fff' ? '0 4px 0 rgba(0,0,0,0.6)' : `0 0 34px ${color}88, 0 4px 0 rgba(0,0,0,0.6)`}}>{children}</div>
);
const Chip: React.FC<{x: number; y: number; s: number; bg: string; color?: string; size?: number; children: React.ReactNode}> = ({x, y, s, bg, color = '#fff', size = 40, children}) => (
  <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%, -50%) scale(${s})`, opacity: Math.min(1, s * 2), background: bg, color, fontFamily: 'Montserrat', fontWeight: 900,
    fontSize: size, padding: '12px 30px', borderRadius: 50, whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 14, boxShadow: `0 0 30px ${bg}88`}}>{children}</div>
);

// плашка «уровень + ELO + счётчик поражений»
const EloBadge: React.FC<{k: number; y?: number; s?: number; drop?: number}> = ({k, y = 230, s = 1, drop = 0}) => {
  const lvl = ELO[k] > 1200 ? 6 : 5;
  return (
    <div style={{position: 'absolute', left: 540, top: y, transform: `translate(-50%, -50%) scale(${s})`, display: 'flex', alignItems: 'center', gap: 26, background: 'rgba(14,16,26,0.95)',
      border: '4px solid #2c3350', borderRadius: 30, padding: '18px 34px'}}>
      <div style={{position: 'relative', width: 130, height: 130}}>
        <Img src={img(`lvl${lvl}.png`)} style={{width: 130, height: 130, transform: `scale(${1 + drop * 0.25}) rotate(${drop * -12}deg)`}} />
      </div>
      <div style={{fontFamily: 'Montserrat', fontWeight: 900}}>
        <div style={{fontSize: 30, color: '#8e9ab8'}}>ELO</div>
        <div style={{fontSize: 76, color: '#fff', lineHeight: 1}}>{ELO[k].toLocaleString('ru-RU')}</div>
      </div>
      <div style={{width: 4, height: 110, background: '#2c3350'}} />
      <div style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 96, color: RED, textShadow: `0 0 30px ${RED}88`}}>−{k}</div>
    </div>
  );
};

// реальная история матчей: показываем нижние k строк скриншота (новые поражения добавляются сверху)
const History: React.FC<{rows: number; y: number}> = ({rows, y}) => {
  const W0 = 407, H0 = 326, rowH = H0 / 6, sc = 2.3;
  const h = rows * rowH * sc;
  return (
    <div style={{position: 'absolute', left: 540, top: y, width: W0 * sc, height: h, transform: 'translateX(-50%)', overflow: 'hidden', borderRadius: 20, border: '4px solid #2c3350',
      boxShadow: '0 30px 60px rgba(0,0,0,0.6)'}}>
      <Img src={img('history.png')} style={{position: 'absolute', left: 0, top: -(H0 - rows * rowH) * sc, width: W0 * sc, height: H0 * sc}} />
    </div>
  );
};

// мозг в контурном стиле
const BrainSvg: React.FC<{red?: number; f: number; w?: number}> = ({red = 0, f, w = 520}) => {
  const pulse = red > 0 ? 0.5 + 0.5 * Math.sin(f / 4) : 0;
  const c = `rgb(${242}, ${161 - red * 90}, ${179 - red * 120})`;
  return (
    <svg width={w} height={w * 0.75} viewBox="0 0 400 300" style={{overflow: 'visible', filter: red > 0 ? `drop-shadow(0 0 ${20 + pulse * 20}px rgba(255,40,60,${0.5 * red}))` : undefined}}>
      <path d="M200 40 C150 0 70 20 60 80 C10 100 10 180 60 200 C70 260 150 270 190 240 L200 230 L210 240 C250 270 330 260 340 200 C390 180 390 100 340 80 C330 20 250 0 200 40 Z" fill={c} stroke={INK} strokeWidth={8} strokeLinejoin="round" />
      <path d="M200 40 L200 230" stroke={INK} strokeWidth={6} />
      <g stroke={INK} strokeWidth={5} fill="none" strokeLinecap="round" opacity={0.8}>
        <path d="M90 90 C120 80 130 110 160 100 M80 150 C110 140 120 170 160 160 M100 205 C130 195 140 220 170 210" />
        <path d="M310 90 C280 80 270 110 240 100 M320 150 C290 140 280 170 240 160 M300 205 C270 195 260 220 230 210" />
      </g>
    </svg>
  );
};

// ---------------------------------------------------------------- сцены
const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const msgs: [number, number, number, string][] = [[v(6), 200, 330, 'тиммейты дно'], [v(7), 760, 260, 'кто так играет?!'], [v(8), 260, 520, 'репорт этого бота'], [v(9), 790, 470, 'опять закинуло к ним']];
  const fade = 1 - ramp(f, v(11) - 2, v(11) + 8);
  const zoom = interpolate(ramp(f, v(11), v(14) + 10), [0, 1], [1, 1.35]);
  return (
    <>
      <Cam s={zoom} y={760}>
        <Portrait f={f} bg="dorm" mood={f < v(11) ? 'worried' : 'shocked'} sweat scale={1.35} y={1000} redness={0.3} light={RED} lightAmt={0.08} />
      </Cam>
      {msgs.map(([at, x, y, t], i) => {
        const s = pop(f, at, fps);
        return <div key={i} style={{position: 'absolute', left: x, top: y, transform: `translate(-50%, -50%) scale(${s}) rotate(${(i % 2 ? 1 : -1) * 4}deg)`, opacity: Math.min(1, s * 2) * fade,
          background: 'rgba(12,14,22,0.92)', border: '3px solid #3a4466', borderRadius: 18, padding: '12px 22px', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 32, color: '#fff', whiteSpace: 'nowrap'}}>
          <span style={{color: '#e8b23a'}}>[ВСЕ] </span>{t}</div>;
      })}
      {f >= v(11) && <div style={{position: 'absolute', left: 540, top: 330, transform: `translate(-50%, -50%) scale(${pop(f, v(13), fps)})`}}><BrainSvg f={f} red={ramp(f, v(13), v(14) + 6)} w={440} /></div>}
    </>
  );
};

const Hist: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const k = f >= v(21) ? 5 : 3;
  const shownRows = f >= v(21) ? Math.min(5, 3 + Math.floor(ramp(f, v(21), v(21) + 10) * 2 + 0.001)) : Math.min(3, Math.floor(ramp(f, v(16), v(17) + 8) * 3) + 1);
  return (
    <>
      <Portrait f={f} bg="dorm" mood={f >= v(18) ? 'tired' : 'neutral'} sweat={f >= v(21)} scale={1.25} y={1060} />
      <AbsoluteFill style={{height: H, background: 'linear-gradient(rgba(7,9,15,0.85), rgba(7,9,15,0.2) 70%)'}} />
      <EloBadge k={k} y={180} s={pop(f, S.hist + 2, fps)} />
      <History rows={shownRows} y={300} />
    </>
  );
};

const Balance: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const tilt = interpolate(ramp(f, v(26), v(27) + 10), [0, 1], [0, 18]) + Math.sin(f / 8) * 1.2;
  const pan = (side: number, color: string, label: string, letter: string, s: number) => (
    <g transform={`translate(${540 + side * 300 * Math.cos((tilt * Math.PI) / 180)}, ${430 - side * 300 * Math.sin((tilt * Math.PI) / 180)})`}>
      <line x1={-110} y1={0} x2={0} y2={-120} stroke="#8e9ab8" strokeWidth={4} /><line x1={110} y1={0} x2={0} y2={-120} stroke="#8e9ab8" strokeWidth={4} />
      <path d="M-140 0 Q0 70 140 0 Z" fill="#2c3350" stroke={INK} strokeWidth={6} />
      <g transform={`translate(0, -70) scale(${s})`}>
        <rect x={-70} y={-70} width={140} height={140} rx={18} fill={color} stroke={INK} strokeWidth={6} />
        <text x={0} y={30} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={90} fill="#fff">{letter}</text>
      </g>
      <text x={0} y={90} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={40} fill={color}>{label}</text>
    </g>
  );
  return (
    <>
      <Bg glow="#5a1a2a" />
      <svg width={1080} height={H} style={{position: 'absolute', inset: 0}}>
        <path d="M540 440 L480 900 L600 900 Z" fill="#2c3350" stroke={INK} strokeWidth={6} />
        <rect x={420} y={890} width={240} height={30} rx={10} fill="#2c3350" stroke={INK} strokeWidth={6} />
        <g transform={`rotate(${-tilt} 540 430)`}>
          <rect x={230} y={418} width={620} height={26} rx={12} fill="#8e9ab8" stroke={INK} strokeWidth={6} />
        </g>
        <circle cx={540} cy={430} r={22} fill={GOLD} stroke={INK} strokeWidth={6} />
        {pan(-1, RED, 'ПОРАЖЕНИЕ', 'L', 1 + pop(f, v(25), fps) * 0.25)}
        {pan(1, GREEN, 'ПОБЕДА', 'W', 0.8)}
      </svg>
      <Chip x={540} y={170} s={pop(f, v(26), fps)} bg={RED} size={44}>БЬЁТ СИЛЬНЕЕ</Chip>
    </>
  );
};

const Brain: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const loss = ramp(f, v(35), v(36) + 12);
  const gain = ramp(f, v(38), v(40) + 10) * 0.45;
  const bar = (label: string, sub: string, w: number, color: string, y: number, s: number) => (
    <div style={{position: 'absolute', left: 120, top: y, width: 840, opacity: Math.min(1, s * 2), transform: `translateY(${(1 - Math.min(1, s)) * 30}px)`}}>
      <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 42, color: '#fff'}}><span style={{color}}>{label}</span><span style={{color: '#9aa4c0', fontSize: 32}}>{sub}</span></div>
      <div style={{height: 54, borderRadius: 27, background: '#141827', border: '4px solid #2c3350', marginTop: 12}}>
        <div style={{height: '100%', width: `${w * 100}%`, background: color, borderRadius: 24, boxShadow: `0 0 26px ${color}`}} />
      </div>
    </div>
  );
  return (
    <>
      <Bg glow="#5a2a4a" />
      <div style={{position: 'absolute', left: 540, top: 360, transform: `translate(-50%, -50%) scale(${pop(f, S.brain + 2, fps)})`}}><BrainSvg f={f} red={loss * 0.7} /></div>
      {bar('ПОТЕРЯЛ 1000 ₽', 'боль', loss, RED, 660, pop(f, v(34), fps))}
      {bar('НАШЁЛ 1000 ₽', 'радость', gain, GREEN, 840, pop(f, v(37), fps))}
    </>
  );
};

const M7: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const k = Math.min(7, 5 + Math.floor(ramp(f, v(41), v(42) + 6) * 2 + 0.001));
  const drop = f >= v(41) + 4 && f < v(41) + 16 ? Math.sin(((f - v(41) - 4) / 12) * Math.PI) : 0;
  const angry = f >= v(46);
  return (
    <>
      <Cam s={interpolate(f, [S.m7, S.peek], [1.0, 1.15], clamp)} y={760}>
        <Portrait f={f} bg="basement" mood={angry ? 'tired' : 'worried'} sweat redness={angry ? 0.9 : 0.4} light={RED} lightAmt={angry ? 0.25 : 0.1} scale={1.35} y={1000} />
      </Cam>
      <EloBadge k={k} y={190} drop={drop} />
      <Chip x={540} y={380} s={pop(f, v(44), fps, 300, 10)} bg={RED} size={48}>РЕЖИМ: «ОТЫГРАТЬСЯ»</Chip>
      {angry && <Big x={540} y={500} s={pop(f, v(51), fps, 300, 9)} size={90} color={RED}>МЕСТЬ</Big>}
    </>
  );
};

const Peek: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const flashX = ramp(f, v(55), v(55) + 8);
  const kill = pop(f, v(56) + 4, fps);
  return (
    <>
      <Bg glow="#5a3a1a" />
      <Chip x={540} y={170} s={pop(f, v(52), fps)} bg="#1c2030" size={44}>ПИКАЕТ ПЕРВЫМ</Chip>
      {/* закупка: AK есть, флешки нет */}
      <div style={{position: 'absolute', left: 540, top: 470, transform: 'translate(-50%, -50%)', display: 'flex', gap: 30, alignItems: 'flex-end'}}>
        <div style={{width: 560, height: 300, borderRadius: 26, background: 'rgba(14,16,26,0.95)', border: `4px solid ${GOLD}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          transform: `scale(${pop(f, S.peek + 2, fps)})`}}>
          <Img src={img('ak.png')} style={{width: 470}} />
          <div style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 32, color: GOLD, marginTop: 8}}>AK-47</div>
        </div>
        <div style={{width: 230, height: 300, borderRadius: 26, background: 'rgba(14,16,26,0.95)', border: `4px solid ${flashX > 0 ? RED : '#2c3350'}`, position: 'relative',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', transform: `scale(${pop(f, v(54), fps)})`}}>
          <Img src={img('flash.png')} style={{height: 200, opacity: 1 - flashX * 0.6, filter: `grayscale(${flashX})`}} />
          <div style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 32, color: flashX > 0 ? RED : '#fff'}}>{flashX > 0 ? '0' : 'ФЛЕШКА'}</div>
          {flashX > 0 && <div style={{position: 'absolute', width: 260 * flashX, height: 16, background: RED, transform: 'rotate(-50deg)', borderRadius: 8}} />}
        </div>
      </div>
      {/* килфид: его убивают с M4 */}
      {kill > 0 && (
        <div style={{position: 'absolute', left: 540, top: 800, transform: `translate(-50%, -50%) scale(${kill})`, display: 'flex', alignItems: 'center', gap: 20, background: 'rgba(30,8,10,0.9)',
          border: `4px solid ${RED}`, borderRadius: 14, padding: '12px 26px', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 40}}>
          <span style={{color: '#5d9cec'}}>Enemy</span>
          <Img src={img('m4.png')} style={{height: 64, filter: 'brightness(1.6)'}} />
          <svg width={44} height={44} viewBox="0 0 44 44"><circle cx={22} cy={22} r={16} fill="none" stroke="#fff" strokeWidth={5} /><circle cx={22} cy={22} r={5} fill="#fff" /></svg>
          <span style={{color: '#e8b23a'}}>Лёха</span>
        </div>
      )}
      {kill > 0 && <Big x={540} y={930} s={kill} size={46} color={RED}>НА ЭМОЦИЯХ</Big>}
    </>
  );
};

const Stress: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const rows: [number, string, string, number, string][] = [
    [v(60), 'СТРЕСС', '↑', 0.92, RED], [v(62), 'НАПРЯЖЕНИЕ РУК', '↑', 0.8, RED], [v(64), 'КАЧЕСТВО РЕШЕНИЙ', '↓', 0.3, GOLD], [v(66), 'СКОРОСТЬ РЕАКЦИИ', '↓', 0.35, GOLD],
  ];
  const shake = f >= v(62) ? Math.sin(f * 2.1) * 3 : 0;
  return (
    <>
      <Portrait f={f} bg="basement" mood="tired" sweat redness={0.6} scale={1.2} y={1080} light={RED} lightAmt={0.12} />
      <AbsoluteFill style={{height: H, background: 'linear-gradient(rgba(7,9,15,0.9), rgba(7,9,15,0.3) 75%)'}} />
      <EloBadge k={f >= v(58) ? 9 : 7} y={170} s={0.85} />
      {rows.map(([at, l, arrow, w, c], i) => {
        const s = pop(f, at, fps);
        const fill = ramp(f, at, at + 14) * w;
        return (
          <div key={l} style={{position: 'absolute', left: 120, top: 320 + i * 130, width: 840, opacity: Math.min(1, s * 2), transform: `translateX(${(1 - Math.min(1, s)) * -40 + (i === 1 ? shake : 0)}px)`}}>
            <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 36, color: '#fff'}}><span>{l}</span><span style={{color: c}}>{arrow}</span></div>
            <div style={{height: 30, borderRadius: 15, background: '#141827', border: '3px solid #2c3350', marginTop: 8}}>
              <div style={{height: '100%', width: `${fill * 100}%`, background: c, borderRadius: 13}} />
            </div>
          </div>
        );
      })}
    </>
  );
};

const Doomed: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const cloud = pop(f, v(68) + 2, fps);
  const stamp = pop(f, v(73), fps, 300, 9);
  const inHead = ramp(f, v(75), v(78) + 6);
  return (
    <>
      <Cam s={interpolate(inHead, [0, 1], [1, 1.12])} y={700}>
        <Portrait f={f} bg="dorm" mood="worried" look={-0.3} scale={1.25} y={1060} light="#6a8cff" lightAmt={0.1} />
      </Cam>
      {/* облако-мысль с экраном поражения */}
      <div style={{position: 'absolute', left: 540, top: 400, width: 940, height: 420, transform: `translate(-50%, -50%) scale(${cloud})`, opacity: Math.min(1, cloud * 2), borderRadius: 60,
        background: '#fff', padding: 18, boxSizing: 'border-box', boxShadow: '0 30px 60px rgba(0,0,0,0.6)'}}>
        <div style={{width: '100%', height: '100%', borderRadius: 44, overflow: 'hidden', position: 'relative'}}>
          <Img src={img('defeat.png')} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
          <div style={{position: 'absolute', inset: 0, background: `rgba(255,30,40,${0.15 + inHead * 0.15})`}} />
        </div>
        <div style={{position: 'absolute', left: 430, bottom: -60, width: 60, height: 60, borderRadius: 30, background: '#fff'}} />
        <div style={{position: 'absolute', left: 470, bottom: -110, width: 34, height: 34, borderRadius: 17, background: '#fff'}} />
      </div>
      {stamp > 0 && (
        <div style={{position: 'absolute', left: 540, top: 690, transform: `translate(-50%, -50%) rotate(-6deg) scale(${stamp})`, border: `8px solid ${RED}`, color: RED, fontFamily: 'Montserrat',
          fontWeight: 900, fontSize: 56, padding: '6px 30px', borderRadius: 14, background: 'rgba(10,11,16,0.85)', whiteSpace: 'nowrap'}}>ПРОИГРАНА ЗАРАНЕЕ</div>
      )}
    </>
  );
};

const M10: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <>
      <Bg glow="#6a1a22" />
      <Big x={540} y={430} s={pop(f, v(79), fps, 300, 9)} size={300} color={RED}>−10</Big>
      <EloBadge k={10} y={760} s={pop(f, v(80), fps)} />
    </>
  );
};

const Rules: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const icons: [number, string, React.ReactNode][] = [
    [v(87), 'ВСТАНЬ', <svg key="a" width={90} height={100} viewBox="0 0 90 100"><circle cx={45} cy={16} r={12} fill="#fff" /><path d="M45 32 V66 M45 66 L30 96 M45 66 L60 96 M45 42 L22 56 M45 42 L68 56" stroke="#fff" strokeWidth={9} strokeLinecap="round" fill="none" /></svg>],
    [v(88), 'УМОЙСЯ', <svg key="b" width={90} height={100} viewBox="0 0 90 100"><path d="M45 8 C30 36 18 52 18 66 A27 27 0 0 0 72 66 C72 52 60 36 45 8 Z" fill="#5fb8ff" stroke="#fff" strokeWidth={5} /></svg>],
    [v(89), 'ПРОЙДИСЬ', <svg key="c" width={90} height={100} viewBox="0 0 90 100"><circle cx={52} cy={14} r={11} fill="#fff" /><path d="M50 30 L40 62 L58 74 L50 100 M44 44 L24 54 M46 42 L68 56 M40 62 L26 88" stroke="#fff" strokeWidth={9} fill="none" strokeLinecap="round" /></svg>],
  ];
  const pause = pop(f, v(86), fps, 300, 10);
  const no = pop(f, v(90), fps), yes = pop(f, v(92), fps);
  return (
    <>
      <Bg />
      <Chip x={540} y={160} s={pop(f, v(81), fps)} bg="#1c2030" size={44}>ЧТО ДЕЛАТЬ?</Chip>
      <div style={{position: 'absolute', left: 540, top: 330, transform: 'translate(-50%, -50%)', display: 'flex', alignItems: 'center', gap: 22}}>
        {[0, 1].map((i) => {
          const s = pop(f, v(83) + i * 4, fps);
          return <div key={i} style={{width: 120, height: 120, borderRadius: 18, background: '#d9283a', color: '#fff', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 76, display: 'flex', alignItems: 'center',
            justifyContent: 'center', transform: `scale(${s})`, opacity: Math.min(1, s * 2)}}>L</div>;
        })}
        <div style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 80, color: '#9aa4c0', opacity: pause}}>→</div>
        <div style={{background: GOLD, color: '#1a1407', borderRadius: 24, padding: '20px 34px', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 64, transform: `scale(${pause})`, opacity: Math.min(1, pause * 2)}}>ПАУЗА</div>
      </div>
      <div style={{position: 'absolute', left: 540, top: 600, transform: 'translate(-50%, -50%)', display: 'flex', gap: 40}}>
        {icons.map(([at, l, ic]) => {
          const s = pop(f, at, fps);
          return (
            <div key={l} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, transform: `scale(${s})`, opacity: Math.min(1, s * 2)}}>
              <div style={{width: 190, height: 190, borderRadius: 95, background: 'rgba(14,16,26,0.95)', border: `5px solid ${GOLD}`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{ic}</div>
              <div style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 34, color: '#fff'}}>{l}</div>
            </div>
          );
        })}
      </div>
      <div style={{position: 'absolute', left: 540, top: 900, transform: 'translate(-50%, -50%)', display: 'flex', gap: 30}}>
        <div style={{position: 'relative', background: '#1c2030', border: `4px solid ${RED}`, borderRadius: 20, padding: '14px 30px', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 44, color: RED, opacity: Math.min(1, no * 2), transform: `scale(${no})`}}>
          ОТЫГРАТЬСЯ<div style={{position: 'absolute', left: 16, right: 16, top: '50%', height: 8, background: RED, borderRadius: 4}} />
        </div>
        <div style={{background: GREEN, borderRadius: 20, padding: '14px 30px', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 44, color: '#fff', opacity: Math.min(1, yes * 2), transform: `scale(${yes})`}}>ОТДЫХАТЬ ✓</div>
      </div>
    </>
  );
};

const Off: React.FC = () => {
  const f = useCurrentFrame();
  const glow = 1 - ramp(f, v(94), v(95) + 8);
  return (
    <>
      <Cam s={interpolate(f, [S.off, S.msg], [1.05, 1.0], clamp)} y={760}>
        <Portrait f={f} bg="dorm" mood={f >= v(96) ? 'happy' : 'neutral'} blink={f >= v(96) && f < v(96) + 16 ? 1 : 0} scale={1.4} y={1000} light="#6a8cff" lightAmt={0.15 * glow} />
      </Cam>
      <AbsoluteFill style={{height: H, background: '#000', opacity: (1 - glow) * 0.35}} />
      <div style={{position: 'absolute', left: 540, top: 260, transform: `translate(-50%, -50%) scale(${pop(f, v(94), 30)})`, opacity: glow}}>
        <svg width={160} height={160} viewBox="0 0 100 100"><path d="M30 26 A34 34 0 1 0 70 26" stroke="#fff" strokeWidth={9} fill="none" strokeLinecap="round" /><path d="M50 12 V50" stroke="#fff" strokeWidth={9} strokeLinecap="round" /></svg>
      </div>
    </>
  );
};

const Msg: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const n = pop(f, v(100) - 2, fps);
  return (
    <>
      <Cam s={interpolate(f, [S.msg, S.end], [1.0, 1.12], clamp)} y={760}>
        <Portrait f={f} bg="dorm" mood={f >= v(101) ? 'shocked' : 'happy'} look={0.5} scale={1.4} y={1000} light="#2aabee" lightAmt={n * 0.1} />
      </Cam>
      <div style={{position: 'absolute', left: 540, top: 330, width: 920, transform: `translate(-50%, ${(1 - n) * -260}px)`, opacity: n, background: 'rgba(240,244,250,0.97)', borderRadius: 34,
        padding: '24px 28px', display: 'flex', gap: 22, alignItems: 'center', boxSizing: 'border-box', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', fontFamily: 'Montserrat'}}>
        <div style={{width: 92, height: 92, borderRadius: 46, background: '#2aabee', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
          <svg width={50} height={44} viewBox="0 0 50 44"><path d="M2 20 L46 2 L38 42 L24 32 L18 40 L18 28 L40 8 L14 26 Z" fill="#fff" /></svg>
        </div>
        <div>
          <div style={{fontSize: 30, fontWeight: 900, color: '#111'}}>Санёк <span style={{fontWeight: 600, color: '#888', fontSize: 26}}>· сейчас</span></div>
          <div style={{fontSize: 38, fontWeight: 600, color: '#222'}}>го ещё одну, эта точно наша</div>
        </div>
      </div>
    </>
  );
};

const End: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (f < S.end) return null;
  const a = pop(f, S.end + 2, fps), b = pop(f, S.end + 14, fps), c = pop(f, S.end + 34, fps);
  return (
    <AbsoluteFill style={{background: '#000', alignItems: 'center', justifyContent: 'center', paddingBottom: 280, textAlign: 'center'}}>
      <div style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 100, color: '#fff', lineHeight: 1.05, opacity: Math.min(1, a * 2), transform: `scale(${0.7 + 0.3 * a})`}}>
        А ТЫ БЫ<br /><span style={{color: RED, textShadow: `0 0 40px ${RED}88`}}>ПРИНЯЛ?</span>
      </div>
      <div style={{marginTop: 50, width: 760, background: '#141a22', border: '5px solid #3fbf4a', borderRadius: 24, padding: 30, boxSizing: 'border-box', opacity: Math.min(1, b * 2), transform: `scale(${0.8 + 0.2 * b})`}}>
        <div style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 46, color: '#fff'}}>МАТЧ НАЙДЕН</div>
        <div style={{display: 'flex', gap: 24, marginTop: 24, justifyContent: 'center'}}>
          <div style={{background: '#3fbf4a', color: '#fff', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 40, padding: '16px 40px', borderRadius: 16}}>ПРИНЯТЬ</div>
          <div style={{background: '#2a3240', color: '#cfd6e0', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 40, padding: '16px 40px', borderRadius: 16}}>СПАТЬ</div>
        </div>
      </div>
      <div style={{marginTop: 40, background: RED, color: '#fff', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 36, padding: '14px 36px', borderRadius: 50, opacity: c, transform: `scale(${0.6 + 0.4 * c})`}}>ПИШИ В КОММЕНТАРИЯХ</div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- звук (эффекты тише голоса)
type Fx = [number, string, number];
const SFX: Fx[] = [
  [0, 'tilt/heart.wav', 0.4], ...[6, 7, 8, 9].map((i): Fx => [v(i), 'sfx2/blip.wav', 0.35]), [v(11), 'money/boom.wav', 0.5], [v(13), 'tilt/heart.wav', 0.5],
  [S.hist, 'sfx2/whoosh.wav', 0.3], [v(16), 'sfx2/error.wav', 0.35], [v(17), 'sfx2/deflate.wav', 0.35], [v(21), 'sfx2/error.wav', 0.35], [v(22), 'sfx2/deflate.wav', 0.35],
  [S.balance, 'sfx2/whip.wav', 0.3], [v(25), 'sfx2/stamp.wav', 0.45], [v(26), 'sfx2/impact.wav', 0.45],
  [S.brain, 'sfx2/whoosh.wav', 0.3], [v(35), 'sfx2/deflate.wav', 0.45], [v(38), 'sfx2/blip.wav', 0.3],
  [S.m7, 'sfx2/error.wav', 0.4], [v(41) + 4, 'money/boom.wav', 0.5], [v(44), 'sfx2/stamp.wav', 0.5], [v(46), 'tilt/heart.wav', 0.5], [v(51), 'sfx2/impact.wav', 0.55],
  [S.peek, 'sfx2/whip.wav', 0.3], [v(52), 'tilt/shot.wav', 0.4], [v(54), 'sfx2/pop.wav', 0.35], [v(55), 'sfx2/error.wav', 0.45], [v(56) + 2, 'tilt/shot.wav', 0.55], [v(56) + 4, 'tilt/hs.wav', 0.45],
  [S.stress, 'sfx2/error.wav', 0.35], ...[60, 62, 64, 66].map((i): Fx => [v(i), 'sfx2/blip_low.wav', 0.35]), [v(60), 'tilt/heart.wav', 0.45], [v(64), 'tilt/heart.wav', 0.5],
  [S.doomed, 'sfx2/whoosh.wav', 0.3], [v(68) + 2, 'sfx2/pop.wav', 0.35], [v(73), 'sfx2/stamp.wav', 0.6], [v(75), 'tilt/heart.wav', 0.5],
  [v(79), 'money/boom.wav', 0.6], [v(79), 'sfx2/error.wav', 0.4],
  [S.rules, 'sfx2/whoosh.wav', 0.35], [v(83), 'sfx2/stamp.wav', 0.35], [v(83) + 4, 'sfx2/stamp.wav', 0.35], [v(86), 'sfx2/ding.wav', 0.35],
  ...[87, 88, 89].map((i): Fx => [v(i), 'sfx2/pop.wav', 0.35]), [v(90), 'sfx2/error.wav', 0.3], [v(92), 'sfx2/ding.wav', 0.35],
  [v(94), 'tilt/switch.wav', 0.5], [v(96), 'sfx2/shimmer.wav', 0.25],
  [v(100) - 2, 'tilt/vibrate.wav', 0.6], [v(100), 'tilt/notif.wav', 0.5],
  [S.end, 'money/boom.wav', 0.45], [S.end + 14, 'tilt/accept.wav', 0.5], [S.end + 34, 'sfx2/pop.wav', 0.4],
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

export const Brain10: React.FC = () => {
  loadFonts();
  const order: [number, number, React.FC, boolean?][] = [
    [S.hook, S.hist, Hook], [S.hist, S.balance, Hist], [S.balance, S.brain, Balance], [S.brain, S.m7, Brain], [S.m7, S.peek, M7, true],
    [S.peek, S.stress, Peek, true], [S.stress, S.doomed, Stress, true], [S.doomed, S.m10, Doomed], [S.m10, S.rules, M10, true],
    [S.rules, S.off, Rules], [S.off, S.msg, Off], [S.msg, S.end, Msg, true],
  ];
  return (
    <AbsoluteFill style={{background: '#07090f'}}>
      {order.map(([from, to, C, cut], i) => <Scene key={i} from={from} to={to} cut={cut}><C /></Scene>)}
      <Flash at={v(11)} len={12} />
      <Flash at={v(41) + 4} len={12} />
      <Flash at={v(51)} len={12} />
      <Flash at={v(79)} len={16} />
      <AbsoluteFill style={{top: H - 220, height: 220, background: 'linear-gradient(rgba(7,9,15,0), #07090f)'}} />
      <Captions cues={CUES} />
      <End />
      <Sound />
    </AbsoluteFill>
  );
};
