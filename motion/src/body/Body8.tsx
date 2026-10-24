// TikTok-ролик «8 часов в CS2 — что происходит с телом» (9:16, ~88 с). Герой — Лёха.
// Монтаж как у «Ещё одна катка»: хук «одна ошибка» → ошибка → часы 1/3/5 → «что внутри» → час 8 → правила → ложная развязка → «часть 2».
import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import {loadFonts} from '../theme';
import {FPS, fr} from '../tilt/script';
import {VO, END_AT, TOTAL, CUES, v} from './script';
import {Room, MON, W, H} from '../tilt/Room';
import {GameView, Kill} from '../tilt/CSScreen';
import {Captions, Sticker, Pill, Tag, Rings, COL, clamp, pop} from '../tilt/UI';
import {Scene, Cam, RedFlash, Grid, IconBubble, ramp} from '../tilt/Tilt';
import {SideBody, Eye, HandMouse, WristSection} from './Figures';

export const BODY_FRAMES = fr(TOTAL);

const S = {
  hook: 0,
  intro: v(18) - 4,
  mistake: v(28) - 4,
  h1: v(42) - 6,
  h3: v(52) - 4,
  h5: v(64) - 4,
  wrist: v(81) - 4,
  h8: v(106) - 4,
  r1: v(125) - 4,
  r2: v(136) - 4,
  r3: v(148) - 4,
  r4: v(158) - 4,
  fin: v(172) - 4,
  end: fr(END_AT),
};

// часы: от 12:00 вперёд на t часов
const clockAt = (t: number) => {
  const m = Math.round(12 * 60 + t * 60);
  return `${String(Math.floor(m / 60) % 24).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
};

const Text: React.FC<{x: number; y: number; s: number; size: number; color?: string; children: React.ReactNode}> = ({x, y, s, size, color = '#fff', children}) => (
  <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%, -50%) scale(${s})`, opacity: Math.min(1, s * 2), fontFamily: 'Montserrat', fontWeight: 900,
    fontSize: size, color, whiteSpace: 'nowrap', textShadow: '0 4px 0 rgba(0,0,0,0.6)', textAlign: 'center'}}>{children}</div>
);

// ---------------------------------------------------------------- хук
const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const run = ramp(f, v(5), v(7) + 14); // «восемь часов подряд» — часы проматываются
  const s = interpolate(f, [0, v(5)], [1.5, 1.0], {...clamp, easing: Easing.inOut(Easing.cubic)}) + interpolate(f, [v(8), S.intro], [0, 0.1], clamp);
  const tint = f >= v(17) ? interpolate(f, [v(17), v(17) + 30], [1, 0.4], clamp) : 0;
  return (
    <>
      <Cam s={s} y={MON.y + MON.h / 2}>
        <Room f={f} mode="game" game={{bob: f}} clock={clockAt(run * 8)} clockGlow={run > 0 && run < 1 ? 1 : 0} daylight={1 - run} tint={tint} />
      </Cam>
      <Tag text="8 часов подряд" x={540} y={310} at={v(5)} until={v(12)} color={COL.y} />
      <Pill text="Тело выдержит" at={v(9)} until={v(15)} color="#2bb673" />
      <RedFlash at={v(17)} len={20} />
      {f >= v(5) && f < v(7) + 14 && <Rings x={180} y={205} at={v(5)} color="#ff3344" size={170} />}
    </>
  );
};

// ---------------------------------------------------------------- Лёха, суббота, полдень
const Intro: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const bubble = pop(f, v(25), fps);
  return (
    <>
      <Cam s={1.04}>
        <Room f={f} mode="menu" menu={{rating: ['ELO 2 150', '▲ 25'], hover: 0.5 + 0.5 * Math.sin(f / 5)}} clock="12:00" clockGlow={f >= v(24) ? 1 : 0} daylight={1} />
      </Cam>
      <Tag text="Лёха" x={540} y={600} at={v(18)} color="#7fb2ff" />
      <Sticker text="Суббота" at={v(19)} />
      <Rings x={180 * 1.04 - 22} y={205 * 1.04 - 25} at={v(24)} color="#ff3344" size={190} />
      <div style={{position: 'absolute', left: 290, top: 840, transform: `scale(${bubble})`, transformOrigin: '75% 100%', opacity: bubble,
        background: '#fff', color: '#11131a', borderRadius: 34, padding: '20px 30px', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 40, width: 500, textAlign: 'center'}}>
        «НА ПАРУ КАТОК»
        <div style={{position: 'absolute', right: 70, bottom: -22, width: 0, height: 0, borderLeft: '22px solid transparent', borderRight: '22px solid transparent', borderTop: '26px solid #fff'}} />
      </div>
    </>
  );
};

