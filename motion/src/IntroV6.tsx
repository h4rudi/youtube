// Интро v6 (~25 с): синий фон, шрифт Zero Cool (глобус — прежний), палитра под синий.
// Основа — v5. Интро v5 (~25 с): волна букв, чёрные тени, звук текста пользователя, пинг из v3.
// Основа — v4: анимированный красный фон пользователя, шрифт Benzin Bold, 3D-ассеты,
// эффекты @remotion/effects (shine, vignette), пинг-сцена «пакет до сервера», звук на каждое действие
import React from 'react';
import {AbsoluteFill, Img, Sequence, Freeze, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing, Audio, random, continueRender, delayRender} from 'remotion';
import {Video} from '@remotion/media';
import {shine} from '@remotion/effects/shine';
import {vignette} from '@remotion/effects/vignette';
import {loadFonts} from './theme';
import {Globe} from './Globe';
import {B6, Thumb} from './IntroV2';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const C = {white: '#f4f8ff', red: '#ff3b4e', deep: '#04122b', orange: '#ff6a13', green: '#35e07a', yellow: '#ffc83a', grey: '#a9c3e6', cyan: '#7fd8ff'};
const FONT = 'ZeroCool';

let benzin = false;
const loadBenzin = () => {
  if (benzin || typeof document === 'undefined') return; benzin = true;
  const h = delayRender('benzin');
  new FontFace(FONT, `url(${staticFile('fonts/ZeroCool.otf')})`).load().then((l) => { document.fonts.add(l); continueRender(h); });
};

const pop = (f: number, at: number, fps: number, stiffness = 240, damping = 12) => spring({frame: f - at, fps, config: {damping, stiffness, mass: 0.6}});

// stacked text-shadow extrusion: face -> side gradient c1->c2, then soft drop shadow
const extrude = (depth: number, c1: string, c2: string, dx = 0.7, dy = 1.25) => {
  const hex = (c: string, i: number) => parseInt(c.slice(1 + i * 2, 3 + i * 2), 16);
  const L: string[] = [];
  for (let i = 1; i <= depth; i++) {
    const t = i / depth; const m = (k: number) => Math.round(hex(c1, k) * (1 - t) + hex(c2, k) * t);
    L.push(`${(i * dx).toFixed(1)}px ${(i * dy).toFixed(1)}px 0 rgb(${m(0)},${m(1)},${m(2)})`);
  }
  L.push(`${depth * dx + 8}px ${depth * dy + 18}px 30px rgba(0,0,0,0.55)`);
  return L.join(',');
};

const Center: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', ...style}}>{children}</AbsoluteFill>
);

