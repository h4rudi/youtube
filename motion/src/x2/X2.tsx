// Ролик «Кнопка x2 на FACEIT» (9:16, ~57 с). Герой — Лёха v2. Мысленный эксперимент.
// Исходники пользователя: иконки уровней FACEIT (public/x2/lvl1..10.png — вырезаны из таблицы), страница матча (match.png — ники
// и аватарки размыты), строки истории матчей (faceit2x/history.png из прошлого ролика). Плашка эло нарисована по скрину пользователя.
import React from 'react';
import {AbsoluteFill, Audio, Img, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {loadFonts} from '../theme';
import {FPS, fr} from '../tilt/script';
import {VO, TOTAL, CUES, v} from './script';
import {Captions, clamp, pop} from '../tilt/UI';
import {Scene, Cam, Flash} from '../money/Money';
import {ramp} from '../tilt/Tilt';
import {H, RED, Portrait} from '../money/Props';
import {LyokhaHead} from '../money/Lyokha';

export const X2_FRAMES = fr(TOTAL);

const S = {
  hook: 0, day1: v(24) - 4, friends: v(43) - 4, morning: v(49) - 4, lose: v(68) - 4, week: v(77) - 4, month: v(99) - 4,
  moral: v(108) - 4, ask: v(120) - 4, end: fr(54.9),
};
const GOLD = '#ffd23f', GREEN = '#2bd96b', ORANGE = '#ff5500';
const RANGES: [number, number][] = [[100, 500], [501, 750], [751, 900], [901, 1050], [1051, 1200], [1201, 1350], [1351, 1530], [1531, 1750], [1751, 2000], [2001, 2400]];
const levelOf = (elo: number) => Math.max(1, RANGES.findIndex(([a, b]) => elo >= a && elo <= b) + 1 || 10);
const Lvl: React.FC<{n: number; w: number}> = ({n, w}) => <Img src={staticFile(`x2/lvl${n}.png`)} style={{width: w, height: w, display: 'block'}} />;

// эло Лёхи по ходу ролика
const eloAt = (f: number) => {
  if (f < v(68)) return Math.round(interpolate(f, [v(33), v(41)], [1800, 2050], clamp) / 10) * 10;
  return Math.round(interpolate(f, [v(68), v(76)], [2050, 1800], clamp) / 10) * 10;
};

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

// плашка эло (как на скрине пользователя): иконка уровня, «Сезон 9», число, полоска до следующего уровня
const EloPanel: React.FC<{elo: number; y?: number; glow?: number}> = ({elo, y = 300, glow = 0}) => {
  const n = levelOf(elo);
  const [a, b] = RANGES[n - 1];
  const p = n === 10 ? 1 : (elo - a) / (b - a);
  return (
    <div style={{position: 'absolute', left: 40, top: y, width: 1000, height: 240, borderRadius: 16, overflow: 'hidden', background: 'linear-gradient(120deg, #4a4c50, #2a2c30 60%, #1c1d20)', fontFamily: 'Montserrat',
      boxShadow: glow > 0 ? `0 0 ${60 * glow}px ${RED}` : '0 30px 60px rgba(0,0,0,0.6)'}}>
      <div style={{position: 'absolute', left: 30, top: 36}}><Lvl n={n} w={170} /></div>
      <div style={{position: 'absolute', left: 230, top: 30, background: 'rgba(255,255,255,0.12)', color: '#cfd2d6', fontWeight: 900, fontSize: 24, padding: '6px 18px', borderRadius: 20}}>Сезон 9</div>
      <div style={{position: 'absolute', left: 230, top: 78, fontWeight: 900, fontSize: 64, color: '#fff'}}>{elo.toLocaleString('ru-RU')}</div>
      <div style={{position: 'absolute', left: 230, right: 30, top: 172, height: 16, background: 'rgba(255,85,0,0.25)', borderRadius: 2}}><div style={{width: `${p * 100}%`, height: 16, background: ORANGE}} /></div>
      <div style={{position: 'absolute', left: 230, right: 30, top: 196, display: 'flex', justifyContent: 'space-between', fontSize: 20, color: '#cfd2d6', fontWeight: 600}}>
        <span>{a}</span><span>{n === 10 ? 'максимальный уровень' : `+${b + 1 - elo} до уровня ${n + 1}`}</span><span>{n === 10 ? '' : b}</span>
      </div>
    </div>
  );
};

// строки истории матчей (скрин пользователя): +50 / −50
const HistRows: React.FC<{f: number; win: boolean; from: number; step: number; y: number; n?: number}> = ({f, win, from, step, y, n = 5}) => {
  const k = 1000 / 634;
  return (
    <div style={{position: 'absolute', left: 40, top: y, width: 1000}}>
      {Array.from({length: n}).map((_, i) => {
        const at = from + i * step;
        if (f < at) return null;
        const a = Math.min(1, (f - at) / 5);
        return (
          <div key={i} style={{position: 'relative', width: 1000, height: 56 * k, overflow: 'hidden', opacity: a, transform: `translateX(${(1 - a) * 60}px)`}}>
            <Img src={staticFile('faceit2x/history.png')} style={{position: 'absolute', left: 0, top: -(win ? 102 : 46) * k, width: 1000}} />
            <div style={{position: 'absolute', left: 560, top: 0, height: 56 * k, display: 'flex', alignItems: 'center', fontFamily: 'Russo One', fontSize: 38, color: win ? GREEN : RED}}>{win ? '↑ +50' : '↓ −50'}</div>
            <div style={{position: 'absolute', left: 700, top: 0, height: 56 * k, display: 'flex', alignItems: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 22, color: ORANGE}}>x2</div>
          </div>
        );
      })}
    </div>
  );
};

// ---------------------------------------------------------------- шапка: эло, уровень, x2
const TopBar: React.FC = () => {
  const f = useCurrentFrame();
  if (f >= S.end || f < S.day1) return null;
  const elo = eloAt(f);
  return (
    <div style={{position: 'absolute', left: 40, right: 40, top: 26, display: 'flex', gap: 20, alignItems: 'center', background: 'rgba(10,12,18,0.88)', border: `2px solid ${ORANGE}66`, borderRadius: 14, padding: '8px 20px', fontFamily: 'Montserrat'}}>
      <Lvl n={levelOf(elo)} w={56} />
      <div><div style={{fontSize: 15, color: '#8f98a0', fontWeight: 900}}>ЭЛО ЛЁХИ</div><div style={{fontFamily: 'Russo One', fontSize: 32, color: '#fff'}}>{elo.toLocaleString('ru-RU')}</div></div>
      <div style={{marginLeft: 'auto', background: ORANGE, color: '#fff', fontWeight: 900, fontSize: 24, padding: '6px 16px', borderRadius: 8}}>x2 ВКЛ</div>
    </div>
  );
};

// ---------------------------------------------------------------- сцены
const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const x2 = pop(f, v(4), fps, 300, 10);
  return (
    <>
      <Bg glow="#5a2a10" />
      <div style={{position: 'absolute', left: 540, top: 330, transform: 'translate(-50%,-50%)', display: 'flex', alignItems: 'center', gap: 24}}>
        <div style={{background: ORANGE, color: '#fff', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 48, padding: '24px 50px', borderRadius: 8}}>НАЙТИ МАТЧ</div>
        <div style={{transform: `scale(${x2})`, opacity: Math.min(1, x2 * 2), background: '#1c1d20', border: `5px solid ${GOLD}`, color: GOLD, fontFamily: 'Russo One', fontSize: 64, padding: '12px 30px', borderRadius: 16,
          boxShadow: `0 0 ${30 + 20 * Math.sin(f / 4)}px ${GOLD}`}}>x2</div>
      </div>
      {f >= v(12) && (
        <div style={{position: 'absolute', left: 540, top: 620, transform: `translate(-50%,-50%) scale(${pop(f, v(12), fps)})`, display: 'flex', alignItems: 'center', gap: 26, fontFamily: 'Russo One'}}>
          <span style={{fontSize: 70, color: '#8f98a0', textDecoration: 'line-through'}}>+25</span><span style={{fontSize: 50, color: '#8f98a0'}}>→</span>
          <span style={{fontSize: 110, color: GREEN, opacity: f >= v(17) ? 1 : 0.2}}>+50</span>
        </div>
      )}
      {f >= v(21) && <Big x={540} y={860} s={pop(f, v(21), fps, 320, 9)} size={110} color={RED}>−50</Big>}
    </>
  );
};

