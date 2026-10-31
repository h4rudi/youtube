// Ролик «Миллион долларов за 10 каток в день» (9:16, ~60 с). Герой — Лёха v2. Хронология по дням со счётчиками.
// Исходники пользователя: компьютерный клуб (public/mil/club.png), баннеры «Победа/Поражение» из CS2 (victory.png, defeat.png —
// карточки игроков обрезаны). Строки поражений — история FACEIT из прошлого ролика (faceit2x/history.png).
import React from 'react';
import {AbsoluteFill, Audio, Img, Sequence, interpolate, random, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {loadFonts} from '../theme';
import {FPS, fr} from '../tilt/script';
import {VO, TOTAL, CUES, v} from './script';
import {Captions, clamp, pop} from '../tilt/UI';
import {Scene, Cam, Flash} from '../money/Money';
import {ramp} from '../tilt/Tilt';
import {H, RED, Portrait, MoneyRain} from '../money/Props';
import {LyokhaBust, Mood} from '../money/Lyokha';

export const MIL_FRAMES = fr(TOTAL);

const S = {
  hook: 0, d1: v(24) - 4, d5: v(41) - 4, d12: v(52) - 4, d18: v(66) - 4, d23: v(75) - 4, d30: v(90) - 4, total: v(104) - 4, ask: v(114) - 4, end: fr(58.1),
};
const GOLD = '#ffd23f', GREEN = '#2bd96b', ORANGE = '#ff5500';

const Bg: React.FC<{glow?: string}> = ({glow = '#2a4a8a'}) => (
  <AbsoluteFill style={{height: H, backgroundColor: '#0b0c12', backgroundImage: `radial-gradient(ellipse at 50% 40%, ${glow}55, #0b0c12 70%), radial-gradient(rgba(120,150,230,0.1) 2px, transparent 2px)`, backgroundSize: 'auto, 44px 44px'}} />
);
const Big: React.FC<{x: number; y: number; s: number; size: number; color?: string; children: React.ReactNode}> = ({x, y, s, size, color = '#fff', children}) => (
  <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%, -50%) scale(${s})`, opacity: Math.min(1, s * 2), fontFamily: 'Montserrat', fontWeight: 900, fontSize: size,
    color, whiteSpace: 'nowrap', textAlign: 'center', lineHeight: 1.05, textShadow: color === '#fff' ? '0 4px 0 rgba(0,0,0,0.6)' : `0 0 34px ${color}88, 0 4px 0 rgba(0,0,0,0.6)`}}>{children}</div>
);
const Chip: React.FC<{x: number; y: number; s: number; bg: string; color?: string; size?: number; children: React.ReactNode}> = ({x, y, s, bg, color = '#fff', size = 40, children}) => (
  <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%, -50%) scale(${s})`, opacity: Math.min(1, s * 2), background: bg, color, fontFamily: 'Montserrat', fontWeight: 900,
    fontSize: size, padding: '12px 30px', borderRadius: 50, whiteSpace: 'nowrap', boxShadow: `0 0 30px ${bg}88`}}>{children}</div>
);
const Bubble: React.FC<{x: number; y: number; s: number; size?: number; children: React.ReactNode}> = ({x, y, s, size = 38, children}) => (
  <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%, -50%) scale(${s})`, opacity: Math.min(1, s * 2), background: '#fff', color: '#111', fontFamily: 'Montserrat', fontWeight: 900,
    fontSize: size, padding: '16px 28px', borderRadius: 26, whiteSpace: 'nowrap', boxShadow: '0 10px 30px rgba(0,0,0,0.5)'}}>{children}</div>
);
// Лёха бюстом поверх своей сцены (без фона)
const Kid: React.FC<{x?: number; y?: number; s?: number; mood?: Mood; sweat?: boolean; light?: string; lightAmt?: number; blanket?: boolean}> = ({x = 540, y = 820, s = 1, blanket, ...p}) => (
  <svg width={1080} height={H} viewBox={`0 0 1080 ${H}`} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <LyokhaBust {...p} />
      {blanket && (
        <g>
          <path d="M-300 520 C -300 280, -220 150, -120 120 C -60 60, 60 60, 120 120 C 220 150, 300 280, 300 520 Z" fill="#6a8acb" stroke="#15131a" strokeWidth={6} />
          <path d="M-130 130 C -150 -80, -100 -210, 0 -220 C 100 -210, 150 -80, 130 130" fill="none" stroke="#15131a" strokeWidth={6} />
          <path d="M-130 130 C -150 -80, -100 -210, 0 -220 C 100 -210, 150 -80, 130 130 C 60 70, -60 70, -130 130 Z" fill="#7a9adb" opacity={0.35} />
          {[[-180, 260], [-60, 380], [120, 300], [220, 420], [-240, 440]].map(([a, b], i) => <circle key={i} cx={a} cy={b} r={14} fill="#f3e6a0" />)}
        </g>
      )}
    </g>
  </svg>
);

// ---------------------------------------------------------------- шапка: день, катки сегодня, всего часов
const DAYS: [number, number, number, number][] = [ // кадр, день, катки «от», катки «до»
  [S.d1, 1, 0, 10], [S.d5, 5, 10, 10], [S.d12, 12, 5, 5], [S.d18, 18, 2, 6], [S.d23, 23, 6, 9], [S.d30, 30, 9, 10], [S.total, 30, 10, 10],
];
const TopBar: React.FC = () => {
  const f = useCurrentFrame();
  if (f < S.d1 || f >= S.end) return null;
  let i = 0;
  while (i + 1 < DAYS.length && f >= DAYS[i + 1][0]) i++;
  const [a, day, g0, g1] = DAYS[i];
  const next = DAYS[i + 1] ? DAYS[i + 1][0] : S.end;
  const games = Math.round(interpolate(f, [a, next - 6], [g0, g1], clamp));
  const hours = (day - 1) * 7.5 + games * 0.75;
  return (
    <div style={{position: 'absolute', left: 40, right: 40, top: 26, background: 'rgba(10,12,18,0.88)', border: `2px solid ${GOLD}55`, borderRadius: 14, padding: '10px 20px', fontFamily: 'Montserrat'}}>
      <div style={{display: 'flex', alignItems: 'flex-end', gap: 36}}>
        <div><div style={{fontSize: 15, color: '#8f98a0', fontWeight: 900}}>ДЕНЬ</div><div style={{fontFamily: 'Russo One', fontSize: 34, color: '#fff'}}>{day}<span style={{color: '#8f98a0', fontSize: 24}}>/30</span></div></div>
        <div><div style={{fontSize: 15, color: '#8f98a0', fontWeight: 900}}>КАТОК СЕГОДНЯ</div><div style={{fontFamily: 'Russo One', fontSize: 34, color: games >= 10 ? GREEN : ORANGE}}>{games}<span style={{color: '#8f98a0', fontSize: 24}}>/10</span></div></div>
        <div><div style={{fontSize: 15, color: '#8f98a0', fontWeight: 900}}>ВСЕГО ЧАСОВ</div><div style={{fontFamily: 'Russo One', fontSize: 34, color: '#fff'}}>{hours.toLocaleString('ru-RU')}</div></div>
      </div>
      <div style={{display: 'flex', gap: 3, marginTop: 8}}>
        {Array.from({length: 30}).map((_, d) => <div key={d} style={{flex: 1, height: 10, borderRadius: 2, background: d < day - 1 || (d === day - 1 && games >= 10) ? GREEN : d === day - 1 ? GOLD : '#2a3040'}} />)}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------- сцены
const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const slam = pop(f, 1, fps, 380, 9);
  const zero = f >= v(22);
  const shake = f < 10 ? (1 - f / 10) * 1.2 : zero && f < v(22) + 12 ? (1 - (f - v(22)) / 12) : 0;
  return (
    <>
      <Bg glow={zero ? '#5a1016' : '#5a4a10'} />
      <Cam s={interpolate(f, [0, S.d1], [1.12, 1.0], clamp)} shake={shake}>
        <div style={{position: 'absolute', left: 0, top: 500, width: 1080, height: 680, overflow: 'hidden'}}>
          <Portrait f={f} bg="dorm" mood={zero ? 'shocked' : 'happy'} scale={1.1} y={430} light={zero ? RED : GOLD} lightAmt={0.15} />
        </div>
        {!zero && <MoneyRain f={f} from={0} until={v(22)} n={34} speed={14} seed="mil" />}
        <div style={{position: 'absolute', left: 540, top: 250, transform: `translate(-50%,-50%) scale(${slam * (1 + 0.04 * Math.sin(f / 3))})`, opacity: Math.min(1, slam * 2), fontFamily: 'Russo One', fontSize: 150,
          color: zero ? '#555' : GOLD, textShadow: zero ? 'none' : `0 0 60px ${GOLD}, 0 6px 0 #7a5a08`, whiteSpace: 'nowrap', textDecoration: zero ? 'line-through' : 'none'}}>$1 000 000</div>
        {f >= v(6) && !zero && <Chip x={540} y={420} s={pop(f, v(12), fps)} bg="#1c2030" size={44}>10 каток × 30 дней</Chip>}
        {zero && <Big x={540} y={420} s={pop(f, v(22), fps, 380, 8)} size={120} color={RED}>ПРОПУСТИЛ = $0</Big>}
      </Cam>
    </>
  );
};

