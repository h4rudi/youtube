// TikTok-ролик «Ты открываешь 100 кейсов» (9:16, ~81 с). Герой — Лёха v2. Шансы — официальные вероятности Valve
// (синие ≈80%, фиолетовые ≈16%, розовые ≈3,2%, красные ≈0,64%, нож/перчатки ≈0,26%).
import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig, Easing, random} from 'remotion';
import {loadFonts} from '../theme';
import {FPS, fr} from '../tilt/script';
import {VO, TOTAL, CUES, v} from './script';
import {Captions, clamp, pop} from '../tilt/UI';
import {ramp} from '../tilt/Tilt';
import {Scene, Cam, Flash} from '../money/Money';
import {Portrait, W, H, RED} from '../money/Props';
import {Mood} from '../money/Lyokha';
import {Roulette, Grid100, Facecam, DiscordCard, CaseIcon, KeyIcon, KnifeIcon, RAR, RAR_NAME, Rar, ORDER, SORTED} from './Rig';

export const CASES_FRAMES = fr(TOTAL);

const S = {
  hook: 0, saved: v(9) - 4, goal: v(16) - 4, open3: v(20) - 4, tenth: v(32) - 4, almost: v(39) - 4, thirty: v(44) - 4, fifty: v(52) - 4,
  thought: v(56) - 4, trap: v(65) - 4, odds: v(83) - 4, quarter: v(91) - 4, hundred: v(102) - 4, result: v(106) - 4, sell: v(118) - 4,
  time: v(130) - 4, close: v(135) - 4, discord: v(142) - 4, buy: v(154) - 4, end: v(165) - 4,
};

const ease = Easing.out(Easing.cubic);
type Spin = {start: number; end: number; result: Rar; n: number; near?: boolean};
const SPINS: Spin[] = [
  {start: v(20), end: v(22), result: 'blue', n: 1},
  {start: v(22) + 4, end: v(26), result: 'blue', n: 2},
  {start: v(26) + 4, end: v(29), result: 'purple', n: 3},
  {start: S.tenth + 2, end: v(36) + 6, result: 'blue', n: 10, near: true},
  {start: S.thirty + 2, end: v(46), result: 'pink', n: 30},
  {start: S.fifty + 2, end: v(55), result: 'blue', n: 50},
  {start: S.hundred + 2, end: v(105), result: 'blue', n: 100},
];

const Bg: React.FC<{glow?: string}> = ({glow = '#3a4a8a'}) => (
  <AbsoluteFill style={{height: H, background: `radial-gradient(ellipse at 50% 35%, ${glow}55, #0b0c12 70%)`,
    backgroundImage: `radial-gradient(ellipse at 50% 35%, ${glow}55, #0b0c12 70%), radial-gradient(rgba(120,150,230,0.12) 2px, transparent 2px)`, backgroundSize: 'auto, 44px 44px'}} />
);

const Big: React.FC<{x: number; y: number; s: number; size: number; color?: string; children: React.ReactNode}> = ({x, y, s, size, color = '#fff', children}) => (
  <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%, -50%) scale(${s})`, opacity: Math.min(1, s * 2), fontFamily: 'Montserrat', fontWeight: 900, fontSize: size,
    color, whiteSpace: 'nowrap', textAlign: 'center', textShadow: color === '#fff' ? '0 4px 0 rgba(0,0,0,0.6)' : `0 0 30px ${color}88, 0 4px 0 rgba(0,0,0,0.6)`, lineHeight: 1.05}}>{children}</div>
);

const Chip: React.FC<{x: number; y: number; s: number; text: string; bg: string; color?: string; size?: number}> = ({x, y, s, text, bg, color = '#fff', size = 40}) => (
  <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%, -50%) scale(${s})`, opacity: Math.min(1, s * 2), background: bg, color, fontFamily: 'Montserrat',
    fontWeight: 900, fontSize: size, padding: '12px 30px', borderRadius: 60, whiteSpace: 'nowrap', boxShadow: `0 0 34px ${bg}88`}}>{text}</div>
);