// ---------------------------------------------------------------- ни разу не встал → ошибка №1
const Mistake: React.FC = () => {
  const f = useCurrentFrame();
  const run = ramp(f, v(31), v(37) + 10);
  const err = v(38);
  const tint = f >= err ? 0.6 + 0.4 * Math.sin((f - err) / 3) : 0;
  const s = interpolate(f, [S.mistake, err], [1.0, 1.12], clamp) + (f >= err ? 0.04 * Math.exp(-(f - err) / 6) : 0);
  const hours = Math.floor(run * 8);
  return (
    <>
      <Cam s={s}>
        <Room f={f} mode="game" game={{bob: f * 1.6}} clock={clockAt(run * 8)} daylight={1 - run} tint={tint} />
      </Cam>
      {/* счётчик «не вставал» */}
      <div style={{position: 'absolute', left: 540, top: 1010, transform: `translate(-50%, -50%) scale(${pop(f, v(34), 30)})`, background: 'rgba(10,12,20,0.92)',
        border: `4px solid ${COL.r}`, borderRadius: 26, padding: '14px 34px', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 44, color: '#fff', whiteSpace: 'nowrap'}}>
        НЕ ВСТАВАЛ: <span style={{color: COL.r}}>{hours} Ч</span>
      </div>
      <Pill text="Ошибка №1" at={err} y={200} />
      <RedFlash at={err} len={18} />
    </>
  );
};

// ---------------------------------------------------------------- час 1: аим летит
const Hour1: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const shots = [v(45), v(47), v(50)];
  const kills: Kill[] = shots.filter((t) => f >= t).map((t, i) => ({killer: 'Лёха', victim: ['Enemy', 'Bot_Kirill', 'xX_pro'][i], mine: true, hs: true, at: (f - t) / 6}));
  const lastShot = shots.filter((t) => f >= t).pop() ?? -100;
  const recoil = f - lastShot < 6 ? 1 - (f - lastShot) / 6 : 0;
  const enemy = f - lastShot < 8 ? 0 : 1;
  const aim = pop(f, v(49), fps);
  const zoom = interpolate(f, [S.h1, S.h1 + 10], [1.25, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  return (
    <>
      <AbsoluteFill style={{height: H, background: '#07090f'}} />
      <Cam s={zoom} shake={recoil * 0.5}>
        <svg width={1500} height={844} viewBox="0 0 1600 900" style={{position: 'absolute', left: -210, top: 300}}>
          <GameView bob={f * 1.2} peek={0.6} enemy={enemy} kills={kills} score={[3, 1]} timer="1:21" />
        </svg>
      </Cam>
      <Sticker num="ЧАС 1" text="· 13:00" at={S.h1 + 6} />
      <div style={{position: 'absolute', left: 140, top: 1000, width: 800, opacity: aim, transform: `translateY(${(1 - aim) * 30}px)`}}>
        <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 38, color: '#fff'}}>
          <span>АИМ</span><span style={{color: '#2bd96b'}}>100%</span>
        </div>
        <div style={{height: 26, borderRadius: 13, background: '#1c2547', marginTop: 10}}>
          <div style={{height: '100%', width: `${aim * 100}%`, background: '#2bd96b', borderRadius: 13}} />
        </div>
      </div>
    </>
  );
};

