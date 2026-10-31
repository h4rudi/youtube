// Ролик «Что будет, если Steam взломают» (9:16, ~57 с). Последствия глазами игрока, без технических деталей взлома.
// Исходники пользователя: окно ошибки Steam (public/hack/err.png), Steam Guard (guard_c.png — устройство и город размыты),
// Торговая площадка (market_c.png), строки библиотеки CS2/Dota 2 (lib_c.png). Фон — тот же тихий тревожный дрон (wake/tension.mp3).
import React from 'react';
import {AbsoluteFill, Audio, Img, Sequence, interpolate, random, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {loadFonts} from '../theme';
import {FPS, fr} from '../tilt/script';
import {VO, TOTAL, CUES, v} from './script';
import {Captions, clamp, pop} from '../tilt/UI';
import {Scene, Cam, Flash} from '../money/Money';
import {H, RED, Portrait} from '../money/Props';
import {LyokhaHead} from '../money/Lyokha';

export const HACK_FRAMES = fr(TOTAL);

const S = {hook: 0, h1: v(21) - 4, h3: v(43) - 4, d2: v(64) - 4, week: v(80) - 4, y2011: v(102) - 4, guard: v(116) - 4, ask: v(123) - 4, end: fr(55.2)};
const GOLD = '#ffd23f', GREEN = '#2bd96b', STEAM = '#1b2838';

const Bg: React.FC<{glow?: string}> = ({glow = '#3a1016'}) => (
  <AbsoluteFill style={{height: H, backgroundColor: '#07080c', backgroundImage: `radial-gradient(ellipse at 50% 40%, ${glow}55, #07080c 70%), radial-gradient(rgba(120,150,230,0.08) 2px, transparent 2px)`, backgroundSize: 'auto, 44px 44px'}} />
);
const Big: React.FC<{x: number; y: number; s: number; size: number; color?: string; children: React.ReactNode}> = ({x, y, s, size, color = '#fff', children}) => (
  <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%, -50%) scale(${s})`, opacity: Math.min(1, s * 2), fontFamily: 'Montserrat', fontWeight: 900, fontSize: size,
    color, whiteSpace: 'nowrap', textAlign: 'center', lineHeight: 1.05, textShadow: color === '#fff' ? '0 4px 0 rgba(0,0,0,0.6)' : `0 0 34px ${color}88, 0 4px 0 rgba(0,0,0,0.6)`}}>{children}</div>
);
const Chip: React.FC<{x: number; y: number; s: number; bg: string; color?: string; size?: number; children: React.ReactNode}> = ({x, y, s, bg, color = '#fff', size = 40, children}) => (
  <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%, -50%) scale(${s})`, opacity: Math.min(1, s * 2), background: bg, color, fontFamily: 'Montserrat', fontWeight: 900,
    fontSize: size, padding: '12px 30px', borderRadius: 50, whiteSpace: 'nowrap', boxShadow: `0 0 30px ${bg}88`}}>{children}</div>
);
const Stamp: React.FC<{x: number; y: number; at: number; children: React.ReactNode; size?: number}> = ({x, y, at, children, size = 70}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (f < at) return null;
  return <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) rotate(-10deg) scale(${pop(f, at, fps, 380, 8)})`, border: `7px solid ${RED}`, color: RED, fontFamily: 'Montserrat', fontWeight: 900, fontSize: size,
    padding: '4px 30px', borderRadius: 12, background: 'rgba(7,8,12,0.75)', whiteSpace: 'nowrap'}}>{children}</div>;
};
// значок Steam
const SteamLogo: React.FC<{w: number; broken?: number}> = ({w, broken = 0}) => (
  <svg width={w} height={w} viewBox="0 0 100 100">
    <circle cx={50} cy={50} r={46} fill={STEAM} stroke={broken ? RED : '#66c0f4'} strokeWidth={5} />
    <circle cx={64} cy={38} r={14} fill="none" stroke="#fff" strokeWidth={6} /><circle cx={64} cy={38} r={6} fill="#fff" />
    <circle cx={34} cy={64} r={10} fill="#fff" /><line x1={34} y1={64} x2={56} y2={44} stroke="#fff" strokeWidth={7} />
    {broken > 0 && <path d="M30 8 L46 40 L36 52 L58 92" stroke={RED} strokeWidth={6} fill="none" opacity={broken} />}
  </svg>
);

// ---------------------------------------------------------------- шапка
const TopBar: React.FC = () => {
  const f = useCurrentFrame();
  if (f < S.h1 || f >= S.ask) return null;
  const label = f >= S.y2011 ? '—' : f >= S.week ? 'НЕДЕЛЯ' : f >= S.d2 ? '2 ДНЯ' : f >= S.h3 ? '3 ЧАСА' : '1 ЧАС';
  const online = f >= S.week ? interpolate(f, [v(86), v(88)], [0, 28], clamp) : interpolate(f, [S.h1, v(36)], [30, 0], clamp);
  const col = (a: string, b: React.ReactNode) => <div><div style={{fontSize: 15, color: '#8f98a0', fontWeight: 900}}>{a}</div><div style={{marginTop: 2}}>{b}</div></div>;
  return (
    <div style={{position: 'absolute', left: 40, right: 40, top: 26, display: 'flex', gap: 40, alignItems: 'flex-end', background: 'rgba(10,12,18,0.88)', border: `2px solid ${RED}66`, borderRadius: 14, padding: '10px 22px', fontFamily: 'Montserrat'}}>
      {col('ПОСЛЕ ВЗЛОМА', <span style={{fontFamily: 'Russo One', fontSize: 30, color: '#fff'}}>{label}</span>)}
      {col('STEAM ОНЛАЙН', <span style={{fontFamily: 'Russo One', fontSize: 30, color: online < 5 ? RED : GREEN}}>{online.toFixed(1).replace('.', ',')} млн</span>)}
      <div style={{marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10, fontFamily: 'Montserrat', fontWeight: 900, fontSize: 22, color: online < 5 ? RED : GREEN}}><span style={{width: 14, height: 14, borderRadius: 7, background: online < 5 ? RED : GREEN, opacity: 0.5 + 0.5 * Math.sin(f / 4)}} />{online < 5 ? 'OFFLINE' : 'ONLINE'}</div>
    </div>
  );
};

// ---------------------------------------------------------------- сцены
const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const glitch = f < 14 || (f >= v(5) && f < v(5) + 10);
  const gx = glitch ? (random(`g${f}`) - 0.5) * 30 : 0;
  const copies = f >= v(13) ? Math.min(14, Math.floor((f - v(13)) / 3) + 1) : 0;
  return (
    <>
      <Bg glow="#5a1016" />
      <AbsoluteFill style={{height: H, background: `rgba(255,30,40,${0.06 + 0.06 * Math.sin(f / 5)})`}} />
      <div style={{position: 'absolute', left: 540 + gx, top: 210, transform: `translate(-50%,-50%) scale(${pop(f, 1, fps, 380, 9)})`, textAlign: 'center', whiteSpace: 'nowrap'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 24, justifyContent: 'center'}}><SteamLogo w={130} broken={f >= v(5) ? 1 : 0} />
          <span style={{fontFamily: 'Russo One', fontSize: 110, color: RED, textShadow: glitch ? `-8px 0 #3af, 8px 0 ${GOLD}` : `0 0 40px ${RED}`}}>ВЗЛОМАН</span></div>
      </div>
      <div style={{position: 'absolute', left: 0, top: 560, width: 1080, height: 620, overflow: 'hidden'}}><Portrait f={f} bg="dorm" mood={f >= v(10) ? 'shocked' : 'neutral'} scale={1.05} y={420} light={RED} lightAmt={0.15} /></div>
      {f >= v(10) && (
        <div style={{position: 'absolute', left: 540, top: 470, transform: `translate(-50%,-50%) scale(${pop(f, v(10), fps)})`}}><Img src={staticFile('hack/err.png')} style={{width: 640, boxShadow: '0 20px 50px rgba(0,0,0,0.7)'}} /></div>
      )}
      {Array.from({length: copies}).map((_, i) => (
        <div key={i} style={{position: 'absolute', left: 60 + random(`ex${i}`) * 560, top: 300 + random(`ey${i}`) * 560, transform: `rotate(${(random(`er${i}`) - 0.5) * 16}deg)`}}>
          <Img src={staticFile('hack/err.png')} style={{width: 420, boxShadow: '0 10px 30px rgba(0,0,0,0.7)'}} />
        </div>
      ))}
      {f >= v(16) && <Big x={540} y={340} s={pop(f, v(16), fps, 320, 9)} size={60} color="#fff">НИ У КОГО В МИРЕ</Big>}
    </>
  );
};

