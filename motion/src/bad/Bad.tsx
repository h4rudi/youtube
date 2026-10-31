// Ролик «Миллион рублей за катку в ужасных условиях» (9:16, ~54 с). Герой — Лёха v2.
// Исходники пользователя: кадр CS2 (public/bad/game.png), сетевая статистика плохая/хорошая (netbad.png, netgood.png),
// шариковая мышь (mouse.png), старый ноутбук (laptop.png — фон вырезан). Остальное нарисовано.
import React from 'react';
import {AbsoluteFill, Audio, Img, Sequence, interpolate, random, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {loadFonts} from '../theme';
import {FPS, fr} from '../tilt/script';
import {VO, TOTAL, CUES, v} from './script';
import {Captions, clamp, pop} from '../tilt/UI';
import {Scene, Cam, Flash} from '../money/Money';
import {H, RED, Portrait, MoneyRain, Mom} from '../money/Props';
import {LyokhaBust, Mood} from '../money/Lyokha';

export const BAD_FRAMES = fr(TOTAL);

const S = {hook: 0, cond: v(16) - 4, first: v(62) - 4, fifth: v(77) - 4, month: v(88) - 4, ask: v(106) - 4, end: fr(52.6)};
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
const Kid: React.FC<{x?: number; y?: number; s?: number; mood?: Mood; sweat?: boolean; bro?: boolean}> = ({x = 540, y = 820, s = 1, bro, ...p}) => (
  <svg width={1080} height={H} viewBox={`0 0 1080 ${H}`} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
    <g transform={`translate(${x} ${y}) scale(${s})`}><LyokhaBust {...p} {...(bro ? {hair: '#8a5a2b', hood: '#2f6a4a'} : {})} /></g>
  </svg>
);

// ---------------------------------------------------------------- условия «ада»
type Cond = {at: number; icon: React.ReactNode; title: string};
const Key: React.FC<{w?: number}> = ({w = 120}) => (
  <div style={{width: w, height: w, borderRadius: 14, background: 'linear-gradient(#3a3f4a, #22262f)', border: '4px solid #15171c', boxShadow: '0 8px 0 #111', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Russo One', fontSize: w * 0.5, color: '#fff'}}>W</div>
);
const Stool: React.FC<{w?: number}> = ({w = 130}) => (
  <svg width={w} height={w} viewBox="0 0 100 100"><ellipse cx={50} cy={24} rx={40} ry={12} fill="#a8743a" stroke="#5a3a1a" strokeWidth={3} /><path d="M22 30 L14 94 M78 30 L86 94 M40 34 L36 94 M60 34 L64 94" stroke="#7a5228" strokeWidth={7} strokeLinecap="round" /></svg>
);
const Phones: React.FC<{w?: number}> = ({w = 130}) => (
  <svg width={w} height={w} viewBox="0 0 100 100"><path d="M18 60 C18 26, 82 26, 82 60" stroke="#2a2d36" strokeWidth={9} fill="none" /><rect x={8} y={56} width={22} height={34} rx={8} fill="#2a2d36" /><rect x={70} y={56} width={22} height={34} rx={8} fill="#2a2d36" /><line x1={62} y1={50} x2={100} y2={96} stroke={RED} strokeWidth={7} /></svg>
);
const CONDS: Cond[] = [
  {at: v(16), title: 'ПИНГ 250', icon: <Img src={staticFile('bad/netbad.png')} style={{width: 220, borderRadius: 8}} />},
  {at: v(18), title: '20 FPS', icon: <Img src={staticFile('bad/laptop.png')} style={{width: 170}} />},
  {at: v(24), title: '60 Гц + битый пиксель', icon: <div style={{width: 140, height: 90, background: '#222', border: '6px solid #444', position: 'relative'}}><div style={{position: 'absolute', left: 60, top: 36, width: 12, height: 12, background: '#3f6'}} /></div>},
  {at: v(34), title: 'ШАРИКОВАЯ МЫШЬ', icon: <Img src={staticFile('bad/mouse.png')} style={{height: 150, borderRadius: 12}} />},
  {at: v(39), title: 'ЗАЛИПАЕТ W', icon: <Key />},
  {at: v(42), title: 'ОДНО УХО', icon: <Phones />},
  {at: v(48), title: 'ТАБУРЕТКА', icon: <Stool />},
  {at: v(52), title: 'МАМА С ПЫЛЕСОСОМ', icon: <div style={{fontSize: 110}}>🧹</div>},
  {at: v(55), title: 'БРАТ ЗА СПИНОЙ', icon: <div style={{fontSize: 110}}>🗣️</div>},
];

// экран игры, который «портится» по мере условий
const GameScreen: React.FC<{f: number; bad: number; y?: number; good?: boolean}> = ({f, bad, y = 120, good}) => {
  const lagF = bad >= 2 ? f - (f % 4) : f; // 20 FPS: картинка обновляется рывками
  const jitter = bad >= 1 && !good ? (random(`j${Math.floor(lagF / 6)}`) - 0.5) * 18 : 0;
  const lowres = bad >= 2 && !good;
  return (
    <div style={{position: 'absolute', left: 40, top: y, width: 1000, height: 562, borderRadius: 12, overflow: 'hidden', border: '8px solid #1a1c22', background: '#000', boxShadow: '0 30px 60px rgba(0,0,0,0.6)'}}>
      <div style={{position: 'absolute', inset: 0, transform: `translateX(${jitter}px)`, overflow: 'hidden'}}>
        {lowres ? (
          <Img src={staticFile('bad/game.png')} style={{width: 240, height: 135, transform: 'scale(4.1667)', transformOrigin: '0 0', imageRendering: 'pixelated', filter: bad >= 3 ? 'saturate(0.7) contrast(0.9)' : 'none'}} />
        ) : (
          <Img src={staticFile('bad/game.png')} style={{width: 984, height: 546}} />
        )}
      </div>
      {bad >= 3 && !good && <div style={{position: 'absolute', left: 488, top: 266, width: 14, height: 14, background: '#3f6', boxShadow: '0 0 8px #3f6'}} />}
      {bad >= 1 && !good && <Img src={staticFile('bad/netbad.png')} style={{position: 'absolute', right: 8, top: 8, width: 220, opacity: 0.95}} />}
      {good && <Img src={staticFile('bad/netgood.png')} style={{position: 'absolute', right: 8, top: 8, width: 240}} />}
    </div>
  );
};

// ---------------------------------------------------------------- шапка
const TopBar: React.FC = () => {
  const f = useCurrentFrame();
  if (f < S.cond || f >= S.end) return null;
  const good = f >= v(94);
  const ping = good ? 9 : f >= v(16) ? 250 + Math.round(random(`p${Math.floor(f / 8)}`) * 30) : 30;
  const fps = good ? 145 : f >= v(21) ? 18 + Math.round(random(`q${Math.floor(f / 8)}`) * 5) : 145;
  const earned = f >= v(92) ? interpolate(f, [v(92), v(93) + 10], [1, 30], clamp) * 1000000 : f >= v(74) ? 1000000 : 0;
  const col = (label: string, body: React.ReactNode) => <div><div style={{fontSize: 15, color: '#8f98a0', fontWeight: 900}}>{label}</div><div style={{marginTop: 2}}>{body}</div></div>;
  return (
    <div style={{position: 'absolute', left: 40, right: 40, top: 26, display: 'flex', gap: 40, alignItems: 'flex-end', background: 'rgba(10,12,18,0.88)', border: `2px solid ${RED}55`, borderRadius: 14, padding: '10px 22px', fontFamily: 'Montserrat'}}>
      {col('ЗАРАБОТАНО', <span style={{fontFamily: 'Russo One', fontSize: 32, color: earned ? GREEN : '#8f98a0'}}>{(Math.round(earned / 100000) * 100000).toLocaleString('ru-RU')} ₽</span>)}
      {col('ПИНГ', <span style={{fontFamily: 'Russo One', fontSize: 32, color: ping > 100 ? RED : GREEN}}>{ping} ms</span>)}
      {col('FPS', <span style={{fontFamily: 'Russo One', fontSize: 32, color: fps < 60 ? RED : GREEN}}>{fps}</span>)}
    </div>
  );
};

// ---------------------------------------------------------------- сцены
const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const slam = pop(f, 1, fps, 380, 9);
  const but = f >= v(9);
  const glitch = but && f < v(9) + 14;
  const gx = glitch ? (random(`g${f}`) - 0.5) * 40 : 0;
  return (
    <>
      <Bg glow={but ? '#5a1016' : '#5a4a10'} />
      <Cam s={interpolate(f, [0, S.cond], [1.12, 1.0], clamp)} shake={f < 10 ? (1 - f / 10) * 1.2 : glitch ? 0.8 : 0}>
        <div style={{position: 'absolute', left: 0, top: 500, width: 1080, height: 680, overflow: 'hidden'}}>
          <Portrait f={f} bg="dorm" mood={but ? 'shocked' : 'happy'} scale={1.1} y={430} light={but ? RED : GOLD} lightAmt={0.15} />
        </div>
        {!but && <MoneyRain f={f} from={0} until={v(9)} n={34} speed={14} seed="bad" />}
        <div style={{position: 'absolute', left: 540 + gx, top: 230, transform: `translate(-50%,-50%) scale(${slam})`, opacity: Math.min(1, slam * 2), textAlign: 'center', whiteSpace: 'nowrap'}}>
          <div style={{fontFamily: 'Russo One', fontSize: 130, color: GOLD, textShadow: glitch ? `-8px 0 ${RED}, 8px 0 #3af` : `0 0 60px ${GOLD}, 0 6px 0 #7a5a08`}}>1 000 000 ₽</div>
          <div style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 52, color: '#fff'}}>ЗА КАЖДУЮ КАТКУ</div>
        </div>
        {f >= v(13) && <Big x={540} y={450} s={pop(f, v(13), fps, 380, 8)} size={84} color={RED}>В УЖАСНЫХ УСЛОВИЯХ</Big>}
      </Cam>
    </>
  );
};

