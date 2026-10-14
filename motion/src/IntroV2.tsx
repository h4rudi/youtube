import React from 'react';
import {AbsoluteFill, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing, Audio, random} from 'remotion';
import {loadFonts} from './theme';
import {LensGrid, SpeedLines, Shake2, Fx, S, flashOp} from './style2';
import {Globe} from './Globe';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const Center: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', ...style}}>{children}</AbsoluteFill>
);

// object flying from deep (small, blurred) to its place, with motion trail
const FlyIn: React.FC<{at: number; children: React.ReactNode; from?: number; dx?: number; dy?: number; rot?: number}> = ({at, children, from = 0.05, dx = 0, dy = 0, rot = 0}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: f - at, fps, config: {damping: 12, stiffness: 160, mass: 0.7}});
  const sc = interpolate(s, [0, 1], [from, 1]);
  const o = interpolate(f - at, [0, 4], [0, 1], clamp);
  return (
    <div style={{transform: `translate(${(1 - s) * dx}px, ${(1 - s) * dy}px) scale(${sc}) rotate(${(1 - s) * rot}deg)`, opacity: o}}>{children}</div>
  );
};

// ghost trail: delayed copies of a FlyIn that fade once the object settles
const Ghost: React.FC<{at: number; n?: number; lag?: number; from?: number; dx?: number; dy?: number; rot?: number; children: React.ReactNode}> = ({at, n = 6, lag = 1.3, children, ...fp}) => {
  const f = useCurrentFrame();
  const fade = interpolate(f - at, [0, 28], [1, 0], clamp);
  return (
    <div style={{position: 'relative'}}>
      {Array.from({length: n}).map((_, k) => {
        const i = n - k;
        return <div key={i} style={{position: 'absolute', inset: 0, opacity: 0.3 * (1 - i / (n + 1)) * fade}}><FlyIn at={at + i * lag} {...fp}>{children}</FlyIn></div>;
      })}
      <FlyIn at={at} {...fp}>{children}</FlyIn>
    </div>
  );
};

// ---------- B1: FACEIT logo + "нет ранга" (0-180)
const B1: React.FC = () => {
  const f = useCurrentFrame();
  const plateY = interpolate(f, [70, 92], [260, 0], {...clamp, easing: Easing.out(Easing.cubic)});
  const plateO = interpolate(f, [70, 80], [0, 1], clamp);
  return (
    <Center>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 50}}>
        <Ghost at={6} rot={-25}><Img src={staticFile('img/faceit_logo.png')} style={{width: 420, filter: 'drop-shadow(0 0 40px rgba(255,95,31,0.55))'}} /></Ghost>
        <div style={{transform: `translateY(${plateY}px)`, opacity: plateO}}>
          <Img src={staticFile('img/norank_plate.png')} style={{width: 900, borderRadius: 18, boxShadow: '0 20px 60px rgba(0,0,0,0.6)', border: '2px solid #3a3a3a'}} />
        </div>
      </div>
    </Center>
  );
};

