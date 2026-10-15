// Интро v4 (~25 с): анимированный красный фон пользователя, шрифт Benzin Bold, 3D-ассеты,
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
const C = {white: '#fff6f2', red: '#ff2a3d', deep: '#2a0309', orange: '#ff6a13', green: '#35e07a', yellow: '#ffc83a', grey: '#c9a7ab'};
const FONT = 'Benzin';

let benzin = false;
const loadBenzin = () => {
  if (benzin || typeof document === 'undefined') return; benzin = true;
  const h = delayRender('benzin');
  new FontFace(FONT, `url(${staticFile('fonts/Benzin-Bold.ttf')})`).load().then((l) => { document.fonts.add(l); continueRender(h); });
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
    <AbsoluteFill style={{background: '#120205', overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `scale(${1.06 + bump + 0.02 * Math.sin(f / 90)}) rotate(${Math.sin(f / 140) * 0.6}deg)`}}>
        <Video src={staticFile('img/bg_red_waves.mp4')} loop muted effects={[vignette({amount: 0.75, radius: 0.55, feather: 0.5})]} />
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

// ---------- 3D word
const Word3D: React.FC<{text: string; at: number; size: number; face?: string; s1?: string; s2?: string; tilt?: number}> = ({text, at, size, face = C.white, s1 = '#c4122a', s2 = '#2a0309', tilt = -4}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = pop(f, at, fps, 230, 11);
  const wob = Math.sin((f - at) / 8) * 2.5 * Math.exp(-Math.max(0, f - at) / 50);
  return (
    <div style={{perspective: 1100}}>
      <div style={{fontFamily: FONT, fontSize: size, lineHeight: 1.02, color: face, textShadow: extrude(18, s1, s2), whiteSpace: 'nowrap',
        transform: `translateY(${(1 - s) * 140}px) scale(${interpolate(s, [0, 1], [0.2, 1])}) rotateX(${(1 - s) * 75 + wob}deg) rotateY(${wob * 2}deg) rotate(${tilt * s}deg)`,
        opacity: interpolate(f - at, [0, 4], [0, 1], clamp)}}>{text}</div>
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
  const logo = pop(f, 50, fps, 200, 10);
  return (
    <Center>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14}}>
        <Word3D text="НИКОГДА" at={4} size={150} tilt={-4} />
        <Word3D text="НЕ ИГРАЛ" at={18} size={120} tilt={3} />
        <div style={{display: 'flex', alignItems: 'center', gap: 34}}>
          <Word3D text="ФЕЙСИТ" at={32} size={150} tilt={-3} face={C.orange} s1="#a83400" s2="#2a0a00" />
          <div style={{transform: `scale(${logo}) rotate(${(1 - logo) * -70}deg) translateY(${Math.sin(f / 13) * 7}px)`, opacity: logo > 0.02 ? 1 : 0}}>
            <ShinyImg src="img/faceit_3d.png" width={250} shineAt={70} style={{filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.6))'}} />
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
          <Img src={staticFile('img/norank_plate.png')} style={{width: 560, borderRadius: 16, boxShadow: '0 24px 50px rgba(0,0,0,0.6)', border: '2px solid #5a1520'}} />
        </div>
        <svg width={300} height={80}>
          <line x1={10} y1={40} x2={10 + 240 * draw} y2={40} stroke={C.white} strokeWidth={9} strokeDasharray="22 14" strokeDashoffset={-f * 4} strokeLinecap="round" />
          {draw > 0.98 && <polygon points="252,12 290,40 252,68" fill={C.white} />}
        </svg>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4}}>
          <div style={{transform: `scale(${lv}) rotateY(${interpolate(lv, [0, 1], [-540, 0])}deg)`, opacity: lv > 0.02 ? 1 : 0}}>
            <ShinyImg src="img/lvl10_3d.png" width={360} shineAt={70} style={{filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.6))'}} />
          </div>
          <div style={{fontFamily: FONT, fontSize: 66, color: C.white, textShadow: extrude(9, '#c4122a', '#2a0309'), opacity: interpolate(f, [50, 56], [0, 1], clamp)}}>
            {elo} <span style={{fontSize: 38}}>ELO</span>
          </div>
        </div>
      </div>
    </Center>
  );
};

