// Ролик «+100 000 ₽ за победу, −200 000 ₽ за поражение на FACEIT» (9:16, ~59 с). Герой — Лёха v2. Мысленный эксперимент.
// Исходники пользователя: «Матч готов» (public/faceit2x/ready.png), история матчей (history.png — эло стёрто, суммы нарисованы),
// статистика 52% (stats.png), лобби с кнопкой «Найти матч» (lobby.png — чужой ник и аватар стёрты, вместо них Лёха).
import React from 'react';
import {AbsoluteFill, Audio, Img, Sequence, interpolate, random, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {loadFonts} from '../theme';
import {FPS, fr} from '../tilt/script';
import {VO, TOTAL, CUES, v} from './script';
import {Captions, clamp, pop} from '../tilt/UI';
import {Scene, Cam, Flash} from '../money/Money';
import {ramp} from '../tilt/Tilt';
import {H, RED, Portrait} from '../money/Props';
import {LyokhaHead, LyokhaBust} from '../money/Lyokha';

export const FACEIT2X_FRAMES = fr(TOTAL);

const S = {
  hook: 0, day1: v(15) - 4, calc: v(38) - 4, week: v(68) - 4, month: v(87) - 4, out: v(105) - 4, ask: v(124) - 4, end: fr(57.0),
};
const GOLD = '#ffd23f', GREEN = '#2bd96b', ORANGE = '#ff5500';
const rub = (n: number) => `${n > 0 ? '+' : n < 0 ? '−' : ''}${Math.abs(Math.round(n)).toLocaleString('ru-RU')} ₽`;

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

// ---------------------------------------------------------------- шапка: баланс · каток · винрейт
const BAL: [number, number, number, number][] = [ // кадр, баланс, катки, победы
  [0, 0, 0, 0], [v(24), 100000, 1, 1], [v(31), -100000, 2, 1], [v(34), 0, 3, 2], [v(65), -50000, 4, 2], [v(70), -250000, 6, 3], [v(87), -450000, 9, 4],
];
const TopBar: React.FC = () => {
  const f = useCurrentFrame();
  if (f >= S.end) return null;
  let i = 0;
  while (i + 1 < BAL.length && f >= BAL[i + 1][0]) i++;
  const [a, b, games, wins] = BAL[i];
  const prev = i ? BAL[i - 1][1] : 0;
  const bal = interpolate(f, [a, a + 12], [prev, b], clamp);
  const wr = games ? Math.round((wins / games) * 100) : 0;
  const col = (label: string, body: React.ReactNode) => (
    <div><div style={{fontSize: 15, color: '#8f98a0', fontWeight: 900, letterSpacing: 1}}>{label}</div><div style={{marginTop: 2}}>{body}</div></div>
  );
  return (
    <div style={{position: 'absolute', left: 40, right: 40, top: 26, display: 'flex', gap: 46, alignItems: 'flex-end', background: 'rgba(10,12,18,0.88)', border: `2px solid ${ORANGE}66`, borderRadius: 14, padding: '10px 22px', fontFamily: 'Montserrat'}}>
      {col('БАЛАНС', <span style={{fontFamily: 'Russo One', fontSize: 32, color: bal > 0 ? GREEN : bal < 0 ? RED : '#fff'}}>{rub(bal)}</span>)}
      {col('КАТОК', <span style={{fontFamily: 'Russo One', fontSize: 32, color: '#fff'}}>{games}</span>)}
      {col('ВИНРЕЙТ', <span style={{fontFamily: 'Russo One', fontSize: 32, color: wr >= 67 ? GREEN : wr ? RED : '#8f98a0'}}>{wr}%</span>)}
    </div>
  );
};

// ---------------------------------------------------------------- сцены
const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const plate = (at: number, y: number, top: string, sum: string, c: string) => {
    const s = pop(f, at, fps, 300, 10);
    return (
      <div style={{position: 'absolute', left: 540, top: y, width: 880, transform: `translate(-50%,-50%) scale(${s})`, opacity: Math.min(1, s * 2), background: `${c}22`, border: `5px solid ${c}`, borderRadius: 26, padding: '22px 0', textAlign: 'center', boxShadow: `0 0 50px ${c}55`}}>
        <div style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 40, color: '#fff'}}>{top}</div>
        <div style={{fontFamily: 'Russo One', fontSize: 110, color: c, textShadow: `0 0 30px ${c}`}}>{sum}</div>
      </div>
    );
  };
  return (
    <>
      <Bg glow="#5a2a10" />
      <div style={{position: 'absolute', left: 540, top: 210, transform: `translate(-50%,-50%) scale(${pop(f, v(1), fps)})`}}><Img src={staticFile('img/faceit_logo.png')} style={{height: 90}} /></div>
      {plate(v(3), 480, 'ЗА ПОБЕДУ', '+100 000 ₽', GREEN)}
      {plate(v(9), 820, 'ЗА ПОРАЖЕНИЕ', '−200 000 ₽', RED)}
    </>
  );
};

