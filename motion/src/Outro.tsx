// Финал выпуска 1 (15 с): синий фон пользователя, шрифт Zero Cool, текст волной с чёрными тенями,
// графика к ключевым словам (калибровка, мало ELO, сыграл неплохо), комментарий + лайк + подписка, прощание
import React from 'react';
import {AbsoluteFill, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing, Audio, random, continueRender, delayRender} from 'remotion';
import {Video} from '@remotion/media';
import {vignette} from '@remotion/effects/vignette';
import {loadFonts} from './theme';
import {Thumb} from './IntroV2';
import {GAMES, FINAL} from './games';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const FONT = 'ZeroCool';
const C = {white: '#f4f8ff', cyan: '#7fd8ff', orange: '#ff6a13', green: '#3de08a', red: '#ff4a5a', panel: 'rgba(8,18,40,0.88)', line: '#2c4f86', yellow: '#ffc83a'};

let zc = false;
const loadZC = () => {
  if (zc || typeof document === 'undefined') return; zc = true;
  const h = delayRender('zerocool');
  new FontFace(FONT, `url(${staticFile('fonts/ZeroCool.otf')})`).load().then((l) => { document.fonts.add(l); continueRender(h); });
};

const extrude = (depth: number) => {
  const L: string[] = [];
  for (let i = 1; i <= depth; i++) { const v = Math.round(38 * (1 - i / depth)); L.push(`${(i * 0.7).toFixed(1)}px ${(i * 1.25).toFixed(1)}px 0 rgb(${v},${v},${v})`); }
  L.push(`${depth * 0.7 + 8}px ${depth * 1.25 + 18}px 30px rgba(0,0,0,0.5)`);
  return L.join(',');
};
const pop = (f: number, at: number, fps: number, stiffness = 220, damping = 12) => spring({frame: f - at, fps, config: {damping, stiffness, mass: 0.6}});
const Center: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', flexDirection: 'column', ...style}}>{children}</AbsoluteFill>
);

// letters rise one after another, flat line, black extrusion (same as intro v5)
const Wave: React.FC<{text: string; at: number; size: number; color?: string; step?: number}> = ({text, at, size, color = C.white, step = 1.6}) => {
  const f = useCurrentFrame();
  return (
    <div style={{display: 'flex', fontFamily: FONT, fontSize: size, lineHeight: 1.05, whiteSpace: 'pre'}}>
      {text.split('').map((ch, i) => {
        const t = interpolate(f - at - i * step, [0, 18], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
        const bob = Math.sin((f - at - i * step) / 7) * 5 * Math.exp(-Math.max(0, f - at - i * step - 12) / 20) * t;
        return <span key={i} style={{display: 'inline-block', color, textShadow: extrude(13), opacity: t,
          transform: `translateY(${(1 - t) * 60 + bob}px) scale(${0.85 + 0.15 * t})`, filter: t < 1 ? `blur(${(1 - t) * 9}px)` : undefined}}>{ch}</span>;
      })}
    </div>
  );
};

// scene wrapper: soft rise in, zoom-blur out
const Scene: React.FC<{dur: number; children: React.ReactNode}> = ({dur, children}) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [dur - 12, dur], [0, 1], {...clamp, easing: Easing.in(Easing.cubic)});
  return <AbsoluteFill style={{opacity: 1 - o, transform: `scale(${1 + o * 0.25})`, filter: o > 0 ? `blur(${o * 10}px)` : undefined}}>{children}</AbsoluteFill>;
};

// ---------- 1: ВОТ ТАКАЯ КАЛИБРОВКА + 10 tiles flipping W/L
const S1: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Center style={{gap: 10}}>
      <Wave text="ВОТ ТАКАЯ" at={2} size={90} color={C.cyan} />
      <Wave text="КАЛИБРОВКА" at={14} size={170} />
      <div style={{display: 'flex', gap: 16, marginTop: 40, perspective: 900}}>
        {GAMES.map((g, i) => {
          const t = interpolate(f - 40 - i * 4, [0, 16], [0, 1], {...clamp, easing: Easing.out(Easing.back(1.6))});
          const col = g.win ? C.green : C.red;
          return (
            <div key={i} style={{width: 92, height: 110, borderRadius: 16, background: t > 0.5 ? col : '#14284d', border: `3px solid ${t > 0.5 ? '#ffffff55' : C.line}`,
              transform: `rotateY(${(1 - t) * 180}deg) translateY(${(1 - t) * 30}px)`, opacity: interpolate(f - 40 - i * 4, [0, 4], [0, 1], clamp),
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT, fontSize: 52, color: '#fff', textShadow: '0 3px 0 rgba(0,0,0,0.35)', boxShadow: t > 0.5 ? `0 0 24px ${col}66` : 'none'}}>
              {t > 0.5 ? (g.win ? 'W' : 'L') : ''}
            </div>
          );
        })}
      </div>
    </Center>
  );
};

