// TikTok-ролик «Ещё одна катка» (9:16, ~83 с): ночной тильт в CS2, озвучка ElevenLabs пользователя.
// Формат по разбору вирусного ролика: хук «одна ошибка» → ошибка → «что в голове» → эскалация → правила → ложная развязка → «часть 2».
import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import {loadFonts} from '../theme';
import {FPS, VO, END_AT, TOTAL, fr, wf} from './script';
import {Room, BedScene, Avatar, MON, W, H} from './Room';
import {GameView, MenuView, DefeatView, CS} from './CSScreen';
import {Captions, Sticker, Pill, Tag, Rings, COL, clamp, pop} from './UI';

export const TILT_FRAMES = fr(TOTAL);

// ---- ключевые моменты (кадры)
const a = (i: number) => wf(1, i);
const b = (i: number) => wf(2, i);
const c = (i: number) => wf(3, i);
const S = {
  hook: 0,
  stats: fr(VO[1].at),
  decide: b(11),
  brain: b(28) - 6,
  round: b(55) - 8,
  angry: b(68) - 4,
  revenge: b(74) - 4,
  rules: b(93) - 4,
  r2: b(106) - 4,
  r3: b(116) - 4,
  r4: b(126) - 4,
  price: b(136) - 4,
  night: fr(VO[2].at) - 6,
  bed: c(5) - 4,
  end: fr(END_AT),
};

const ramp = (f: number, from: number, to: number) => interpolate(f, [from, to], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});

// сцена с плавным входом: появляется поверх предыдущей, слегка «наезжая»
const Scene: React.FC<{from: number; to: number; children: React.ReactNode; zoom?: number}> = ({from, to, children, zoom = 0.05}) => {
  const f = useCurrentFrame();
  if (f < from || f >= to + 8) return null;
  const t = ramp(f, from, from + 8);
  return <AbsoluteFill style={{height: H, overflow: 'hidden', opacity: t, transform: `scale(${1 + (1 - t) * zoom})`}}>{children}</AbsoluteFill>;
};

// камера: масштаб вокруг точки (в координатах картинки)
const Cam: React.FC<{s: number; x?: number; y?: number; tx?: number; ty?: number; shake?: number; children: React.ReactNode}> = ({s, x = W / 2, y = H / 2, tx = 0, ty = 0, shake = 0, children}) => {
  const f = useCurrentFrame();
  const dx = shake ? Math.sin(f * 1.7) * shake * 10 : 0;
  const dy = shake ? Math.cos(f * 2.3) * shake * 8 : 0;
  return <AbsoluteFill style={{transformOrigin: `${x}px ${y}px`, transform: `translate(${dx + tx}px, ${dy + ty}px) scale(${s})`}}>{children}</AbsoluteFill>;
};

const RedFlash: React.FC<{at: number; len?: number}> = ({at, len = 14}) => {
  const f = useCurrentFrame();
  if (f < at || f > at + len) return null;
  return <AbsoluteFill style={{height: H, background: 'radial-gradient(ellipse at center, rgba(255,40,60,0.15), rgba(255,20,40,0.55))', opacity: 1 - (f - at) / len}} />;
};

const Grid: React.FC = () => (
  <AbsoluteFill style={{height: H, background: '#0c1226', backgroundImage: 'radial-gradient(rgba(120,150,230,0.18) 2px, transparent 2px)', backgroundSize: '44px 44px'}} />
);

