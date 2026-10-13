import React from 'react';
import {AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig, random, Easing} from 'remotion';
import {C, F, loadFonts} from './theme';
import {Flash, GridBg, Gauge, PingBadge, Shake, glitchShadow, useSlam} from './fx';

const Center: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', flexDirection: 'column', ...style}}>{children}</AbsoluteFill>
);

const BigText: React.FC<{text: string; at: number; size?: number; color?: string; glitchFrames?: number}> = ({text, at, size = 150, color = C.white, glitchFrames = 8}) => {
  const f = useCurrentFrame();
  const {scale, opacity} = useSlam(at);
  return (
    <div style={{fontFamily: F.title, fontWeight: 900, fontSize: size, color, transform: `scale(${scale})`, opacity,
      textShadow: glitchShadow(f, f - at >= 0 && f - at < glitchFrames, 14), letterSpacing: -2, lineHeight: 1.05, textAlign: 'center',
      }}>{text}</div>
  );
};

// A: "Я НИ РАЗУ НЕ ИГРАЛ НА FACEIT"
const BeatA: React.FC = () => (
  <Shake at={22} amount={22}>
    <Center>
      <BigText text="Я НИ РАЗУ" at={0} size={130} />
      <div style={{height: 20}} />
      <BigText text="НЕ ИГРАЛ НА" at={22} size={130} />
      <div style={{height: 20}} />
      <BigText text="FACEIT" at={44} size={210} color={C.orange} />
    </Center>
    <Flash at={44} dur={10} color={C.orange} />
  </Shake>
);