// ---------- background: user's animated loop + vignette + punch zoom on hits
const Bg: React.FC<{hits: number[]}> = ({hits}) => {
  const f = useCurrentFrame();
  let bump = 0;
  for (const h of hits) { const d = f - h; if (d >= 0 && d < 20) bump += 0.05 * Math.exp(-d / 5); }
  return (
    <AbsoluteFill style={{background: '#04122b', overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `scale(${1.06 + bump + 0.02 * Math.sin(f / 90)}) rotate(${Math.sin(f / 140) * 0.6}deg)`}}>
        <Video src={staticFile('img/bg_blue.mp4')} loop muted effects={[vignette({amount: 0.75, radius: 0.55, feather: 0.5})]} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Shake: React.FC<{hits: number[]; amount?: number; children: React.ReactNode}> = ({hits, amount = 16, children}) => {
  const f = useCurrentFrame(); let k = 0;
  for (const h of hits) { const d = f - h; if (d >= 0 && d < 14) k += (1 - d / 14) * amount; }
  return <AbsoluteFill style={{transform: `translate(${(random(`x${f}`) - 0.5) * 2 * k}px,${(random(`y${f}`) - 0.5) * 2 * k}px)`}}>{children}</AbsoluteFill>;
};

// scene wrapper: quick zoom-in on enter, zoom-through + fade on exit
const Scene: React.FC<{dur: number; children: React.ReactNode}> = ({dur, children}) => {
  const f = useCurrentFrame();
  const inT = interpolate(f, [0, 10], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const outT = interpolate(f, [dur - 12, dur], [0, 1], {...clamp, easing: Easing.in(Easing.cubic)});
  return <AbsoluteFill style={{opacity: inT * (1 - outT), transform: `scale(${0.92 + 0.08 * inT + outT * 0.5})`, filter: outT > 0 ? `blur(${outT * 12}px)` : undefined}}>{children}</AbsoluteFill>;
};

// ---------- wave text: letters rise one after another (no tilt), black extrusion
const BLACK = (d: number) => extrude(d, '#262626', '#000000');
const WaveWord: React.FC<{text: string; at: number; size: number; face?: string; step?: number}> = ({text, at, size, face = C.white, step = 2.2}) => {
  const f = useCurrentFrame();
  return (
    <div style={{display: 'flex', fontFamily: FONT, fontSize: size, lineHeight: 1.05, whiteSpace: 'pre'}}>
      {text.split('').map((ch, i) => {
        const t = interpolate(f - at - i * step, [0, 20], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
        const bob = Math.sin((f - at - i * step) / 7) * 6 * Math.exp(-Math.max(0, f - at - i * step - 14) / 22) * t;
        return (
          <span key={i} style={{display: 'inline-block', color: face, textShadow: BLACK(14), opacity: t,
            transform: `translateY(${(1 - t) * 70 + bob}px) scale(${0.85 + 0.15 * t})`, filter: t < 1 ? `blur(${(1 - t) * 10}px)` : undefined}}>{ch}</span>
        );
      })}
    </div>
  );
};

// 3D image with Remotion shine sweep
const ShinyImg: React.FC<{src: string; width: number; shineAt: number; style?: React.CSSProperties}> = ({src, width, shineAt, style}) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [shineAt, shineAt + 40], [0, 1], clamp);
  return <Img src={staticFile(src)} style={{width, ...style}} effects={[shine({progress: p, angle: 25, coreIntensity: 0.65, haloIntensity: 0.35})]} />;
};

// ---------- S1 (0-230): НИКОГДА / НЕ ИГРАЛ / ФЕЙСИТ + 3D FACEIT
const S1: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const logo = pop(f, 72, fps, 200, 10);
  return (
    <Center>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14}}>
        <WaveWord text="НИКОГДА" at={4} size={150} />
        <WaveWord text="НЕ ИГРАЛ" at={22} size={120} face={C.cyan} />
        <div style={{display: 'flex', alignItems: 'center', gap: 34}}>
          <WaveWord text="ФЕЙСИТ" at={40} size={150} face={C.orange} />
          <div style={{transform: `scale(${logo}) rotate(${(1 - logo) * -70}deg) translateY(${Math.sin(f / 13) * 7}px)`, opacity: logo > 0.02 ? 1 : 0}}>
            <ShinyImg src="img/faceit_3d.png" width={250} shineAt={92} style={{filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.6))'}} />
          </div>
        </div>
      </div>
    </Center>
  );
};

// ---------- S2 (230-430): Нет ранга -> 10 LVL, 2000 ELO
const S2: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const q = pop(f, 2, fps);
  const draw = interpolate(f, [16, 44], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const lv = pop(f, 42, fps, 190, 10);
  const elo = Math.round(interpolate(f, [50, 105], [0, 2000], {...clamp, easing: Easing.out(Easing.cubic)}));
  return (
    <Center>
      <div style={{display: 'flex', alignItems: 'center', gap: 30}}>
        <div style={{transform: `scale(${q}) rotate(${(1 - q) * -10}deg)`}}>
          <Img src={staticFile('img/norank_plate.png')} style={{width: 820, borderRadius: 20, boxShadow: '0 24px 50px rgba(0,0,0,0.6)', border: '2px solid #2c4f86'}} />
        </div>
        <svg width={220} height={80}>
          <line x1={10} y1={40} x2={10 + 160 * draw} y2={40} stroke={C.white} strokeWidth={9} strokeDasharray="22 14" strokeDashoffset={-f * 4} strokeLinecap="round" />
          {draw > 0.98 && <polygon points="172,12 210,40 172,68" fill={C.white} />}
        </svg>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4}}>
          <div style={{transform: `scale(${lv}) rotateY(${interpolate(lv, [0, 1], [-540, 0])}deg)`, opacity: lv > 0.02 ? 1 : 0}}>
            <ShinyImg src="img/lvl10_3d.png" width={380} shineAt={70} style={{filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.6))'}} />
          </div>
          <div style={{fontFamily: FONT, fontSize: 66, color: C.white, textShadow: BLACK(9), opacity: interpolate(f, [50, 56], [0, 1], clamp)}}>
            {elo} <span style={{fontSize: 38}}>ELO</span>
          </div>
        </div>
      </div>
    </Center>
  );
};