// значок поражения «L»
const LCard: React.FC<{x: number; y: number; s: number; size?: number}> = ({x, y, s, size = 96}) => (
  <div style={{position: 'absolute', left: x, top: y, width: size, height: size, transform: `translate(-50%, -50%) scale(${s}) rotate(${(1 - s) * -20}deg)`,
    background: '#d9283a', borderRadius: 14, color: '#fff', fontFamily: 'Montserrat', fontWeight: 900, fontSize: size * 0.62, display: 'flex',
    alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 30px rgba(255,40,60,0.6), 0 8px 18px rgba(0,0,0,0.5)', opacity: Math.min(1, s * 2)}}>L</div>
);

// ---------------------------------------------------------------- 1. Хук
const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const lost = a(6);
  const mode = f < lost ? 'game' : f < a(17) ? 'defeat' : 'menu';
  const tint = f >= a(21) ? interpolate(f, [a(21), a(21) + 30], [1, 0.4], clamp) : 0;
  const s = f < lost ? interpolate(f, [0, lost], [1.5, 1.0], {...clamp, easing: Easing.inOut(Easing.cubic)}) : interpolate(f, [lost, S.stats], [1.0, 1.12], clamp);
  return (
    <>
      <Cam s={s} y={MON.y + MON.h / 2}>
        <Room f={f} mode={mode} game={{bob: f, peek: 0}} defeat={{appear: pop(f, lost, fps), score: [9, 13], elo: -25}}
          menu={{hover: f >= a(17) ? 0.5 + 0.5 * Math.sin(f / 4) : 0}} tint={tint} />
        {[7, 8, 9].map((i, k) => <LCard key={i} x={420 + k * 120} y={290} s={pop(f, a(i), fps, 300, 10)} />)}
      </Cam>
      <Tag text="Пора спать" x={860} y={520} at={a(12)} until={a(17)} color="#2bb673" dark={false} />
      <Rings x={1010} y={180} at={a(12)} until={a(17)} />
      <RedFlash at={a(21)} len={20} />
    </>
  );
};

// ---------------------------------------------------------------- 2. Андрей, 2 часа ночи, −75
const Stats: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const elo = Math.round(interpolate(f, [b(7), b(10) + 12], [1875, 1800], {...clamp, easing: Easing.out(Easing.cubic)}));
  const panel = pop(f, b(4) - 4, fps);
  const eloS = pop(f, b(7), fps);
  return (
    <>
      <Cam s={1.06}>
        <Room f={f} mode="defeat" defeat={{score: [9, 13], elo: -25}} clockGlow={f >= b(1) ? 1 : 0} />
      </Cam>
      <AbsoluteFill style={{height: H, background: 'rgba(5,8,18,0.35)'}} />
      <Tag text="Андрей" x={540} y={600} at={b(0)} color="#7fb2ff" />
      <Rings x={180 * 1.06 - 32} y={205 * 1.06 - 35} at={b(1)} color="#ff3344" size={190} />
      {/* последние матчи */}
      <div style={{position: 'absolute', left: 540, top: 470, transform: `translate(-50%, -50%) scale(${panel})`, opacity: panel,
        background: 'rgba(10,13,24,0.94)', border: '3px solid #2c3858', borderRadius: 24, padding: '26px 36px', width: 640}}>
        <div style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 30, color: '#8e9ab8', marginBottom: 16}}>ПОСЛЕДНИЕ МАТЧИ</div>
        <div style={{position: 'relative', height: 110}}>
          {[4, 5, 6].map((i, k) => <LCard key={i} x={60 + k * 130} y={55} s={pop(f, b(i), fps, 300, 10)} size={104} />)}
        </div>
        <div style={{display: 'flex', alignItems: 'baseline', gap: 20, marginTop: 20, opacity: eloS, transform: `scale(${0.8 + 0.2 * eloS})`, transformOrigin: 'left'}}>
          <span style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 40, color: '#fff'}}>ELO</span>
          <span style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 96, color: '#fff'}}>{elo.toLocaleString('ru-RU')}</span>
          <span style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 56, color: COL.r}}>▼{1875 - elo}</span>
        </div>
      </div>
    </>
  );
};

// ---------------------------------------------------------------- 3. «Ещё одна» → ошибка №1
const Decide: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const clickAt = b(21);
  const mv = ramp(f, b(15), clickAt - 4);
  const cursor: [number, number] = [interpolate(mv, [0, 1], [520, 1120]), interpolate(mv, [0, 1], [420, 700])];
  const click = f >= clickAt && f < clickAt + 10 ? (f - clickAt) / 10 : 0;
  const searching = f >= clickAt ? (f - clickAt) / fps + 1 : -1;
  const err = b(24);
  const tint = f >= err ? 0.6 + 0.4 * Math.sin((f - err) / 3) : 0;
  const s = interpolate(f, [S.decide, err], [1.0, 1.22], clamp) + (f >= err ? 0.04 * Math.exp(-(f - err) / 6) : 0);
  const bubble = pop(f, b(19), fps);
  return (
    <>
      <Cam s={s} y={MON.y + MON.h * 0.6}>
        <Room f={f} mode="menu" menu={{cursor, click, searching, hover: mv > 0.9 ? 1 : 0}} tint={tint} click={click} />
      </Cam>
      {/* мысль Андрея */}
      <div style={{position: 'absolute', left: 300, top: 830, transform: `scale(${bubble})`, transformOrigin: '75% 100%', opacity: bubble,
        background: '#fff', color: '#11131a', borderRadius: 34, padding: '20px 30px', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 38, width: 480, textAlign: 'center'}}>
        «ЕЩЁ ОДНА.<br />ОТЫГРАЮСЬ — И СПАТЬ»
        <div style={{position: 'absolute', right: 70, bottom: -22, width: 0, height: 0, borderLeft: '22px solid transparent', borderRight: '22px solid transparent', borderTop: '26px solid #fff'}} />
      </div>
      <Pill text="Ошибка №1" at={err} y={200} />
      <RedFlash at={err} len={18} />
    </>
  );
};