// ---------- 2: НЕ ТАК МНОГО ЭЛО — bar charges toward 2000, stalls at 1044 and sags
const S2: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  // fill overshoots hopefully toward ~1700, then deflates back to 1044
  const up = interpolate(f, [40, 95], [0, 1700], {...clamp, easing: Easing.out(Easing.cubic)});
  const down = interpolate(f, [100, 130], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const val = Math.round(up + (FINAL.elo - 1700) * down);
  const sag = f > 100 ? Math.sin((f - 100) / 4) * 6 * Math.exp(-(f - 100) / 25) : 0;
  const tgt = pop(f, 30, fps);
  const sad = f >= 128;
  return (
    <Center style={{gap: 14}}>
      <Wave text="НЕ ТАК МНОГО" at={2} size={100} color={C.cyan} />
      <div style={{display: 'flex', alignItems: 'baseline', gap: 26}}>
        <Wave text="ЭЛО" at={18} size={170} />
        <div style={{fontFamily: FONT, fontSize: 110, color: sad ? C.red : C.white, textShadow: extrude(10), opacity: interpolate(f, [40, 46], [0, 1], clamp), minWidth: 300}}>{val}</div>
      </div>
      <div style={{position: 'relative', width: 1200, marginTop: 40, transform: `translateY(${sag}px)`}}>
        <div style={{height: 46, borderRadius: 23, background: C.panel, border: `3px solid ${C.line}`, overflow: 'hidden'}}>
          <div style={{width: `${(val / 2000) * 100}%`, height: '100%', background: sad ? `linear-gradient(90deg, ${C.cyan}, ${C.orange})` : `linear-gradient(90deg, ${C.cyan}, #ffffff)`, borderRadius: 23}} />
        </div>
        {/* target 2000 flag */}
        <div style={{position: 'absolute', right: -20, top: -96, transform: `scale(${tgt})`, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <Img src={staticFile('img/lvl10_3d.png')} style={{width: 92}} />
          <div style={{fontFamily: FONT, fontSize: 34, color: C.white, textShadow: extrude(5), marginTop: 4}}>2000</div>
        </div>
        {/* "you are here" marker */}
        {sad && (
          <div style={{position: 'absolute', left: `${(FINAL.elo / 2000) * 100}%`, top: 62, transform: `translateX(-50%) scale(${pop(f, 128, fps, 300, 10)})`, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <svg width={40} height={26}><polygon points="20,0 40,26 0,26" fill={C.orange} /></svg>
            <div style={{fontFamily: FONT, fontSize: 34, color: C.orange, textShadow: extrude(5)}}>4 LVL</div>
          </div>
        )}
      </div>
    </Center>
  );
};

// ---------- 3: СЫГРАЛ НЕПЛОХО — stat chips + stamp
const Chip: React.FC<{label: string; value: string; at: number}> = ({label, value, at}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = pop(f, at, fps, 260, 11);
  return (
    <div style={{transform: `translateY(${(1 - s) * 80}px) scale(${0.6 + 0.4 * s})`, opacity: Math.min(1, s * 1.5), padding: '22px 36px', borderRadius: 24, background: C.panel,
      border: `3px solid ${C.line}`, boxShadow: '0 20px 40px rgba(0,0,0,0.35)', textAlign: 'center', minWidth: 300}}>
      <div style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 28, color: C.cyan, letterSpacing: 3}}>{label}</div>
      <div style={{fontFamily: FONT, fontSize: 76, color: C.white, textShadow: extrude(6)}}>{value}</div>
    </div>
  );
};
const S3: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const st = pop(f, 120, fps, 420, 13);
  return (
    <Center style={{gap: 14}}>
      <Wave text="СЫГРАЛ" at={2} size={100} color={C.cyan} />
      <Wave text="НЕПЛОХО" at={14} size={170} />
      <div style={{display: 'flex', gap: 30, marginTop: 40, position: 'relative'}}>
        <Chip label="К/Д" value="1.23" at={42} />
        <Chip label="РЕЙТИНГ" value="1.23" at={56} />
        <Chip label="ЛУЧШАЯ" value="25/8" at={70} />
        {f >= 120 && (
          <div style={{position: 'absolute', right: -190, top: 110, transform: `rotate(-12deg) scale(${interpolate(st, [0, 1], [2.6, 1])})`, opacity: Math.min(1, st * 2),
            padding: '10px 26px', border: `7px solid ${C.green}`, borderRadius: 18, fontFamily: FONT, fontSize: 64, color: C.green, background: 'rgba(8,30,20,0.55)', textShadow: '0 4px 0 rgba(0,0,0,0.4)'}}>
            НЕПЛОХО ✓
          </div>
        )}
      </div>
    </Center>
  );
};

// ---------- 4: comment typing + like + subscribe (smooth cursor)
const COMMENT = 'Харуди, жду второй выпуск!';
const Bell: React.FC<{ring: number}> = ({ring}) => (
  <svg width={42} height={42} viewBox="0 0 24 24" style={{transform: `rotate(${Math.sin(ring) * 18 * Math.max(0, 1 - ring / 14)}deg)`}}>
    <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" fill="#fff" />
  </svg>
);
const Cursor: React.FC<{x: number; y: number; press: boolean}> = ({x, y, press}) => (
  <svg width={64} height={84} style={{position: 'absolute', left: x, top: y, transform: `scale(${press ? 0.85 : 1})`, transformOrigin: '0 0', filter: 'drop-shadow(0 6px 10px rgba(0,0,0,0.55))'}}>
    <path d="M4 4 L4 66 L20 51 L31 76 L42 71 L31 47 L54 47 Z" fill="#fff" stroke="#111" strokeWidth={4} strokeLinejoin="round" />
  </svg>
);
export const S4_TYPE = [40, 2.2]; // start frame, frames per char
const S4: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const inS = pop(f, 0, fps, 160, 16);
  const [t0, cps] = S4_TYPE;
  const typed = Math.max(0, Math.min(COMMENT.length, Math.floor((f - t0) / cps)));
  const sendAt = 112, likeAt = 168, subAt = 222;
  const sent = f >= sendAt + 3, liked = f >= likeAt + 3, subbed = f >= subAt + 3;
  // cursor waypoints (top-left of pointer = tip)
  const kx = [0, 30, 100, 112, 150, 168, 205, 222, 270];
  const cx = interpolate(f, kx, [1750, 1700, 1435, 1435, 1040, 1040, 1395, 1395, 1600], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const cy = interpolate(f, kx, [1150, 1120, 610, 610, 418, 418, 418, 418, 600], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const press = [sendAt, likeAt, subAt].some((p) => f >= p && f < p + 6);
  const likeS = pop(f, likeAt, fps, 320, 8);
  const posted = pop(f, sendAt + 4, fps, 200, 14);
  return (
    <AbsoluteFill>
      <Center>
        <div style={{transform: `translateY(${(1 - inS) * 260}px) scale(${0.85 + 0.15 * inS})`, opacity: inS, width: 1300, padding: 46, borderRadius: 34, background: C.panel,
          border: `2px solid ${C.line}`, boxShadow: '0 30px 90px rgba(0,0,0,0.55)'}}>
          {/* channel row */}
          <div style={{display: 'flex', alignItems: 'center', gap: 30}}>
            <Img src={staticFile('img/avatar.png')} style={{width: 120, height: 120, borderRadius: '50%'}} />
            <div style={{flex: 1}}>
              <div style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 58, color: '#fff', lineHeight: 1}}>харуди</div>
              <div style={{fontFamily: 'Montserrat', fontWeight: 600, fontSize: 28, color: '#9fb3d6', marginTop: 8}}>@харуди</div>
            </div>
            <div style={{display: 'flex', alignItems: 'center', borderRadius: 60, background: '#22324f', overflow: 'hidden'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: 12, padding: '16px 26px', borderRight: '2px solid #3a4c6e', transform: `scale(${liked ? interpolate(likeS, [0, 1], [1.35, 1]) : 1})`}}>
                <Thumb filled={liked} size={40} /><span style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 30, color: '#fff'}}>{liked ? '1' : '0'}</span>
              </div>
              <div style={{padding: '16px 22px', transform: 'rotate(180deg)'}}><Thumb filled={false} size={34} /></div>
            </div>
            <div style={{display: 'flex', alignItems: 'center', gap: 12, padding: '20px 38px', borderRadius: 60, background: subbed ? '#2b3a57' : '#fff', transform: `scale(${press && f < subAt + 6 && f >= subAt ? 0.93 : 1})`}}>
              {subbed && <Bell ring={f - subAt} />}
              <span style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 32, color: subbed ? '#fff' : '#0b1220'}}>{subbed ? 'Вы подписаны' : 'Подписаться'}</span>
            </div>
          </div>
          {/* comment input */}
          <div style={{display: 'flex', alignItems: 'center', gap: 22, marginTop: 44}}>
            <div style={{width: 64, height: 64, borderRadius: '50%', background: '#3a6fd8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 30, color: '#fff'}}>Я</div>
            <div style={{flex: 1, borderBottom: `3px solid ${typed > 0 && !sent ? C.cyan : '#3a4c6e'}`, paddingBottom: 10, fontFamily: 'Montserrat', fontWeight: 600, fontSize: 36, color: sent ? '#6f84a8' : '#fff', minHeight: 46}}>
              {sent ? 'Напишите комментарий...' : typed === 0 ? <span style={{color: '#6f84a8'}}>Напишите комментарий...</span> : <>{COMMENT.slice(0, typed)}<span style={{opacity: Math.floor(f / 15) % 2 ? 1 : 0, color: C.cyan}}>|</span></>}
            </div>
            <div style={{padding: '14px 30px', borderRadius: 40, background: typed >= COMMENT.length && !sent ? C.cyan : '#22324f', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 28, color: typed >= COMMENT.length && !sent ? '#0b1220' : '#6f84a8',
              transform: `scale(${press && f >= sendAt && f < sendAt + 6 ? 0.92 : 1})`}}>Отправить</div>
          </div>
          {/* posted comment */}
          {sent && (
            <div style={{display: 'flex', gap: 22, marginTop: 30, opacity: posted, transform: `translateY(${(1 - posted) * 30}px)`}}>
              <div style={{width: 64, height: 64, borderRadius: '50%', background: '#3a6fd8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 30, color: '#fff'}}>Я</div>
              <div>
                <div style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 26, color: '#9fb3d6'}}>@зритель · только что</div>
                <div style={{fontFamily: 'Montserrat', fontWeight: 600, fontSize: 34, color: '#fff', marginTop: 4}}>{COMMENT}</div>
              </div>
            </div>
          )}
        </div>
      </Center>
      {liked && Array.from({length: 14}).map((_, i) => {
        const t = f - likeAt; const a = (i / 14) * Math.PI * 2; const r = interpolate(t, [0, 24], [10, 130], clamp);
        return <div key={i} style={{position: 'absolute', left: 1050 + Math.cos(a) * r, top: 425 + Math.sin(a) * r, width: 12, height: 12, borderRadius: 6, background: i % 2 ? '#fff' : C.cyan, opacity: interpolate(t, [0, 24], [1, 0], clamp)}} />;
      })}
      <Cursor x={cx} y={cy} press={press} />
    </AbsoluteFill>
  );
};