// ---------- S3 (430-730): ping — packet travels PC -> EU server and back, slower each trip, then LAG + 150 slam
const PC: React.FC<{col: string}> = ({col}) => (
  <svg width={190} height={170} viewBox="0 0 190 170">
    <rect x={10} y={10} width={170} height={110} rx={12} fill="#1a0306" stroke={col} strokeWidth={7} />
    <rect x={26} y={26} width={138} height={78} rx={6} fill={col} opacity={0.18} />
    <rect x={80} y={122} width={30} height={22} fill={col} /><rect x={50} y={144} width={90} height={12} rx={6} fill={col} />
  </svg>
);
const Server: React.FC<{col: string; blink: boolean}> = ({col, blink}) => (
  <svg width={170} height={190} viewBox="0 0 170 190">
    {[0, 1, 2].map((i) => (
      <g key={i} transform={`translate(10,${10 + i * 58})`}>
        <rect width={150} height={50} rx={10} fill="#1a0306" stroke={col} strokeWidth={6} />
        <circle cx={28} cy={25} r={7} fill={blink && i === 1 ? C.red : col} />
        <rect x={50} y={20} width={80} height={10} rx={5} fill={col} opacity={0.5} />
      </g>
    ))}
  </svg>
);
const TRIPS = [{a: 20, d: 34, ms: 24}, {a: 64, d: 58, ms: 67}, {a: 132, d: 110, ms: 150}];
const PingScene: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const X0 = 520, X1 = 1400, Y = 560;
  let px = X0, active = false, ms = 0, k = -1;
  TRIPS.forEach((tr, i) => {
    if (f >= tr.a) { k = i; }
    if (f >= tr.a && f < tr.a + tr.d) {
      let p = (f - tr.a) / tr.d;
      if (i === 2) p = Math.floor(p * 14) / 14; // stutter on the last trip
      const q = p < 0.5 ? p * 2 : 2 - p * 2;
      px = X0 + (X1 - X0) * Easing.inOut(Easing.quad)(q); active = true;
    }
    if (f >= tr.a + tr.d) ms = tr.ms;
  });
  const col = ms === 0 ? C.white : ms < 50 ? C.green : ms < 100 ? C.yellow : C.red;
  const slam = pop(f, 250, fps, 300, 9);
  const big = f >= 250;
  const msPop = TRIPS.map((tr) => pop(f, tr.a + tr.d, fps, 320, 10));
  const lineCol = k >= 2 ? C.red : C.white;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{opacity: big ? interpolate(f, [250, 256], [1, 0], clamp) : 1}}>
      {/* cable */}
      <svg width={1920} height={1080} style={{position: 'absolute'}}>
        <line x1={X0} y1={Y} x2={X1} y2={Y} stroke={lineCol} strokeOpacity={0.55} strokeWidth={6} strokeDasharray="18 16" strokeDashoffset={-f * 2} />
        {active && (
          <g>
            <circle cx={px} cy={Y} r={34} fill={col === C.white ? '#ffffff' : col} opacity={0.25} />
            <circle cx={px} cy={Y} r={15} fill="#fff" />
          </g>
        )}
      </svg>
      <div style={{position: 'absolute', left: X0 - 210, top: Y - 90}}><PC col={k >= 2 && f > 200 ? C.red : C.white} /></div>
      <div style={{position: 'absolute', left: X1 + 30, top: Y - 98}}><Server col={k >= 2 && f > 200 ? C.red : C.white} blink={Math.floor(f / 8) % 2 === 0} /></div>
      <div style={{position: 'absolute', left: X1 + 72, top: Y + 100, fontFamily: FONT, fontSize: 40, color: C.white}}>EU</div>
      </AbsoluteFill>
      {/* ms readout */}
      {!big && ms > 0 && (
        <div style={{position: 'absolute', left: 0, right: 0, top: Y - 230, display: 'flex', justifyContent: 'center'}}>
          <div style={{transform: `scale(${interpolate(msPop[TRIPS.findIndex((t) => t.ms === ms)], [0, 1], [1.5, 1])})`, fontFamily: FONT, fontSize: 110, color: col, textShadow: extrude(10, '#000000', '#000000')}}>
            {ms} <span style={{fontSize: 56, color: C.white}}>MS</span>
          </div>
        </div>
      )}
      {/* big 150 slam with bars + crack */}
      {big && (
        <Center>
          <div style={{transform: `scale(${interpolate(slam, [0, 1], [2.2, 1])})`, display: 'flex', alignItems: 'center', gap: 44, padding: '34px 64px', borderRadius: 40,
            background: 'rgba(24,2,6,0.92)', border: `7px solid ${C.red}`, boxShadow: `0 0 80px ${C.red}aa, 0 30px 60px rgba(0,0,0,0.6)`, position: 'relative'}}>
            <div style={{display: 'flex', alignItems: 'flex-end', gap: 10, height: 140, position: 'relative'}}>
              {[0, 1, 2, 3].map((i) => <div key={i} style={{width: 30, height: 36 + i * 32, borderRadius: 7, background: i === 0 ? C.red : '#4a1a20'}} />)}
              <div style={{position: 'absolute', right: -28, top: -26, color: C.red, fontFamily: 'Montserrat', fontWeight: 900, fontSize: 60}}>✕</div>
            </div>
            <div style={{fontFamily: FONT, fontSize: 200, lineHeight: 1, color: C.red, textShadow: extrude(12, '#5a0010', '#120003') + (f < 268 ? `, 10px 0 0 rgba(0,220,255,.6), -10px 0 0 rgba(255,0,60,.6)` : '')}}>150</div>
            <div style={{fontFamily: FONT, fontSize: 80, color: C.white, alignSelf: 'flex-end', marginBottom: 14}}>MS</div>
            <svg width={900} height={280} style={{position: 'absolute', left: 0, top: 0, pointerEvents: 'none'}}>
              <path d="M560 0 L540 80 L585 120 L545 190 L570 280" stroke="#fff" strokeWidth={4} fill="none" opacity={0.8} />
              <path d="M585 120 L660 140 L720 128" stroke="#fff" strokeWidth={3} fill="none" opacity={0.6} />
              <path d="M545 190 L470 210 L430 250" stroke="#fff" strokeWidth={3} fill="none" opacity={0.6} />
            </svg>
          </div>
        </Center>
      )}
    </AbsoluteFill>
  );
};
const S3: React.FC = () => {
  const f = useCurrentFrame();
  const lag = f >= 205 && f < 248; // freeze before the slam
  const q = lag ? 205 + Math.floor((f - 205) / 10) * 10 : f;
  const rgb = lag ? (random(`r${Math.floor(f / 3)}`) - 0.5) * 24 : 0;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{transform: `translateX(${rgb}px)`, filter: lag ? 'saturate(1.6) contrast(1.15)' : undefined}}>
        <Freeze frame={q} active={lag}><PingScene /></Freeze>
      </AbsoluteFill>
      {lag && (
        <>
          <AbsoluteFill style={{background: 'rgba(0,0,0,0.25)'}} />
          <Center style={{flexDirection: 'column', gap: 26}}>
            <div style={{width: 120, height: 120, borderRadius: '50%', border: '14px solid rgba(255,246,242,0.2)', borderTopColor: C.white, transform: `rotate(${f * 15}deg)`}} />
            <div style={{width: 520, height: 18, borderRadius: 9, background: 'rgba(255,255,255,0.15)', overflow: 'hidden'}}>
              <div style={{width: `${Math.min(92, (f - 205) * 6)}%`, height: '100%', background: C.white}} />
            </div>
          </Center>
        </>
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
        background: 'repeating-conic-gradient(rgba(255,60,70,0.55) 0deg 6deg, transparent 6deg 18deg)', maskImage: 'radial-gradient(circle, black 10%, transparent 60%)'}} />
      <div style={{transform: `scale(${interpolate(s, [0, 1], [3, 1])}) rotate(${(1 - s) * 25}deg)`, opacity: interpolate(f, [0, 3], [0, 1], clamp)}}>
        <ShinyImg src="img/lvl10_3d.png" width={600} shineAt={14} style={{filter: 'drop-shadow(0 30px 50px rgba(0,0,0,0.6))'}} />
      </div>
    </Center>
  );
};