// история матчей (скрин пользователя): строки с суммами вместо эло
const ROWS: [boolean, number][] = [[true, v(24)], [false, v(31)], [true, v(34)]]; // победа?, когда появляется
const Day1: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const ready = f < v(20);
  const k = 1000 / 634;
  return (
    <>
      <Bg glow="#3a2a10" />
      {ready ? (
        <>
          <Chip x={540} y={170} s={pop(f, S.day1, fps)} bg={ORANGE} size={42}>ДЕНЬ ПЕРВЫЙ</Chip>
          <div style={{position: 'absolute', left: 540, top: 520, transform: `translate(-50%,-50%) scale(${pop(f, v(17), fps, 260, 12) * 1.6})`}}><Img src={staticFile('faceit2x/ready.png')} style={{width: 550}} /></div>
          <Chip x={540} y={880} s={pop(f, v(17), fps)} bg="#1c2030" size={40}>ВСЕ БЕГУТ ИГРАТЬ 🏃</Chip>
        </>
      ) : (
        <>
          <div style={{position: 'absolute', left: 0, top: 120, transform: `scale(${pop(f, v(20), fps)})`, transformOrigin: '540px 0'}}>
            <div style={{position: 'absolute', left: 280, top: 0}}><Portrait f={f} bg="dorm" mood={f >= v(31) && f < v(34) ? 'shocked' : 'happy'} scale={0.55} y={260} /></div>
          </div>
          <div style={{position: 'absolute', left: 40, top: 600, width: 1000, height: 3 * 56 * k, overflow: 'hidden', borderRadius: 12}}>
            {ROWS.map(([win, at], i) => {
              if (f < at) return null;
              const a = Math.min(1, (f - at) / 6);
              return (
                <div key={i} style={{position: 'absolute', left: 0, top: i * 56 * k, width: 1000, height: 56 * k, overflow: 'hidden', opacity: a, transform: `translateX(${(1 - a) * 60}px)`}}>
                  <Img src={staticFile('faceit2x/history.png')} style={{position: 'absolute', left: 0, top: -(win ? 102 : 46) * k, width: 1000}} />
                  <div style={{position: 'absolute', left: 560, top: 0, height: 56 * k, display: 'flex', alignItems: 'center', fontFamily: 'Russo One', fontSize: 36, color: win ? GREEN : RED}}>{win ? '+100 000 ₽' : '−200 000 ₽'}</div>
                </div>
              );
            })}
          </div>
          {f >= v(36) && <Big x={540} y={1020} s={pop(f, v(36), fps, 320, 9)} size={90} color="#fff">ИТОГО: 0 ₽</Big>}
        </>
      )}
    </>
  );
};