// ---------- 5: С ВАМИ БЫЛ ХАРУДИ / ВСЕМ ПОКА!
const S5: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const av = pop(f, 0, fps, 200, 11);
  const wave = Math.sin(f / 5) * 14 * Math.min(1, f / 20);
  const out = interpolate(f, [100, 120], [1, 0], clamp);
  return (
    <Center style={{gap: 8, opacity: out}}>
      <div style={{transform: `scale(${av}) rotate(${wave * 0.3}deg)`, marginBottom: 20}}>
        <Img src={staticFile('img/avatar.png')} style={{width: 230, height: 230, borderRadius: '50%', border: '6px solid #fff', boxShadow: `0 0 50px ${C.cyan}88`}} />
      </div>
      <Wave text="С ВАМИ БЫЛ" at={8} size={80} color={C.cyan} />
      <Wave text="ХАРУДИ" at={20} size={170} />
      <Wave text="ВСЕМ ПОКА!" at={48} size={100} color={C.orange} />
    </Center>
  );
};

export const OUTRO = {s1: [0, 160], s2: [160, 170], s3: [330, 170], s4: [500, 280], s5: [780, 120]} as const;
export const OUTRO_FRAMES = 900;

const Sfx: React.FC<{at: number; s: string; v?: number; ext?: string}> = ({at, s, v = 1, ext = 'wav'}) => (
  <Sequence from={Math.max(0, Math.round(at))} layout="none"><Audio src={staticFile(`sfx2/${s}.${ext}`)} volume={v} /></Sequence>
);
const TextSfx: React.FC<{at: number; v?: number}> = ({at, v = 0.75}) => (
  <Sequence from={Math.max(0, Math.round(at))} layout="none"><Audio src={staticFile('sfx2/text_reveal.mp3')} volume={v} trimAfter={88} /></Sequence>
);