const D1: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <>
      <Bg glow="#1a4a2a" />
      <Chip x={540} y={230} s={pop(f, S.d1, fps)} bg={GREEN} color="#06260f" size={46}>ДЕНЬ 1</Chip>
      <Kid y={860} s={1.05} mood="happy" />
      {f >= v(28) && <Bubble x={540} y={400} s={pop(f, v(28), fps)}>«да я и так столько играю» 😂</Bubble>}
      {f >= v(34) && <Big x={540} y={560} s={pop(f, v(36), fps, 320, 9)} size={110} color={GOLD}>7,5 ЧАСОВ</Big>}
    </>
  );
};

const D5: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const pulse = 0.5 + 0.5 * Math.sin(f / 4);
  return (
    <>
      <Bg glow="#3a2a1a" />
      <Chip x={540} y={230} s={pop(f, S.d5, fps)} bg={ORANGE} size={46}>ДЕНЬ 5</Chip>
      <Kid y={860} s={1.05} mood="tired" />
      {f >= v(43) && (
        <svg width={1080} height={H} viewBox={`0 0 1080 ${H}`} style={{position: 'absolute', inset: 0}}>
          <circle cx={300} cy={1020} r={90} fill={RED} opacity={0.25 + 0.25 * pulse} />
          <circle cx={780} cy={1020} r={90} fill={RED} opacity={0.25 + 0.25 * pulse} />
        </svg>
      )}
      {f >= v(43) && <Chip x={230} y={900} s={pop(f, v(43), fps)} bg={RED} size={34}>⚡ спина</Chip>}
      {f >= v(45) && (
        <svg width={1080} height={H} viewBox={`0 0 1080 ${H}`} style={{position: 'absolute', inset: 0}}>
          {[481, 599].map((x) => <circle key={x} cx={x} cy={688} r={44} fill="none" stroke={RED} strokeWidth={6} opacity={0.4 + 0.6 * pulse} />)}
        </svg>
      )}
      {f >= v(45) && <Chip x={850} y={600} s={pop(f, v(45), fps)} bg={RED} size={34}>👁 глаза</Chip>}
      {f >= v(48) && <Big x={540} y={420} s={pop(f, v(48), fps, 320, 9)} size={90} color="#fff">ЕЩЁ 25 ДНЕЙ</Big>}
    </>
  );
};

