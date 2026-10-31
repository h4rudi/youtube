// Ролик «Все матчи на FACEIT — только Mirage» (9:16, ~55 с). Герой — Лёха v2. Мысленный эксперимент.
// Исходники пользователя: кадры Mirage (public/mirage/window|jungle|asite|asite2.png), Nuke (nuke.png), радар (radar.png).
// Карточки карт вырезаны из скрина мап пула CS2 (public/home/pool.png). Экран голосования нарисован.
import React from 'react';
import {AbsoluteFill, Audio, Img, Sequence, interpolate, random, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {loadFonts} from '../theme';
import {FPS, fr} from '../tilt/script';
import {VO, TOTAL, CUES, v} from './script';
import {Captions, clamp, pop} from '../tilt/UI';
import {Scene, Cam, Flash} from '../money/Money';
import {ramp} from '../tilt/Tilt';
import {H, RED, Portrait} from '../money/Props';
import {LyokhaHead} from '../money/Lyokha';

export const MIRAGE_FRAMES = fr(TOTAL);

const S = {
  hook: 0, d1: v(11) - 4, week: v(28) - 4, month: v(49) - 4, m3: v(71) - 4, online: v(93) - 4, back: v(98) - 4, score: v(117) - 4, ask: v(119) - 4, end: fr(53.5),
};
const GOLD = '#ffd23f', GREEN = '#2bd96b', ORANGE = '#ff5500';
const MAPS = ['cache', 'anubis', 'inferno', 'mirage', 'dust2', 'nuke', 'ancient', 'train', 'vertigo', 'overpass'];
const Card: React.FC<{name: string; w: number}> = ({name, w}) => <Img src={staticFile(`mirage/card_${name}.png`)} style={{width: w, height: w * 389 / 159, display: 'block', borderRadius: 6}} />;
const Lvl: React.FC<{n: number; w: number}> = ({n, w}) => <Img src={staticFile(`x2/lvl${n}.png`)} style={{width: w, height: w, display: 'block'}} />;

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
const Shot: React.FC<{src: string; y?: number; children?: React.ReactNode}> = ({src, y = 140, children}) => (
  <div style={{position: 'absolute', left: 40, top: y, width: 1000, height: 562, borderRadius: 12, overflow: 'hidden', boxShadow: '0 30px 60px rgba(0,0,0,0.6)'}}>
    <Img src={staticFile(src)} style={{width: 1000, height: 562}} />
    {children}
  </div>
);

// ---------------------------------------------------------------- шапка
const TopBar: React.FC = () => {
  const f = useCurrentFrame();
  if (f < S.d1 || f >= S.back) return null;
  const label = f >= S.m3 ? '3 МЕСЯЦА' : f >= S.month ? 'МЕСЯЦ' : f >= S.week ? 'НЕДЕЛЯ' : 'ДЕНЬ 1';
  const streak = Math.round(f >= S.m3 ? interpolate(f, [S.m3, S.back], [400, 520], clamp) : f >= S.month ? interpolate(f, [S.month, S.m3], [120, 400], clamp) : f >= S.week ? interpolate(f, [S.week, S.month], [20, 120], clamp) : interpolate(f, [S.d1, S.week], [1, 10], clamp));
  const online = Math.round(f >= S.online ? interpolate(f, [S.online, S.back], [480000, 90000], clamp) : 480000);
  const col = (a: string, b: React.ReactNode) => <div><div style={{fontSize: 15, color: '#8f98a0', fontWeight: 900}}>{a}</div><div style={{marginTop: 2}}>{b}</div></div>;
  return (
    <div style={{position: 'absolute', left: 40, right: 40, top: 26, display: 'flex', gap: 34, alignItems: 'flex-end', background: 'rgba(10,12,18,0.88)', border: `2px solid ${ORANGE}66`, borderRadius: 14, padding: '10px 22px', fontFamily: 'Montserrat'}}>
      {col('ПРОШЛО', <span style={{fontFamily: 'Russo One', fontSize: 30, color: '#fff'}}>{label}</span>)}
      {col('MIRAGE ПОДРЯД', <span style={{fontFamily: 'Russo One', fontSize: 30, color: GOLD}}>{streak} каток</span>)}
      {col('ОНЛАЙН', <span style={{fontFamily: 'Russo One', fontSize: 30, color: online < 300000 ? RED : GREEN}}>{online.toLocaleString('ru-RU')}</span>)}
    </div>
  );
};

// ---------------------------------------------------------------- сцены
const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const order = MAPS.filter((m) => m !== 'mirage');
  const big = pop(f, v(9), fps, 300, 10);
  return (
    <>
      <Bg glow="#5a3a10" />
      <Cam s={1} shake={f < v(9) ? 0.35 : f < v(9) + 10 ? 1 - (f - v(9)) / 10 : 0}>
        {MAPS.map((m, i) => {
          const x = 70 + (i % 5) * 190, y = 150 + Math.floor(i / 5) * 420;
          if (m === 'mirage') {
            const t = big;
            return <div key={m} style={{position: 'absolute', left: interpolate(t, [0, 1], [x, 353]), top: interpolate(t, [0, 1], [y, 190]), transform: `scale(${1 + 1.2 * t})`, transformOrigin: '0 0', zIndex: 5,
              boxShadow: t > 0 ? `0 0 ${60 * t}px ${GOLD}` : 'none'}}><Card name={m} w={170} /></div>;
          }
          const k = order.indexOf(m);
          const at = 2 + k * Math.max(2, Math.round((v(9) - 4) / order.length));
          const out = Math.max(0, (f - at - 6) / 10);
          return (
            <div key={m} style={{position: 'absolute', left: x, top: y + out * out * 900, transform: `rotate(${out * (k % 2 ? 40 : -40)}deg)`, opacity: Math.max(0, 1 - out)}}>
              <Card name={m} w={170} />
              {f >= at && <svg width={170} height={416} viewBox="0 0 170 416" style={{position: 'absolute', inset: 0}}><line x1={10} y1={40} x2={160} y2={376} stroke={RED} strokeWidth={14} strokeLinecap="round" /><line x1={160} y1={40} x2={10} y2={376} stroke={RED} strokeWidth={14} strokeLinecap="round" /></svg>}
            </div>
          );
        })}
      </Cam>
      {f >= v(8) && <Big x={540} y={110} s={pop(f, v(8), fps, 380, 8)} size={84} color={RED}>ТОЛЬКО MIRAGE</Big>}
    </>
  );
};