// ---------------------------------------------------------------- стол открытия: рулетка + сетка + вебка
const RigScene: React.FC<{spins: Spin[]; mood: (f: number) => Mood; extra?: React.ReactNode; tears?: number}> = ({spins, mood, extra, tears = 0}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const cur = [...spins].reverse().find((s) => f >= s.start) ?? spins[0];
  const p = ease(Math.max(0, Math.min(1, (f - cur.start) / (cur.end - cur.start))));
  const done = f >= cur.end;
  const filled = cur.n - 1 + (done ? 1 : 0);
  const cells = ORDER.slice(0, filled);
  const chip = pop(f, cur.end, fps);
  const res = cur.result;
  return (
    <>
      <Bg glow={done ? RAR[res] : '#3a4a8a'} />
      <Chip x={540} y={150} s={1} text={`КЕЙС ${cur.n} / 100`} bg="#1c2030" size={38} />
      <Roulette p={p} result={res} seed={`s${cur.n}`} nearMiss={cur.near} done={done} />
      {done && <Chip x={540} y={545} s={chip} text={RAR_NAME[res]} bg={RAR[res]} size={34} />}
      <Grid100 cells={cells} x={70} y={640} size={38} />
      <Facecam x={800} y={860} r={190} mood={mood(f)} look={done ? 0 : -0.3} sweat={mood(f) === 'worried'} tears={tears} ring={done ? RAR[res] : '#ffd23f'} />
      {extra}
    </>
  );
};

// ---------------------------------------------------------------- сцены
const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <>
      <Cam s={interpolate(f, [0, S.saved], [1.0, 1.1], clamp)} y={700}>
        <Portrait f={f} bg="dorm" mood="shocked" scale={1.35} y={980} />
      </Cam>
      {/* сыплются кейсы */}
      <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
        {Array.from({length: 26}).map((_, i) => {
          const d = random(`hk${i}`) * 30;
          const y = -120 + (f - d) * (9 + random(`hs${i}`) * 5);
          if (f < d || y > H) return null;
          const x = random(`hx${i}`) * 1000;
          return <g key={i} transform={`translate(${x}, ${y}) rotate(${Math.sin((f + i * 7) / 9) * 30})`}><CaseIcon w={110} /></g>;
        })}
      </svg>
      <Big x={540} y={250} s={pop(f, 4, fps, 300, 10)} size={170} color="#ffd23f">×100</Big>
      {f >= v(6) && (
        <div style={{position: 'absolute', left: 540, top: 470, transform: `translate(-50%, -50%) scale(${pop(f, v(6), fps)})`, display: 'flex', alignItems: 'center', gap: 20}}>
          <KnifeIcon w={360} glow />
          <span style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 140, color: '#fff', textShadow: '0 4px 0 #000'}}>?</span>
        </div>
      )}
    </>
  );
};

const Card: React.FC<{x: number; s: number; label: string; children: React.ReactNode}> = ({x, s, label, children}) => (
  <div style={{position: 'absolute', left: x, top: 330, width: 300, height: 290, transform: `translate(-50%, -50%) scale(${s})`, opacity: Math.min(1, s * 2), background: 'rgba(14,16,26,0.94)',
    border: '4px solid #ffd23f', borderRadius: 28, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14}}>
    {children}
    <div style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 40, color: '#fff'}}>{label}</div>
  </div>
);

const Saved: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const months = Math.round(ramp(f, v(10), v(11) + 14) * 6);
  return (
    <>
      <Portrait f={f} bg="dorm" mood="neutral" scale={1.3} y={1000} look={0.2} />
      <Card x={200} s={pop(f, v(10), fps)} label="ПОЛГОДА">
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 50px)', gap: 8}}>
          {Array.from({length: 6}).map((_, i) => <div key={i} style={{width: 50, height: 50, borderRadius: 10, background: i < months ? '#ffd23f' : '#2a2f42'}} />)}
        </div>
      </Card>
      <Card x={540} s={pop(f, v(12), fps)} label="×100"><CaseIcon w={170} /></Card>
      <Card x={880} s={pop(f, v(14), fps)} label="×100"><KeyIcon w={170} /></Card>
    </>
  );
};