const Calc: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const need = ramp(f, v(46), v(51));
  const have = ramp(f, v(54), v(59));
  const bar = (y: number, label: string, p: number, target: number, c: string) => (
    <div style={{position: 'absolute', left: 80, top: y, width: 920, fontFamily: 'Montserrat'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', fontWeight: 900, fontSize: 34, color: '#fff'}}><span>{label}</span><span style={{color: c}}>{Math.round(target * p)}%</span></div>
      <div style={{marginTop: 10, height: 40, borderRadius: 20, background: '#1c2030', overflow: 'hidden'}}><div style={{width: `${target * p}%`, height: 40, background: c, boxShadow: `0 0 20px ${c}`}} /></div>
    </div>
  );
  return (
    <>
      <Bg glow="#1a3a4a" />
      <Chip x={540} y={160} s={pop(f, S.calc, fps)} bg="#1c2030" size={40}>🧮 ЛЁХА СЧИТАЕТ</Chip>
      {bar(300, 'Нужно для плюса', need, 67, GREEN)}
      {bar(460, 'У обычного игрока', have, 50, RED)}
      {f >= v(52) && <div style={{position: 'absolute', left: 540, top: 690, transform: `translate(-50%,-50%) scale(${pop(f, v(52), fps) * 2.2})`}}><Img src={staticFile('faceit2x/stats.png')} style={{width: 264}} /></div>}
      {f >= v(65) && <Big x={540} y={930} s={pop(f, v(65), fps, 320, 9)} size={96} color={RED}>−50 000 ₽</Big>}
      {f >= v(65) && <Chip x={540} y={1060} s={pop(f, v(65) + 4, fps)} bg="#1c2030" size={36}>в среднем за каждую катку</Chip>}
    </>
  );
};

const Week: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const k = 1000 / 1344;
  const online = Math.round(interpolate(f, [S.week, v(72)], [480000, 12000], clamp) / 1000) * 1000;
  return (
    <>
      <Bg glow="#2a1a1a" />
      <Chip x={540} y={150} s={pop(f, S.week, fps)} bg={ORANGE} size={42}>ЧЕРЕЗ НЕДЕЛЮ</Chip>
      <div style={{position: 'absolute', left: 540, top: 270, transform: 'translate(-50%,-50%)', fontFamily: 'Montserrat', textAlign: 'center'}}>
        <div style={{fontSize: 26, fontWeight: 900, color: '#8f98a0'}}>ИГРОКОВ ОНЛАЙН</div>
        <div style={{fontFamily: 'Russo One', fontSize: 80, color: online < 100000 ? RED : '#fff'}}>{online.toLocaleString('ru-RU')}</div>
      </div>
      <div style={{position: 'absolute', left: 40, top: 400, width: 1000, height: 423 * k, overflow: 'hidden', borderRadius: 14, boxShadow: '0 30px 60px rgba(0,0,0,0.6)'}}>
        <Img src={staticFile('faceit2x/lobby.png')} style={{width: 1000, filter: f >= v(72) ? 'grayscale(0.85)' : 'none'}} />
        <div style={{position: 'absolute', left: 596 * k - 50, top: 150 * k - 50, width: 100, height: 100, borderRadius: 50, overflow: 'hidden', background: '#2a3045'}}><svg width={100} height={100} viewBox="-200 -230 400 400"><LyokhaHead mood="worried" /></svg></div>
        <div style={{position: 'absolute', left: 596 * k, top: 222 * k, transform: 'translateX(-50%)', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 18, color: '#fff'}}>Лёха</div>
        {f >= v(72) && <div style={{position: 'absolute', left: 480 * k, top: 351 * k, width: 231 * k, height: 48 * k, background: 'rgba(60,60,60,0.85)', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 20, color: '#aaa'}}>НИКТО НЕ ИЩЕТ</div>}
      </div>
      {f >= v(80) && (
        <div style={{position: 'absolute', left: 540, top: 900, transform: `translate(-50%,-50%) scale(${pop(f, v(80), fps)})`, display: 'flex', alignItems: 'center', gap: 18, background: 'rgba(40,8,12,0.9)', border: `3px solid ${RED}`, borderRadius: 18, padding: '18px 28px', fontFamily: 'Montserrat'}}>
          <div style={{fontSize: 44}}>💀</div>
          <div><div style={{fontSize: 30, fontWeight: 900, color: '#fff'}}>тиммейт слил 1 раунд</div><div style={{fontSize: 26, fontWeight: 900, color: RED}}>−200 000 ₽ под угрозой</div></div>
        </div>
      )}
    </>
  );
};