// ---------------------------------------------------------------- час 3: глаза
const Hour3: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const rare = f >= v(56);
  const period = rare ? 75 : 22;
  const ph = (f - S.h3) % period;
  const blink = ph < 6 ? Math.sin((ph / 6) * Math.PI) : 0;
  const dry = ramp(f, v(59), v(60) + 12);
  const rate = Math.round(interpolate(f, [v(56), v(58) + 12], [18, 6], clamp));
  const game = pop(f, v(61) - 4, fps);
  const blur = ramp(f, v(62), v(63) + 12);
  return (
    <>
      <Grid />
      <Sticker num="ЧАС 3" text="· 15:00" at={S.h3 + 4} />
      <div style={{position: 'absolute', left: 260, top: 290}}><Eye blink={blink} dry={dry} /></div>
      <Text x={540} y={600} s={1} size={40} color="#9aa4c0">МОРГАНИЙ В МИНУТУ</Text>
      <Text x={540} y={680} s={rare ? 1 + 0.08 * Math.max(0, 1 - (f - v(56)) / 8) : 1} size={92} color={rare ? COL.r : '#fff'}>{rate}</Text>
      {game > 0 && (
        <div style={{position: 'absolute', left: 90, top: 770, width: 900, height: 506, transform: `scale(${0.8 + 0.2 * game})`, opacity: game, borderRadius: 18, overflow: 'hidden',
          border: '4px solid #2a3350'}}>
          <svg width={900} height={506} viewBox="0 0 1600 900"><GameView bob={f} peek={0.3} enemy={1} blur={blur} score={[7, 6]} timer="0:54" /></svg>
        </div>
      )}
    </>
  );
};

// ---------------------------------------------------------------- час 5: шея и спина
const Hour5: React.FC = () => {
  const f = useCurrentFrame();
  const fw = ramp(f, v(66), v(70) + 10);
  const neck = ramp(f, v(71), v(71) + 8);
  const load = ramp(f, v(74), v(78) + 6);
  const back = ramp(f, v(79), v(79) + 8);
  return (
    <>
      <SideBody f={f} forward={fw} zones={{neck, back}} neckLoad={load} daylight={0.45} clock="17:00" game={{bob: f, peek: 0.3, enemy: 1}} />
      <Sticker num="ЧАС 5" text="· 17:00" at={S.h5 + 4} />
      <Tag text="Шея" x={720} y={330} at={v(72)} color={COL.r} dark={false} />
      <Tag text="Спина" x={170} y={640} at={v(79)} color={COL.r} dark={false} />
    </>
  );
};

// ---------------------------------------------------------------- что внутри: запястье
const Wrist: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const sec = pop(f, v(85), fps);
  const inflame = ramp(f, v(102), v(102) + 16);
  const numb = ramp(f, v(103), v(105) + 6);
  const clicks = Math.round(interpolate(f, [v(95), v(98) + 20], [0, 12480], clamp));
  const clickPulse = f >= v(95) && f < v(98) + 20 ? ((f % 4) < 2 ? 1 : 0) : 0;
  const handY = interpolate(sec, [0, 1], [560, 420]);
  const handS = interpolate(sec, [0, 1], [1.5, 0.9]);
  return (
    <>
      <Grid />
      <Sticker text="Что внутри" at={S.wrist + 4} />
      <div style={{position: 'absolute', left: 540, top: handY, transform: `translate(-50%, -50%) scale(${handS})`}}>
        <HandMouse click={clickPulse} numb={numb} wrist={f >= v(84) ? 1 : 0} f={f} />
      </div>
      {f >= v(95) && <Text x={820} y={560} s={pop(f, v(95), fps)} size={38} color={COL.y}>КЛИКОВ: {clicks.toLocaleString('ru-RU')}</Text>}
      {sec > 0 && (
        <>
          <svg width={W} height={H} style={{position: 'absolute'}}>
            <path d="M470 480 L330 610 M560 480 L760 610" stroke="#7d94d8" strokeWidth={4} strokeDasharray="10 8" opacity={sec} />
          </svg>
          <div style={{position: 'absolute', left: 540, top: 820, transform: `translate(-50%, -50%) scale(${0.75 * sec + 0.1})`, opacity: sec}}>
            <WristSection inflame={inflame} f={f} />
          </div>
        </>
      )}
      <Tag text="Канал" x={540} y={820} at={v(87)} until={v(92)} color="#9fb3ee" />
      <Tag text="Нерв" x={250} y={930} at={v(92)} color={COL.y} />
      <Tag text="Сухожилия" x={850} y={690} at={v(94)} color="#fff" />
      <Pill text="Воспаление" at={v(102)} y={1010} />
    </>
  );
};