// ---------------------------------------------------------------- 4. Что в голове
const Brain: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const yellow = pop(f, b(32), fps);
  const slot = pop(f, b(37) - 6, fps);
  const react = pop(f, b(44), fps);
  const ms = Math.round(interpolate(f, [b(47), b(48) + 20], [190, 270], clamp));
  const emo = f >= b(52) ? 0.5 + 0.5 * Math.sin((f - b(52)) / 4) : 0;
  const brainFill = emo > 0 ? `rgba(255,59,71,${0.35 + emo * 0.4})` : `rgba(255,210,63,${yellow * 0.3})`;
  const reels = [0, 1, 2].map((k) => {
    const stop = b(42) + k * 5;
    const syms = ['7', '$', 'W', '7', 'L'];
    return f >= stop ? 'L' : syms[Math.floor((f + k * 2) / 2) % syms.length];
  });
  return (
    <>
      <Grid />
      <Sticker text="Что в голове" at={S.brain + 4} />
      <svg width={W} height={H} style={{position: 'absolute'}}>
        <g transform="translate(-40, 20)">
          <path d="M290 980 C260 800 190 640 220 490 C250 340 380 290 480 310 C580 330 625 410 625 480 L668 575 L628 590 C636 625 624 655 612 665 C622 700 600 742 556 752 L480 756 L470 980"
            fill="rgba(90,120,200,0.12)" stroke="#7d94d8" strokeWidth={6} strokeLinejoin="round" />
          <g transform="translate(420, 470)">
            <path d="M-150 20 C-170 -60 -110 -120 -30 -125 C40 -140 130 -100 150 -30 C170 30 130 90 60 95 C0 120 -80 110 -120 80 C-150 65 -155 45 -150 20 Z"
              fill={brainFill} stroke="#9fb3ee" strokeWidth={5} />
            <path d="M-100 -60 C-70 -40 -90 0 -60 20 M-20 -100 C0 -60 -30 -30 0 0 C20 20 0 60 30 80 M60 -90 C40 -50 80 -30 70 10 M100 -40 C80 0 120 30 90 60"
              stroke="#9fb3ee" strokeWidth={4} fill="none" strokeLinecap="round" opacity={0.8} />
          </g>
          {yellow > 0 && <line x1={540} y1={400} x2={700} y2={340} stroke={COL.y} strokeWidth={4} opacity={yellow} strokeDasharray="10 8" />}
        </g>
      </svg>
      <Tag text="Вернуть потерянное" x={830} y={355} at={b(32)} color={COL.y} />
      {/* слот-машина: барабаны останавливаются на L L L */}
      <div style={{position: 'absolute', left: 820, top: 610, transform: `translate(-50%, -50%) scale(${slot})`, opacity: slot,
        width: 330, background: '#1a2140', border: '5px solid #ff3b47', borderRadius: 26, padding: 18}}>
        <div style={{display: 'flex', gap: 10}}>
          {reels.map((r, k) => (
            <div key={k} style={{flex: 1, height: 110, background: '#fff', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'Montserrat', fontWeight: 900, fontSize: 72, color: r === 'L' ? '#d9283a' : '#222'}}>{r}</div>
          ))}
        </div>
      </div>
      <Tag text="Ловушка казино" x={820} y={735} at={b(42)} color={COL.r} />
      {/* реакция падает ночью */}
      <div style={{position: 'absolute', left: 140, top: 925, width: 800, opacity: react, transform: `translateY(${(1 - react) * 30}px)`}}>
        <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 36, color: '#fff'}}>
          <span>РЕАКЦИЯ НОЧЬЮ</span><span style={{color: ms > 230 ? COL.r : '#fff'}}>{ms} мс</span>
        </div>
        <div style={{height: 26, borderRadius: 13, background: '#1c2547', marginTop: 12, overflow: 'hidden'}}>
          <div style={{height: '100%', width: `${(ms - 120) / 1.8}%`, background: ms > 230 ? COL.r : COL.y, borderRadius: 13}} />
        </div>
      </div>
      <Tag text="Пик на эмоциях" x={380} y={300} at={b(52)} color={COL.r} dark={false} />
    </>
  );
};

// ---------------------------------------------------------------- 5а. Раунд: пик, смерть, чат
const Round: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const peek = ramp(f, b(57), b(58) + 6);
  const deadAt = b(61);
  const dead = f >= deadAt ? pop(f, deadAt, fps, 200, 20) : 0;
  const muzzle = f >= b(60) && f < b(60) + 6 ? 1 - (f - b(60)) / 6 : 0;
  const chat = [] as {name: string; text: string; typed?: number; color?: string}[];
  if (f >= b(62)) chat.push({name: 'Андрей', text: 'ты чё не трейднул??', typed: ramp(f, b(62), b(62) + 24)});
  if (f >= b(66)) chat.push({name: 'Dimon', text: 'сам пикаешь как бот', typed: ramp(f, b(66), b(66) + 18), color: CS.t});
  const zoom = interpolate(f, [S.round, S.round + 10], [1.25, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const shake = f >= deadAt && f < deadAt + 10 ? 1 - (f - deadAt) / 10 : 0;
  return (
    <>
      <AbsoluteFill style={{height: H, background: '#07090f'}} />
      <Cam s={zoom} shake={shake}>
        <svg width={1500} height={844} viewBox="0 0 1600 900" style={{position: 'absolute', left: -210, top: 300}}>
          <GameView bob={f * 1.4} peek={peek} enemy={peek > 0.55 ? 1 : 0} muzzle={muzzle} dead={dead} killfeed={f >= deadAt} score={[0, 0]} timer="1:48" />
        </svg>
      </Cam>
      <div style={{position: 'absolute', left: 50, top: 820, width: 980, display: 'flex', flexDirection: 'column', gap: 12}}>
        {chat.map((l, i) => (
          <div key={i} style={{background: 'rgba(6,8,14,0.82)', borderRadius: 16, padding: '12px 22px', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 40,
            borderLeft: `8px solid ${l.color ?? CS.ct}`, transform: `translateX(${(1 - Math.min(1, (l.typed ?? 1) * 4)) * -40}px)`}}>
            <span style={{color: '#9fb3c8'}}>(Команда) </span><span style={{color: l.color ?? CS.ct}}>{l.name}: </span>
            <span style={{color: '#fff'}}>{l.text.slice(0, Math.ceil((l.typed ?? 1) * l.text.length))}</span>
          </div>
        ))}
      </div>
      <Sticker text="Раунд 1" at={S.round + 6} until={S.angry + 8} />
    </>
  );
};

// ---------------------------------------------------------------- 5б. Двое злых → катка проиграна
const Angry: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const anger = ramp(f, b(69), b(71) + 6);
  const loss = pop(f, b(72), fps, 220, 14);
  const vib = anger > 0.5 ? Math.sin(f * 2) * 3 : 0;
  return (
    <>
      <AbsoluteFill style={{height: H, background: `radial-gradient(ellipse at center, rgba(160,20,35,${0.25 + anger * 0.35}), #0b0d18 70%)`}} />
      <svg width={W} height={H} style={{position: 'absolute', transform: `translateX(${vib}px)`}}>
        <Avatar x={290} y={560} r={150} name="АНДРЕЙ" anger={anger} color="#5d9cec" />
        <Avatar x={790} y={560} r={150} name="DIMON" anger={anger} color="#e8b23a" hair="#5a3a22" />
        <path d="M500 480 L560 540 L520 560 L590 640" stroke={COL.r} strokeWidth={14} fill="none" strokeLinejoin="round" opacity={anger} />
      </svg>
      {loss > 0 && (
        <div style={{position: 'absolute', left: 540, top: 600, width: 900, height: 506, transform: `translate(-50%, -50%) scale(${0.6 + 0.4 * loss}) rotate(${(1 - loss) * 6}deg)`,
          opacity: Math.min(1, loss * 2), borderRadius: 24, overflow: 'hidden', border: '4px solid #ff3b47', boxShadow: '0 30px 60px rgba(0,0,0,0.6)'}}>
          <svg width={900} height={506} viewBox="0 0 1600 900"><DefeatView score={[6, 13]} elo={-28} /></svg>
        </div>
      )}
    </>
  );
};