const Month: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <>
      <Bg glow="#3a3010" />
      <Chip x={540} y={150} s={pop(f, S.month, fps)} bg={ORANGE} size={42}>ЧЕРЕЗ МЕСЯЦ</Chip>
      <div style={{position: 'absolute', left: 300, top: 470, transform: `translate(-50%,-50%) scale(${pop(f, v(91), fps)})`, textAlign: 'center'}}>
        <Img src={staticFile('img/lvl10.png')} style={{width: 260}} />
        <div style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 36, color: GREEN, marginTop: 10}}>винрейт 70%+</div>
      </div>
      {f >= v(98) && (
        <div style={{position: 'absolute', left: 780, top: 470, transform: `translate(-50%,-50%) scale(${pop(f, v(98), fps)})`, textAlign: 'center'}}>
          <div style={{fontSize: 140}}>💰</div>
          <div style={{fontFamily: 'Russo One', fontSize: 56, color: GREEN}}>миллионы</div>
        </div>
      )}
      {f >= v(100) && (
        <div style={{position: 'absolute', left: 0, top: 760, width: 1080, display: 'flex', justifyContent: 'center', gap: 14}}>
          {Array.from({length: 6}).map((_, i) => (
            <div key={i} style={{textAlign: 'center', opacity: Math.min(1, Math.max(0, (f - v(100) - i * 3) / 6))}}>
              <div style={{width: 130, height: 130, borderRadius: 65, overflow: 'hidden', background: '#2a3045', margin: '0 auto'}}><svg width={130} height={130} viewBox="-200 -230 400 400"><LyokhaHead mood={i % 2 ? 'worried' : 'tired'} hair={['#1c1a20', '#8a5a2b', '#c9a24a', '#3a2a1a', '#5a3a2a', '#1c1a20'][i]} /></svg></div>
              <div style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 18, color: RED, marginTop: 6}}>«отыграюсь»</div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

const Out: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <>
      <svg width={1080} height={H} viewBox={`0 0 1080 ${H}`} style={{position: 'absolute', inset: 0}}>
        <defs><linearGradient id="dsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#5fb2f0" /><stop offset="1" stopColor="#bfe3ff" /></linearGradient></defs>
        <rect width={1080} height={H} fill="url(#dsky)" />
        <circle cx={860} cy={240} r={90} fill="#ffe27a" />
        {[0, 1, 2].map((i) => <rect key={i} x={40 + i * 360} y={360 + (i % 2) * 60} width={300} height={600} fill="#c9b8a0" stroke="#8a7a66" strokeWidth={6} />)}
        <rect y={860} width={1080} height={400} fill="#5aa04a" />
        {[150, 930].map((x) => <g key={x}><rect x={x - 12} y={700} width={24} height={180} fill="#6a4a2a" /><circle cx={x} cy={660} r={110} fill="#4a9a3a" stroke="#2a6a2a" strokeWidth={6} /></g>)}
      </svg>
      <svg width={1080} height={H} viewBox={`0 0 1080 ${H}`} style={{position: 'absolute', inset: 0}}><g transform="translate(540 860) scale(0.9)"><LyokhaBust mood="happy" /></g></svg>
      {f >= v(107) && <Chip x={540} y={160} s={pop(f, v(107), fps)} bg="#1c2030" size={40}>FACEIT удалён ✓</Chip>}
      {f >= v(122) && <Big x={540} y={330} s={pop(f, v(122), fps, 320, 9)} size={96} color={GOLD}>НЕ ИГРАТЬ</Big>}
    </>
  );
};

const Ask: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <>
      <Bg glow="#3a2a10" />
      <Big x={540} y={330} s={pop(f, S.ask, fps)} size={60} color="#fff">А ТЫ БЫ РИСКНУЛ?</Big>
      <div style={{position: 'absolute', left: 540, top: 600, transform: `translate(-50%,-50%) scale(${pop(f, v(128), fps)})`, display: 'flex', gap: 30}}>
        <div style={{background: GREEN, color: '#06260f', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 44, padding: '22px 40px', borderRadius: 16}}>ДА, 1 КАТКУ</div>
        <div style={{background: RED, color: '#fff', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 44, padding: '22px 40px', borderRadius: 16}}>НИ ЗА ЧТО</div>
      </div>
    </>
  );
};