const D12: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const k = 1000 / 634;
  const blocked = f >= v(60);
  return (
    <>
      <Bg glow="#5a1016" />
      <Chip x={540} y={230} s={pop(f, S.d12, fps)} bg={RED} size={46}>ДЕНЬ 12</Chip>
      <div style={{position: 'absolute', left: 40, top: 300, width: 1000, borderRadius: 12, overflow: 'hidden'}}><Img src={staticFile('mil/defeat.png')} style={{width: 1000, display: 'block'}} /></div>
      <div style={{position: 'absolute', left: 40, top: 660, width: 1000}}>
        {Array.from({length: 5}).map((_, i) => {
          const at = v(54) + i * 5;
          if (f < at) return null;
          return (
            <div key={i} style={{position: 'relative', width: 1000, height: 56 * k * 0.6, overflow: 'hidden', opacity: Math.min(1, (f - at) / 4)}}>
              <Img src={staticFile('faceit2x/history.png')} style={{position: 'absolute', left: 0, top: -46 * k * 0.6, width: 1000 * 0.6, transform: 'scale(1)', transformOrigin: '0 0'}} />
              <div style={{position: 'absolute', left: 640, top: 0, height: 56 * k * 0.6, display: 'flex', alignItems: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 30, color: RED}}>ПОРАЖЕНИЕ</div>
            </div>
          );
        })}
      </div>
      {f >= v(57) && (
        <div style={{position: 'absolute', left: 540, top: 1040, transform: `translate(-50%,-50%) scale(${pop(f, v(57), fps)})`, width: 120, height: 120, borderRadius: 60, background: blocked ? '#3a3f4a' : RED, display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: blocked ? 'none' : `0 0 40px ${RED}`}}>
          <svg width={70} height={70} viewBox="0 0 24 24"><path d="M12 3 V12 M6.3 7 A8 8 0 1 0 17.7 7" stroke="#fff" strokeWidth={2.6} fill="none" strokeLinecap="round" /></svg>
          {blocked && <svg width={120} height={120} viewBox="0 0 120 120" style={{position: 'absolute'}}><line x1={15} y1={15} x2={105} y2={105} stroke={RED} strokeWidth={10} strokeLinecap="round" /></svg>}
        </div>
      )}
      {blocked && <Big x={790} y={1040} s={pop(f, v(60), fps, 320, 9)} size={64} color={RED}>НЕЛЬЗЯ</Big>}
    </>
  );
};