const Goal: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = pop(f, S.goal + 2, fps, 200, 14);
  return (
    <>
      <Bg glow={RAR.gold} />
      <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
        {[300, 230, 160].map((r, i) => <circle key={i} cx={540} cy={560} r={r * (0.9 + 0.1 * s)} fill="none" stroke={RAR.gold} strokeWidth={6} opacity={0.25 + i * 0.2} strokeDasharray={i === 0 ? '30 20' : undefined}
          transform={`rotate(${f * (i % 2 ? -1 : 1)} 540 560)`} />)}
      </svg>
      <div style={{position: 'absolute', left: 540, top: 560, transform: `translate(-50%, -50%) scale(${s}) rotate(${Math.sin(f / 15) * 4}deg)`}}><KnifeIcon w={720} glow /></div>
      <Chip x={540} y={220} s={pop(f, v(16), fps)} text="ЦЕЛЬ: НОЖ" bg={RAR.gold} color="#1a1407" size={52} />
    </>
  );
};

const Almost: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const bar = ramp(f, v(41), v(43) + 10);
  return (
    <>
      <Cam s={interpolate(f, [S.almost, S.thirty], [1.05, 1.15], clamp)} y={700}>
        <Portrait f={f} bg="dorm" mood={f < v(41) ? 'shocked' : 'happy'} look={0.5} scale={1.45} />
      </Cam>
      <div style={{position: 'absolute', left: 140, top: 230, width: 800, opacity: pop(f, v(41) - 4, fps)}}>
        <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 42, color: '#fff', textShadow: '0 3px 0 #000'}}>
          <span>ДО НОЖА</span><span style={{color: RAR.gold}}>«ПОЧТИ»</span>
        </div>
        <div style={{height: 34, borderRadius: 17, background: '#1c2030', marginTop: 12, border: '3px solid #2c3350'}}>
          <div style={{height: '100%', width: `${bar * 94}%`, background: RAR.gold, borderRadius: 17, boxShadow: `0 0 20px ${RAR.gold}`}} />
        </div>
      </div>
    </>
  );
};

const Thought: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const b = pop(f, v(56), fps);
  return (
    <>
      <Cam s={interpolate(f, [S.thought, S.trap], [1.0, 1.1], clamp)} y={760}>
        <Portrait f={f} bg="dorm" mood="neutral" look={-0.4} scale={1.4} y={900} light="#6a8cff" lightAmt={0.12} />
      </Cam>
      <div style={{position: 'absolute', left: 540, top: 260, transform: `translate(-50%, -50%) scale(${b})`, opacity: b, background: '#fff', color: '#11131a', borderRadius: 40,
        padding: '26px 36px', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 44, textAlign: 'center', width: 900, boxSizing: 'border-box'}}>
        «Я ДОЛГО НЕ ВЫБИВАЛ —<br /><span style={{color: '#c4232d'}}>СЛЕДУЮЩИЙ ТОЧНО МОЙ</span>»
        <div style={{position: 'absolute', left: 426, bottom: -26, borderLeft: '24px solid transparent', borderRight: '24px solid transparent', borderTop: '30px solid #fff'}} />
      </div>
    </>
  );
};

const Trap: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const labels = ['№1', '№2', '№50', '№99', '№100'];
  const ats = [v(69), v(71), v(74), v(76), v(77)];
  const same = f >= v(78) ? 0.5 + 0.5 * Math.sin((f - v(78)) / 4) : 0;
  return (
    <>
      <Bg glow="#8a1f2a" />
      <Chip x={540} y={170} s={pop(f, v(68), fps, 300, 10)} text="ЛОВУШКА" bg={RED} size={56} />
      <Big x={540} y={330} s={pop(f, v(69), fps)} size={50}>КЕЙС НЕ ПОМНИТ ПРОШЛЫЕ</Big>
      {labels.map((l, i) => {
        const s = pop(f, ats[i], fps);
        return (
          <div key={l} style={{position: 'absolute', left: 140 + i * 200, top: 600, width: 180, height: 280, transform: `translate(-50%, -50%) scale(${s})`, opacity: Math.min(1, s * 2),
            background: 'rgba(14,16,26,0.95)', borderRadius: 22, border: `4px solid ${same > 0 ? `rgba(255,210,63,${0.4 + same * 0.6})` : '#2c3350'}`,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10}}>
            <div style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 34, color: '#9aa4c0'}}>{l}</div>
            <CaseIcon w={120} />
            <div style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 32, color: RAR.gold}}>1 к 400</div>
          </div>
        );
      })}
      <Big x={540} y={880} s={pop(f, v(78), fps)} size={48} color="#ffd23f">КАЖДЫЙ РАЗ — КАК ПЕРВЫЙ</Big>
    </>
  );
};