export const Outro: React.FC<{sound?: boolean}> = ({sound = true}) => {
  loadFonts(); loadZC();
  const f = useCurrentFrame();
  const cuts = [160, 330, 500, 780];
  const flash = Math.max(0, ...cuts.map((s) => interpolate(f - s, [0, 1, 9], [0, 0.35, 0], clamp)));
  const Seq = (k: keyof typeof OUTRO, Comp: React.FC) => <Sequence from={OUTRO[k][0]} durationInFrames={OUTRO[k][1]}><Scene dur={OUTRO[k][1]}><Comp /></Scene></Sequence>;
  return (
    <AbsoluteFill style={{background: '#04122b'}}>
      <AbsoluteFill style={{transform: `scale(${1.05 + 0.02 * Math.sin(f / 80)})`}}>
        <Video src={staticFile('img/bg_blue.mp4')} loop muted effects={[vignette({amount: 0.55, radius: 0.6, feather: 0.5})]} />
      </AbsoluteFill>
      {Seq('s1', S1)}
      {Seq('s2', S2)}
      {Seq('s3', S3)}
      {Seq('s4', S4)}
      {Seq('s5', S5)}
      <AbsoluteFill style={{background: 'radial-gradient(circle, #e6f6ff 0%, #7fd8ff 55%, transparent 100%)', opacity: flash, mixBlendMode: 'screen', pointerEvents: 'none'}} />
      {sound && (
        <>
          <Audio src={staticFile('sfx2/bed.wav')} volume={0.25} loop />
          {/* 1: text sound + tile flips */}
          <TextSfx at={0} v={0.9} />
          {GAMES.map((_, i) => <Sfx key={'t' + i} at={44 + i * 4} s="tick" v={0.6} />)}
          {cuts.map((c) => <Sfx key={'w' + c} at={c - 12} s="whoosh" v={0.55} />)}
          {/* 2: charge up, deflate, marker */}
          {Array.from({length: 10}).map((_, i) => <Sfx key={'u' + i} at={160 + 40 + i * 5.5} s="tick" v={0.45} />)}
          <Sfx at={160 + 100} s="deflate" v={0.8} /><Sfx at={160 + 128} s="pop" v={0.6} />
          {/* 3: chips + stamp */}
          <TextSfx at={330} v={0.6} />
          {[42, 56, 70].map((d) => <Sfx key={'c' + d} at={330 + d} s="pop" v={0.55} />)}
          <Sfx at={330 + 120} s="stamp" v={0.9} />
          {/* 4: typing, send, like, subscribe */}
          {Array.from({length: COMMENT.length}).map((_, i) => COMMENT[i] === ' ' ? null : <Sfx key={'k' + i} at={500 + S4_TYPE[0] + i * S4_TYPE[1]} s={`key${i % 3}`} v={0.6} />)}
          <Sfx at={500 + 112} s="click" v={0.9} /><Sfx at={500 + 115} s="pop" v={0.5} />
          <Sfx at={500 + 168} s="click" v={0.9} /><Sfx at={500 + 170} s="likepop" v={0.75} />
          <Sfx at={500 + 222} s="click" v={0.9} /><Sfx at={500 + 224} s="ding" v={0.65} />
          {/* 5: goodbye */}
          <TextSfx at={780 + 6} v={0.8} /><Sfx at={780} s="pop" v={0.5} /><Sfx at={780 + 48} s="shimmer" v={0.45} />
        </>
      )}
    </AbsoluteFill>
  );
};