const Day1: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const elo = eloAt(f);
  const ten = elo >= 2001;
  return (
    <>
      <Bg glow={ten ? '#5a1016' : '#3a2a10'} />
      {f < v(29) ? (
        <>
          <Chip x={540} y={200} s={pop(f, S.day1, fps)} bg={ORANGE} size={42}>ДЕНЬ ПЕРВЫЙ</Chip>
          <div style={{position: 'absolute', left: 540, top: 520, transform: `translate(-50%,-50%) scale(${pop(f, v(26), fps)})`, textAlign: 'center', fontFamily: 'Montserrat'}}>
            <div style={{fontSize: 36, fontWeight: 900, color: '#8f98a0'}}>НАЖАЛИ x2</div>
            <div style={{fontFamily: 'Russo One', fontSize: 180, color: GOLD}}>{Math.round(interpolate(f, [v(26), v(28)], [0, 98], clamp))}%</div>
          </div>
        </>
      ) : (
        <>
          <EloPanel elo={elo} y={130} glow={ten ? 0.6 + 0.4 * Math.sin(f / 4) : 0} />
          <HistRows f={f} win from={v(33)} step={Math.round((v(41) - v(33)) / 5)} y={400} />
          {ten && <Big x={540} y={1030} s={pop(f, v(41), fps, 320, 9)} size={84} color={RED}>10 УРОВЕНЬ!</Big>}
        </>
      )}
    </>
  );
};