const Odds: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const shown = Math.round(ramp(f, S.odds, v(87)) * 400);
  const goldIdx = 273;
  const blink = f >= v(88) ? 0.5 + 0.5 * Math.sin((f - v(88)) / 3) : 0;
  return (
    <>
      <Bg />
      <Big x={540} y={160} s={pop(f, v(87), fps, 300, 10)} size={110} color={RAR.gold}>1 К 400</Big>
      <div style={{position: 'absolute', left: 140, top: 260, display: 'grid', gridTemplateColumns: 'repeat(20, 34px)', gap: 6}}>
        {Array.from({length: 400}).map((_, i) => (
          <div key={i} style={{width: 34, height: 34, borderRadius: 8, background: i === goldIdx && f >= v(88) ? RAR.gold : i < shown ? '#3a4466' : '#151a28',
            boxShadow: i === goldIdx && f >= v(88) ? `0 0 ${20 + blink * 30}px ${RAR.gold}` : 'none', transform: i === goldIdx && f >= v(88) ? `scale(${1 + blink * 0.4})` : 'none'}} />
        ))}
      </div>
    </>
  );
};

const Quarter: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const fill = ramp(f, v(95), v(96) + 12) * 0.23;
  return (
    <>
      <Bg />
      <Chip x={540} y={170} s={pop(f, v(91), fps)} text="100 КЕЙСОВ" bg="#1c2030" size={44} />
      {[0, 1, 2, 3].map((i) => (
        <div key={i} style={{position: 'absolute', left: 105 + i * 220, top: 330, width: 200, height: 380, borderRadius: 24, border: '5px solid #2c3350', background: '#141827', overflow: 'hidden',
          opacity: pop(f, v(92) + i * 3, fps)}}>
          {i === 0 && <div style={{position: 'absolute', bottom: 0, width: '100%', height: `${fill * 100}%`, background: RAR.gold, boxShadow: `0 0 30px ${RAR.gold}`}} />}
        </div>
      ))}
      <Big x={210} y={770} s={pop(f, v(96), fps)} size={56} color={RAR.gold}>≈23%</Big>
      <Big x={540} y={900} s={pop(f, v(97), fps)} size={64}>МЕНЬШЕ <span style={{color: RED}}>1 ИЗ 4</span></Big>
    </>
  );
};

const Result: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const n = (at: number, cnt: number, len: number) => Math.round(ramp(f, at, at + len) * cnt);
  const filled = n(v(107), 80, 20) + n(v(109), 16, 10) + n(v(111), 3, 6) + n(v(113), 1, 2);
  const cells = SORTED.slice(0, filled);
  const gold = pop(f, v(115), fps);
  const chips: [number, string, Rar][] = [[v(107), '80', 'blue'], [v(109), '16', 'purple'], [v(111), '3', 'pink'], [v(113), '1', 'red'], [v(115), '0', 'gold']];
  return (
    <>
      <Bg />
      <Chip x={540} y={140} s={pop(f, v(106), fps)} text="ИТОГ" bg="#1c2030" size={48} />
      <Grid100 cells={cells} x={130} y={210} size={66} gap={8} highlightGold={gold} pulse={0.5 + 0.5 * Math.sin(f / 5)} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 1000, display: 'flex', justifyContent: 'center', gap: 20}}>
        {chips.map(([at, t, c]) => {
          const s = pop(f, at, fps);
          return <div key={c} style={{transform: `scale(${s})`, opacity: Math.min(1, s * 2), background: RAR[c], color: c === 'gold' ? '#1a1407' : '#fff', fontFamily: 'Montserrat', fontWeight: 900,
            fontSize: 46, minWidth: 110, textAlign: 'center', padding: '10px 18px', borderRadius: 20, textDecoration: c === 'gold' ? 'line-through' : 'none'}}>{t}</div>;
        })}
      </div>
    </>
  );
};

