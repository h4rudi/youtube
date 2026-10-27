// Ролик «Кейсы с 2015 года» (9:16, ~59 с): Лёха копил кейсы, Димон открывал. Герои — Лёха v2 и Димон (Лёхина голова + кепка).
// Исходники пользователя: три кейса (public/cases15/c_*.png, фон вырезан) и график цены «за всё время» (chart.png).
// Инвентарь со стопками кейсов и ник — нарисованы.
import React from 'react';
import {AbsoluteFill, Audio, Img, Sequence, interpolate, random, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {loadFonts} from '../theme';
import {FPS, fr} from '../tilt/script';
import {VO, TOTAL, CUES, v} from './script';
import {Captions, clamp, pop} from '../tilt/UI';
import {Scene, Cam, Flash} from '../money/Money';
import {ramp} from '../tilt/Tilt';
import {H, RED} from '../money/Props';
import {LyokhaHead, Mood} from '../money/Lyokha';
import {Roulette} from '../cases/Rig';

export const CASES15_FRAMES = fr(TOTAL);

const S = {
  hook: 0, open: v(16) - 4, lazy: v(31) - 4, years: v(46) - 4, gone: v(49) - 4, price: v(76) - 4,
  result: v(87) - 4, twist: v(103) - 4, warn: v(115) - 4, ask: v(137) - 4, end: fr(56.95),
};
const GOLD = '#ffd23f', GREEN = '#2bd96b', STEAM = '#1b2838';
const CASES = ['cases15/c_csgo.png', 'cases15/c_breakout.png', 'cases15/c_falchion.png'];

const Bg: React.FC<{glow?: string}> = ({glow = '#2a4a8a'}) => (
  <AbsoluteFill style={{height: H, backgroundColor: '#0b0c12', backgroundImage: `radial-gradient(ellipse at 50% 35%, ${glow}55, #0b0c12 70%), radial-gradient(rgba(120,150,230,0.1) 2px, transparent 2px)`, backgroundSize: 'auto, 44px 44px'}} />
);
const Big: React.FC<{x: number; y: number; s: number; size: number; color?: string; children: React.ReactNode}> = ({x, y, s, size, color = '#fff', children}) => (
  <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%, -50%) scale(${s})`, opacity: Math.min(1, s * 2), fontFamily: 'Montserrat', fontWeight: 900, fontSize: size,
    color, whiteSpace: 'nowrap', textAlign: 'center', lineHeight: 1.05, textShadow: color === '#fff' ? '0 4px 0 rgba(0,0,0,0.6)' : `0 0 34px ${color}88, 0 4px 0 rgba(0,0,0,0.6)`}}>{children}</div>
);
const Chip: React.FC<{x: number; y: number; s: number; bg: string; color?: string; size?: number; children: React.ReactNode}> = ({x, y, s, bg, color = '#fff', size = 40, children}) => (
  <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%, -50%) scale(${s})`, opacity: Math.min(1, s * 2), background: bg, color, fontFamily: 'Montserrat', fontWeight: 900,
    fontSize: size, padding: '12px 30px', borderRadius: 50, whiteSpace: 'nowrap', boxShadow: `0 0 30px ${bg}88`}}>{children}</div>
);
const CaseImg: React.FC<{i: number; w: number}> = ({i, w}) => <Img src={staticFile(CASES[i % 3])} style={{width: w, display: 'block'}} />;

// голова героя: Лёха или Димон (та же голова + красная кепка)
const Head: React.FC<{who: 'lyokha' | 'dimon'; size: number; mood?: Mood}> = ({who, size, mood = 'neutral'}) => (
  <svg width={size} height={size} viewBox="-200 -230 400 400" style={{overflow: 'visible'}}>
    <LyokhaHead mood={mood} />
    {who === 'dimon' && (
      <g>
        <path d="M-128 -120 C -128 -230, 128 -230, 128 -120 Z" fill="#d23a3a" stroke="#15131a" strokeWidth={6} />
        <path d="M-10 -122 L 190 -122 C 190 -104, 150 -96, -10 -100 Z" fill="#a82828" stroke="#15131a" strokeWidth={6} />
        <circle cx={0} cy={-212} r={9} fill="#a82828" stroke="#15131a" strokeWidth={4} />
      </g>
    )}
  </svg>
);