// ---------- B2: "?" -> 10 LVL / 2000 ELO (180-480)
const QGauge: React.FC = () => (
  <div style={{width: 300, height: 300, borderRadius: '50%', background: '#1e1e1e', border: '3px solid #3a3a3a', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative'}}>
    <svg width={300} height={300} style={{position: 'absolute', transform: 'rotate(135deg)'}}>
      <circle cx={150} cy={150} r={112} fill="none" stroke="#8a8a8a" strokeWidth={26} strokeDasharray={`${2 * Math.PI * 112 * 0.75} 999`} />
    </svg>
    <div style={{fontFamily: 'Unbounded', fontWeight: 900, fontSize: 130, color: '#fff'}}>?</div>
  </div>
);
const B2: React.FC = () => {
  const f = useCurrentFrame();
  const draw = interpolate(f, [40, 110], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const elo = Math.round(interpolate(f, [120, 200], [0, 2000], {...clamp, easing: Easing.out(Easing.cubic)}));
  const shine = interpolate(f, [125, 165], [-150, 150], clamp);
  return (
    <Center>
      <div style={{display: 'flex', alignItems: 'center', gap: 40}}>
        <FlyIn at={0} dx={-500}><QGauge /></FlyIn>
        <svg width={460} height={80}>
          <line x1={10} y1={40} x2={10 + 400 * draw} y2={40} stroke="#e6e6e6" strokeWidth={8} strokeDasharray="26 16" strokeDashoffset={-f * 3} strokeLinecap="round" />
          {draw > 0.98 && <polygon points="410,12 452,40 410,68" fill="#e6e6e6" />}
        </svg>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18}}>
          <Ghost at={112} rot={30}>
              <div style={{position: 'relative', width: 380, height: 380, borderRadius: '50%', overflow: 'hidden', boxShadow: '0 0 80px rgba(255,40,20,0.45)'}}>
                <Img src={staticFile('img/lvl10.png')} style={{width: 380, height: 380}} />
                <div style={{position: 'absolute', inset: 0, background: `linear-gradient(115deg, transparent ${50 + shine / 3 - 10}%, rgba(255,255,255,0.45) ${50 + shine / 3}%, transparent ${50 + shine / 3 + 10}%)`}} />
              </div>
            </Ghost>
          <div style={{fontFamily: 'Unbounded', fontWeight: 900, fontSize: 64, color: '#fff', opacity: interpolate(f, [120, 130], [0, 1], clamp)}}>
            {elo} <span style={{color: S.grey, fontSize: 40}}>ELO</span>
          </div>
        </div>
      </div>
    </Center>
  );
};

// ---------- B3: ping 20 -> 150 (480-780)
const Bars: React.FC<{lvl: number; color: string}> = ({lvl, color}) => (
  <div style={{display: 'flex', alignItems: 'flex-end', gap: 12, height: 150}}>
    {[0, 1, 2, 3].map((i) => <div key={i} style={{width: 32, height: 40 + i * 34, borderRadius: 7, background: i < lvl ? color : '#4a4a4a'}} />)}
  </div>
);
const B3: React.FC = () => {
  const f = useCurrentFrame();
  const v = Math.round(interpolate(f, [30, 150], [20, 150], {...clamp, easing: Easing.in(Easing.cubic)}));
  const col = v < 60 ? '#2bd96b' : v < 110 ? '#ffc400' : S.red;
  const lvl = v < 60 ? 4 : v < 90 ? 3 : v < 120 ? 2 : 1;
  const hit = 150;
  const s = spring({frame: f - hit, fps: 60, config: {damping: 9, stiffness: 200}});
  const sc = f >= hit ? interpolate(s, [0, 1], [1.5, 1]) : 1;
  const gl = f >= hit && f < hit + 30;
  const jx = gl ? (random(`j${f}`) - 0.5) * 30 : 0;
  return (
    <Center>
      <FlyIn at={0}>
        <div style={{display: 'flex', alignItems: 'center', gap: 50, padding: '40px 70px', borderRadius: 40, background: 'rgba(15,15,15,0.9)',
          border: `6px solid ${col}`, boxShadow: `0 0 70px ${col}88`, transform: `scale(${sc}) translateX(${jx}px)`}}>
          <div style={{position: 'relative'}}>
            <Bars lvl={lvl} color={col} />
            {v >= 150 && <div style={{position: 'absolute', right: -30, top: -26, color: S.red, fontFamily: 'Montserrat', fontWeight: 900, fontSize: 64}}>✕</div>}
          </div>
          <div style={{fontFamily: 'Unbounded', fontWeight: 900, fontSize: 210, color: col, lineHeight: 1,
            textShadow: gl ? `${jx}px 0 0 rgba(0,220,255,0.8), ${-jx}px 0 0 rgba(255,0,60,0.8)` : 'none'}}>{v}</div>
          <div style={{fontFamily: 'Unbounded', fontWeight: 900, fontSize: 90, color: '#fff', alignSelf: 'flex-end', marginBottom: 20}}>MS</div>
        </div>
      </FlyIn>
    </Center>
  );
};

// ---------- B5: 10 LVL slam (1260-1500)
const B5: React.FC = () => {
  const f = useCurrentFrame();
  const rays = f * 0.6;
  const shine = interpolate(f, [20, 70], [-120, 120], clamp);
  return (
    <Center>
      <div style={{position: 'absolute', width: 1600, height: 1600, opacity: interpolate(f, [10, 30], [0, 0.35], clamp), transform: `rotate(${rays}deg)`,
        background: 'repeating-conic-gradient(rgba(255,60,30,0.5) 0deg 6deg, transparent 6deg 18deg)', maskImage: 'radial-gradient(circle, black 10%, transparent 60%)'}} />
      <Ghost at={6} from={0.02} rot={-40}>
          <div style={{position: 'relative', width: 560, height: 560, borderRadius: '50%', overflow: 'hidden', boxShadow: '0 0 140px rgba(255,40,20,0.6)'}}>
            <Img src={staticFile('img/lvl10.png')} style={{width: 560, height: 560}} />
            <div style={{position: 'absolute', inset: 0, background: `linear-gradient(115deg, transparent ${50 + shine / 3 - 10}%, rgba(255,255,255,0.5) ${50 + shine / 3}%, transparent ${50 + shine / 3 + 10}%)`}} />
          </div>
        </Ghost>
    </Center>
  );
};

// ---------- B6: channel card, subscribe + like (1500-1860)
const Cursor: React.FC<{x: number; y: number; press: boolean}> = ({x, y, press}) => (
  <svg width={70} height={90} style={{position: 'absolute', left: x, top: y, transform: `scale(${press ? 0.85 : 1})`, transformOrigin: '0 0', filter: 'drop-shadow(0 6px 10px rgba(0,0,0,0.6))'}}>
    <path d="M4 4 L4 70 L22 54 L34 82 L46 77 L34 50 L58 50 Z" fill="#fff" stroke="#111" strokeWidth={4} strokeLinejoin="round" />
  </svg>
);
export const Thumb: React.FC<{filled: boolean; size?: number}> = ({filled, size = 54}) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path d="M2 21h4V9H2v12zm20-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L13.17 1 6.59 7.59C6.22 7.95 6 8.45 6 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"
      fill={filled ? '#fff' : 'none'} stroke="#fff" strokeWidth={filled ? 0 : 1.6} />
  </svg>
);
const Bell: React.FC<{ring: number}> = ({ring}) => (
  <svg width={46} height={46} viewBox="0 0 24 24" style={{transform: `rotate(${Math.sin(ring) * 18 * Math.max(0, 1 - ring / 12)}deg)`}}>
    <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" fill="#fff" />
  </svg>
);
export const B6: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const inS = spring({frame: f, fps, config: {damping: 14}});
  const subClick = 95, likeClick = 215;
  const subbed = f >= subClick + 4, liked = f >= likeClick + 4;
  // cursor path: enter -> subscribe btn -> like btn
  const cx = interpolate(f, [40, 90, 150, 210], [1700, 1235, 1235, 785], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const cy = interpolate(f, [40, 90, 150, 210], [1100, 495, 495, 668], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const press = (f >= subClick && f < subClick + 6) || (f >= likeClick && f < likeClick + 6);
  const likePop = spring({frame: f - likeClick, fps, config: {damping: 8, stiffness: 300}});
  const likes = liked ? 1 : 0;
  return (
    <AbsoluteFill>
      <Center>
        <div style={{transform: `translateY(${(1 - inS) * 300}px) scale(${0.8 + 0.2 * inS})`, opacity: inS, width: 1300, padding: 50, borderRadius: 36,
          background: 'rgba(15,15,15,0.94)', border: '2px solid #3a3a3a', boxShadow: '0 30px 90px rgba(0,0,0,0.7)'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 46}}>
            <Img src={staticFile('img/avatar.png')} style={{width: 230, height: 230, borderRadius: '50%'}} />
            <div style={{flex: 1}}>
              <div style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 92, color: '#fff', lineHeight: 1}}>харуди</div>
              <div style={{fontFamily: 'Montserrat', fontWeight: 600, fontSize: 40, color: S.grey, marginTop: 12}}>@харуди</div>
            </div>
            <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '26px 46px', borderRadius: 60, background: subbed ? '#3a3a3a' : '#fff',
              transform: `scale(${press && f < subClick + 6 ? 0.92 : 1})`}}>
              {subbed && <Bell ring={f - subClick} />}
              <span style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 40, color: subbed ? '#fff' : '#0f0f0f'}}>{subbed ? 'Вы подписаны' : 'Подписаться'}</span>
            </div>
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: 0, marginTop: 50, marginLeft: 276, alignSelf: 'flex-start', width: 'fit-content', borderRadius: 60, background: '#272727', overflow: 'hidden'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 16, padding: '20px 34px', borderRight: '2px solid #444', transform: `scale(${liked ? interpolate(likePop, [0, 1], [1.4, 1]) : 1})`}}>
              <Thumb filled={liked} />
              <span style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 40, color: '#fff'}}>{likes ? 'Нравится' : 'Лайк'}</span>
            </div>
            <div style={{padding: '20px 30px', transform: 'rotate(180deg)'}}><Thumb filled={false} size={46} /></div>
          </div>
        </div>
      </Center>
      {liked && Array.from({length: 14}).map((_, i) => {
        const t = f - likeClick; const a = (i / 14) * Math.PI * 2; const r = interpolate(t, [0, 25], [10, 140], clamp);
        return <div key={i} style={{position: 'absolute', left: 800 + Math.cos(a) * r, top: 690 + Math.sin(a) * r, width: 12, height: 12, borderRadius: 6,
          background: i % 2 ? '#fff' : S.orange, opacity: interpolate(t, [0, 25], [1, 0], clamp)}} />;
      })}
      <Cursor x={cx} y={cy} press={press} />
    </AbsoluteFill>
  );
};