// ---------------------------------------------------------------- 5в. «Отыграться» → он мстит → 4:17
const Revenge: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const found = pop(f, b(77), fps);
  const acceptAt = b(82);
  const gameAt = b(83);
  const click = f >= acceptAt && f < acceptAt + 10 ? (f - acceptAt) / 10 : 0;
  const mv = ramp(f, b(78), acceptAt - 3);
  const cursor: [number, number] = [interpolate(mv, [0, 1], [1250, 820]), interpolate(mv, [0, 1], [760, 530])];
  const clockAt = b(89);
  const zoomClock = ramp(f, clockAt - 4, clockAt + 10);
  const lean = ramp(f, gameAt, gameAt + 20);
  const angerPulse = f >= b(88) ? 1 : lean;
  const s = interpolate(zoomClock, [0, 1], [1.08 + lean * 0.08, 2.6]);
  const ox = interpolate(zoomClock, [0, 1], [W / 2, 180]);
  const oy = interpolate(zoomClock, [0, 1], [MON.y + MON.h / 2, 205]);
  const shake = f >= b(88) && f < b(88) + 12 ? 1 - (f - b(88)) / 12 : 0;
  return (
    <>
      <Cam s={s} x={ox} y={oy} tx={(W / 2 - 180) * zoomClock} ty={(520 - 205) * zoomClock} shake={shake}>
        <Room f={f} mode={f < gameAt ? 'menu' : 'game'} menu={{found, accepted: f >= acceptAt ? 1 : 0, cursor, click, searching: 3}}
          game={{bob: f * 2.2, peek: 0}} tint={angerPulse} lean={lean} click={click}
          clock={f >= clockAt - 2 ? '04:17' : '03:12'} clockGlow={f >= clockAt ? 0.6 + 0.4 * Math.sin(f / 3) : 0} />
      </Cam>
      <RedFlash at={b(88)} len={16} />
    </>
  );
};

// ---------------------------------------------------------------- 6. Что делать: 4 правила
const Rule1: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const door = pop(f, b(102), fps);
  const pause = pop(f, b(103), fps);
  const cross = ramp(f, b(104), b(104) + 8);
  const pulse = f >= b(105) ? 1 + 0.06 * Math.sin((f - b(105)) / 3) : 1;
  return (
    <>
      <Grid />
      <Sticker text="Что делать?" at={b(93)} until={b(95)} />
      <Sticker num="1." text="Правило трёх" at={b(95)} />
      {[98, 99, 100].map((i, k) => <LCard key={i} x={340 + k * 200} y={430} s={pop(f, b(i), fps, 300, 10)} size={150} />)}
      <svg width={W} height={H} style={{position: 'absolute'}}>
        <path d="M540 540 L540 640" stroke="#fff" strokeWidth={8} opacity={door} />
        <path d="M515 620 L540 655 L565 620" stroke="#fff" strokeWidth={8} fill="none" opacity={door} />
      </svg>
      {/* знак выхода */}
      <div style={{position: 'absolute', left: 640, top: 830, transform: `translate(-50%, -50%) scale(${door * pulse})`, opacity: door,
        background: '#17a34a', borderRadius: 22, padding: '22px 40px', display: 'flex', alignItems: 'center', gap: 24, boxShadow: '0 0 50px rgba(30,200,90,0.5)'}}>
        <svg width={100} height={110} viewBox="0 0 100 110">
          <rect x={56} y={6} width={40} height={98} fill="none" stroke="#fff" strokeWidth={7} />
          <circle cx={30} cy={18} r={10} fill="#fff" />
          <path d="M30 32 L20 62 L38 74 L30 104 M24 46 L6 54 M26 44 L48 56 M20 62 L8 86" stroke="#fff" strokeWidth={9} fill="none" strokeLinecap="round" />
        </svg>
        <span style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 64, color: '#fff'}}>ВЫХОД</span>
      </div>
      {/* пауза — перечёркнута */}
      <div style={{position: 'absolute', left: 230, top: 830, transform: `translate(-50%, -50%) scale(${pause})`, opacity: pause, width: 150, height: 150,
        borderRadius: 75, background: '#1c2547', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18}}>
        <div style={{width: 24, height: 70, background: '#8e9ab8', borderRadius: 6}} />
        <div style={{width: 24, height: 70, background: '#8e9ab8', borderRadius: 6}} />
        <div style={{position: 'absolute', width: 170 * cross, height: 12, background: COL.r, transform: 'rotate(-45deg)', borderRadius: 6}} />
      </div>
    </>
  );
};