const Sell: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const spent = pop(f, v(119), fps);
  const back = ramp(f, v(125), v(127) + 14) * 0.24;
  return (
    <>
      <Bg glow="#5a1f2a" />
      <Chip x={540} y={170} s={pop(f, S.sell + 4, fps)} text="ПРОДАЛ ВСЁ" bg="#1c2030" size={44} />
      {[['ПОТРАТИЛ', spent, RED], ['ВЕРНУЛ', back, RAR.gold]].map(([l, w, c], i) => (
        <div key={l as string} style={{position: 'absolute', left: 140, top: 300 + i * 190, width: 800}}>
          <div style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 44, color: '#fff', marginBottom: 14}}>{l}</div>
          <div style={{height: 70, borderRadius: 20, background: '#141827', border: '4px solid #2c3350'}}>
            <div style={{height: '100%', width: `${(w as number) * 100}%`, background: c as string, borderRadius: 16, boxShadow: `0 0 26px ${c}`}} />
          </div>
        </div>
      ))}
      <Facecam x={540} y={900} r={170} mood="worried" look={-0.6} sweat tears={ramp(f, v(127), v(129) + 10) * 0.7} ring={RED} />
    </>
  );
};

const Time: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <>
      <Bg />
      <div style={{position: 'absolute', left: 290, top: 520, transform: `translate(-50%, -50%) scale(${pop(f, v(130), fps)})`, textAlign: 'center'}}>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 80px)', gap: 12, justifyContent: 'center'}}>
          {['ЯНВ', 'ФЕВ', 'МАР', 'АПР', 'МАЙ', 'ИЮН'].map((m) => <div key={m} style={{height: 80, borderRadius: 14, background: '#ffd23f', color: '#1a1407', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 24, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{m}</div>)}
        </div>
        <div style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 56, color: '#fff', marginTop: 20}}>ПОЛГОДА</div>
      </div>
      <Big x={540} y={500} s={pop(f, v(132) - 4, fps)} size={90} color="#9aa4c0">→</Big>
      <div style={{position: 'absolute', left: 800, top: 520, transform: `translate(-50%, -50%) scale(${pop(f, v(132), fps, 300, 10)})`, textAlign: 'center'}}>
        <div style={{width: 230, height: 230, borderRadius: 115, border: `10px solid ${RED}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 80, color: '#fff', boxShadow: `0 0 40px ${RED}66`}}>40</div>
        <div style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 56, color: RED, marginTop: 20}}>МИНУТ</div>
      </div>
    </>
  );
};

const Close: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const shut = ramp(f, v(137), v(137) + 10);
  const stop = f >= v(138);
  const ban = pop(f, v(139), fps);
  return (
    <>
      <Cam s={1.05} y={760} shake={stop ? Math.max(0, 1 - (f - v(138)) / 12) : 0}>
        <Portrait f={f} bg="dorm" mood={stop ? 'neutral' : 'tired'} scale={1.35} y={1000} />
      </Cam>
      {shut < 1 && (
        <div style={{position: 'absolute', left: 540, top: 330, width: 820, height: 340, transform: `translate(-50%, -50%) scale(${1 - shut * 0.6})`, opacity: 1 - shut, background: '#1b2838',
          borderRadius: 20, border: '4px solid #2a475e', overflow: 'hidden', fontFamily: 'Montserrat'}}>
          <div style={{height: 64, background: '#171d25', display: 'flex', alignItems: 'center', padding: '0 24px', color: '#c7d5e0', fontWeight: 900, fontSize: 30}}>
            STEAM · МАГАЗИН <span style={{marginLeft: 'auto', background: f >= v(137) - 3 ? RED : 'transparent', padding: '2px 16px', borderRadius: 8}}>✕</span>
          </div>
          <div style={{display: 'flex', gap: 20, padding: 30}}>{[0, 1, 2].map((i) => <div key={i} style={{flex: 1, height: 200, background: '#2a475e', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><CaseIcon w={130} /></div>)}</div>
        </div>
      )}
      {ban > 0 && (
        <div style={{position: 'absolute', left: 540, top: 330, transform: `translate(-50%, -50%) scale(${ban})`, width: 300, height: 300, borderRadius: 150, border: `18px solid ${RED}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(10,11,16,0.85)'}}>
          <CaseIcon w={180} />
          <div style={{position: 'absolute', width: 300, height: 18, background: RED, transform: 'rotate(-45deg)'}} />
        </div>
      )}
    </>
  );
};