const Friends: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const msg = (t: React.ReactNode, at: number, me = false) => {
    const a = Math.min(1, Math.max(0, (f - at) / 6));
    if (a <= 0) return null;
    return <div style={{alignSelf: me ? 'flex-end' : 'flex-start', maxWidth: 520, background: me ? '#2b5278' : '#182533', color: '#fff', fontSize: 32, fontWeight: 600, padding: '14px 22px', borderRadius: 20, opacity: a, transform: `translateY(${(1 - a) * 16}px)`}}>{t}</div>;
  };
  return (
    <>
      <Bg glow="#1a3a5a" />
      <div style={{position: 'absolute', left: 540, top: 590, width: 640, height: 940, transform: 'translate(-50%,-50%)', borderRadius: 60, background: '#0b0c11', border: '10px solid #2c2f38', overflow: 'hidden', fontFamily: 'Montserrat'}}>
        <div style={{height: 120, background: '#232e3c', display: 'flex', alignItems: 'center', gap: 16, padding: '30px 28px 0', boxSizing: 'border-box'}}>
          <div style={{width: 60, height: 60, borderRadius: 30, background: '#f0a24a', color: '#fff', fontWeight: 900, fontSize: 30, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>П</div>
          <div style={{fontSize: 30, color: '#fff', fontWeight: 900}}>Пацаны 🎮</div>
        </div>
        <div style={{position: 'absolute', left: 20, right: 20, bottom: 40, display: 'flex', flexDirection: 'column', gap: 14}}>
          {msg(<div style={{display: 'flex', alignItems: 'center', gap: 14}}><Lvl n={10} w={80} /><span style={{fontFamily: 'Russo One', fontSize: 44}}>2 050</span></div>, S.friends + 2, true)}
          {msg('пацаны, я 10 лвл 😎', v(46), true)}
          {msg('ЧЕГО??? 🔥🔥🔥', v(47) + 4)}
          {msg('за один вечер???', v(48) + 2)}
        </div>
      </div>
    </>
  );
};

const Morning: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const k = 1000 / 1286;
  const luck = f >= v(64);
  const spots: [number, number][] = [[230, 177], [230, 308], [230, 440], [1070, 177], [1070, 308], [1070, 440]];
  return (
    <>
      <Bg glow="#2a2a1a" />
      <Chip x={540} y={150} s={pop(f, S.morning, fps)} bg="#1c2030" size={40}>☀️ УТРО · ЛОББИ 10 УРОВНЯ</Chip>
      <div style={{position: 'absolute', left: 40, top: 280, width: 1000, height: 616 * k, overflow: 'hidden', borderRadius: 12}}>
        <Img src={staticFile('x2/match.png')} style={{width: 1000}} />
        {luck && spots.map(([x, y], i) => (
          <div key={i} style={{position: 'absolute', left: x * k, top: y * k, transform: `translate(-50%,-50%) scale(${pop(f, v(64) + i * 3, fps)})`, fontSize: 46}}>🍀</div>
        ))}
      </div>
      {f >= v(57) && <Big x={540} y={900} s={pop(f, v(57), fps)} size={50} color="#fff">ВСЕ ТАКИЕ ЖЕ, КАК ОН</Big>}
      {luck && <Big x={540} y={1010} s={pop(f, v(67), fps, 320, 9)} size={80} color={GREEN}>ПРОСТО ПОВЕЗЛО</Big>}
    </>
  );
};