const D1: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <>
      <Bg glow="#3a3a10" />
      <div style={{position: 'absolute', left: 0, top: 560, width: 1080, height: 620, overflow: 'hidden'}}><Portrait f={f} bg="dorm" mood="happy" scale={1.05} y={420} /></div>
      <Chip x={540} y={170} s={pop(f, S.d1, fps)} bg={GREEN} color="#06260f" size={42}>ВСЕ СЧАСТЛИВЫ 🎉</Chip>
      <div style={{position: 'absolute', left: 540, top: 400, width: 940, transform: `translate(-50%,-50%) scale(${pop(f, v(21), fps)})`, background: '#16181d', border: '3px solid #2a2d36', borderRadius: 18, padding: 24, fontFamily: 'Montserrat'}}>
        <div style={{fontSize: 28, fontWeight: 900, color: '#fff', marginBottom: 14}}>Голосование за карту</div>
        <div style={{display: 'flex', alignItems: 'center', gap: 20}}>
          <Card name="mirage" w={90} />
          <div style={{flex: 1}}>
            <div style={{fontSize: 34, fontWeight: 900, color: GOLD}}>Mirage</div>
            <div style={{display: 'flex', gap: 6, marginTop: 10}}>
              {Array.from({length: 10}).map((_, i) => <div key={i} style={{width: 52, height: 52, borderRadius: 26, overflow: 'hidden', background: '#2a3045', opacity: f >= v(23) + i * 2 ? 1 : 0.15}}><svg width={52} height={52} viewBox="-200 -230 400 400"><LyokhaHead mood="happy" hair={['#1c1a20', '#8a5a2b', '#c9a24a', '#3a2a1a'][i % 4]} /></svg></div>)}
            </div>
          </div>
          <div style={{fontFamily: 'Russo One', fontSize: 50, color: GREEN}}>{Math.min(10, Math.max(0, Math.floor((f - v(23)) / 2) + 1))}/10</div>
        </div>
      </div>
    </>
  );
};