// инвентарь со стопками кейсов (нарисован) + ник
const Inventory: React.FC<{nick: string; count: number; glow?: number}> = ({nick, count, glow = 0}) => (
  <div style={{position: 'absolute', left: 40, top: 220, width: 1000, background: `linear-gradient(160deg, #2a3446, ${STEAM} 40%, #141a24)`, borderRadius: 18, padding: 30, boxSizing: 'border-box', fontFamily: 'Montserrat', boxShadow: '0 30px 70px rgba(0,0,0,0.6)'}}>
    <div style={{display: 'flex', alignItems: 'center', gap: 18, marginBottom: 20}}>
      <div style={{width: 64, height: 64, border: '3px solid #5a6a2a', overflow: 'hidden', background: '#1a2030'}}><svg width={64} height={64} viewBox="-200 -230 400 400"><LyokhaHead mood="happy" /></svg></div>
      <div style={{fontSize: 40, color: '#fff', fontWeight: 600}}>{nick}</div>
      <div style={{marginLeft: 'auto', fontSize: 30, color: '#8f98a0'}}>Инвентарь</div>
    </div>
    <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14}}>
      {Array.from({length: 8}).map((_, i) => {
        const show = i < count;
        const n = 6 + Math.floor(random(`inv${i}`) * 20);
        return (
          <div key={i} style={{aspectRatio: '1.3', background: show ? 'linear-gradient(#2a3140, #171c26)' : 'rgba(255,255,255,0.03)', borderRadius: 10, border: show ? `2px solid ${glow > 0 ? `rgba(255,210,63,${glow})` : '#3a4556'}` : '2px dashed #2a3140',
            display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', boxShadow: show && glow > 0 ? `0 0 ${20 * glow}px ${GOLD}66` : 'none'}}>
            {show && <CaseImg i={Math.floor(random(`ci${i}`) * 3)} w={150} />}
            {show && <div style={{position: 'absolute', right: 8, bottom: 6, fontSize: 24, fontWeight: 900, color: '#fff', textShadow: '0 2px 4px #000'}}>×{n}</div>}
          </div>
        );
      })}
    </div>
  </div>
);

// ---------------------------------------------------------------- сцены
const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <>
      <Bg glow="#1a3a6a" />
      <div style={{position: 'absolute', left: 540, top: 150, transform: 'translate(-50%,-50%)'}}><Chip x={0} y={0} s={pop(f, 2, fps)} bg={GOLD} color="#111" size={54}>2015 ГОД</Chip></div>
      <div style={{position: 'absolute', left: 0, top: 0, width: 540, height: H, borderRight: '2px solid #2a3244'}}>
        <div style={{position: 'absolute', left: 270, top: 420, transform: 'translate(-50%,-50%)'}}><Head who="lyokha" size={240} mood="neutral" /></div>
        <Chip x={270} y={620} s={pop(f, 4, fps)} bg="#1c2030" size={38}>ЛЁХА</Chip>
        <div style={{position: 'absolute', left: 270, top: 820, transform: 'translate(-50%,-50%)', display: 'flex', gap: 8}}>{[0, 1, 2].map((i) => <CaseImg key={i} i={i} w={120} />)}</div>
      </div>
      <div style={{position: 'absolute', right: 0, top: 0, width: 540, height: H}}>
        <div style={{position: 'absolute', left: 270, top: 420, transform: 'translate(-50%,-50%)'}}><Head who="dimon" size={240} mood="happy" /></div>
        <Chip x={270} y={620} s={pop(f, 4, fps)} bg="#1c2030" size={38}>ДИМОН</Chip>
        <div style={{position: 'absolute', left: 270, top: 820, transform: 'translate(-50%,-50%)', display: 'flex', gap: 8}}>{[0, 1, 2].map((i) => <CaseImg key={i} i={i} w={120} />)}</div>
      </div>
      {f >= v(12) && <Chip x={540} y={1050} s={pop(f, v(12), fps)} bg="#1c2030" size={44}>одни и те же кейсы · по 2 ₽</Chip>}
    </>
  );
};