const End: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (f < S.end) return null;
  const m = pop(f, S.end, fps, 320, 9);
  return (
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, #3a2a10, #0b0c12 70%)', alignItems: 'center', justifyContent: 'center', paddingBottom: 240, textAlign: 'center'}}>
      <div style={{fontFamily: 'Russo One', fontSize: 90, color: GREEN, transform: `scale(${0.6 + 0.4 * m})`}}>+100 000</div>
      <div style={{fontFamily: 'Russo One', fontSize: 90, color: RED, transform: `scale(${0.6 + 0.4 * m})`}}>−200 000</div>
      <div style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 52, color: '#fff', marginTop: 20, opacity: Math.min(1, m * 2)}}>ПИШИ: РИСКНУЛ БЫ?</div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- звук (тихие эффекты, без фонового гула)
type Fx = [number, string, number];
const SFX: Fx[] = [
  [v(3), 'sfx2/impact.wav', 0.35], [v(9), 'sfx2/impact.wav', 0.35], [v(17), 'tilt/accept.wav', 0.3],
  [v(24), 'sfx2/ding.wav', 0.3], [v(31), 'sfx2/error.wav', 0.3], [v(34), 'sfx2/ding.wav', 0.3], [v(36), 'sfx2/stamp.wav', 0.3],
  [v(52), 'sfx2/blip.wav', 0.3], [v(65), 'sfx2/deflate.wav', 0.35], [v(72), 'sfx2/blip_low.wav', 0.3], [v(80), 'sfx2/error.wav', 0.25],
  [v(91), 'sfx2/pop.wav', 0.3], [v(98), 'money/cash.wav', 0.25], [S.out, 'sfx2/whoosh.wav', 0.3], [v(122), 'sfx2/stamp.wav', 0.3],
  [S.end, 'sfx2/ding.wav', 0.35],
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

export const Faceit2x: React.FC = () => {
  loadFonts();
  const order: [number, number, React.FC, boolean?][] = [
    [S.hook, S.day1, Hook], [S.day1, S.calc, Day1, true], [S.calc, S.week, Calc, true], [S.week, S.month, Week, true],
    [S.month, S.out, Month, true], [S.out, S.ask, Out, true], [S.ask, S.end, Ask, true],
  ];
  return (
    <AbsoluteFill style={{background: '#0b0c12'}}>
      {order.map(([from, to, C, cut], i) => <Scene key={i} from={from} to={to} cut={cut}><C /></Scene>)}
      <Flash at={v(31)} len={10} />
      <Flash at={v(65)} len={10} />
      <TopBar />
      <AbsoluteFill style={{top: H - 220, height: 220, background: 'linear-gradient(rgba(11,12,18,0), #0b0c12)'}} />
      <Captions cues={CUES} />
      <End />
      <Sound />
    </AbsoluteFill>
  );
};