// ---------- B7: 50 likes goal (1860-2160)
const B7: React.FC = () => {
  const f = useCurrentFrame();
  const n = Math.round(interpolate(f, [30, 150], [0, 50], {...clamp, easing: Easing.inOut(Easing.quad)}));
  const done = f >= 152;
  const s = spring({frame: f - 152, fps: 60, config: {damping: 8, stiffness: 220}});
  const out = interpolate(f, [270, 300], [1, 0], clamp);
  return (
    <Center style={{opacity: out}}>
      <FlyIn at={0}>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 40}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 40, transform: `scale(${done ? interpolate(s, [0, 1], [1.3, 1]) : 1})`}}>
            <Thumb filled size={190} />
            <div style={{fontFamily: 'Unbounded', fontWeight: 900, fontSize: 230, color: done ? S.orange : '#fff', lineHeight: 1}}>{n}</div>
          </div>
          <div style={{width: 900, height: 34, borderRadius: 17, background: '#333', overflow: 'hidden', border: '2px solid #555'}}>
            <div style={{width: `${(n / 50) * 100}%`, height: '100%', background: done ? S.orange : '#e6e6e6', boxShadow: `0 0 30px ${S.orange}`}} />
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: 26, opacity: interpolate(f, [175, 190], [0, 1], clamp), transform: `translateY(${interpolate(f, [175, 195], [40, 0], clamp)}px)`}}>
            <svg width={110} height={70} viewBox="0 0 24 16"><path d="M0 0 L11 8 L0 16 Z M12 0 L23 8 L12 16 Z" fill="#fff" /></svg>
            <div style={{fontFamily: 'Unbounded', fontWeight: 900, fontSize: 90, color: '#fff'}}>ВЫПУСК #2</div>
          </div>
        </div>
      </FlyIn>
    </Center>
  );
};