const Week: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const src = f >= v(39) ? 'mirage/asite.png' : f >= v(36) ? 'mirage/jungle.png' : 'mirage/window.png';
  const smoke = f >= v(33) && f < v(36), flash = f >= v(36) && f < v(39), molly = f >= v(39);
  const round = 1 + Math.floor(Math.max(0, f - v(42)) / 4);
  return (
    <>
      <Bg glow="#3a2a10" />
      <Chip x={540} y={150} s={pop(f, S.week, fps)} bg={ORANGE} size={40}>КАЖДЫЙ ЗНАЕТ КАЖДУЮ РАСКИДКУ</Chip>
      <Shot src={src} y={230}>
        {smoke && <div style={{position: 'absolute', left: 300, top: 120, width: 420, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(230,230,230,0.95), rgba(200,200,200,0.7) 60%, transparent 72%)', transform: `scale(${pop(f, v(33), fps, 120, 14)})`}} />}
        {flash && <div style={{position: 'absolute', inset: 0, background: `rgba(255,255,255,${Math.max(0, 1 - (f - v(36)) / 18)})`}} />}
        {molly && <div style={{position: 'absolute', left: 340, top: 360, width: 360, height: 140, borderRadius: '50%', background: `radial-gradient(ellipse, rgba(255,${160 + 40 * Math.sin(f / 2)},40,0.95), rgba(255,80,20,0.6) 55%, transparent 72%)`}} />}
      </Shot>
      <div style={{position: 'absolute', left: 540, top: 860, transform: 'translate(-50%,-50%)', display: 'flex', gap: 16}}>
        {[['💨', 'смок в окно', v(33)], ['⚡', 'флешка на джангл', v(36)], ['🔥', 'молотов под сэндвич', v(39)]].map(([i, t, at]) => (
          <div key={t as string} style={{background: '#1c2030', borderRadius: 14, padding: '10px 16px', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 24, color: '#fff', opacity: f >= (at as number) ? 1 : 0.2}}>{i} {t}</div>
        ))}
      </div>
      {f >= v(42) && <div style={{position: 'absolute', left: 540, top: 970, transform: 'translate(-50%,-50%)', fontFamily: 'Russo One', fontSize: 50, color: '#8f98a0'}}>раунд {round} · раунд {round + 1} · раунд {round + 2}</div>}
      {f >= v(45) && <Big x={540} y={1080} s={pop(f, v(45), fps, 320, 9)} size={70} color={RED}>ОДНО И ТО ЖЕ</Big>}
    </>
  );
};

const Month: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const down = Math.round(interpolate(f, [v(57), v(60) + 6], [10, 7], clamp));
  const up = Math.round(interpolate(f, [v(68), v(70) + 6], [7, 10], clamp));
  const side = (x: number, map: string, label: string, lvl: number, c: string, at: number) => (
    <div style={{position: 'absolute', left: x, top: 560, transform: `translate(-50%,-50%) scale(${pop(f, at, fps)})`, textAlign: 'center', fontFamily: 'Montserrat'}}>
      <Card name={map} w={170} />
      <div style={{fontSize: 30, fontWeight: 900, color: '#fff', marginTop: 14}}>{label}</div>
      <div style={{display: 'flex', justifyContent: 'center', marginTop: 12}}><Lvl n={lvl} w={150} /></div>
      <div style={{fontFamily: 'Russo One', fontSize: 60, color: c}}>{c === RED ? '↓' : '↑'}</div>
    </div>
  );
  return (
    <>
      <Bg glow="#2a1a2a" />
      <Chip x={540} y={150} s={pop(f, S.month, fps)} bg={ORANGE} size={42}>ЧЕРЕЗ МЕСЯЦ</Chip>
      {side(280, 'nuke', 'тащил на Nuke', down, RED, v(54))}
      {f >= v(61) && side(800, 'mirage', 'сидел на Mirage', up, GREEN, v(61))}
      {f >= v(57) && <Chip x={280} y={1060} s={pop(f, v(57), fps)} bg={RED} size={34}>−3 уровня</Chip>}
      {f >= v(68) && <Chip x={800} y={1060} s={pop(f, v(68), fps)} bg={GREEN} color="#06260f" size={34}>10 уровень</Chip>}
    </>
  );
};