// ---------------------------------------------------------------- час 8
const Hour8: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const legs = ramp(f, v(108), v(108) + 8);
  const bottle = pop(f, v(110), fps);
  const head = ramp(f, v(116), v(116) + 8);
  const card = pop(f, v(118), fps);
  const worse = ramp(f, v(120), v(120) + 14);
  return (
    <>
      <SideBody f={f} forward={1} zones={{legs, neck: head * 0.6}} daylight={0} clock="20:00" bottle={bottle} bottleLevel={0} game={{bob: f * 0.6, peek: 0.3, enemy: 1}} />
      <Sticker num="ЧАС 8" text="· 20:00" at={S.h8 + 4} />
      <Tag text="Ноги затекли" x={820} y={930} at={v(108)} color={COL.r} dark={false} />
      <Tag text="Воды 0" x={950} y={570} at={v(110)} color={COL.r} />
      {f >= v(116) && <Rings x={560} y={430} at={v(116)} color="#ff6b6b" size={150} />}
      {card > 0 && (
        <div style={{position: 'absolute', left: 540, top: 600, width: 860, transform: `translate(-50%, -50%) scale(${0.7 + 0.3 * card})`, opacity: card,
          background: 'rgba(10,13,24,0.96)', border: '3px solid #2c3858', borderRadius: 26, padding: '30px 40px', boxSizing: 'border-box'}}>
          <div style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 40, color: '#fff', marginBottom: 20}}>АИМ</div>
          {[['ЧАС 1', 1, '#2bd96b'], ['ЧАС 8', 1 - worse * 0.55, COL.r]].map(([l, w, c]) => (
            <div key={l as string} style={{display: 'flex', alignItems: 'center', gap: 24, marginBottom: 18}}>
              <span style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 34, color: '#9aa4c0', width: 150}}>{l}</span>
              <div style={{flex: 1, height: 34, borderRadius: 17, background: '#1c2547'}}>
                <div style={{height: '100%', width: `${(w as number) * 100}%`, background: c as string, borderRadius: 17}} />
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

// ---------------------------------------------------------------- правила
const Rule1: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const stand = ramp(f, v(131), v(131) + 18);
  return (
    <>
      <Cam s={1.0}>
        <Room f={f} mode="menu" menu={{rating: ['ELO 2 150', '▲ 25']}} stand={stand} clock="" daylight={0} />
      </Cam>
      <Sticker text="Что делать?" at={v(125)} until={v(127)} />
      <Sticker num="1." text="Раз в час вставай" at={v(127)} />
      <IconBubble x={380} y={990} s={pop(f, v(132), fps)} label="2 МИНУТЫ">
        <span style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 48, color: '#fff'}}>2:00</span>
      </IconBubble>
      <IconBubble x={700} y={990} s={pop(f, v(134), fps)} label="ПОХОДИ">
        <svg width={90} height={100} viewBox="0 0 100 110">
          <circle cx={52} cy={14} r={11} fill="#fff" />
          <path d="M50 30 L40 62 L58 74 L50 104 M44 44 L24 54 M46 42 L68 56 M40 62 L26 88" stroke="#fff" strokeWidth={10} fill="none" strokeLinecap="round" />
        </svg>
      </IconBubble>
    </>
  );
};

const Rule2: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const cards: [number, string, string][] = [[v(138), '20', 'МИНУТ'], [v(139), '20', 'СЕКУНД'], [v(140), '6 м', 'ВДАЛЬ']];
  const look = ramp(f, v(144), v(145) + 10);
  const left = Math.max(0, 20 - Math.floor((f - v(146)) / 3));
  return (
    <>
      <Grid />
      <Sticker num="2." text="Правило 20-20-20" at={S.r2 + 4} />
      {cards.map(([at, big, small], i) => {
        const s = pop(f, at, fps, 300, 11);
        return (
          <div key={i} style={{position: 'absolute', left: 230 + i * 310, top: 470, width: 270, height: 260, transform: `translate(-50%, -50%) scale(${s})`, opacity: Math.min(1, s * 2),
            background: 'rgba(16,22,40,0.96)', border: '5px solid #ffd23f', borderRadius: 28, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
            <div style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 110, color: '#ffd23f', lineHeight: 1}}>{big}</div>
            <div style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 36, color: '#fff', marginTop: 10}}>{small}</div>
          </div>
        );
      })}
      {/* взгляд от экрана в окно */}
      {look > 0 && (
        <>
          <div style={{position: 'absolute', left: 120, top: 760, opacity: look}}><Eye blink={0} dry={0} size={300} /></div>
          <svg width={W} height={H} style={{position: 'absolute'}}>
            <line x1={440} y1={835} x2={440 + 300 * look} y2={835} stroke="#2bd96b" strokeWidth={8} strokeDasharray="16 12" />
            <path d={`M${730 * 1} 815 L${760} 835 L${730} 855`} stroke="#2bd96b" strokeWidth={8} fill="none" opacity={look > 0.95 ? 1 : 0} />
            <g transform="translate(800, 740)" opacity={look}>
              <rect width={200} height={190} fill="#86bdea" stroke="#3a4a75" strokeWidth={8} />
              <circle cx={140} cy={50} r={24} fill="#ffe08a" />
              <path d="M0 190 L50 120 L90 160 L140 100 L200 170 L200 190 Z" fill="#3d7a4a" />
            </g>
          </svg>
        </>
      )}
      {f >= v(146) && <Text x={900} y={990} s={pop(f, v(146), fps)} size={64} color="#2bd96b">0:{String(left).padStart(2, '0')}</Text>}
    </>
  );
};