const H1: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const k = 996 / 249;
  const locked = f >= v(29);
  const dark = Math.floor(ramp2(f, v(36), v(42)) * 30);
  return (
    <>
      <Bg glow="#2a1a1a" />
      <Chip x={540} y={170} s={pop(f, S.h1, fps)} bg={RED} size={40}>VALVE ОТКЛЮЧАЕТ ВСЁ</Chip>
      <div style={{position: 'absolute', left: 42, top: 260, width: 996, height: 52 * k, borderRadius: 12, overflow: 'hidden', filter: locked ? 'grayscale(1) brightness(0.55)' : 'none'}}>
        <Img src={staticFile('hack/lib_c.png')} style={{width: 996, height: 52 * k}} />
      </div>
      {locked && [0, 1].map((i) => <div key={i} style={{position: 'absolute', left: 880, top: 262 + i * 104, transform: `scale(${pop(f, v(29) + i * 6, fps)})`, fontSize: 70}}>🔒</div>)}
      {locked && <Chip x={540} y={540} s={pop(f, v(33), fps)} bg="#1c2030" size={38}>все онлайн-игры недоступны</Chip>}
      <div style={{position: 'absolute', left: 540, top: 820, transform: 'translate(-50%,-50%)', display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: 10}}>
        {Array.from({length: 30}).map((_, i) => (
          <div key={i} style={{width: 80, height: 54, borderRadius: 6, border: '3px solid #2a2d36', background: i < dark ? '#050507' : `linear-gradient(135deg, #3a6acb, #1a2a4a)`, boxShadow: i < dark ? 'none' : '0 0 12px rgba(80,140,255,0.4)'}} />
        ))}
      </div>
      {f >= v(36) && <Big x={540} y={1020} s={pop(f, v(36), fps)} size={50} color="#fff">ДЕСЯТКИ МИЛЛИОНОВ ЭКРАНОВ</Big>}
    </>
  );
};
const ramp2 = (f: number, a: number, b: number) => Math.max(0, Math.min(1, (f - a) / (b - a)));