const Discord: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <>
      <Portrait f={f} bg="dorm" mood={f >= v(150) ? 'shocked' : 'neutral'} scale={1.35} y={1000} look={0.4} />
      <AbsoluteFill style={{height: H, background: 'rgba(0,0,0,0.35)'}} />
      <DiscordCard appear={pop(f, v(146) - 2, fps)} img={pop(f, v(150), fps)} />
    </>
  );
};

const Buy: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const mv = ramp(f, v(158) - 6, v(161));
  const cx = interpolate(mv, [0, 1], [880, 600]), cy = interpolate(mv, [0, 1], [300, 760]);
  const hover = mv > 0.9 ? 0.5 + 0.5 * Math.sin(f / 3) : 0;
  const zoom = interpolate(ramp(f, v(163) - 2, v(164) + 10), [0, 1], [1, 1.35]);
  return (
    <>
      <Cam s={zoom} x={540} y={760}>
        <Bg glow="#1f6a33" />
        <div style={{position: 'absolute', left: 540, top: 450, transform: 'translate(-50%, -50%)', width: 880, background: '#1b2838', borderRadius: 30, border: '4px solid #2a475e',
          padding: 36, boxSizing: 'border-box', fontFamily: 'Montserrat', textAlign: 'center'}}>
          <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 30}}><CaseIcon w={240} /><span style={{fontSize: 70, color: '#fff', fontWeight: 900}}>+</span><KeyIcon w={200} /></div>
          <div style={{fontSize: 44, fontWeight: 900, color: '#fff', marginTop: 20}}>КЕЙС + КЛЮЧ</div>
          <div style={{fontSize: 30, fontWeight: 600, color: '#8f98a0', marginTop: 8}}>Шанс на нож: 0,26%</div>
        </div>
        <div style={{position: 'absolute', left: 540, top: 760, transform: `translate(-50%, -50%) scale(${1 + hover * 0.05})`, background: '#4c9a2a', color: '#fff', fontFamily: 'Montserrat',
          fontWeight: 900, fontSize: 64, padding: '26px 70px', borderRadius: 24, whiteSpace: 'nowrap', border: `5px solid rgba(255,255,255,${0.3 + hover * 0.7})`, boxShadow: `0 0 ${40 + hover * 40}px rgba(90,200,60,0.6)`}}>КУПИТЬ ЕЩЁ</div>
        <svg width={60} height={80} viewBox="0 0 60 80" style={{position: 'absolute', left: cx, top: cy}}>
          <path d="M0 0 L0 56 L14 42 L26 68 L36 63 L24 38 L44 38 Z" fill="#fff" stroke="#000" strokeWidth={3} strokeLinejoin="round" />
        </svg>
      </Cam>
      <Facecam x={890} y={1010} r={140} mood="worried" look={-0.8} light={RED} lightAmt={0.15} ring={RED} />
    </>
  );
};