const Rule3: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const eye = ramp(f, v(149), v(149) + 14);
  const elbow = ramp(f, v(153), v(153) + 10);
  const wrist = ramp(f, v(156), v(156) + 10);
  return (
    <>
      <SideBody f={f} forward={0} daylight={0} clock="" guides={{eye, elbow, wrist}} game={{bob: f, peek: 0.3, enemy: 1}} />
      <Sticker num="3." text="Правильная посадка" at={S.r3 + 4} />
      <Tag text="Глаза = верх экрана ✓" x={760} y={360} at={v(149)} color="#2bd96b" />
      <Tag text="Локоть на столе ✓" x={300} y={940} at={v(153)} color="#2bd96b" />
      <Tag text="Кисть ровно ✓" x={800} y={800} at={v(156)} color="#2bd96b" />
    </>
  );
};

const Rule4: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <>
      <Cam s={1.0}>
        <Room f={f} mode="game" game={{bob: f, peek: 0.3, enemy: 1}} bottle={pop(f, v(159), fps)} clock="" daylight={0} />
      </Cam>
      <Sticker num="4." text="Вода и разминка" at={S.r4 + 4} />
      <Rings x={925} y={720} at={v(159)} until={v(163)} color="#9fd0ff" size={130} />
      <IconBubble x={380} y={990} s={pop(f, v(163), fps)} label="РАЗМИНКА">
        <svg width={100} height={90} viewBox="0 0 100 90">
          <path d="M20 80 L20 40 Q20 20 32 20 L32 50 M32 20 Q32 8 44 8 L44 48 M44 12 Q48 2 58 6 L58 48 M58 14 Q64 6 72 12 L72 56 Q72 80 50 84 L20 80" stroke="#fff" strokeWidth={7} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </IconBubble>
      <IconBubble x={700} y={990} s={pop(f, v(170), fps)} label="ВСЕГО">
        <span style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 48, color: '#fff'}}>0:30</span>
      </IconBubble>
    </>
  );
};

// ---------------------------------------------------------------- ложная развязка: кик за бездействие
const Final: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const stand = ramp(f, v(176), v(176) + 14) * (1 - ramp(f, v(181), v(181) + 14));
  const level = 1 - ramp(f, v(177), v(178) + 12) * 0.6;
  const kickAt = v(187);
  const kick = pop(f, kickAt, fps, 220, 14);
  const push = ramp(f, v(183), kickAt + 6);
  const s = 1 + push * 0.55;
  const checks: [number, string][] = [[v(176), 'ВСТАЛ'], [v(177), 'ВОДА'], [v(179), 'РАЗМИНКА']];
  return (
    <>
      <Cam s={s} y={MON.y + MON.h / 2}>
        <Room f={f} mode="game" game={{bob: f, peek: 0.3, enemy: 1}} stand={stand} bottle={1} bottleLevel={level} kick={kick} clock="20:15" daylight={0} />
      </Cam>
      <div style={{position: 'absolute', left: 640, top: 250, opacity: 1 - push, display: 'flex', flexDirection: 'column', gap: 12}}>
        {checks.map(([at, t]) => {
          const p = pop(f, at, fps);
          return (
            <div key={t} style={{transform: `scale(${p})`, transformOrigin: 'left', opacity: p, background: '#17a34a', color: '#fff', borderRadius: 30, padding: '8px 24px',
              fontFamily: 'Montserrat', fontWeight: 900, fontSize: 36, width: 'fit-content'}}>✓ {t}</div>
          );
        })}
      </div>
      <RedFlash at={kickAt} len={20} />
    </>
  );
};