const Lose: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const elo = eloAt(f);
  return (
    <>
      <Bg glow="#5a1016" />
      <EloPanel elo={elo} y={130} />
      <HistRows f={f} win={false} from={S.lose + 2} step={Math.round((v(72) - S.lose) / 5)} y={400} />
      {f >= v(71) && <Big x={540} y={1030} s={pop(f, v(71), fps, 320, 9)} size={100} color={RED}>−250</Big>}
    </>
  );
};

// перевёрнутая «пирамида» уровней: на 10-м толпа, настоящий 10-й сидит на 7-м
const Week: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const crowd = ramp(f, v(79), v(83));
  const counts = [30, 45, 55, 60, 60, 55, 50, 40, 30, 20].map((c, i) => (i === 9 ? c + 280 * crowd : c * (1 - 0.35 * crowd)));
  return (
    <>
      <Bg glow="#2a1a2a" />
      <Chip x={540} y={150} s={pop(f, S.week, fps)} bg={ORANGE} size={42}>ЧЕРЕЗ НЕДЕЛЮ</Chip>
      {Array.from({length: 10}).map((_, i) => {
        const n = 10 - i;
        const y = 240 + i * 82;
        return (
          <div key={n} style={{position: 'absolute', left: 60, top: y, display: 'flex', alignItems: 'center', gap: 16}}>
            <Lvl n={n} w={66} />
            <div style={{width: counts[n - 1] * 2.4, height: 46, borderRadius: 8, background: n === 10 ? RED : '#3a4150', boxShadow: n === 10 && crowd > 0.5 ? `0 0 30px ${RED}` : 'none'}} />
            {n === 10 && crowd > 0.3 && <span style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 30, color: RED}}>толпа 🍀</span>}
            {n === 7 && f >= v(92) && (
              <span style={{display: 'flex', alignItems: 'center', gap: 10, transform: `scale(${pop(f, v(92), fps)})`, fontFamily: 'Montserrat', fontWeight: 900, fontSize: 28, color: GOLD}}>
                <Lvl n={10} w={56} /> настоящий 10 lvl
              </span>
            )}
          </div>
        );
      })}
      {f >= v(96) && <Chip x={540} y={1100} s={pop(f, v(96), fps, 320, 9)} bg={RED} size={40}>РАЗНОСИТ ВСЕХ НА 7-м</Chip>}
    </>
  );
};

const Month: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <>
      <Bg glow="#2a2a3a" />
      <Chip x={540} y={150} s={pop(f, S.month, fps)} bg={ORANGE} size={42}>ЧЕРЕЗ МЕСЯЦ</Chip>
      <div style={{position: 'absolute', left: 540, top: 520, transform: 'translate(-50%,-50%)', display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 24}}>
        {Array.from({length: 10}).map((_, i) => (
          <div key={i} style={{position: 'relative', transform: `rotate(${(i % 2 ? 1 : -1) * 8 * ramp(f, v(104), v(107))}deg)`}}>
            <Lvl n={i + 1} w={150} />
            {f >= v(104) + i * 2 && <svg width={150} height={150} viewBox="0 0 150 150" style={{position: 'absolute', inset: 0}}><line x1={20} y1={20} x2={130} y2={130} stroke={RED} strokeWidth={12} strokeLinecap="round" /></svg>}
          </div>
        ))}
      </div>
      {f >= v(105) && <Big x={540} y={900} s={pop(f, v(105), fps, 320, 9)} size={66} color={RED}>НИЧЕГО НЕ ЗНАЧИТ</Big>}
    </>
  );
};