const M3: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const pre = f >= v(85);
  const spots: [number, number][] = [[95, 120], [300, 95], [180, 290], [360, 230], [140, 360], [330, 345], [250, 190], [395, 160]];
  return (
    <>
      <Bg glow="#2a2a3a" />
      <Chip x={540} y={150} s={pop(f, S.m3, fps)} bg={ORANGE} size={42}>ЧЕРЕЗ 3 МЕСЯЦА</Chip>
      {!pre ? (
        <div style={{position: 'absolute', left: 540, top: 600, transform: 'translate(-50%,-50%)', width: 760, height: 760}}>
          <Img src={staticFile('mirage/radar.png')} style={{width: 760, height: 760, borderRadius: 16}} />
          {spots.map(([x, y], i) => (
            <div key={i} style={{position: 'absolute', left: x * 1.7 - 14, top: y * 1.7 - 14, width: 28, height: 28, borderRadius: 14, background: i < 4 ? '#3af' : RED, border: '3px solid #fff',
              boxShadow: `0 0 ${12 + 8 * Math.sin(f / 4 + i)}px ${i < 4 ? '#3af' : RED}`, opacity: f >= v(77) ? 1 : 0}} />
          ))}
          {f >= v(80) && <div style={{position: 'absolute', left: 0, right: 0, bottom: -70, textAlign: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 36, color: '#fff'}}>каждый раунд — те же позиции</div>}
        </div>
      ) : (
        <Shot src="mirage/asite2.png" y={260}>
          <svg width={1000} height={562} viewBox="0 0 1000 562" style={{position: 'absolute', inset: 0}}>
            <circle cx={500} cy={268} r={40} fill="none" stroke={GREEN} strokeWidth={5} />
            <line x1={500} y1={218} x2={500} y2={248} stroke={GREEN} strokeWidth={5} /><line x1={500} y1={288} x2={500} y2={318} stroke={GREEN} strokeWidth={5} />
          </svg>
          <div style={{position: 'absolute', left: 500, top: 190, transform: `translate(-50%,-50%) scale(${pop(f, v(88), fps)})`, background: RED, color: '#fff', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 30, padding: '8px 18px', borderRadius: 10, whiteSpace: 'nowrap'}}>там всегда он</div>
        </Shot>
      )}
    </>
  );
};

const Online: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <>
      <Bg glow="#1a1a2a" />
      <div style={{position: 'absolute', left: 0, top: 560, width: 1080, height: 620, overflow: 'hidden'}}><Portrait f={f} bg="dorm" mood="tired" scale={1.05} y={420} /></div>
      <Big x={540} y={260} s={pop(f, S.online, fps)} size={70} color={RED}>ОНЛАЙН ПАДАЕТ</Big>
      {f >= v(95) && <Big x={540} y={400} s={pop(f, v(95), fps)} size={60} color="#fff">😴 СКУЧНО</Big>}
    </>
  );
};

const Back: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const spinEnd = v(105);
  const strip = [...MAPS, ...MAPS, ...MAPS];
  const target = MAPS.length * 2 + MAPS.indexOf('nuke');
  const p = 1 - Math.pow(1 - ramp(f, v(100), spinEnd), 3);
  const off = p * (target * 200 - 440);
  const inNuke = f >= v(107);
  return (
    <>
      <Bg glow="#1a3a4a" />
      {!inNuke ? (
        <>
          <Chip x={540} y={170} s={pop(f, S.back, fps)} bg={GREEN} color="#06260f" size={40}>FACEIT ВОЗВРАЩАЕТ ВСЕ КАРТЫ</Chip>
          <div style={{position: 'absolute', left: 0, top: 320, width: 1080, height: 460, overflow: 'hidden'}}>
            <div style={{position: 'absolute', left: -off, top: 20, display: 'flex', gap: 30}}>
              {strip.map((m, i) => <div key={i} style={{boxShadow: f >= spinEnd && i === target ? `0 0 50px ${GOLD}` : 'none'}}><Card name={m} w={170} /></div>)}
            </div>
            <div style={{position: 'absolute', left: 537, top: 0, width: 6, height: 460, background: GOLD, boxShadow: `0 0 20px ${GOLD}`}} />
          </div>
          {f >= spinEnd && <Big x={540} y={900} s={pop(f, spinEnd, fps, 320, 9)} size={100} color={ORANGE}>NUKE</Big>}
        </>
      ) : (
        <>
          <Shot src="mirage/nuke.png" y={200} />
          <div style={{position: 'absolute', left: 0, top: 640, width: 1080, height: 540, overflow: 'hidden'}}><Portrait f={f} bg="dorm" mood="shocked" scale={0.95} y={400} /></div>
          {f >= v(110) && <Big x={540} y={740} s={pop(f, v(110), fps, 320, 9)} size={66} color={GOLD}>ГДЕ ТОЧКА B???</Big>}
        </>
      )}
    </>
  );
};