const Conds: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const n = CONDS.filter((c) => f >= c.at).length;
  const cur = CONDS[n - 1];
  const mood: Mood = n >= 7 ? 'shocked' : n >= 4 ? 'worried' : 'neutral';
  return (
    <>
      <Bg glow="#3a1016" />
      <GameScreen f={f} bad={n} />
      <Kid x={270} y={1010} s={0.72} mood={mood} sweat={n >= 5} />
      {n >= 9 && <Kid x={560} y={1080} s={0.5} bro mood="happy" />}
      {n >= 9 && <div style={{position: 'absolute', left: 790, top: 880, transform: `translate(-50%,-50%) scale(${pop(f, v(59), fps)})`, background: '#fff', color: '#111', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 30, padding: '10px 20px', borderRadius: 20, whiteSpace: 'nowrap'}}>ахаха, опять умер</div>}
      {n >= 8 && n < 9 && <div style={{position: 'absolute', left: 560, top: 640, width: 1080, height: H, transform: 'scale(0.42)', transformOrigin: '0 0'}}><Mom tears={0} f={f} /></div>}
      {n >= 8 && n < 9 && <div style={{position: 'absolute', left: 930, top: 1000, fontSize: 120, transform: `rotate(${Math.sin(f / 3) * 15}deg)`}}>🧹</div>}
      {cur && (
        <div style={{position: 'absolute', left: 760, top: 820, transform: `translate(-50%,-50%) scale(${pop(f, cur.at, fps, 320, 10)})`, display: n >= 8 ? 'none' : 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
          background: 'rgba(30,8,12,0.92)', border: `4px solid ${RED}`, borderRadius: 22, padding: '20px 26px', boxShadow: `0 0 40px ${RED}55`}}>
          <div style={{height: 150, display: 'flex', alignItems: 'center'}}>{cur.icon}</div>
          <div style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 34, color: '#fff', whiteSpace: 'nowrap'}}>✕ {cur.title}</div>
        </div>
      )}
      {n >= 8 && <Chip x={540} y={720} s={pop(f, cur.at, fps)} bg={RED} size={38}>✕ {cur.title}</Chip>}
      <div style={{position: 'absolute', left: 40, top: 700, display: 'flex', gap: 6}}>
        {CONDS.map((c, i) => <div key={i} style={{width: 18, height: 18, borderRadius: 9, background: i < n ? RED : '#2a3040'}} />)}
      </div>
    </>
  );
};