const Opening: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const spin = ((f - S.open) * 0.1) % 1;
  const spent = Math.floor(ramp(f, S.open, v(30)) * 40) * 50;
  return (
    <>
      <Bg glow="#2a1a3a" />
      <Chip x={540} y={120} s={pop(f, S.open, fps)} bg="#1c2030" size={42}>ДИМОН ОТКРЫВАЛ ВСЁ</Chip>
      <Roulette p={spin} result="blue" seed={`d${Math.floor((f - S.open) / 7)}`} y={300} />
      <div style={{position: 'absolute', left: 540, top: 700, transform: 'translate(-50%,-50%)', textAlign: 'center', fontFamily: 'Montserrat'}}>
        <div style={{fontSize: 30, fontWeight: 600, color: '#8f98a0'}}>потрачено на ключи</div>
        <div style={{fontFamily: 'Russo One', fontSize: 100, color: RED}}>{spent.toLocaleString('ru-RU')} ₽</div>
      </div>
      {f >= v(26) && <Big x={540} y={960} s={pop(f, v(26), fps, 320, 9)} size={70} color={RED}>НОЖА НЕТ</Big>}
    </>
  );
};

const Lazy: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <>
      <Bg glow="#1a3a4a" />
      <Chip x={540} y={120} s={pop(f, S.lazy, fps)} bg="#1c2030" size={42}>А ЛЁХА БЫЛ ЛЕНИВЫЙ</Chip>
      <Inventory nick="lyokha_2015" count={Math.min(8, Math.floor(ramp(f, v(38), v(43)) * 8) + 1)} glow={f >= v(43) ? 0.5 + 0.5 * Math.sin(f / 5) : 0} />
      <div style={{position: 'absolute', left: 540, top: 1000, transform: 'translate(-50%,-50%)'}}><Head who="lyokha" size={170} mood="tired" /></div>
      {f >= v(44) && <Chip x={540} y={830} s={pop(f, v(44), fps)} bg="#1c2030" size={40}>…в инвентарь и забыл 😴</Chip>}
    </>
  );
};

const Years: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const yr = Math.round(interpolate(f, [S.years, v(48)], [2015, 2025], clamp));
  return (
    <>
      <Bg glow="#2a2a3a" />
      <Big x={540} y={440} s={pop(f, S.years, fps)} size={70} color="#fff">ПРОШЛО 10 ЛЕТ</Big>
      <div style={{position: 'absolute', left: 540, top: 620, transform: 'translate(-50%,-50%)', fontFamily: 'Russo One', fontSize: 180, color: GOLD, textShadow: `0 0 40px ${GOLD}66`}}>{yr}</div>
    </>
  );
};

const Gone: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = ramp(f, S.gone, v(75));
  return (
    <>
      <Bg glow="#3a1a1a" />
      <Chip x={540} y={120} s={pop(f, S.gone, fps)} bg="#1c2030" size={38}>ЭТИ КЕЙСЫ БОЛЬШЕ НЕ ДЕЛАЮТ</Chip>
      <div style={{position: 'absolute', left: 0, top: 320, width: 1080, height: 440}}>
        {Array.from({length: 24}).map((_, i) => {
          const gone = i / 24 > (1 - t);
          return (
            <div key={i} style={{position: 'absolute', left: 90 + (i % 6) * 160, top: 40 + Math.floor(i / 6) * 110, opacity: gone ? 0.06 : 1, transform: `scale(${gone ? 0.7 : 1})`}}><CaseImg i={i} w={120} /></div>
          );
        })}
      </div>
      <div style={{position: 'absolute', left: 540, top: 850, transform: 'translate(-50%,-50%)', textAlign: 'center', fontFamily: 'Montserrat'}}>
        <div style={{fontSize: 30, fontWeight: 600, color: '#8f98a0'}}>кейсов на рынке</div>
        <div style={{width: 700, height: 34, borderRadius: 17, background: '#1c2030', marginTop: 14, overflow: 'hidden'}}><div style={{width: `${(1 - t * 0.95) * 100}%`, height: 34, background: RED}} /></div>
      </div>
      {f >= v(62) && <Big x={540} y={1050} s={pop(f, v(62), fps, 320, 9)} size={60} color={RED}>ИСЧЕЗЛИ НАВСЕГДА</Big>}
    </>
  );
};