const H3: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const k = 760 / 679;
  const chart = ramp2(f, v(54), v(59));
  const pts = Array.from({length: 30}).map((_, i) => {
    const t = i / 29;
    return [40 + t * 400, 40 + (t < 0.4 ? 0.1 : 0.1 + Math.pow((t - 0.4) / 0.6, 1.3) * 0.8) * 220 * Math.min(1, chart * 1.3)];
  });
  return (
    <>
      <Bg glow="#3a1016" />
      <div style={{position: 'absolute', left: 40, top: 140, width: 620, height: 720, overflow: 'hidden', borderRadius: 12, filter: f >= v(47) ? 'grayscale(0.8) brightness(0.7)' : 'none'}}>
        <Img src={staticFile('hack/market_c.png')} style={{width: 620 * 1.0, height: 899 * (620 / 679)}} />
      </div>
      <Stamp x={350} y={480} at={v(47)} size={64}>ЗАМОРОЖЕНО</Stamp>
      {f >= v(54) && (
        <svg width={480} height={300} viewBox="0 0 480 300" style={{position: 'absolute', left: 580, top: 560}}>
          <rect width={480} height={300} rx={16} fill="rgba(10,12,18,0.9)" stroke="#2a3244" strokeWidth={3} />
          <path d={pts.map((p, i) => `${i ? 'L' : 'M'}${p[0]} ${p[1]}`).join(' ')} fill="none" stroke={RED} strokeWidth={6} style={{filter: `drop-shadow(0 0 8px ${RED})`}} />
          <text x={240} y={290} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={24} fill="#8f98a0">цены на сторонних сайтах</text>
        </svg>
      )}
      {f >= v(59) && <Big x={540} y={970} s={pop(f, v(59), fps, 320, 9)} size={100} color={RED}>ПАНИКА</Big>}
    </>
  );
};