const First: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const tele = f >= v(66);
  return (
    <>
      <Bg glow="#3a1016" />
      <Chip x={540} y={150} s={pop(f, S.first, fps)} bg={RED} size={42}>КАТКА №1</Chip>
      <GameScreen f={f} bad={9} y={230} />
      {tele && (
        <svg width={1080} height={H} viewBox={`0 0 1080 ${H}`} style={{position: 'absolute', inset: 0}}>
          <circle cx={540} cy={510} r={30} fill="none" stroke={RED} strokeWidth={5} />
          <path d="M540 510 L760 470" stroke={RED} strokeWidth={4} strokeDasharray="10 8" />
          <rect x={740} y={430} width={40} height={80} rx={14} fill={RED} opacity={0.4 + 0.4 * Math.sin(f / 3)} />
          <text x={760} y={420} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={26} fill={RED}>уже за стеной</text>
        </svg>
      )}
      {f >= v(71) && <Big x={540} y={930} s={pop(f, v(71), fps, 320, 9)} size={120} color={RED}>2 : 13</Big>}
      {f >= v(74) && <Chip x={540} y={1070} s={pop(f, v(74), fps)} bg={GREEN} color="#06260f" size={46}>+1 000 000 ₽</Chip>}
    </>
  );
};

const Fifth: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <>
      <Bg glow="#2a3a2a" />
      <Chip x={540} y={150} s={pop(f, S.fifth, fps)} bg={ORANGE} size={42}>КАТКА №5</Chip>
      <GameScreen f={f} bad={9} y={230} />
      <svg width={1080} height={H} viewBox={`0 0 1080 ${H}`} style={{position: 'absolute', inset: 0}}>
        <circle cx={600} cy={510} r={22} fill="none" stroke={GREEN} strokeWidth={5} />
        <path d="M520 510 L585 510" stroke={GREEN} strokeWidth={4} markerEnd="" />
        <text x={600} y={470} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={24} fill={GREEN}>на опережение</text>
      </svg>
      <Kid y={1060} s={0.6} mood="happy" />
      {f >= v(80) && <Chip x={540} y={860} s={pop(f, v(80), fps)} bg={GREEN} color="#06260f" size={42}>ПРИВЫК 💪</Chip>}
      {f >= v(85) && <Chip x={540} y={950} s={pop(f, v(85), fps)} bg="#1c2030" size={34}>бегает без W</Chip>}
    </>
  );
};