const Price: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const z = interpolate(f, [S.price, v(84)], [1, 1.15], clamp);
  const mult = Math.round(interpolate(f, [v(84), v(86) + 10], [1, 50], clamp));
  return (
    <>
      <Bg glow="#1a3a2a" />
      <Chip x={540} y={120} s={pop(f, S.price, fps)} bg="#1c2030" size={40}>ГРАФИК ЗА ВСЁ ВРЕМЯ</Chip>
      <Cam s={z} y={500}>
        <Img src={staticFile('cases15/chart.png')} style={{position: 'absolute', left: 40, top: 300, width: 1000, borderRadius: 14, boxShadow: '0 30px 60px rgba(0,0,0,0.6)'}} />
      </Cam>
      <div style={{position: 'absolute', left: 540, top: 760, transform: 'translate(-50%,-50%)', display: 'flex', alignItems: 'center', gap: 24, fontFamily: 'Russo One'}}>
        <span style={{fontSize: 70, color: '#8f98a0'}}>2 ₽</span>
        <span style={{fontSize: 50, color: '#8f98a0'}}>→</span>
        <span style={{fontSize: 120, color: GREEN, textShadow: `0 0 30px ${GREEN}`}}>×{mult}</span>
      </div>
      {f >= v(84) && <Chip x={540} y={980} s={pop(f, v(84), fps)} bg={GREEN} color="#06260f" size={40}>в десятки раз дороже</Chip>}
    </>
  );
};

const Result: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <>
      <Bg glow="#2a2a3a" />
      <div style={{position: 'absolute', left: 0, top: 0, width: 540, height: H, background: 'rgba(60,16,22,0.3)', borderRight: '2px solid #2a3244'}}>
        <div style={{position: 'absolute', left: 270, top: 360, transform: 'translate(-50%,-50%)'}}><Head who="dimon" size={220} mood="worried" /></div>
        <Chip x={270} y={560} s={pop(f, S.result, fps)} bg="#1c2030" size={36}>ДИМОН</Chip>
        <div style={{position: 'absolute', left: 270, top: 720, transform: 'translate(-50%,-50%)', textAlign: 'center', fontFamily: 'Montserrat', fontWeight: 900, color: RED, fontSize: 36, lineHeight: 1.4}}>− деньги<br />на ключи<br />+ синька</div>
      </div>
      <div style={{position: 'absolute', right: 0, top: 0, width: 540, height: H, background: 'rgba(16,60,30,0.3)'}}>
        <div style={{position: 'absolute', left: 270, top: 360, transform: 'translate(-50%,-50%)'}}><Head who="lyokha" size={220} mood="happy" /></div>
        <Chip x={270} y={560} s={pop(f, S.result, fps)} bg="#1c2030" size={36}>ЛЁХА</Chip>
        <div style={{position: 'absolute', left: 270, top: 720, transform: 'translate(-50%,-50%)', textAlign: 'center', fontFamily: 'Montserrat', fontWeight: 900, color: GREEN, fontSize: 40, lineHeight: 1.4}}>ничего<br />не делал<br />+ в плюсе</div>
      </div>
      {f >= v(95) && <Big x={540} y={1060} s={pop(f, v(95), fps, 320, 9)} size={52} color="#fff">ЛЁХА В ПЛЮСЕ</Big>}
    </>
  );
};

const Twist: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const arrow = ramp(f, v(103), v(109));
  return (
    <>
      <Bg glow="#2a1a3a" />
      <Big x={540} y={160} s={pop(f, S.twist, fps)} size={54} color={GOLD}>САМОЕ СМЕШНОЕ</Big>
      <div style={{position: 'absolute', left: 220, top: 500, transform: 'translate(-50%,-50%)', textAlign: 'center'}}>
        <Head who="dimon" size={200} mood="worried" />
        <div style={{display: 'flex', gap: 6, justifyContent: 'center', marginTop: 10}}>{[0, 1].map((i) => <CaseImg key={i} i={i} w={90} />)}</div>
      </div>
      <div style={{position: 'absolute', left: 860, top: 500, transform: 'translate(-50%,-50%)', textAlign: 'center'}}>
        <Head who="lyokha" size={200} mood="happy" />
        <div style={{fontFamily: 'Russo One', fontSize: 50, color: GREEN, marginTop: 10}}>+ ₽</div>
      </div>
      <svg width={1080} height={200} viewBox="0 0 1080 200" style={{position: 'absolute', left: 0, top: 420}}>
        <path d={`M 320 80 Q 540 20 ${320 + arrow * 440} 80`} fill="none" stroke={GOLD} strokeWidth={8} strokeDasharray="12 10" opacity={arrow} />
        {arrow > 0.95 && <path d="M 748 66 L 772 80 L 748 94 Z" fill={GOLD} />}
      </svg>
      {f >= v(110) && <Chip x={540} y={900} s={pop(f, v(110), fps)} bg={RED} size={40}>это Димон сделал их редкими</Chip>}
    </>
  );
};