const EndCard: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (f < S.end) return null;
  const s1 = pop(f, S.end + 4, fps);
  const s2 = pop(f, S.end + 14, fps, 300, 10);
  return (
    <AbsoluteFill style={{background: '#000', alignItems: 'center', justifyContent: 'center', paddingBottom: 260}}>
      <div style={{fontFamily: 'Montserrat', fontWeight: 600, fontStyle: 'italic', fontSize: 40, color: '#bbb', opacity: s1}}>часть 2</div>
      <div style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 100, color: '#fff', opacity: s1, transform: `scale(${0.8 + 0.2 * s1})`}}>КУДА ПРОПАЛ</div>
      <div style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 120, color: COL.r, opacity: s2, transform: `scale(${0.6 + 0.4 * s2})`, textShadow: '0 0 40px rgba(255,59,71,0.6)'}}>АИМ?</div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- звук
type Fx = [number, string, number];
const SFX: Fx[] = [
  [3, 'tilt/shot.wav', 0.25], [16, 'tilt/shot.wav', 0.25],
  ...[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((k): Fx => [v(5) + k * 3, 'sfx2/tick.wav', 0.5]),
  [v(9), 'sfx2/shimmer.wav', 0.3], [v(17), 'sfx2/impact.wav', 0.55],
  [S.intro, 'sfx2/whoosh.wav', 0.4], [v(18), 'sfx2/pop.wav', 0.35], [v(19), 'sfx2/pop.wav', 0.35], [v(24), 'sfx2/ding.wav', 0.3], [v(25), 'sfx2/pop.wav', 0.35],
  [S.mistake, 'sfx2/whip.wav', 0.35], ...[0, 1, 2, 3, 4, 5, 6, 7].map((k): Fx => [v(31) + k * 7, 'sfx2/tick.wav', 0.5]), [v(34), 'sfx2/error.wav', 0.35],
  [v(38), 'sfx2/stamp.wav', 0.6], [v(38), 'sfx2/impact.wav', 0.45],
  [S.h1, 'sfx2/whip.wav', 0.4], [v(45), 'tilt/shot.wav', 0.6], [v(45) + 2, 'tilt/hs.wav', 0.5], [v(47), 'tilt/shot.wav', 0.6], [v(47) + 2, 'tilt/hs.wav', 0.5],
  [v(50), 'tilt/shot.wav', 0.6], [v(50) + 2, 'tilt/hs.wav', 0.5], [v(49), 'sfx2/riser.wav', 0.2],
  [S.h3, 'sfx2/whoosh.wav', 0.4], [v(56), 'sfx2/blip_low.wav', 0.35], [v(59), 'sfx2/deflate.wav', 0.3], [v(61) - 4, 'sfx2/pop.wav', 0.35], [v(62), 'sfx2/lag.wav', 0.3],
  [S.h5, 'sfx2/whoosh.wav', 0.4], [v(66), 'sfx2/deflate.wav', 0.3], [v(72), 'sfx2/error.wav', 0.3], [v(75), 'sfx2/hit.wav', 0.4], [v(79), 'sfx2/impact.wav', 0.35],
  [S.wrist, 'sfx2/whoosh.wav', 0.4], [v(84), 'tilt/heart.wav', 0.35], [v(85), 'sfx2/pop.wav', 0.4], [v(92), 'sfx2/blip.wav', 0.3], [v(94), 'sfx2/blip.wav', 0.3],
  ...[0, 1, 2, 3, 4, 5, 6, 7].map((k): Fx => [v(95) + k * 4, 'sfx2/click.wav', 0.45]), [v(102), 'tilt/heart.wav', 0.5], [v(102) + 9, 'tilt/heart.wav', 0.5], [v(103), 'sfx2/glitch.wav', 0.25],
  [S.h8, 'sfx2/whip.wav', 0.4], [v(108), 'sfx2/error.wav', 0.3], [v(110), 'sfx2/deflate.wav', 0.35], [v(116), 'sfx2/lag.wav', 0.3], [v(118), 'sfx2/pop.wav', 0.35], [v(120), 'sfx2/deflate.wav', 0.4],
  [S.r1, 'sfx2/whoosh.wav', 0.45], [v(125), 'sfx2/pop.wav', 0.4], [v(127), 'sfx2/pop.wav', 0.4], [v(131), 'sfx2/whoosh.wav', 0.3], [v(132), 'sfx2/pop.wav', 0.35], [v(134), 'sfx2/pop.wav', 0.35],
  [S.r2, 'sfx2/whip.wav', 0.35], [v(138), 'sfx2/stamp.wav', 0.4], [v(139), 'sfx2/stamp.wav', 0.4], [v(140), 'sfx2/stamp.wav', 0.45], [v(144), 'sfx2/whoosh.wav', 0.3], [v(146), 'sfx2/ding.wav', 0.3],
  [S.r3, 'sfx2/whip.wav', 0.35], [v(149), 'sfx2/ding.wav', 0.3], [v(153), 'sfx2/ding.wav', 0.3], [v(156), 'sfx2/ding.wav', 0.35],
  [S.r4, 'sfx2/whip.wav', 0.35], [v(159), 'sfx2/pop.wav', 0.4], [v(163), 'sfx2/pop.wav', 0.35], [v(170), 'sfx2/pop.wav', 0.35],
  [S.fin, 'sfx2/whoosh.wav', 0.3], [v(176), 'sfx2/ding.wav', 0.3], [v(177), 'sfx2/ding.wav', 0.3], [v(179), 'sfx2/ding.wav', 0.3],
  [v(183), 'sfx2/riser.wav', 0.3], [v(187), 'sfx2/error.wav', 0.5], [v(187), 'sfx2/impact.wav', 0.55],
  [S.end, 'sfx2/impact.wav', 0.5], [S.end + 14, 'tilt/heart.wav', 0.6],
];

const Sound: React.FC = () => (
  <>
    {VO.map((o) => (
      <Sequence key={o.src} from={fr(o.at)} durationInFrames={fr(o.dur) + 6}>
        <Audio src={staticFile(o.src)} volume={1} />
      </Sequence>
    ))}
    {Array.from({length: Math.ceil(TOTAL / 11.5)}).map((_, i) => (
      <Sequence key={i} from={Math.round(i * 11.5 * FPS)} durationInFrames={12 * FPS}>
        <Audio src={staticFile('tilt/pad.wav')} volume={(x) => (i * 11.5 * FPS + x >= S.end ? 0.05 : 0.13)} />
      </Sequence>
    ))}
    {SFX.map(([at, src, vol], i) => (
      <Sequence key={i} from={Math.max(0, at)} durationInFrames={FPS * 2}>
        <Audio src={staticFile(src)} volume={vol} />
      </Sequence>
    ))}
  </>
);

export const Body8: React.FC = () => {
  loadFonts();
  return (
    <AbsoluteFill style={{background: '#07090f'}}>
      <Scene from={S.hook} to={S.intro}><Hook /></Scene>
      <Scene from={S.intro} to={S.mistake}><Intro /></Scene>
      <Scene from={S.mistake} to={S.h1}><Mistake /></Scene>
      <Scene from={S.h1} to={S.h3} zoom={0.15}><Hour1 /></Scene>
      <Scene from={S.h3} to={S.h5}><Hour3 /></Scene>
      <Scene from={S.h5} to={S.wrist}><Hour5 /></Scene>
      <Scene from={S.wrist} to={S.h8}><Wrist /></Scene>
      <Scene from={S.h8} to={S.r1}><Hour8 /></Scene>
      <Scene from={S.r1} to={S.r2}><Rule1 /></Scene>
      <Scene from={S.r2} to={S.r3}><Rule2 /></Scene>
      <Scene from={S.r3} to={S.r4}><Rule3 /></Scene>
      <Scene from={S.r4} to={S.fin}><Rule4 /></Scene>
      <Scene from={S.fin} to={S.end}><Final /></Scene>
      <AbsoluteFill style={{top: H - 220, height: 220, background: 'linear-gradient(rgba(7,9,15,0), #07090f)'}} />
      <Captions cues={CUES} />
      <EndCard />
      <Sound />
    </AbsoluteFill>
  );
};