const End: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (f < S.end) return null;
  const a = pop(f, S.end + 2, fps), b = pop(f, S.end + 10, fps, 300, 10), c = pop(f, S.end + 18, fps);
  const q = pop(f, S.end + 30, fps), btn = pop(f, S.end + 46, fps);
  const line = (txt: string, s: number, color: string) => (
    <div style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 104, color, opacity: Math.min(1, s * 2), transform: `scale(${0.7 + 0.3 * s})`, lineHeight: 1.08,
      textShadow: color === RED ? `0 0 40px ${RED}88` : 'none'}}>{txt}</div>
  );
  return (
    <AbsoluteFill style={{background: '#000', alignItems: 'center', justifyContent: 'center', paddingBottom: 280, textAlign: 'center'}}>
      {line('100 КЕЙСОВ', a, '#fff')}
      {line('0 НОЖЕЙ', b, RED)}
      {line('40 МИНУТ', c, '#fff')}
      <div style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 52, color: '#fff', marginTop: 60, opacity: q, transform: `translateY(${(1 - q) * 20}px)`}}>А СКОЛЬКО ОТКРЫЛ ТЫ?</div>
      <div style={{marginTop: 34, background: RED, color: '#fff', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 36, padding: '14px 36px', borderRadius: 50,
        opacity: btn, transform: `scale(${0.6 + 0.4 * btn})`}}>ПИШИ В КОММЕНТАРИЯХ</div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- звук
type Fx = [number, string, number];
// щелчки рулетки: по одному на каждый проехавший предмет (обратная функция easeOut-cubic)
const ticks = (s: Spin): Fx[] => Array.from({length: 30}).map((_, k): Fx => {
  const pk = (k + 1) / 31;
  const t = 1 - Math.pow(1 - pk, 1 / 3);
  return [Math.round(s.start + (s.end - s.start) * t), 'sfx2/tick.wav', 0.35];
});
const resultFx = (s: Spin): Fx[] => {
  const m: Record<Rar, Fx[]> = {
    blue: [[s.end, 'sfx2/blip_low.wav', 0.4]], purple: [[s.end, 'sfx2/blip.wav', 0.45]],
    pink: [[s.end, 'sfx2/shimmer.wav', 0.5], [s.end, 'sfx2/ding.wav', 0.4]], red: [[s.end, 'sfx2/ding.wav', 0.5]], gold: [[s.end, 'money/win.wav', 0.5]], empty: [],
  };
  return [...m[s.result], ...(s.near ? [[s.end + 2, 'sfx2/deflate.wav', 0.5] as Fx] : [])];
};
const SFX: Fx[] = [
  ...Array.from({length: 10}).map((_, i): Fx => [Math.round(random(`hk${i * 2}`) * 30) + 8, 'sfx2/stamp.wav', 0.25]), [4, 'money/boom.wav', 0.5], [v(6), 'sfx2/shimmer.wav', 0.35],
  [S.saved, 'sfx2/whoosh.wav', 0.35], [v(10), 'sfx2/pop.wav', 0.4], [v(12), 'sfx2/pop.wav', 0.4], [v(14), 'sfx2/pop.wav', 0.4],
  [S.goal, 'sfx2/riser.wav', 0.3], [S.goal + 2, 'money/win.wav', 0.35],
  ...SPINS.flatMap((s) => [...ticks(s), ...resultFx(s)]),
  [S.almost, 'sfx2/whoosh.wav', 0.3], [v(41), 'tilt/heart.wav', 0.4], [S.thought, 'sfx2/whip.wav', 0.3], [v(56), 'sfx2/pop.wav', 0.4],
  [v(68), 'money/boom.wav', 0.5], [v(68), 'sfx2/stamp.wav', 0.45], ...[69, 71, 74, 76, 77].map((i): Fx => [v(i), 'sfx2/pop.wav', 0.35]), [v(78), 'sfx2/shimmer.wav', 0.3],
  [S.odds, 'sfx2/riser.wav', 0.25], [v(87), 'sfx2/stamp.wav', 0.5], [v(88), 'sfx2/ding.wav', 0.35],
  [S.quarter, 'sfx2/whoosh.wav', 0.3], [v(95), 'sfx2/blip.wav', 0.35], [v(97), 'sfx2/error.wav', 0.35],
  [S.result, 'sfx2/whoosh.wav', 0.35], ...[107, 109, 111, 113].map((i): Fx => [v(i), 'sfx2/pop.wav', 0.4]), [v(115), 'sfx2/error.wav', 0.45], [v(115), 'money/boom.wav', 0.4],
  [v(119), 'sfx2/pop.wav', 0.35], [v(125), 'sfx2/deflate.wav', 0.45],
  [v(130), 'sfx2/pop.wav', 0.35], [v(132), 'sfx2/stamp.wav', 0.45],
  [v(137), 'sfx2/click.wav', 0.8], [v(138), 'sfx2/impact.wav', 0.5], [v(139), 'sfx2/stamp.wav', 0.45],
  [v(146) - 2, 'tilt/notif.wav', 0.55], [v(150), 'money/win.wav', 0.4],
  [v(158) - 6, 'tilt/heart.wav', 0.4], [v(160), 'tilt/heart.wav', 0.45], [v(162), 'tilt/heart.wav', 0.5], [v(163), 'sfx2/riser.wav', 0.3],
  [S.end, 'money/boom.wav', 0.5], [S.end + 2, 'sfx2/stamp.wav', 0.4], [S.end + 10, 'sfx2/stamp.wav', 0.45], [S.end + 18, 'sfx2/stamp.wav', 0.4], [S.end + 46, 'sfx2/pop.wav', 0.4],
];
const GAIN = 0.55; // эффекты тише голоса (как после правки «Миллиона за катку»)

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