const D18: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <>
      <Bg glow="#2a3a5a" />
      <Chip x={540} y={230} s={pop(f, S.d18, fps)} bg="#3a6acb" size={46}>ДЕНЬ 18</Chip>
      <Kid y={880} s={1.0} mood="tired" sweat blanket={f >= v(71)} />
      {f >= v(68) && (
        <div style={{position: 'absolute', left: 820, top: 520, transform: `translate(-50%,-50%) rotate(12deg) scale(${pop(f, v(68), fps)})`, display: 'flex', alignItems: 'center', gap: 12}}>
          <svg width={60} height={220} viewBox="0 0 30 110"><rect x={9} y={4} width={12} height={84} rx={6} fill="#f3f3f3" stroke="#555" strokeWidth={2} /><rect x={12} y={28} width={6} height={64} fill={RED} /><circle cx={15} cy={96} r={11} fill={RED} stroke="#555" strokeWidth={2} /></svg>
          <span style={{fontFamily: 'Russo One', fontSize: 80, color: RED, textShadow: `0 0 20px ${RED}`}}>39,0°</span>
        </div>
      )}
    </>
  );
};

const D23: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const club = f >= v(83);
  return (
    <>
      {!club ? (
        <>
          <Bg glow="#1a1a3a" />
          <Chip x={540} y={230} s={pop(f, S.d23, fps)} bg="#5a3acb" size={46}>ДЕНЬ 23</Chip>
          <Big x={540} y={420} s={pop(f, v(78), fps)} size={130} color="#fff">21:00</Big>
          {f >= v(81) && (
            <svg width={300} height={300} viewBox="0 0 100 100" style={{position: 'absolute', left: 390, top: 560, transform: `scale(${pop(f, v(81), fps, 320, 9)})`}}>
              {[40, 28, 16].map((r, i) => <path key={i} d={`M${50 - r} ${70 - r * 0.55} A${r} ${r} 0 0 1 ${50 + r} ${70 - r * 0.55}`} stroke="#8f98a0" strokeWidth={7} fill="none" strokeLinecap="round" />)}
              <circle cx={50} cy={74} r={6} fill="#8f98a0" />
              <line x1={14} y1={14} x2={86} y2={86} stroke={RED} strokeWidth={9} strokeLinecap="round" />
            </svg>
          )}
        </>
      ) : (
        <>
          <Cam s={interpolate(f, [v(83), S.d30], [1.0, 1.15], clamp)}>
            <Img src={staticFile('mil/club.png')} style={{position: 'absolute', inset: 0, width: '100%', height: H, objectFit: 'cover'}} />
          </Cam>
          <AbsoluteFill style={{height: H, background: 'linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.5))'}} />
          <Chip x={540} y={240} s={pop(f, v(83), fps)} bg="#c2185b" size={42}>КОМПЬЮТЕРНЫЙ КЛУБ 24/7</Chip>
          <Big x={540} y={380} s={pop(f, v(84), fps)} size={90} color="#fff">00:40</Big>
        </>
      )}
    </>
  );
};