const Month: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const good = f >= v(94);
  return (
    <>
      <Bg glow={good ? '#1a4a3a' : '#3a3a10'} />
      {!good && (
        <>
          <Chip x={540} y={200} s={pop(f, S.month, fps)} bg={GOLD} color="#111" size={42}>ЧЕРЕЗ МЕСЯЦ</Chip>
          <Big x={540} y={480} s={pop(f, v(92), fps, 320, 9)} size={120} color={GREEN}>30 000 000 ₽</Big>
          <MoneyRain f={f} from={v(92)} n={26} speed={13} seed="bad2" />
        </>
      )}
      {good && (
        <>
          <GameScreen f={f} bad={0} y={150} good />
          <Chip x={540} y={780} s={pop(f, v(94), fps)} bg={GREEN} color="#06260f" size={40}>НОРМАЛЬНЫЙ КОМП · 145 FPS · 9 ms</Chip>
          {f >= v(103) && (
            <div style={{position: 'absolute', left: 540, top: 960, transform: `translate(-50%,-50%) scale(${pop(f, v(103), fps, 320, 9)})`, display: 'flex', alignItems: 'center', gap: 20}}>
              <Img src={staticFile('x2/lvl10.png')} style={{width: 140}} />
              <span style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 70, color: RED, textShadow: `0 0 30px ${RED}`}}>РАЗНОСИТ</span>
            </div>
          )}
        </>
      )}
    </>
  );
};