const Warn: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <>
      <Bg glow="#3a2a1a" />
      <Big x={540} y={200} s={pop(f, S.warn, fps)} size={54} color="#fff">НО НЕ СПЕШИ СКУПАТЬ</Big>
      <div style={{position: 'absolute', left: 540, top: 500, width: 900, transform: `translate(-50%,-50%) scale(${pop(f, v(120), fps)})`, background: '#121722', border: `3px solid ${RED}`, borderRadius: 24, padding: 36, boxSizing: 'border-box', fontFamily: 'Montserrat'}}>
        <div style={{fontSize: 40, fontWeight: 900, color: RED}}>📉 Новые кейсы дешевеют</div>
        <div style={{fontSize: 36, fontWeight: 900, color: GREEN, marginTop: 20}}>📈 Растут только убранные из игры</div>
      </div>
      {f >= v(131) && <Big x={540} y={820} s={pop(f, v(131), fps, 320, 9)} size={56} color={GOLD}>УГАДАТЬ НЕЛЬЗЯ</Big>}
    </>
  );
};

const End: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (f < S.end) return null;
  const m = pop(f, S.end, fps, 320, 9), p = pop(f, S.end + 8, fps);
  return (
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, #1a3a2a, #0b0c12 70%)', alignItems: 'center', justifyContent: 'center', paddingBottom: 240, textAlign: 'center'}}>
      <div style={{display: 'flex', gap: 10, transform: `scale(${0.6 + 0.4 * m})`, opacity: Math.min(1, m * 2)}}>{[0, 1, 2].map((i) => <CaseImg key={i} i={i} w={180} />)}</div>
      <div style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 64, color: '#fff', marginTop: 30, opacity: p, lineHeight: 1.05}}>А У ТЕБЯ ОСТАЛИСЬ<br />СТАРЫЕ КЕЙСЫ?</div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- звук (тихие эффекты, без фонового гула)
type Fx = [number, string, number];
const SFX: Fx[] = [
  [2, 'sfx2/pop.wav', 0.3], [v(12), 'sfx2/blip.wav', 0.3],
  ...Array.from({length: 6}).map((_, i): Fx => [S.open + i * 7, 'sfx2/tick.wav', 0.25]), [v(26), 'sfx2/error.wav', 0.3],
  [S.lazy, 'sfx2/whoosh.wav', 0.3], [S.years, 'sfx2/riser.wav', 0.3],
  [v(62), 'sfx2/deflate.wav', 0.35], [v(84), 'sfx2/ding.wav', 0.35],
  [S.result, 'sfx2/whoosh.wav', 0.3], [v(110), 'sfx2/stamp.wav', 0.3], [v(120), 'sfx2/blip.wav', 0.3],
  [S.end, 'money/cash.wav', 0.35],
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

export const Cases15: React.FC = () => {
  loadFonts();
  const order: [number, number, React.FC, boolean?][] = [
    [S.hook, S.open, Hook], [S.open, S.lazy, Opening, true], [S.lazy, S.years, Lazy, true], [S.years, S.gone, Years, true],
    [S.gone, S.price, Gone, true], [S.price, S.result, Price, true], [S.result, S.twist, Result, true], [S.twist, S.warn, Twist, true], [S.warn, S.end, Warn, true],
  ];
  return (
    <AbsoluteFill style={{background: '#0b0c12'}}>
      {order.map(([from, to, C, cut], i) => <Scene key={i} from={from} to={to} cut={cut}><C /></Scene>)}
      <Flash at={v(46)} len={12} color="rgba(255,210,63,0.3)" />
      <Flash at={v(84)} len={10} color="rgba(60,200,120,0.35)" />
      <AbsoluteFill style={{top: H - 220, height: 220, background: 'linear-gradient(rgba(11,12,18,0), #0b0c12)'}} />
      <Captions cues={CUES} />
      <End />
      <Sound />
    </AbsoluteFill>
  );
};