// ---------- S6 (1180-1500): channel card from intro v2 (x1.25) + 50 likes goal
const S6: React.FC = () => {
  const f = useCurrentFrame();
  const K = 1.25; // card speed: subscribe click at 95/K, like click at 215/K
  const n = Math.round(interpolate(f, [186, 250], [0, 50], {...clamp, easing: Easing.inOut(Easing.quad)}));
  const g = interpolate(f, [176, 190], [0, 1], clamp);
  const done = f >= 252;
  const ds = spring({frame: f - 252, fps: 60, config: {damping: 8, stiffness: 260}});
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
          <div style={{width: 520, height: 26, borderRadius: 13, background: 'rgba(20,2,5,0.85)', border: '2px solid #6a1a24', overflow: 'hidden'}}>
            <div style={{width: `${(n / 50) * 100}%`, height: '100%', background: done ? C.orange : C.white}} />
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: 12, opacity: interpolate(f, [258, 268], [0, 1], clamp)}}>
            <svg width={66} height={44} viewBox="0 0 24 16"><path d="M0 0 L11 8 L0 16 Z M12 0 L23 8 L12 16 Z" fill={C.white} /></svg>
            <div style={{fontFamily: FONT, fontSize: 66, color: C.white, textShadow: extrude(8, '#c4122a', '#2a0309')}}>#2</div>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const V4 = {s1: [0, 230], s2: [230, 200], s3: [430, 300], s4: [730, 330], s5: [1060, 120], s6: [1180, 320]} as const;