const D2: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const n = Math.min(9, Math.max(0, Math.floor((f - v(66)) / 4) + 1));
  return (
    <>
      <Bg glow="#1a2a3a" />
      <div style={{position: 'absolute', left: 60, top: 150, width: 960, background: '#f4f5f7', borderRadius: 18, overflow: 'hidden', fontFamily: 'Montserrat', boxShadow: '0 30px 60px rgba(0,0,0,0.6)'}}>
        <div style={{background: '#fff', padding: '18px 26px', borderBottom: '2px solid #e0e2e6', display: 'flex', justifyContent: 'space-between', fontWeight: 900, fontSize: 32, color: '#222'}}>
          <span>📥 Входящие</span><span style={{color: RED}}>{(n * 137).toLocaleString('ru-RU')}</span>
        </div>
        {Array.from({length: n}).map((_, i) => {
          const scam = i % 2 === 1 && f >= v(78);
          return (
            <div key={i} style={{display: 'flex', alignItems: 'center', gap: 16, padding: '16px 26px', borderBottom: '1px solid #e5e7ea', background: scam ? 'rgba(255,43,54,0.12)' : '#f4f5f7'}}>
              <div style={{width: 46, height: 46, borderRadius: 23, background: i % 2 ? '#8a8f98' : STEAM, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><SteamLogo w={40} /></div>
              <div style={{flex: 1}}><div style={{fontWeight: 900, fontSize: 26, color: '#222'}}>Срочно смените пароль!</div><div style={{fontSize: 20, color: '#777'}}>{i % 2 ? 'неизвестный отправитель' : 'уведомление безопасности'}</div></div>
              {scam && <span style={{background: RED, color: '#fff', fontWeight: 900, fontSize: 20, padding: '6px 12px', borderRadius: 8}}>МОШЕННИКИ</span>}
            </div>
          );
        })}
      </div>
      {f >= v(78) && <Chip x={540} y={1030} s={pop(f, v(78), fps)} bg={RED} size={38}>ни на что не жми</Chip>}
    </>
  );
};

const Week: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const col = (x: number, head: React.ReactNode, title: string, res: string, ok: boolean, at: number) => (
    <div style={{position: 'absolute', left: x, top: 560, width: 470, transform: `translate(-50%,-50%) scale(${pop(f, at, fps)})`, background: ok ? 'rgba(20,60,30,0.85)' : 'rgba(60,10,16,0.85)', border: `4px solid ${ok ? GREEN : RED}`, borderRadius: 24,
      padding: 26, boxSizing: 'border-box', textAlign: 'center', fontFamily: 'Montserrat'}}>
      <div style={{width: 200, height: 200, margin: '0 auto', borderRadius: 100, overflow: 'hidden', background: '#2a3045'}}>{head}</div>
      <div style={{fontSize: 32, fontWeight: 900, color: '#fff', marginTop: 16}}>{title}</div>
      <div style={{fontSize: 34, fontWeight: 900, color: ok ? GREEN : RED, marginTop: 14}}>{res}</div>
    </div>
  );
  return (
    <>
      <Bg glow="#1a2a2a" />
      <Chip x={540} y={170} s={pop(f, S.week, fps)} bg={GREEN} color="#06260f" size={40}>VALVE ВОЗВРАЩАЕТ ДОСТУП</Chip>
      {col(290, <svg width={200} height={200} viewBox="-200 -230 400 400"><LyokhaHead mood="happy" /></svg>, 'Лёха · Steam Guard ✓', 'инвентарь вернули', true, v(83))}
      {f >= v(91) && col(790, <svg width={200} height={200} viewBox="-200 -230 400 400"><LyokhaHead mood="shocked" hair="#c9a24a" /></svg>, 'Друг · без защиты', 'инвентарь пуст', false, v(91))}
      {f >= v(99) && <Big x={540} y={970} s={pop(f, v(99), fps, 320, 9)} size={64} color={RED}>МОЖЕТ НЕ ВЕРНУТЬСЯ</Big>}
    </>
  );
};