const Ask: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <>
      <Bg glow="#3a1016" />
      <Big x={540} y={190} s={pop(f, S.ask, fps)} size={54} color="#fff">КАКОЕ САМОЕ УЖАСНОЕ?</Big>
      <div style={{position: 'absolute', left: 540, top: 640, transform: 'translate(-50%,-50%)', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16}}>
        {CONDS.map((c, i) => (
          <div key={i} style={{width: 300, height: 240, borderRadius: 18, background: '#1c1418', border: `3px solid ${RED}88`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8,
            transform: `scale(${pop(f, S.ask + i * 3, fps)})`}}>
            <div style={{transform: 'scale(0.7)', height: 150, display: 'flex', alignItems: 'center'}}>{c.icon}</div>
            <div style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 22, color: '#fff', textAlign: 'center'}}>{c.title}</div>
          </div>
        ))}
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
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, #5a1016, #0b0c12 70%)', alignItems: 'center', justifyContent: 'center', paddingBottom: 240, textAlign: 'center'}}>
      <div style={{fontFamily: 'Russo One', fontSize: 110, color: GOLD, transform: `scale(${0.6 + 0.4 * m})`}}>1 000 000 ₽</div>
      <div style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 50, color: '#fff', marginTop: 20, opacity: Math.min(1, m * 2)}}>ПИШИ САМОЕ УЖАСНОЕ 👇</div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- звук (тихие эффекты, без фонового гула)
type Fx = [number, string, number];
const SFX: Fx[] = [
  [0, 'money/boom.wav', 0.45], [2, 'money/cash.wav', 0.25], [v(9), 'sfx2/glitch.wav', 0.45], [v(13), 'sfx2/impact.wav', 0.4],
  ...CONDS.map((c): Fx => [c.at, 'sfx2/stamp.wav', 0.28]), [v(52), 'sfx2/lag.wav', 0.2],
  [S.first, 'sfx2/whoosh.wav', 0.3], [v(66), 'sfx2/error.wav', 0.3], [v(71), 'sfx2/deflate.wav', 0.35], [v(74), 'money/cash.wav', 0.25],
  [S.fifth, 'sfx2/whoosh.wav', 0.3], [v(80), 'sfx2/ding.wav', 0.3], [v(92), 'money/win.wav', 0.3], [v(103), 'sfx2/impact.wav', 0.35], [S.end, 'sfx2/ding.wav', 0.35],
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

export const Bad: React.FC = () => {
  loadFonts();
  const order: [number, number, React.FC, boolean?][] = [
    [S.hook, S.cond, Hook], [S.cond, S.first, Conds, true], [S.first, S.fifth, First, true], [S.fifth, S.month, Fifth, true], [S.month, S.ask, Month, true], [S.ask, S.end, Ask, true],
  ];
  return (
    <AbsoluteFill style={{background: '#0b0c12'}}>
      {order.map(([from, to, C, cut], i) => <Scene key={i} from={from} to={to} cut={cut}><C /></Scene>)}
      <Flash at={0} len={8} color="rgba(255,210,63,0.5)" />
      <Flash at={v(9)} len={10} />
      <Flash at={v(71)} len={10} />
      <TopBar />
      <AbsoluteFill style={{top: H - 220, height: 220, background: 'linear-gradient(rgba(11,12,18,0), #0b0c12)'}} />
      <Captions cues={CUES} />
      <End />
      <Sound />
    </AbsoluteFill>
  );
};