// ---------- S3: ping from intro v3 — net graph, bars dropping, LAG freeze, slam 150 with crack
const PingScene: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  // ping value follows a jittery rising curve
  const base = interpolate(f, [10, 120], [18, 150], {...clamp, easing: Easing.in(Easing.quad)});
  const jitter = f < 120 ? (random(`pv${Math.floor(f / 3)}`) - 0.5) * base * 0.35 : 0;
  const v = Math.max(12, Math.round(f >= 120 ? 150 : base + jitter));
  const col = v < 60 ? '#35e07a' : v < 110 ? '#ffc400' : C.red;
  const bars = v < 50 ? 4 : v < 85 ? 3 : v < 120 ? 2 : 1;
  const slam = pop(f, 140, fps, 300);
  const enter = pop(f, 0, fps);
  // graph points
  const pts: string[] = [];
  const N = 60;
  for (let i = 0; i < N; i++) {
    const ff = f - (N - 1 - i) * 2;
    const b = interpolate(ff, [10, 120], [18, 150], {...clamp, easing: Easing.in(Easing.quad)});
    const j = ff < 120 ? (random(`pv${Math.floor(ff / 3)}`) - 0.5) * b * 0.35 : 0;
    const val = ff < 0 ? 18 : ff >= 120 ? 150 : b + j;
    pts.push(`${i * (900 / (N - 1))},${220 - Math.min(210, val * 1.3)}`);
  }
  const crack = f >= 140;
  return (
    <Center>
      <div style={{transform: `scale(${enter * (f >= 140 ? interpolate(slam, [0, 1], [1.35, 1]) : 1)})`, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24}}>
        <div style={{position: 'relative', display: 'flex', alignItems: 'center', gap: 44, padding: '30px 60px', borderRadius: 36, background: 'rgba(6,16,38,0.92)',
          border: `6px solid ${col}`, boxShadow: `0 0 60px ${col}88, 0 24px 50px rgba(0,0,0,0.6)`}}>
          <div style={{display: 'flex', alignItems: 'flex-end', gap: 10, height: 130, position: 'relative'}}>
            {[0, 1, 2, 3].map((i) => <div key={i} style={{width: 28, height: 34 + i * 30, borderRadius: 6, background: i < bars ? col : '#22365c',
              transform: `scaleY(${i >= bars ? 0.92 : 1})`}} />)}
            {bars === 1 && <div style={{position: 'absolute', right: -26, top: -24, color: C.red, fontFamily: 'Montserrat', fontWeight: 900, fontSize: 56}}>✕</div>}
          </div>
          <div style={{fontFamily: FONT, fontSize: 190, lineHeight: 1, color: col, textShadow: BLACK(10) + (crack && f < 175 ? `, 8px 0 0 rgba(0,220,255,.7), -8px 0 0 rgba(255,0,60,.7)` : ''), minWidth: 380, textAlign: 'right'}}>{v}</div>
          <div style={{fontFamily: FONT, fontSize: 80, color: C.white, alignSelf: 'flex-end', marginBottom: 16}}>MS</div>
          {crack && (
            <svg width={900} height={260} style={{position: 'absolute', left: 0, top: 0, pointerEvents: 'none'}}>
              <path d="M520 0 L500 70 L540 110 L505 170 L530 260" stroke="#fff7ea" strokeWidth={4} fill="none" opacity={0.85} />
              <path d="M540 110 L610 130 L660 120" stroke="#fff7ea" strokeWidth={3} fill="none" opacity={0.7} />
              <path d="M505 170 L440 190 L400 230" stroke="#fff7ea" strokeWidth={3} fill="none" opacity={0.7} />
            </svg>
          )}
        </div>
        {/* net graph */}
        <svg width={900} height={230} style={{background: 'rgba(6,16,38,0.75)', borderRadius: 18, border: '2px solid #2c4f86'}}>
          {[50, 100, 150].map((y) => <line key={y} x1={0} x2={900} y1={220 - y * 1.3} y2={220 - y * 1.3} stroke="#2c4f86" strokeDasharray="6 8" />)}
          <polyline points={pts.join(' ')} fill="none" stroke={col} strokeWidth={5} strokeLinejoin="round" />
          <text x={12} y={220 - 150 * 1.3 - 8} fill="#9fbfe6" style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 22}}>150</text>
        </svg>
      </div>
    </Center>
  );
};
const S3: React.FC = () => {
  const f = useCurrentFrame();
  // LAG: stutter between 100-140 (low fps freeze), with loading spinner
  const lag = f >= 100 && f < 140;
  const q = lag ? 100 + Math.floor((f - 100) / 9) * 9 : f;
  return (
    <AbsoluteFill>
      <Freeze frame={q} active={lag}><PingScene /></Freeze>
      {lag && (
        <Center>
          <div style={{width: 120, height: 120, borderRadius: '50%', border: '14px solid rgba(244,248,255,0.25)', borderTopColor: C.white, transform: `rotate(${f * 14}deg)`, marginTop: 300}} />
        </Center>
      )}
    </AbsoluteFill>
  );
};