const D30: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const flip = f >= v(97) && f < v(101);
  const done = f >= v(103);
  return (
    <>
      <Bg glow={done ? '#1a5a2a' : '#3a2a10'} />
      <Chip x={540} y={230} s={pop(f, S.d30, fps)} bg={GOLD} color="#111" size={46}>ДЕНЬ 30</Chip>
      {!flip && !done && <Big x={540} y={460} s={pop(f, v(92), fps)} size={170} color={RED}>23:40</Big>}
      {!flip && !done && f >= v(95) && <Chip x={540} y={640} s={pop(f, v(95), fps)} bg={ORANGE} size={46}>ПОСЛЕДНЯЯ КАТКА · 10/10</Chip>}
      {flip && (
        <div style={{position: 'absolute', left: 40, top: 380, width: 1000, borderRadius: 12, overflow: 'hidden'}}>
          <Img src={staticFile(`mil/${Math.floor((f - v(97)) / 8) % 2 ? 'defeat' : 'victory'}.png`)} style={{width: 1000, display: 'block'}} />
        </div>
      )}
      {flip && <Big x={540} y={820} s={1} size={60} color="#fff">НЕВАЖНО</Big>}
      {done && (
        <>
          {Array.from({length: 40}).map((_, i) => {
            const t = (f - v(103)) / 30;
            return <div key={i} style={{position: 'absolute', left: 540 + (random(`c${i}`) - 0.5) * 1100 * Math.min(1, t * 2), top: 500 - 400 * t + 900 * t * t * random(`d${i}`), width: 18, height: 10, background: [GOLD, GREEN, '#fff', ORANGE][i % 4], transform: `rotate(${i * 40 + f * 8}deg)`}} />;
          })}
          <Big x={540} y={520} s={pop(f, v(103), fps, 320, 9)} size={120} color={GREEN}>ДОИГРАЛ ✓</Big>
        </>
      )}
    </>
  );
};

const Total: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const line = (at: number, y: number, n: string, label: string, c: string) => (
    <div style={{position: 'absolute', left: 540, top: y, transform: `translate(-50%,-50%) scale(${pop(f, at, fps)})`, opacity: Math.min(1, pop(f, at, fps) * 2), textAlign: 'center'}}>
      <span style={{fontFamily: 'Russo One', fontSize: 110, color: c}}>{n}</span> <span style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 50, color: '#fff'}}>{label}</span>
    </div>
  );
  return (
    <>
      <Bg glow="#3a3a10" />
      {f >= v(110) && <MoneyRain f={f} from={v(110)} n={22} speed={13} seed="mil2" />}
      {line(v(104), 330, '300', 'каток', '#fff')}
      {line(v(106), 500, '225', 'часов', '#fff')}
      {f >= v(110) && (
        <div style={{position: 'absolute', left: 540, top: 760, width: 900, transform: `translate(-50%,-50%) scale(${pop(f, v(110), fps)})`, background: 'rgba(255,255,255,0.12)', border: `3px solid ${GREEN}`, borderRadius: 26, padding: '22px 28px', fontFamily: 'Montserrat',
          boxShadow: `0 0 50px ${GREEN}55`}}>
          <div style={{fontSize: 26, color: '#c9cede', fontWeight: 900}}>БАНК · сейчас</div>
          <div style={{fontSize: 38, color: '#fff', fontWeight: 900, marginTop: 8}}>Зачисление</div>
          <div style={{fontFamily: 'Russo One', fontSize: 84, color: GREEN}}>+$1 000 000</div>
        </div>
      )}
    </>
  );
};