// beats: [from, dur]
export const V2 = {
  b1: [0, 180], b2: [180, 300], b3: [480, 300], b4: [780, 480], b5: [1260, 240], b6: [1500, 360], b7: [1860, 300],
} as const;
export const V2_FRAMES = 2160;

// hits = frames with impact (shake + grid punch + speed lines)
const HITS = [14, 180 + 120, 480 + 150, 1260 + 14, 1860 + 152];
const SWISH = [180, 480, 780, 1260, 1500, 1860];

export const IntroV2: React.FC<{sound?: boolean}> = ({sound = true}) => {
  loadFonts();
  const f = useCurrentFrame();
  const red = f >= 480 + 150 && f < 780;
  const B = (k: keyof typeof V2, C: React.FC) => (
    <Sequence from={V2[k][0]} durationInFrames={V2[k][1]}><C /></Sequence>
  );
  // white flash at each beat change
  const fl = Math.max(...SWISH.map((s) => flashOp(f, s, 7) * 0.6), ...HITS.map((h) => flashOp(f, h, 9)));
  return (
    <AbsoluteFill>
      <LensGrid punch={HITS} tint={red ? '#ff8a8a' : '#e6e6e6'} />
      {HITS.map((h) => <SpeedLines key={h} at={h} />)}
      {SWISH.slice(1).map((h) => <SpeedLines key={'s' + h} at={h} dur={14} count={40} />)}
      <Shake2 hits={HITS} amount={20}>
        {B('b1', B1)}
        {B('b2', B2)}
        {B('b3', B3)}
        <Sequence from={V2.b4[0]} durationInFrames={V2.b4[1]}><Globe /></Sequence>
        {B('b5', B5)}
        {B('b6', B6)}
        {B('b7', B7)}
      </Shake2>
      <AbsoluteFill style={{background: '#fff', opacity: fl, pointerEvents: 'none'}} />
      {sound && (
        <>
          <Audio src={staticFile('sfx/drone.wav')} volume={0.35} loop />
          <Fx at={0} s="riser" v={0.6} />
          {SWISH.map((s) => <Fx key={'w' + s} at={s - 12} s="whoosh" v={0.7} />)}
          {HITS.map((h) => <Fx key={'i' + h} at={h} s="impact" v={0.9} />)}
          {/* B1 plate */}
          <Fx at={68} s="swish" v={0.6} /><Fx at={88} s="hit" v={0.5} />
          {/* B2 arrow + elo counter */}
          <Fx at={180 + 40} s="swish" v={0.5} />
          {Array.from({length: 16}).map((_, i) => <Fx key={'t' + i} at={180 + 120 + i * 5} s="tick" v={0.5} />)}
          {/* B3 ping counter + glitch */}
          {Array.from({length: 20}).map((_, i) => <Fx key={'p' + i} at={480 + 30 + 120 * Math.cbrt(i / 20)} s="tick" v={0.5} />)}
          <Fx at={480 + 150} s="glitch" v={0.8} /><Fx at={480 + 165} s="glitch" v={0.5} />
          {/* B4 globe */}
          <Fx at={780 + 40} s="navbeep" v={0.8} /><Fx at={780 + 70} s="riser" v={0.35} /><Fx at={780 + 290} s="navbeep" v={0.8} /><Fx at={780 + 292} s="hit" v={0.6} /><Fx at={780 + 300} s="glitch" v={0.4} />
          {/* B6 subscribe + like */}
          <Fx at={1500 + 95} s="click" v={0.9} /><Fx at={1500 + 98} s="ding" v={0.6} />
          <Fx at={1500 + 215} s="click" v={0.9} /><Fx at={1500 + 217} s="pop" v={0.8} />
          {/* B7 counter */}
          {Array.from({length: 25}).map((_, i) => <Fx key={'l' + i} at={1860 + 30 + i * 4.8} s="tick" v={0.45} />)}
          <Fx at={1860 + 152} s="ding" v={0.7} /><Fx at={1860 + 175} s="whoosh" v={0.6} />
        </>
      )}
    </AbsoluteFill>
  );
};