const Score: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <>
      <Bg glow="#5a1016" />
      <Big x={540} y={540} s={pop(f, S.score, fps, 380, 8)} size={240} color={RED}>0 : 13</Big>
    </>
  );
};

const Ask: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <>
      <Bg glow="#3a3a10" />
      <Big x={540} y={190} s={pop(f, S.ask, fps)} size={54} color="#fff">А НА КАКОЙ ИГРАЛ БЫ ТЫ?</Big>
      <div style={{position: 'absolute', left: 540, top: 640, transform: 'translate(-50%,-50%)', display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 14}}>
        {MAPS.map((m, i) => <div key={m} style={{transform: `scale(${pop(f, S.ask + i * 2, fps)})`}}><Card name={m} w={170} /></div>)}
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
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, #3a3a10, #0b0c12 70%)', alignItems: 'center', justifyContent: 'center', paddingBottom: 240, textAlign: 'center'}}>
      <div style={{transform: `scale(${0.6 + 0.4 * m})`}}><Card name="mirage" w={220} /></div>
      <div style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 50, color: '#fff', marginTop: 20, opacity: Math.min(1, m * 2)}}>ПИШИ СВОЮ КАРТУ 👇</div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- звук (тихие эффекты, без фонового гула)
type Fx = [number, string, number];
const SFX: Fx[] = [
  ...Array.from({length: 9}).map((_, k): Fx => [2 + k * Math.max(2, Math.round((v(9) - 4) / 9)), 'sfx2/stamp.wav', 0.22]), [v(9), 'sfx2/impact.wav', 0.45],
  [v(23), 'sfx2/blip.wav', 0.25], [v(33), 'sfx2/whoosh.wav', 0.3], [v(36), 'sfx2/hit.wav', 0.3], [v(39), 'sfx2/riser.wav', 0.25], [v(45), 'sfx2/stamp.wav', 0.3],
  [v(57), 'sfx2/blip_low.wav', 0.3], [v(68), 'sfx2/ding.wav', 0.3], [v(85), 'tilt/hs.wav', 0.3], [S.online, 'sfx2/deflate.wav', 0.3],
  ...Array.from({length: 12}).map((_, i): Fx => [v(100) + i * 5, 'sfx2/tick.wav', 0.2]), [v(105), 'sfx2/impact.wav', 0.35],
  [S.score, 'money/boom.wav', 0.4], [S.end, 'sfx2/ding.wav', 0.35],
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

export const Mirage: React.FC = () => {
  loadFonts();
  const order: [number, number, React.FC, boolean?][] = [
    [S.hook, S.d1, Hook], [S.d1, S.week, D1, true], [S.week, S.month, Week, true], [S.month, S.m3, Month, true], [S.m3, S.online, M3, true],
    [S.online, S.back, Online, true], [S.back, S.score, Back, true], [S.score, S.ask, Score, true], [S.ask, S.end, Ask, true],
  ];
  return (
    <AbsoluteFill style={{background: '#0b0c12'}}>
      {order.map(([from, to, C, cut], i) => <Scene key={i} from={from} to={to} cut={cut}><C /></Scene>)}
      <Flash at={v(9)} len={10} color="rgba(255,210,63,0.4)" />
      <Flash at={S.score} len={12} />
      <TopBar />
      <AbsoluteFill style={{top: H - 220, height: 220, background: 'linear-gradient(rgba(11,12,18,0), #0b0c12)'}} />
      <Captions cues={CUES} />
      <End />
      <Sound />
    </AbsoluteFill>
  );
};