const Y2011: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <>
      <Bg glow="#2a2a1a" />
      <Big x={540} y={190} s={pop(f, S.y2011, fps)} size={60} color="#fff">ЭТО НЕ ФАНТАСТИКА</Big>
      <div style={{position: 'absolute', left: 540, top: 580, width: 900, transform: `translate(-50%,-50%) rotate(-2deg) scale(${pop(f, v(106), fps)})`, background: '#efe8d8', padding: '34px 40px', boxSizing: 'border-box', boxShadow: '0 30px 60px rgba(0,0,0,0.6)',
        fontFamily: 'Montserrat', color: '#1a1a1a'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', fontWeight: 900, fontSize: 24, borderBottom: '3px solid #1a1a1a', paddingBottom: 10}}><span>ИГРОВЫЕ НОВОСТИ</span><span>НОЯБРЬ 2011</span></div>
        <div style={{fontWeight: 900, fontSize: 54, lineHeight: 1.1, marginTop: 20}}>Хакеры добрались до базы данных Steam</div>
        <div style={{fontSize: 28, marginTop: 16, color: '#444'}}>Valve предупредила пользователей о взломе форумов и доступе к базе данных.</div>
      </div>
      <Stamp x={820} y={820} at={v(107)} size={80}>2011</Stamp>
    </>
  );
};

const Guard: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const k = 1000 / 1004;
  return (
    <>
      <Bg glow="#1a3a2a" />
      <Big x={540} y={190} s={pop(f, S.guard, fps)} size={58} color={GREEN}>ВКЛЮЧИ STEAM GUARD</Big>
      <div style={{position: 'absolute', left: 40, top: 360, width: 1000, borderRadius: 12, overflow: 'hidden', boxShadow: `0 0 50px ${GREEN}55`}}>
        <Img src={staticFile('hack/guard_c.png')} style={{width: 1000, height: 319 * k, display: 'block'}} />
      </div>
      {f >= v(121) && <Chip x={540} y={800} s={pop(f, v(121), fps)} bg={GREEN} color="#06260f" size={50}>✓ ЗАЩИЩЁН</Chip>}
    </>
  );
};