export const Cases: React.FC = () => {
  loadFonts();
  const rig = (spins: Spin[], mood: (f: number) => Mood, extra?: (f: number) => React.ReactNode) => () => {
    const f = useCurrentFrame();
    return <RigScene spins={spins} mood={mood} extra={extra?.(f)} />;
  };
  const order: [number, number, React.FC, boolean?][] = [
    [S.hook, S.saved, Hook], [S.saved, S.goal, Saved], [S.goal, S.open3, Goal],
    [S.open3, S.tenth, rig(SPINS.slice(0, 3), (f) => (f >= v(29) ? 'happy' : 'neutral')), true],
    [S.tenth, S.almost, rig([SPINS[3]], (f) => (f >= v(36) ? 'shocked' : 'neutral')), true],
    [S.almost, S.thirty, Almost],
    [S.thirty, S.fifty, rig([SPINS[4]], (f) => (f >= v(46) ? 'happy' : 'neutral'), (f) => f >= v(49) ? (
      <div style={{position: 'absolute', left: 800, top: 625, transform: `translate(-50%, -50%) scale(${Math.min(1, (f - v(49)) / 6)})`, background: '#2bd96b', color: '#fff', fontFamily: 'Montserrat',
        fontWeight: 900, fontSize: 38, padding: '10px 26px', borderRadius: 40}}>УДАЧА ↑</div>) : null), true],
    [S.fifty, S.thought, rig([SPINS[5]], () => 'tired'), true],
    [S.thought, S.trap, Thought], [S.trap, S.odds, Trap], [S.odds, S.quarter, Odds], [S.quarter, S.hundred, Quarter],
    [S.hundred, S.result, rig([SPINS[6]], (f) => (f >= v(105) ? 'worried' : 'tired')), true],
    [S.result, S.sell, Result], [S.sell, S.time, Sell], [S.time, S.close, Time], [S.close, S.discord, Close],
    [S.discord, S.buy, Discord], [S.buy, S.end, Buy, true],
  ];
  return (
    <AbsoluteFill style={{background: '#07090f'}}>
      {order.map(([from, to, C, cut], i) => <Scene key={i} from={from} to={to} cut={cut}><C /></Scene>)}
      <Flash at={SPINS[4].end} len={14} color="rgba(211,44,230,0.45)" />
      <Flash at={v(68)} len={14} />
      <Flash at={v(115)} len={14} />
      <Flash at={v(138)} len={12} />
      <AbsoluteFill style={{top: H - 220, height: 220, background: 'linear-gradient(rgba(7,9,15,0), #07090f)'}} />
      <Captions cues={CUES} />
      <End />
      <Sound />
    </AbsoluteFill>
  );
};