const Ask: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <>
      <Bg glow="#2a2a3a" />
      <Big x={540} y={230} s={pop(f, S.ask, fps)} size={60} color="#fff">А ТЫ БЫ ВЫДЕРЖАЛ?</Big>
      <div style={{position: 'absolute', left: 540, top: 640, transform: 'translate(-50%,-50%)', display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12}}>
        {Array.from({length: 30}).map((_, d) => (
          <div key={d} style={{width: 120, height: 92, borderRadius: 12, background: '#1c2030', border: `3px solid ${f >= v(121) && d === 11 ? RED : '#2a3244'}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'Russo One', fontSize: 40, color: f >= v(121) && d === 11 ? RED : '#c9cede', opacity: Math.min(1, Math.max(0, (f - S.ask - d) / 4))}}>{d + 1}</div>
        ))}
      </div>
      {f >= v(121) && <Chip x={540} y={1060} s={pop(f, v(121), fps)} bg={RED} size={40}>пиши день, на котором сдался бы</Chip>}
    </>
  );
};

const End: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (f < S.end) return null;
  const m = pop(f, S.end, fps, 320, 9);
  return (
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, #5a4a10, #0b0c12 70%)', alignItems: 'center', justifyContent: 'center', paddingBottom: 240, textAlign: 'center'}}>
      <div style={{fontFamily: 'Russo One', fontSize: 120, color: GOLD, transform: `scale(${0.6 + 0.4 * m})`, textShadow: `0 0 50px ${GOLD}`}}>$1 000 000</div>
      <div style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 50, color: '#fff', marginTop: 20, opacity: Math.min(1, m * 2)}}>НА КАКОМ ДНЕ СДАЛСЯ БЫ?</div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- звук (тихие эффекты, без фонового гула)
type Fx = [number, string, number];
const SFX: Fx[] = [
  [0, 'money/boom.wav', 0.45], [2, 'money/cash.wav', 0.25], [v(12), 'sfx2/pop.wav', 0.3], [v(22), 'sfx2/impact.wav', 0.45], [v(22), 'sfx2/deflate.wav', 0.35],
  [S.d1, 'sfx2/whoosh.wav', 0.3], [v(36), 'sfx2/ding.wav', 0.3], [S.d5, 'sfx2/whoosh.wav', 0.3], [v(48), 'tilt/heart.wav', 0.3],
  [S.d12, 'sfx2/whoosh.wav', 0.3], ...Array.from({length: 5}).map((_, i): Fx => [v(54) + i * 5, 'sfx2/blip_low.wav', 0.22]), [v(60), 'sfx2/error.wav', 0.3],
  [S.d18, 'sfx2/whoosh.wav', 0.3], [v(68), 'sfx2/blip.wav', 0.3], [S.d23, 'sfx2/whoosh.wav', 0.3], [v(81), 'sfx2/error.wav', 0.3], [v(83), 'sfx2/whip.wav', 0.3],
  [S.d30, 'sfx2/whoosh.wav', 0.3], ...Array.from({length: 6}).map((_, i): Fx => [v(92) + i * 15, 'sfx2/tick.wav', 0.25]), [v(103), 'money/win.wav', 0.35],
  [v(110), 'money/cash.wav', 0.25], [S.end, 'sfx2/ding.wav', 0.35],
];
const GAIN = 0.45;

const Sound: React.FC = () => (
  <>
    {VO.map((o) => (
      <Sequence key={o.src} from={fr(o.at)} durationInFrames={fr(o.dur) + 6}>
        <Audio src={staticFile(o.src)} volume={1} />
      </Sequence>
    ))}
    {SFX.map(([at, src, vol], i) => (
      <Sequence key={i} from={Math.max(0, at)} durationInFrames={FPS * 2}>
        <Audio src={staticFile(src)} volume={vol * GAIN} />
      </Sequence>
    ))}
  </>
);

export const Mil: React.FC = () => {
  loadFonts();
  const order: [number, number, React.FC, boolean?][] = [
    [S.hook, S.d1, Hook], [S.d1, S.d5, D1, true], [S.d5, S.d12, D5, true], [S.d12, S.d18, D12, true], [S.d18, S.d23, D18, true],
    [S.d23, S.d30, D23, true], [S.d30, S.total, D30, true], [S.total, S.ask, Total, true], [S.ask, S.end, Ask, true],
  ];
  return (
    <AbsoluteFill style={{background: '#0b0c12'}}>
      {order.map(([from, to, C, cut], i) => <Scene key={i} from={from} to={to} cut={cut}><C /></Scene>)}
      <Flash at={0} len={8} color="rgba(255,210,63,0.5)" />
      <Flash at={v(22)} len={12} />
      <Flash at={v(103)} len={12} color="rgba(43,217,107,0.4)" />
      <TopBar />
      <AbsoluteFill style={{top: H - 220, height: 220, background: 'linear-gradient(rgba(11,12,18,0), #0b0c12)'}} />
      <Captions cues={CUES} />
      <End />
      <Sound />
    </AbsoluteFill>
  );
};