// B: empty profile card
const Row: React.FC<{label: string; value: string; at: number; valueColor?: string}> = ({label, value, at, valueColor = C.white}) => {
  const f = useCurrentFrame();
  const x = interpolate(f - at, [0, 12], [80, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  const o = interpolate(f - at, [0, 8], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: 900, padding: '22px 34px', marginTop: 16,
      background: 'rgba(255,255,255,0.05)', borderLeft: `6px solid ${C.orange}`, borderRadius: 12, transform: `translateX(${x}px)`, opacity: o}}>
      <span style={{fontFamily: F.ui, fontWeight: 600, fontSize: 44, color: C.grey}}>{label}</span>
      <span style={{fontFamily: F.title, fontWeight: 900, fontSize: 56, color: valueColor}}>{value}</span>
    </div>
  );
};
const BeatB: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: f, fps, config: {damping: 14}});
  return (
    <Center>
      <div style={{transform: `scale(${interpolate(s, [0, 1], [0.7, 1])}) rotateX(${interpolate(s, [0, 1], [35, 0])}deg)`, opacity: s,
        padding: '40px 50px 50px', background: C.panel, borderRadius: 28, border: '2px solid #2a2a33', boxShadow: `0 0 80px ${C.orange}33`, perspective: 800}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 30, marginBottom: 20}}>
          <div style={{width: 120, height: 120, borderRadius: 20, background: '#1d1d25', border: `3px solid ${C.orange}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: F.title, fontSize: 70, color: C.orange}}>?</div>
          <div style={{fontFamily: F.title, fontWeight: 900, fontSize: 60, color: C.white}}>ПРОФИЛЬ FACEIT</div>
        </div>
        <Row label="МАТЧЕЙ" value="0" at={18} />
        <Row label="УРОВЕНЬ" value="НЕТ РАНГА" at={34} valueColor={C.grey} />
        <Row label="ELO" value="—" at={50} />
      </div>
    </Center>
  );
};

// C: ping meter 20 -> 150
const BeatC: React.FC = () => {
  const f = useCurrentFrame();
  const v = Math.round(interpolate(f, [10, 120], [20, 150], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.in(Easing.cubic)}));
  const hit = 120;
  const color = v < 60 ? C.green : v < 100 ? C.yellow : C.red;
  const {scale} = useSlam(hit, 1.6);
  const jitter = f > hit ? (random(`pj${Math.floor(f / 4)}`) > 0.8 ? 14 : 0) : 0;
  return (
    <Shake at={hit} amount={30} dur={20}>
      <Center>
        <div style={{fontFamily: F.ui, fontWeight: 900, fontSize: 56, color: C.grey, letterSpacing: 8, marginBottom: 10}}>МОЙ ПИНГ</div>
        <div style={{display: 'flex', alignItems: 'flex-end', gap: 20, transform: `scale(${f >= hit ? scale : 1}) translateX(${jitter}px)`}}>
          <div style={{fontFamily: F.title, fontWeight: 900, fontSize: 300, color, lineHeight: 1, textShadow: glitchShadow(f, f >= hit && f < hit + 40, 22)}}>{v}</div>
          <div style={{fontFamily: F.title, fontWeight: 900, fontSize: 110, color: C.white, marginBottom: 30}}>MS</div>
        </div>
        <div style={{display: 'flex', gap: 14, marginTop: 30}}>
          {Array.from({length: 15}).map((_, i) => (
            <div key={i} style={{width: 46, height: 26, borderRadius: 6, background: i < v / 10 ? color : '#22222a', boxShadow: i < v / 10 ? `0 0 14px ${color}` : 'none'}} />
          ))}
        </div>
      </Center>
      <Flash at={hit} dur={12} color={C.red} />
    </Shake>
  );
};

// D: 10 calibration slots
const BeatD: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Center>
      <BigText text="10 ИГР" at={0} size={200} />
      <div style={{fontFamily: F.title, fontWeight: 900, fontSize: 90, color: C.orange, marginTop: 6, opacity: interpolate(f, [16, 24], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}}>КАЛИБРОВКИ</div>
      <div style={{display: 'flex', gap: 22, marginTop: 60}}>
        {Array.from({length: 10}).map((_, i) => {
          const at = 40 + i * 9;
          const sc = interpolate(f - at, [0, 6, 10], [0, 1.25, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
          return (
            <div key={i} style={{width: 110, height: 110, borderRadius: 18, border: `4px solid ${C.orange}`, background: 'rgba(255,85,0,0.08)', transform: `scale(${sc})`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: F.title, fontSize: 44, color: C.white}}>{i + 1}</div>
          );
        })}
      </div>
    </Center>
  );
};

// E: roulette of levels -> "?"
const lvlColor = (n: number) => (n <= 1 ? '#eeeeee' : n <= 3 ? C.green : n <= 7 ? C.yellow : n <= 9 ? C.orange : C.red);
const BeatE: React.FC = () => {
  const f = useCurrentFrame();
  // decelerating roulette: switch times grow
  let t = 0, step = 3, idx = 0;
  while (t + step <= f && t < 150) { t += step; step = Math.min(step * 1.18, 30); idx++; }
  const stopped = t >= 150;
  const n = (idx * 7) % 10 + 1;
  const showQ = stopped;
  const color = showQ ? C.grey : lvlColor(n);
  const pulse = showQ ? 1 + 0.04 * Math.sin((f - 150) / 5) : 1;
  return (
    <Shake at={150} amount={16}>
      <Center>
        <div style={{fontFamily: F.ui, fontWeight: 900, fontSize: 58, color: C.white, marginBottom: 30, letterSpacing: 2}}>КАКОЙ УРОВЕНЬ МНЕ ДАДУТ?</div>
        <div style={{transform: `scale(${pulse})`}}>
          <Gauge fill={showQ ? 0 : n / 10} color={color} size={440}>
            <div style={{fontFamily: F.title, fontWeight: 900, fontSize: 200, color: showQ ? C.white : color, textShadow: glitchShadow(f, showQ && f < 175, 16)}}>{showQ ? '?' : n}</div>
          </Gauge>
        </div>
      </Center>
      <Flash at={150} dur={10} />
    </Shake>
  );
};

// F: teaser words, hard cuts
const words: [string, string][] = [['КЛАТЧИ', C.white], ['ФЕЙЛЫ', C.red], ['ОВЕРТАЙМ', C.orange], ['НЕРВЫ', C.red]];
const BeatF: React.FC = () => {
  const f = useCurrentFrame();
  const i = Math.min(3, Math.floor(f / 60));
  const local = f - i * 60;
  const [w, col] = words[i];
  const rot = (random(`r${i}`) - 0.5) * 8;
  return (
    <Shake at={i * 60} amount={26} dur={12}>
      <Center>
        <div style={{transform: `rotate(${rot}deg) scale(${interpolate(local, [0, 6, 60], [1.8, 1, 1.12], {extrapolateRight: 'clamp'})})`,
          fontFamily: F.title, fontWeight: 900, fontSize: 230, color: col, textShadow: glitchShadow(f, local < 8, 18)}}>{w}</div>
      </Center>
      <Flash at={i * 60} dur={7} />
    </Shake>
  );
};

// G: title card
const BeatG: React.FC = () => {
  const f = useCurrentFrame();
  const out = interpolate(f, [230, 270], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const gl = f > 230;
  return (
    <AbsoluteFill style={{opacity: out}}>
      <Shake at={14} amount={20}>
        <Center>
          <div style={{fontFamily: F.ui, fontWeight: 900, fontSize: 56, color: C.grey, letterSpacing: 10, opacity: interpolate(f, [0, 10], [0, 1], {extrapolateRight: 'clamp'})}}>ПУТЬ ДО 10 LVL FACEIT</div>
          <div style={{height: 10}} />
          <div style={{textShadow: glitchShadow(f, gl, 30)}}><BigText text="КАЛИБРОВКА" at={14} size={190} /></div>
          <div style={{display: 'flex', gap: 40, alignItems: 'center', marginTop: 40, opacity: interpolate(f, [40, 52], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}}>
            <div style={{fontFamily: F.title, fontWeight: 900, fontSize: 70, color: C.orange}}>ВЫПУСК #1</div>
            <PingBadge value={150} scale={0.9} glitch={gl} />
          </div>
        </Center>
      </Shake>
      <Flash at={14} dur={10} color={C.orange} />
    </AbsoluteFill>
  );
};

// slow camera push-in so no beat is static
const PushIn: React.FC<{dur: number; children: React.ReactNode}> = ({dur, children}) => {
  const f = useCurrentFrame();
  const sc = interpolate(f, [0, dur], [1, 1.08]);
  return <AbsoluteFill style={{transform: `scale(${sc})`}}>{children}</AbsoluteFill>;
};

export const INTRO_BEATS = [
  {from: 0, dur: 150, C: BeatA},
  {from: 150, dur: 180, C: BeatB},
  {from: 330, dur: 210, C: BeatC},
  {from: 540, dur: 240, C: BeatD},
  {from: 780, dur: 240, C: BeatE},
  {from: 1020, dur: 240, C: BeatF},
  {from: 1260, dur: 270, C: BeatG},
];
export const INTRO_FRAMES = 1530;

export const Intro: React.FC<{transparent?: boolean}> = ({transparent}) => {
  loadFonts();
  const f = useCurrentFrame();
  const accent = f >= 330 && f < 540 ? C.red : C.orange;
  return (
    <AbsoluteFill style={{background: transparent ? 'transparent' : C.bg}}>
      {!transparent && <GridBg accent={accent} speed={f >= 1020 && f < 1260 ? 3 : 1} />}
      {INTRO_BEATS.map(({from, dur, C: Beat}, i) => (
        <Sequence key={i} from={from} durationInFrames={dur}>
          <PushIn dur={dur}><Beat /></PushIn>
        </Sequence>
      ))}
      {INTRO_BEATS.slice(1).map(({from}, i) => <Sequence key={`fl${i}`} from={from} durationInFrames={10}><Flash at={0} dur={8} /></Sequence>)}
    </AbsoluteFill>
  );
};