const Moral: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <>
      <Bg glow="#1a3a3a" />
      <div style={{position: 'absolute', left: 0, top: 520, width: 1080, height: 660, overflow: 'hidden'}}><Portrait f={f} bg="dorm" mood="neutral" scale={1.0} y={400} /></div>
      <Big x={540} y={200} s={pop(f, S.moral, fps)} size={48} color="#fff">x2 НЕ ДЕЛАЕТ СИЛЬНЕЕ</Big>
      {f >= v(113) && <Big x={540} y={300} s={pop(f, v(113), fps)} size={48} color="#fff">ОН ПРОСТО БЫСТРЕЕ ПОКАЖЕТ</Big>}
      {f >= v(117) && <Big x={540} y={410} s={pop(f, v(117), fps, 320, 9)} size={72} color={GOLD}>ТВОЁ МЕСТО</Big>}
    </>
  );
};

const Ask: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <>
      <Bg glow="#3a2a10" />
      <Big x={540} y={330} s={pop(f, S.ask, fps)} size={60} color="#fff">А ТЫ БЫ…</Big>
      <div style={{position: 'absolute', left: 540, top: 600, transform: `translate(-50%,-50%) scale(${pop(f, v(124), fps)})`, display: 'flex', gap: 40, alignItems: 'center'}}>
        <div style={{background: '#1c1d20', border: `5px solid ${GOLD}`, color: GOLD, fontFamily: 'Russo One', fontSize: 70, padding: '14px 40px', borderRadius: 16}}>x2</div>
        <div style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 40, color: '#8f98a0', opacity: f >= v(125) ? 1 : 0}}>или</div>
        <div style={{background: GREEN, color: '#06260f', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 52, padding: '24px 40px', borderRadius: 16, opacity: f >= v(126) ? 1 : 0}}>ЧЕСТНО</div>
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
      <div style={{transform: `scale(${0.6 + 0.4 * m})`}}><Lvl n={10} w={220} /></div>
      <div style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 56, color: '#fff', marginTop: 24, opacity: Math.min(1, m * 2)}}>ПИШИ: x2 ИЛИ ЧЕСТНО?</div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- звук (тихие эффекты, без фонового гула)
type Fx = [number, string, number];
const SFX: Fx[] = [
  [v(4), 'sfx2/pop.wav', 0.35], [v(17), 'sfx2/ding.wav', 0.3], [v(21), 'sfx2/error.wav', 0.3], [v(26), 'sfx2/blip.wav', 0.3],
  ...Array.from({length: 5}).map((_, i): Fx => [v(33) + i * Math.round((v(41) - v(33)) / 5), 'sfx2/blip.wav', 0.25]), [v(41), 'sfx2/impact.wav', 0.4],
  [v(46), 'tilt/notif.wav', 0.25], [v(64), 'sfx2/pop.wav', 0.25],
  ...Array.from({length: 5}).map((_, i): Fx => [S.lose + 2 + i * Math.round((v(72) - S.lose) / 5), 'sfx2/blip_low.wav', 0.25]), [v(71), 'sfx2/deflate.wav', 0.35],
  [S.week, 'sfx2/whoosh.wav', 0.3], [v(96), 'sfx2/stamp.wav', 0.3], [v(104), 'sfx2/error.wav', 0.25], [S.end, 'sfx2/ding.wav', 0.35],
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

export const X2: React.FC = () => {
  loadFonts();
  const order: [number, number, React.FC, boolean?][] = [
    [S.hook, S.day1, Hook], [S.day1, S.friends, Day1, true], [S.friends, S.morning, Friends, true], [S.morning, S.lose, Morning, true],
    [S.lose, S.week, Lose, true], [S.week, S.month, Week, true], [S.month, S.moral, Month, true], [S.moral, S.ask, Moral, true], [S.ask, S.end, Ask, true],
  ];
  return (
    <AbsoluteFill style={{background: '#0b0c12'}}>
      {order.map(([from, to, C, cut], i) => <Scene key={i} from={from} to={to} cut={cut}><C /></Scene>)}
      <Flash at={v(41)} len={12} />
      <Flash at={v(71)} len={10} />
      <TopBar />
      <AbsoluteFill style={{top: H - 220, height: 220, background: 'linear-gradient(rgba(11,12,18,0), #0b0c12)'}} />
      <Captions cues={CUES} />
      <End />
      <Sound />
    </AbsoluteFill>
  );
};