const IconBubble: React.FC<{x: number; y: number; s: number; label: string; children: React.ReactNode}> = ({x, y, s, label, children}) => (
  <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%, -50%) scale(${s})`, opacity: Math.min(1, s * 2), display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8}}>
    <div style={{width: 150, height: 150, borderRadius: 75, background: 'rgba(12,16,32,0.92)', border: '4px solid #ffd23f', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{children}</div>
    <div style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 30, color: '#fff', textShadow: '0 3px 0 #000'}}>{label}</div>
  </div>
);

const Rule2: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const stand = ramp(f, b(107), b(107) + 18);
  const power = 1 - ramp(f, b(114), b(114) + 10);
  return (
    <>
      <Cam s={1.0}>
        <Room f={f} mode="menu" menu={{}} stand={stand} power={power} clock="" />
      </Cam>
      <Sticker num="2." text="Встань из-за компа" at={S.r2 + 4} />
      <IconBubble x={250} y={990} s={pop(f, b(110), fps)} label="ВОДА">
        <svg width={80} height={90} viewBox="0 0 80 90"><path d="M10 6 L70 6 L62 84 L18 84 Z" fill="none" stroke="#fff" strokeWidth={6} /><path d="M15 40 L65 40 L62 80 L18 80 Z" fill="#5fb8ff" /></svg>
      </IconBubble>
      <IconBubble x={540} y={990} s={pop(f, b(111), fps)} label="СВЕТ">
        <svg width={90} height={90} viewBox="0 0 90 90"><circle cx={45} cy={45} r={18} fill="#ffd23f" />{[0, 45, 90, 135, 180, 225, 270, 315].map((d) => <line key={d} x1={45} y1={14} x2={45} y2={4} stroke="#ffd23f" strokeWidth={6} strokeLinecap="round" transform={`rotate(${d} 45 45)`} />)}</svg>
      </IconBubble>
      <IconBubble x={830} y={990} s={pop(f, b(112), fps)} label="БЕЗ ЭКРАНА">
        <span style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 48, color: '#fff'}}>5:00</span>
      </IconBubble>
    </>
  );
};

const ModeCard: React.FC<{y: number; title: string; sub: string; color: string; s: number; good: number; bad: number}> = ({y, title, sub, color, s, good, bad}) => (
  <div style={{position: 'absolute', left: 540, top: y, width: 800, height: 230, transform: `translate(-50%, -50%) scale(${s * (1 + good * 0.04)})`, opacity: Math.min(1, s * 2) * (1 - bad * 0.45),
    background: 'rgba(16,22,40,0.95)', border: `5px solid ${good > 0 ? '#2bd96b' : bad > 0 ? COL.r : color}`, borderRadius: 28, padding: '34px 44px', boxSizing: 'border-box',
    boxShadow: good > 0 ? `0 0 ${60 * good}px rgba(43,217,107,0.5)` : 'none'}}>
    <div style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 62, color}}>{title}</div>
    <div style={{fontFamily: 'Montserrat', fontWeight: 600, fontSize: 34, color: '#9aa4c0', marginTop: 10}}>{sub}</div>
    {good > 0 && <div style={{position: 'absolute', right: 40, top: 60, width: 110, height: 110, borderRadius: 55, background: '#2bd96b', transform: `scale(${good})`,
      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 70, color: '#fff', fontWeight: 900, fontFamily: 'Montserrat'}}>✓</div>}
    {bad > 0 && <div style={{position: 'absolute', left: 30, top: 108, width: 740 * bad, height: 14, background: COL.r, borderRadius: 7, transform: 'rotate(-8deg)'}} />}
  </div>
);

const Rule3: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <>
      <Grid />
      <Sticker num="3." text="Дэтматч, не рейтинг" at={S.r3 + 4} />
      <ModeCard y={480} title="DEATHMATCH" sub="Разминка · ELO не трогаешь" color="#e8b23a" s={pop(f, b(117), fps)} good={pop(f, b(121), fps)} bad={0} />
      <ModeCard y={790} title="PREMIER" sub="Рейтинг · каждая катка = ELO" color="#5d9cec" s={pop(f, b(119), fps)} good={0} bad={ramp(f, b(125), b(125) + 8)} />
    </>
  );
};

const Rule4: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const mute = ramp(f, b(127), b(127) + 8);
  const before = pop(f, b(129), fps);
  const after = pop(f, b(134), fps);
  const msgs = ['Dimon: ты как бот', 'kirill: ну и тиммейты', 'Dimon: сливай уже', 'xX_pro: удали игру'];
  return (
    <>
      <Grid />
      <Sticker num="4." text="Мут чата" at={S.r4 + 4} />
      <div style={{position: 'absolute', left: 140, top: 330, width: 800, background: 'rgba(8,10,18,0.9)', border: '3px solid #2c3858', borderRadius: 24, padding: 28, boxSizing: 'border-box'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18}}>
          <span style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 34, color: '#8e9ab8'}}>ЧАТ КОМАНДЫ</span>
          <div style={{width: 120, height: 60, borderRadius: 30, background: mute > 0.5 ? COL.r : '#2c3858', position: 'relative'}}>
            <div style={{position: 'absolute', top: 6, left: 6 + mute * 60, width: 48, height: 48, borderRadius: 24, background: '#fff'}} />
          </div>
        </div>
        {msgs.map((m, i) => {
          const show = pop(f, S.r4 + 6 + i * 6, fps);
          return (
            <div key={i} style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 34, color: '#e8b23a', padding: '8px 0', opacity: show * (1 - mute * 0.85),
              filter: `blur(${mute * 8}px)`, transform: `translateX(${(1 - show) * -40}px)`}}>{m.split(':')[0]}:<span style={{color: '#fff'}}>{m.split(':')[1]}</span></div>
          );
        })}
        {mute > 0 && (
          <svg width={170} height={170} viewBox="0 0 100 100" style={{position: 'absolute', left: '50%', top: '58%', transform: `translate(-50%, -50%) scale(${mute})`}}>
            <circle cx={50} cy={50} r={48} fill={COL.r} />
            <path d="M22 40 L34 40 L50 26 L50 74 L34 60 L22 60 Z" fill="#fff" />
            <path d="M60 38 L80 62 M80 38 L60 62" stroke="#fff" strokeWidth={8} strokeLinecap="round" />
          </svg>
        )}
      </div>
      {/* шкала злости: мут до, а не после */}
      <div style={{position: 'absolute', left: 140, top: 860, width: 800}}>
        <div style={{height: 34, borderRadius: 17, background: 'linear-gradient(90deg, #2bd96b, #ffd23f 50%, #ff3b47)'}} />
        <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 30, color: '#9aa4c0', marginTop: 12}}>
          <span>СПОКОЕН</span><span>ЗЛОЙ</span>
        </div>
        <div style={{position: 'absolute', left: 120, top: -100, transform: `translateX(-50%) scale(${before})`, opacity: before, background: '#2bd96b', color: '#fff',
          fontFamily: 'Montserrat', fontWeight: 900, fontSize: 36, padding: '8px 22px', borderRadius: 30}}>ДО ✓</div>
        <div style={{position: 'absolute', left: 690, top: -100, transform: `translateX(-50%) scale(${after})`, opacity: after, background: COL.r, color: '#fff',
          fontFamily: 'Montserrat', fontWeight: 900, fontSize: 36, padding: '8px 22px', borderRadius: 30}}>ПОСЛЕ ✕</div>
      </div>
    </>
  );
};

const Price: React.FC = () => {
  const f = useCurrentFrame();
  const drop = ramp(f, b(138), b(140) + 6);
  const climb = ramp(f, b(141), b(144) + 10);
  const x0 = 150, x1 = 270, x2 = 930, yTop = 470, yLow = 800;
  // ночь: резкое падение; неделя: медленный подъём с колебаниями
  const nightPts = `${x0},${yTop} ${x0 + (x1 - x0) * drop},${yTop + (yLow - yTop) * drop}`;
  const week: string[] = [];
  const N = 28;
  for (let i = 0; i <= Math.round(N * climb); i++) {
    const t = i / N;
    week.push(`${x1 + (x2 - x1) * t},${yLow - (yLow - yTop) * t + Math.sin(i * 1.7) * 18}`);
  }
  const days = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'];
  return (
    <>
      <Grid />
      <Sticker text="Цена одной ночи" at={S.price + 4} />
      <svg width={W} height={H} style={{position: 'absolute'}}>
        <line x1={x0} y1={yTop} x2={x2} y2={yTop} stroke="#3a4a75" strokeWidth={3} strokeDasharray="10 10" />
        <text x={x2} y={yTop - 16} textAnchor="end" fontFamily="Montserrat" fontWeight={900} fontSize={30} fill="#8e9ab8">ELO 1 875</text>
        <polyline points={nightPts} fill="none" stroke={COL.r} strokeWidth={12} strokeLinecap="round" />
        {week.length > 1 && <polyline points={`${x1},${yLow} ${week.join(' ')}`} fill="none" stroke={COL.y} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />}
        <rect x={x0 - 10} y={860} width={x1 - x0 + 20} height={60} rx={12} fill="rgba(255,59,71,0.2)" />
        <text x={(x0 + x1) / 2} y={902} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={30} fill={COL.r}>НОЧЬ</text>
        {days.map((d, i) => (
          <text key={d} x={x1 + 60 + i * 95} y={902} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={30}
            fill={climb * 7 > i ? '#fff' : '#3a4a75'}>{d}</text>
        ))}
      </svg>
      <Tag text="−75 за ночь" x={300} y={700} at={b(139)} color={COL.r} dark={false} />
      <Tag text="+75 за неделю" x={760} y={420} at={b(142)} color={COL.y} />
    </>
  );
};

// ---------------------------------------------------------------- 7. Ложная развязка
const Night: React.FC = () => {
  const f = useCurrentFrame();
  const power = 1 - ramp(f, c(1), c(2) + 4);
  const lamp = f >= c(3) ? 0 : 1;
  return (
    <Cam s={interpolate(f, [S.night, S.bed], [1.05, 1.0], clamp)}>
      <Room f={f} mode="game" game={{bob: f, peek: 0}} power={power} lamp={lamp} clock="04:41" />
    </Cam>
  );
};

const Bed: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const breathe = f >= c(7) ? Math.min(1.2, (f - c(7)) / 40) : 0;
  const ph = c(9);
  const phone = f >= ph ? 1 : 0;
  const buzz = f >= ph ? (Math.floor((f - ph) / 16) % 2 === 0 ? 1 : 0) : 0;
  const notif = pop(f, c(11) - 3, fps, 220, 16);
  const s = interpolate(f, [ph, ph + 40], [1, 1.12], {...clamp, easing: Easing.inOut(Easing.cubic)});
  return (
    <>
      <Cam s={s} x={900} y={790}>
        <BedScene f={f} breathe={breathe} phone={phone} buzz={buzz} />
      </Cam>
      <Rings x={900} y={790} at={ph} color="#9fd0ff" size={170} />
      {/* уведомление на телефоне */}
      <div style={{position: 'absolute', left: 540, top: 330, width: 900, transform: `translate(-50%, ${(1 - notif) * -260}px)`, opacity: notif,
        background: 'rgba(235,240,250,0.96)', borderRadius: 34, padding: '26px 30px', display: 'flex', gap: 24, alignItems: 'center', boxSizing: 'border-box', boxShadow: '0 20px 50px rgba(0,0,0,0.5)'}}>
        <div style={{width: 96, height: 96, borderRadius: 24, background: '#e8b23a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
          <svg width={70} height={46} viewBox="0 0 70 46"><path d="M14 4 H56 C66 4 70 20 68 32 C66 44 56 46 50 36 L44 28 H26 L20 36 C14 46 4 44 2 32 C0 20 4 4 14 4 Z" fill="#1a1a1a" />
            <path d="M16 14 V26 M10 20 H22" stroke="#fff" strokeWidth={4} strokeLinecap="round" /><circle cx={50} cy={16} r={3.5} fill="#fff" /><circle cx={56} cy={23} r={3.5} fill="#fff" /></svg>
        </div>
        <div>
          <div style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 34, color: '#111'}}>Dimon <span style={{fontWeight: 600, color: '#888', fontSize: 28}}>· сейчас</span></div>
          <div style={{fontFamily: 'Montserrat', fontWeight: 600, fontSize: 36, color: '#222', marginTop: 4}}>го ещё одну? нас четверо, нужен пятый</div>
        </div>
      </div>
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
      <div style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 104, color: '#fff', opacity: s1, transform: `scale(${0.8 + 0.2 * s1})`}}>ЕЩЁ ОДНА</div>
      <div style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 104, color: COL.r, opacity: s2, transform: `scale(${0.6 + 0.4 * s2})`, textShadow: '0 0 40px rgba(255,59,71,0.6)'}}>КАТКА?</div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- звук
type Fx = [number, string, number];
const SFX: Fx[] = [
  [2, 'tilt/shot.wav', 0.25], [14, 'tilt/shot.wav', 0.25], [a(6), 'sfx2/deflate.wav', 0.4],
  [a(7), 'sfx2/stamp.wav', 0.45], [a(8), 'sfx2/stamp.wav', 0.45], [a(9), 'sfx2/stamp.wav', 0.5],
  [a(12), 'sfx2/shimmer.wav', 0.3], [a(21), 'sfx2/impact.wav', 0.55],
  [S.stats, 'sfx2/whoosh.wav', 0.4], [b(0), 'sfx2/pop.wav', 0.35], [b(1), 'tilt/heart.wav', 0.4],
  [b(4), 'sfx2/error.wav', 0.3], [b(5), 'sfx2/error.wav', 0.3], [b(6), 'sfx2/error.wav', 0.35], [b(7), 'sfx2/deflate.wav', 0.45],
  [S.decide, 'sfx2/whip.wav', 0.35], [b(19), 'sfx2/pop.wav', 0.35], [b(21), 'sfx2/click.wav', 0.8], [b(21) + 2, 'tilt/accept.wav', 0.35],
  [b(24), 'sfx2/stamp.wav', 0.6], [b(24), 'sfx2/impact.wav', 0.45],
  [S.brain, 'sfx2/whoosh.wav', 0.4], [b(32), 'sfx2/blip.wav', 0.35], [b(37) - 6, 'sfx2/pop.wav', 0.35],
  [b(42), 'sfx2/error.wav', 0.3], [b(42) + 5, 'sfx2/error.wav', 0.3], [b(42) + 10, 'sfx2/error.wav', 0.4],
  [b(44), 'sfx2/blip_low.wav', 0.35], [b(47), 'sfx2/lag.wav', 0.3], [b(52), 'tilt/heart.wav', 0.5], [b(53) + 8, 'tilt/heart.wav', 0.5],
  [S.round, 'sfx2/whip.wav', 0.4], [b(60) - 2, 'tilt/shot.wav', 0.6], [b(60) + 3, 'tilt/shot.wav', 0.5], [b(61), 'tilt/hs.wav', 0.55], [b(61), 'sfx2/hit.wav', 0.5],
  [b(62), 'sfx2/key0.wav', 0.4], [b(62) + 5, 'sfx2/key1.wav', 0.4], [b(62) + 10, 'sfx2/key2.wav', 0.4], [b(62) + 15, 'sfx2/key0.wav', 0.4], [b(62) + 20, 'sfx2/key1.wav', 0.4],
  [b(66), 'sfx2/blip.wav', 0.35],
  [S.angry, 'sfx2/whoosh.wav', 0.4], [b(70), 'tilt/heart.wav', 0.5], [b(72), 'sfx2/impact.wav', 0.6],
  [S.revenge, 'sfx2/whip.wav', 0.35], [b(77), 'tilt/accept.wav', 0.5], [b(82), 'sfx2/click.wav', 0.8],
  [b(83) + 6, 'tilt/shot.wav', 0.35], [b(83) + 12, 'tilt/shot.wav', 0.35], [b(84) + 6, 'tilt/shot.wav', 0.35],
  [b(85), 'tilt/heart.wav', 0.55], [b(87), 'tilt/heart.wav', 0.55], [b(88), 'sfx2/impact.wav', 0.55],
  [b(89) - 4, 'sfx2/whoosh.wav', 0.4], [b(91), 'sfx2/tick.wav', 0.6], [b(91) + 15, 'sfx2/tick.wav', 0.6], [b(92), 'sfx2/tick.wav', 0.6], [b(92) + 15, 'sfx2/tick.wav', 0.6],
  [S.rules, 'sfx2/whoosh.wav', 0.45], [b(93), 'sfx2/pop.wav', 0.4], [b(95), 'sfx2/pop.wav', 0.4],
  [b(98), 'sfx2/stamp.wav', 0.4], [b(99), 'sfx2/stamp.wav', 0.4], [b(100), 'sfx2/stamp.wav', 0.45], [b(102), 'sfx2/ding.wav', 0.35], [b(104), 'sfx2/error.wav', 0.3],
  [S.r2, 'sfx2/whip.wav', 0.35], [b(107), 'sfx2/whoosh.wav', 0.3], [b(110), 'sfx2/pop.wav', 0.35], [b(111), 'sfx2/pop.wav', 0.35], [b(112), 'sfx2/pop.wav', 0.35], [b(114), 'tilt/switch.wav', 0.4],
  [S.r3, 'sfx2/whip.wav', 0.35], [b(121), 'sfx2/ding.wav', 0.4], [b(125), 'sfx2/error.wav', 0.35],
  [S.r4, 'sfx2/whip.wav', 0.35], [b(127), 'tilt/switch.wav', 0.5], [b(129), 'sfx2/ding.wav', 0.3], [b(134), 'sfx2/error.wav', 0.35],
  [S.price, 'sfx2/whoosh.wav', 0.4], [b(138), 'sfx2/deflate.wav', 0.45], [b(141), 'sfx2/riser.wav', 0.25],
  [S.night, 'sfx2/whoosh.wav', 0.3], [c(1), 'sfx2/click.wav', 0.6], [c(3), 'tilt/switch.wav', 0.6],
  [c(9), 'tilt/vibrate.wav', 0.8], [c(9) + 33, 'tilt/vibrate.wav', 0.8], [c(11) - 3, 'tilt/notif.wav', 0.6], [c(14), 'tilt/vibrate.wav', 0.6],
  [S.end, 'sfx2/impact.wav', 0.5], [S.end + 14, 'tilt/heart.wav', 0.6],
];

const Sound: React.FC = () => (
  <>
    {VO.map((v) => (
      <Sequence key={v.src} from={fr(v.at)} durationInFrames={fr(v.dur) + 6}>
        <Audio src={staticFile(v.src)} volume={1} />
      </Sequence>
    ))}
    {Array.from({length: Math.ceil(TOTAL / 11.5)}).map((_, i) => (
      <Sequence key={i} from={Math.round(i * 11.5 * FPS)} durationInFrames={12 * FPS}>
        <Audio src={staticFile('tilt/pad.wav')} volume={(fr2) => (i * 11.5 * FPS + fr2 >= S.end ? 0.05 : 0.13)} />
      </Sequence>
    ))}
    {SFX.map(([at, src, vol], i) => (
      <Sequence key={i} from={Math.max(0, at)} durationInFrames={FPS * 2}>
        <Audio src={staticFile(src)} volume={vol} />
      </Sequence>
    ))}
  </>
);

// ---------------------------------------------------------------- композиция
export const Tilt: React.FC = () => {
  loadFonts();
  return (
    <AbsoluteFill style={{background: '#07090f'}}>
      <Scene from={S.hook} to={S.stats}><Hook /></Scene>
      <Scene from={S.stats} to={S.decide}><Stats /></Scene>
      <Scene from={S.decide} to={S.brain}><Decide /></Scene>
      <Scene from={S.brain} to={S.round}><Brain /></Scene>
      <Scene from={S.round} to={S.angry} zoom={0.15}><Round /></Scene>
      <Scene from={S.angry} to={S.revenge}><Angry /></Scene>
      <Scene from={S.revenge} to={S.rules}><Revenge /></Scene>
      <Scene from={S.rules} to={S.r2}><Rule1 /></Scene>
      <Scene from={S.r2} to={S.r3}><Rule2 /></Scene>
      <Scene from={S.r3} to={S.r4}><Rule3 /></Scene>
      <Scene from={S.r4} to={S.price}><Rule4 /></Scene>
      <Scene from={S.price} to={S.night}><Price /></Scene>
      <Scene from={S.night} to={S.bed}><Night /></Scene>
      <Scene from={S.bed} to={S.end}><Bed /></Scene>
      {/* переход картинки в тёмный низ с субтитрами */}
      <AbsoluteFill style={{top: H - 220, height: 220, background: 'linear-gradient(rgba(7,9,15,0), #07090f)'}} />
      <Captions />
      <EndCard />
      <Sound />
    </AbsoluteFill>
  );
};