const Ask: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <>
      <Bg glow="#3a1016" />
      <Big x={540} y={330} s={pop(f, S.ask, fps)} size={58} color="#fff">ЧТО СПАСАЛ БЫ ПЕРВЫМ?</Big>
      <div style={{position: 'absolute', left: 540, top: 600, transform: `translate(-50%,-50%) scale(${pop(f, v(129), fps)})`, display: 'flex', gap: 30}}>
        <div style={{background: '#2a6acb', color: '#fff', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 50, padding: '24px 44px', borderRadius: 16}}>🔐 АККАУНТ</div>
        <div style={{background: GOLD, color: '#111', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 50, padding: '24px 44px', borderRadius: 16, opacity: f >= v(130) ? 1 : 0.2}}>🔪 СКИНЫ</div>
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
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, #3a1016, #07080c 70%)', alignItems: 'center', justifyContent: 'center', paddingBottom: 240, textAlign: 'center'}}>
      <div style={{transform: `scale(${0.6 + 0.4 * m})`}}><SteamLogo w={220} /></div>
      <div style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 52, color: '#fff', marginTop: 24, opacity: Math.min(1, m * 2)}}>ПИШИ: АККАУНТ ИЛИ СКИНЫ?</div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- звук: голос + тихий дрон + редкие эффекты
type Fx = [number, string, number];
const SFX: Fx[] = [
  [0, 'sfx2/glitch.wav', 0.45], [2, 'sfx2/impact.wav', 0.4], [v(5), 'sfx2/glitch.wav', 0.35], [v(10), 'sfx2/error.wav', 0.35],
  ...Array.from({length: 8}).map((_, i): Fx => [v(13) + i * 6, 'sfx2/error.wav', 0.15]),
  [S.h1, 'sfx2/whoosh.wav', 0.3], [v(29), 'sfx2/stamp.wav', 0.3], [v(36), 'sfx2/deflate.wav', 0.3],
  [S.h3, 'sfx2/whoosh.wav', 0.3], [v(47), 'sfx2/stamp.wav', 0.35], [v(59), 'sfx2/impact.wav', 0.35],
  ...Array.from({length: 6}).map((_, i): Fx => [v(66) + i * 8, 'tilt/notif.wav', 0.15]), [v(78), 'sfx2/error.wav', 0.3],
  [S.week, 'sfx2/whoosh.wav', 0.3], [v(83), 'sfx2/ding.wav', 0.3], [v(91), 'sfx2/blip_low.wav', 0.3],
  [v(107), 'sfx2/stamp.wav', 0.35], [v(121), 'sfx2/ding.wav', 0.35], [S.end, 'sfx2/ding.wav', 0.3],
];
const GAIN = 0.45;

const Sound: React.FC = () => (
  <>
    {VO.map((o) => (
      <Sequence key={o.src} from={fr(o.at)} durationInFrames={fr(o.dur) + 6}>
        <Audio src={staticFile(o.src)} volume={1} />
      </Sequence>
    ))}
    <Audio src={staticFile('wake/tension.mp3')} volume={(x) => (x >= S.guard ? 0.05 : 0.13)} />
    {SFX.map(([at, src, vol], i) => (
      <Sequence key={i} from={Math.max(0, at)} durationInFrames={FPS * 2}>
        <Audio src={staticFile(src)} volume={vol * GAIN} />
      </Sequence>
    ))}
  </>
);

export const Hack: React.FC = () => {
  loadFonts();
  const order: [number, number, React.FC, boolean?][] = [
    [S.hook, S.h1, Hook], [S.h1, S.h3, H1, true], [S.h3, S.d2, H3, true], [S.d2, S.week, D2, true], [S.week, S.y2011, Week, true],
    [S.y2011, S.guard, Y2011, true], [S.guard, S.ask, Guard, true], [S.ask, S.end, Ask, true],
  ];
  return (
    <AbsoluteFill style={{background: '#07080c'}}>
      {order.map(([from, to, C, cut], i) => <Scene key={i} from={from} to={to} cut={cut}><C /></Scene>)}
      <Flash at={0} len={8} />
      <Flash at={v(5)} len={10} />
      <Flash at={v(59)} len={10} />
      <TopBar />
      <AbsoluteFill style={{top: H - 220, height: 220, background: 'linear-gradient(rgba(7,8,12,0), #07080c)'}} />
      <Captions cues={CUES} />
      <End />
      <Sound />
    </AbsoluteFill>
  );
};