// ---------- S5 (1060-1180): 10 LVL slam
const S5: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = pop(f, 0, fps, 230, 11);
  return (
    <Center>
      <div style={{position: 'absolute', width: 1700, height: 1700, opacity: interpolate(f, [4, 16], [0, 0.5], clamp), transform: `rotate(${f * 0.9}deg)`,
        background: 'repeating-conic-gradient(rgba(127,216,255,0.45) 0deg 6deg, transparent 6deg 18deg)', maskImage: 'radial-gradient(circle, black 10%, transparent 60%)'}} />
      <div style={{transform: `scale(${interpolate(s, [0, 1], [3, 1])}) rotate(${(1 - s) * 25}deg)`, opacity: interpolate(f, [0, 3], [0, 1], clamp)}}>
        <ShinyImg src="img/lvl10_3d.png" width={600} shineAt={14} style={{filter: 'drop-shadow(0 30px 50px rgba(0,0,0,0.6))'}} />
      </div>
    </Center>
  );
};

// ---------- S6 (1180-1500): channel card from intro v2 (x1.25) + 50 likes goal
const S6: React.FC = () => {
  const f = useCurrentFrame();
  const K = 1.1; // card speed: subscribe click at 95/K, like click at 215/K
  const n = Math.round(interpolate(f, [215, 283], [0, 50], {...clamp, easing: Easing.inOut(Easing.quad)}));
  const g = interpolate(f, [205, 219], [0, 1], clamp);
  const done = f >= 285;
  const ds = spring({frame: f - 285, fps: 60, config: {damping: 8, stiffness: 260}});
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{transform: `translateY(${-g * 110}px)`}}>
        <Freeze frame={Math.round(f * K)}><B6 /></Freeze>
      </AbsoluteFill>
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 110, opacity: g}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 30, transform: `translateY(${(1 - g) * 80}px)`}}>
          <div style={{transform: `scale(${done ? interpolate(ds, [0, 1], [1.4, 1]) : 1})`, display: 'flex', alignItems: 'center', gap: 20}}>
            <Thumb filled size={84} />
            <div style={{fontFamily: FONT, fontSize: 84, color: done ? C.orange : C.white, textShadow: extrude(8, '#000000', '#000000'), minWidth: 140}}>{n}</div>
          </div>
          <div style={{width: 520, height: 26, borderRadius: 13, background: 'rgba(6,16,38,0.85)', border: '2px solid #2c4f86', overflow: 'hidden'}}>
            <div style={{width: `${(n / 50) * 100}%`, height: '100%', background: done ? C.orange : C.white}} />
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: 12, opacity: interpolate(f, [291, 301], [0, 1], clamp)}}>
            <svg width={66} height={44} viewBox="0 0 24 16"><path d="M0 0 L11 8 L0 16 Z M12 0 L23 8 L12 16 Z" fill={C.white} /></svg>
            <div style={{fontFamily: FONT, fontSize: 66, color: C.white, textShadow: BLACK(8)}}>#2</div>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const V6 = {s1: [0, 230], s2: [230, 200], s3: [430, 220], s4: [650, 350], s5: [1000, 130], s6: [1130, 370]} as const;
export const V6_FRAMES = 1500;
const HITS = [72, 230 + 42, 430 + 140, 650 + 252, 1000, 1130 + 285];
const CUTS = [230, 430, 650, 1000, 1130];

// user's text sound, first half only (~1.45 s) for later text appearances
const TextSfx: React.FC<{at: number; v?: number}> = ({at, v = 0.8}) => (
  <Sequence from={Math.max(0, Math.round(at))} layout="none"><Audio src={staticFile('sfx2/text_reveal.mp3')} volume={v} trimAfter={88} /></Sequence>
);
const Sfx: React.FC<{at: number; s: string; v?: number}> = ({at, s, v = 1}) => (
  <Sequence from={Math.max(0, Math.round(at))} layout="none"><Audio src={staticFile(`sfx2/${s}.wav`)} volume={v} /></Sequence>
);