export const V4_FRAMES = 1500;
const HITS = [4, 18, 32, 50, 230 + 42, 430 + 250, 730 + 255, 1060, 1180 + 252];
const CUTS = [230, 430, 730, 1060, 1180];

const Sfx: React.FC<{at: number; s: string; v?: number}> = ({at, s, v = 1}) => (
  <Sequence from={Math.max(0, Math.round(at))} layout="none"><Audio src={staticFile(`sfx2/${s}.wav`)} volume={v} /></Sequence>
);

export const IntroV4: React.FC<{sound?: boolean}> = ({sound = true}) => {
  loadFonts(); loadBenzin();
  const f = useCurrentFrame();
  const flash = Math.max(0, ...CUTS.map((s) => interpolate(f - s, [0, 1, 8], [0, 0.45, 0], clamp)), ...[430 + 250, 1060].map((s) => interpolate(f - s, [0, 1, 10], [0, 0.7, 0], clamp)));
  const Seq = (k: keyof typeof V4, Comp: React.FC) => (
    <Sequence from={V4[k][0]} durationInFrames={V4[k][1]}><Scene dur={V4[k][1]}><Comp /></Scene></Sequence>
  );
  const S4: React.FC = () => <Globe speed={1.32} pal={{ocean0: '#6a1420', ocean1: '#16030a', line: '#ffd9dc', land: '#ffb8bf'}} />;
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
      <AbsoluteFill style={{background: 'radial-gradient(circle, #fff1ec 0%, #ff8a8a 60%, transparent 100%)', opacity: flash, pointerEvents: 'none', mixBlendMode: 'screen'}} />
      {sound && (
        <>
          <Audio src={staticFile('sfx2/bed.wav')} volume={0.35} loop />
          {/* S1: words + logo + shine */}
          <Sfx at={2} s="impact" v={0.8} /><Sfx at={4} s="pop" v={0.8} /><Sfx at={18} s="pop" v={0.8} /><Sfx at={32} s="hit" v={0.9} />
          <Sfx at={44} s="whip" v={0.7} /><Sfx at={50} s="impact" v={0.7} /><Sfx at={70} s="shimmer" v={0.7} />
          {CUTS.map((c) => <Sfx key={'w' + c} at={c - 14} s="whoosh" v={0.75} />)}
          {/* S2 */}
          <Sfx at={232} s="pop" v={0.7} /><Sfx at={246} s="whip" v={0.5} /><Sfx at={272} s="impact" v={0.8} /><Sfx at={300} s="shimmer" v={0.6} />
          {Array.from({length: 12}).map((_, i) => <Sfx key={'e' + i} at={280 + i * 4.6} s="tick" v={0.7} />)}
          {/* S3 ping: packet blips at server and back */}
          {TRIPS.map((t, i) => <React.Fragment key={'t' + i}>
            <Sfx at={430 + t.a} s="blip" v={0.7} /><Sfx at={430 + t.a + t.d / 2} s="blip_low" v={0.7} /><Sfx at={430 + t.a + t.d} s={i === 2 ? 'error' : 'pop'} v={0.8} />
          </React.Fragment>)}
          <Sfx at={430 + 205} s="lag" v={0.9} /><Sfx at={430 + 230} s="glitch" v={0.6} /><Sfx at={430 + 250} s="impact" v={1} /><Sfx at={430 + 252} s="glitch" v={0.7} />
          {/* S4 globe (speed 1.32: pins at 40/1.32, route 70..290 /1.32) */}
          <Sfx at={730 + 30} s="blip" v={0.9} /><Sfx at={730 + 53} s="riser" v={0.5} /><Sfx at={730 + 220} s="blip" v={0.9} /><Sfx at={730 + 222} s="hit" v={0.8} /><Sfx at={730 + 226} s="error" v={0.4} />
          {/* S5 */}
          <Sfx at={1060} s="impact" v={1} /><Sfx at={1074} s="shimmer" v={0.7} />
          {/* S6 card: subscribe 95/1.25=76, like 215/1.25=172 */}
          <Sfx at={1180 + 76} s="click" v={1} /><Sfx at={1180 + 78} s="ding" v={0.7} />
          <Sfx at={1180 + 172} s="click" v={1} /><Sfx at={1180 + 174} s="likepop" v={0.8} />
          {Array.from({length: 14}).map((_, i) => <Sfx key={'l' + i} at={1180 + 188 + i * 4.5} s="tick" v={0.6} />)}
          <Sfx at={1180 + 252} s="ding" v={0.8} /><Sfx at={1180 + 258} s="whip" v={0.5} />
        </>
      )}
    </AbsoluteFill>
  );
};