export const IntroV6: React.FC<{sound?: boolean}> = ({sound = true}) => {
  loadFonts(); loadBenzin();
  const f = useCurrentFrame();
  const flash = Math.max(0, ...CUTS.map((s) => interpolate(f - s, [0, 1, 8], [0, 0.45, 0], clamp)), ...[430 + 140, 1000].map((s) => interpolate(f - s, [0, 1, 10], [0, 0.7, 0], clamp)));
  const Seq = (k: keyof typeof V6, Comp: React.FC) => (
    <Sequence from={V6[k][0]} durationInFrames={V6[k][1]}><Scene dur={V6[k][1]}><Comp /></Scene></Sequence>
  );
  const S4: React.FC = () => <Globe speed={1.15} pal={{ocean0: '#1a4f9c', ocean1: '#04112b', line: '#d6ecff', land: '#9fd0ff'}} />;
  return (
    <AbsoluteFill style={{fontFamily: FONT}}>
      <Bg hits={HITS} />
      <Shake hits={HITS}>
        {Seq('s1', S1)}
        {Seq('s2', S2)}
        {Seq('s3', S3)}
        {Seq('s4', S4)}
        {Seq('s5', S5)}
        {Seq('s6', S6)}
      </Shake>
      <AbsoluteFill style={{background: 'radial-gradient(circle, #eef8ff 0%, #7fd8ff 60%, transparent 100%)', opacity: flash, pointerEvents: 'none', mixBlendMode: 'screen'}} />
      {sound && (
        <>
          <Audio src={staticFile('sfx2/bed.wav')} volume={0.3} loop />
          {/* S1: user's text sound (part 1 under the letter wave, part 2 under the logo) */}
          <Sequence from={0} layout="none"><Audio src={staticFile('sfx2/text_reveal.mp3')} volume={1} /></Sequence>
          <Sfx at={72} s="hit" v={0.6} /><Sfx at={92} s="shimmer" v={0.5} />
          {CUTS.map((c) => <Sfx key={'w' + c} at={c - 14} s="whoosh" v={0.7} />)}
          {/* S2 */}
          <Sfx at={232} s="pop" v={0.6} /><Sfx at={248} s="whip" v={0.5} /><Sfx at={272} s="impact" v={0.75} /><Sfx at={300} s="shimmer" v={0.5} />
          <TextSfx at={280} />
          {Array.from({length: 12}).map((_, i) => <Sfx key={'e' + i} at={280 + i * 4.6} s="tick" v={0.55} />)}
          {/* S3 ping (v3 timing): ticks as it climbs, beeps, lag, slam */}
          {Array.from({length: 16}).map((_, i) => <Sfx key={'p' + i} at={440 + i * 6.5} s="tick" v={0.5} />)}
          <Sfx at={430 + 55} s="blip" v={0.6} /><Sfx at={430 + 85} s="blip_low" v={0.6} />
          <Sfx at={430 + 100} s="lag" v={0.85} /><Sfx at={430 + 118} s="glitch" v={0.5} /><Sfx at={430 + 140} s="impact" v={1} /><Sfx at={430 + 142} s="error" v={0.5} />
          {/* S4 globe (speed 1.15): pin at 40/1.15, route 70..290 /1.15 */}
          <Sfx at={650 + 35} s="blip" v={0.9} /><Sfx at={650 + 61} s="riser" v={0.45} />
          <Sfx at={650 + 252} s="blip" v={0.9} /><Sfx at={650 + 254} s="hit" v={0.8} />
          {/* S5 */}
          <Sfx at={1000} s="impact" v={1} /><Sfx at={1014} s="shimmer" v={0.6} />
          {/* S6 card (K=1.1): subscribe 86, like 195 */}

          <Sfx at={1130 + 86} s="click" v={1} /><Sfx at={1130 + 88} s="ding" v={0.7} />
          <Sfx at={1130 + 195} s="click" v={1} /><Sfx at={1130 + 197} s="likepop" v={0.8} />
          {Array.from({length: 14}).map((_, i) => <Sfx key={'l' + i} at={1130 + 217 + i * 4.8} s="tick" v={0.55} />)}
          <Sfx at={1130 + 285} s="ding" v={0.8} />
        </>
      )}
    </AbsoluteFill>
  );
};
