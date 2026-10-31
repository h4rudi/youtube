// Ролик «Если проснёшься в мире CS2» (9:16, ~58 с): «правила выживания» + поворот (это был сон Лёхи).
// Исходники пользователя: спавн T на Mirage (public/wake/spawn.png), установленная C4 (bomb.png), поиск матча (search.png),
// кадры Mirage из прошлого ролика (mirage/window|asite2|jungle.png) и радар (mirage/radar.png).
// Фоновая музыка wake/tension.mp3 — сгенерирована (низкий дрон + «пульс»), тихо под голосом.
import React from 'react';
import {AbsoluteFill, Audio, Img, Sequence, interpolate, random, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {loadFonts} from '../theme';
import {FPS, fr} from '../tilt/script';
import {VO, TOTAL, CUES, v} from './script';
import {Captions, clamp, pop} from '../tilt/UI';
import {Scene, Cam, Flash, loadCaveat} from '../money/Money';
import {H, RED, Portrait} from '../money/Props';

export const WAKE_FRAMES = fr(TOTAL);

const S = {
  hook: 0, r1: v(17) - 4, r2: v(29) - 4, r3: v(40) - 4, r4: v(54) - 4, r5: v(66) - 4, r6: v(79) - 4, last: v(95) - 4, wake: v(109) - 4, ask: v(120) - 4, end: fr(56.5),
};
const GOLD = '#ffd23f', GREEN = '#2bd96b';

const Bg: React.FC<{glow?: string}> = ({glow = '#3a1016'}) => (
  <AbsoluteFill style={{height: H, backgroundColor: '#07080c', backgroundImage: `radial-gradient(ellipse at 50% 40%, ${glow}55, #07080c 70%)`}} />
);
const Big: React.FC<{x: number; y: number; s: number; size: number; color?: string; children: React.ReactNode}> = ({x, y, s, size, color = '#fff', children}) => (
  <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%, -50%) scale(${s})`, opacity: Math.min(1, s * 2), fontFamily: 'Montserrat', fontWeight: 900, fontSize: size,
    color, whiteSpace: 'nowrap', textAlign: 'center', lineHeight: 1.05, textShadow: color === '#fff' ? '0 4px 0 rgba(0,0,0,0.6)' : `0 0 34px ${color}88, 0 4px 0 rgba(0,0,0,0.6)`}}>{children}</div>
);
const Chip: React.FC<{x: number; y: number; s: number; bg: string; color?: string; size?: number; children: React.ReactNode}> = ({x, y, s, bg, color = '#fff', size = 40, children}) => (
  <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%, -50%) scale(${s})`, opacity: Math.min(1, s * 2), background: bg, color, fontFamily: 'Montserrat', fontWeight: 900,
    fontSize: size, padding: '12px 30px', borderRadius: 50, whiteSpace: 'nowrap', boxShadow: `0 0 30px ${bg}88`}}>{children}</div>
);
// стикер «ПРАВИЛО №N»
const Rule: React.FC<{n: string; at: number}> = ({n, at}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = pop(f, at, fps, 300, 10);
  return (
    <div style={{position: 'absolute', left: 540, top: 150, transform: `translate(-50%,-50%) rotate(-3deg) scale(${s})`, opacity: Math.min(1, s * 2), background: '#f3ead2', padding: '10px 38px', boxShadow: '0 10px 30px rgba(0,0,0,0.6)',
      fontFamily: 'Caveat', fontWeight: 700, fontSize: 76, color: '#b01e26', whiteSpace: 'nowrap'}}>Правило {n}</div>
  );
};
// кадр игры во весь экран сверху; дышащая камера + красная виньетка
const Shot: React.FC<{src: string; f: number; dim?: number; children?: React.ReactNode}> = ({src, f, dim = 0, children}) => (
  <div style={{position: 'absolute', left: 0, top: 230, width: 1080, height: 760, overflow: 'hidden'}}>
    <div style={{position: 'absolute', inset: 0, transform: `translate(${Math.sin(f / 23) * 8}px, ${Math.sin(f / 17) * 6}px) scale(1.06)`}}>
      <Img src={staticFile(src)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
    </div>
    <div style={{position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 50% 50%, transparent 50%, rgba(120,0,0,${0.55 + 0.15 * Math.sin(f / 9)}))`}} />
    {dim > 0 && <div style={{position: 'absolute', inset: 0, background: '#000', opacity: dim}} />}
    {children}
  </div>
);

// ---------------------------------------------------------------- сцены
const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const open = interpolate(f, [4, 22], [0, 1], clamp);
  const blur = interpolate(f, [4, 40], [14, 0], clamp);
  return (
    <>
      <AbsoluteFill style={{height: H, background: '#000'}} />
      <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: H, overflow: 'hidden', filter: `blur(${blur}px)`}}>
        <div style={{position: 'absolute', inset: 0, transform: `rotate(${Math.sin(f / 10) * 2 * (1 - open * 0.7)}deg) scale(1.15)`}}>
          <Img src={staticFile('wake/spawn.png')} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: '45% 50%'}} />
        </div>
      </div>
      {/* веки */}
      <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: (H / 2) * (1 - open), background: '#000', borderBottomLeftRadius: '50% 40px', borderBottomRightRadius: '50% 40px'}} />
      <div style={{position: 'absolute', left: 0, bottom: 0, width: 1080, height: (H / 2) * (1 - open), background: '#000', borderTopLeftRadius: '50% 40px', borderTopRightRadius: '50% 40px'}} />
      <AbsoluteFill style={{height: H, background: `radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(90,0,0,0.75))`}} />
      {f >= v(3) && <Big x={540} y={240} s={pop(f, v(3), fps, 300, 10)} size={64} color="#fff">ТЫ ПРОСНУЛСЯ В CS2</Big>}
      {f >= v(7) && <Big x={540} y={360} s={pop(f, v(7), fps, 380, 8)} size={72} color={RED}>НЕ ЗОВИ НА ПОМОЩЬ</Big>}
      {f >= v(16) && <Chip x={540} y={930} s={pop(f, v(16), fps)} bg="rgba(10,10,14,0.85)" size={40}>правила выживания 👇</Chip>}
    </>
  );
};

const R1: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <>
      <Bg />
      <Rule n="№1" at={S.r1} />
      <Shot src="wake/spawn.png" f={f}>
        {f >= v(21) && [0, 1, 2].map((i) => {
          const t = ((f - v(21)) / 30 + i / 3) % 1;
          return <div key={i} style={{position: 'absolute', left: 540, top: 600, width: 600 * t, height: 220 * t, transform: 'translate(-50%,-50%)', border: `5px solid rgba(255,255,255,${1 - t})`, borderRadius: '50%'}} />;
        })}
      </Shot>
      {f >= v(19) && <Big x={540} y={420} s={pop(f, v(19), fps, 320, 9)} size={110} color="#fff">🤫 ТСС</Big>}
      {f >= v(27) && (
        <div style={{position: 'absolute', left: 540, top: 930, transform: `translate(-50%,-50%) scale(${pop(f, v(27), fps)})`, background: 'linear-gradient(#3a3f4a, #22262f)', border: '4px solid #15171c', boxShadow: '0 8px 0 #111', borderRadius: 14,
          padding: '18px 60px', fontFamily: 'Russo One', fontSize: 54, color: '#fff'}}>SHIFT</div>
      )}
    </>
  );
};

const R2: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const glint = f >= v(36) ? 0.5 + 0.5 * Math.sin(f / 3) : 0;
  return (
    <>
      <Bg />
      <Rule n="№2" at={S.r2} />
      <Shot src="mirage/window.png" f={f}>
        {glint > 0 && <div style={{position: 'absolute', left: 520, top: 360, width: 60, height: 60, borderRadius: 30, background: `radial-gradient(circle, rgba(255,255,255,${glint}), rgba(120,200,255,${glint * 0.6}) 40%, transparent 70%)`, transform: `scale(${1 + glint})`}} />}
      </Shot>
      {f >= v(31) && <Big x={540} y={930} s={pop(f, v(31), fps, 320, 9)} size={70} color={RED}>⛔ НЕ ВЫХОДИ</Big>}
      {f >= v(38) && <Chip x={540} y={330} s={pop(f, v(38), fps)} bg={RED} size={40}>в окне снайпер</Chip>}
    </>
  );
};

const R3: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const cnt = Math.max(1, 3 - Math.floor(Math.max(0, f - v(48)) / 12));
  return (
    <>
      <Bg />
      <Rule n="№3" at={S.r3} />
      <Shot src="mirage/asite2.png" f={f}>
        <svg width={1080} height={760} viewBox="0 0 1080 760" style={{position: 'absolute', inset: 0}}>
          <g transform={`translate(${interpolate(f, [S.r3, v(51)], [300, 540], clamp)} ${interpolate(f, [S.r3, v(51)], [250, 380], clamp)})`}>
            <circle r={46} fill="none" stroke={RED} strokeWidth={6} />
            <line x1={-70} y1={0} x2={-30} y2={0} stroke={RED} strokeWidth={6} /><line x1={30} y1={0} x2={70} y2={0} stroke={RED} strokeWidth={6} />
            <line x1={0} y1={-70} x2={0} y2={-30} stroke={RED} strokeWidth={6} /><line x1={0} y1={30} x2={0} y2={70} stroke={RED} strokeWidth={6} />
          </g>
        </svg>
      </Shot>
      {f >= v(48) && <Big x={540} y={930} s={pop(f, v(48), fps, 320, 9)} size={130} color={RED}>{cnt}…</Big>}
      {f >= v(51) && <Chip x={540} y={330} s={pop(f, v(51), fps)} bg={RED} size={40}>тебя уже префаерят</Chip>}
    </>
  );
};

const R4: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const sec = Math.max(0, 115 - Math.floor(interpolate(f, [v(56), v(59)], [0, 115], clamp)));
  const rewind = f >= v(59) && f < v(59) + 18;
  return (
    <>
      <Bg glow="#1a2a4a" />
      <Rule n="№4" at={S.r4} />
      <Shot src="wake/spawn.png" f={f} dim={rewind ? 0.3 : 0}>
        {rewind && <div style={{position: 'absolute', inset: 0, background: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.15) 0 3px, transparent 3px 9px)'}} />}
      </Shot>
      <div style={{position: 'absolute', left: 540, top: 620, transform: 'translate(-50%,-50%)', background: 'rgba(10,12,18,0.85)', border: `4px solid ${sec < 10 ? RED : '#fff'}`, borderRadius: 18, padding: '10px 40px',
        fontFamily: 'Russo One', fontSize: 110, color: sec < 10 ? RED : '#fff'}}>{Math.floor(sec / 60)}:{String(sec % 60).padStart(2, '0')}</div>
      {rewind && <Big x={540} y={820} s={1} size={70} color={GOLD}>⏪ ПЕРЕЗАПУСК</Big>}
      {f >= v(61) && <Chip x={540} y={930} s={pop(f, v(61), fps)} bg="rgba(10,12,18,0.85)" size={38}>погиб — жди следующий раунд</Chip>}
    </>
  );
};

const R5: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = Math.max(0, f - v(68));
  const rate = Math.max(4, 22 - t / 6);
  const blink = Math.floor(t / rate) % 2 === 0;
  const secs = Math.max(0, 40 - Math.floor(interpolate(f, [v(76), S.r6], [0, 12], clamp)));
  return (
    <>
      <Bg glow="#5a1016" />
      <Rule n="№5" at={S.r5} />
      <Shot src="wake/bomb.png" f={f}>
        <div style={{position: 'absolute', left: 520, top: 470, width: 140, height: 140, borderRadius: 70, transform: 'translate(-50%,-50%)', background: `radial-gradient(circle, rgba(255,40,40,${blink ? 0.9 : 0.1}), transparent 70%)`}} />
      </Shot>
      {f >= v(74) && <Big x={540} y={420} s={pop(f, v(74), fps, 380, 8)} size={130} color={RED}>БЕГИ</Big>}
      {f >= v(76) && <div style={{position: 'absolute', left: 540, top: 930, transform: `translate(-50%,-50%) scale(${pop(f, v(76), fps)})`, fontFamily: 'Russo One', fontSize: 100, color: RED, textShadow: `0 0 30px ${RED}`}}>00:{String(secs).padStart(2, '0')}</div>}
    </>
  );
};

const R6: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <>
      <Bg glow="#1a1a3a" />
      <Rule n="№6" at={S.r6} />
      <Shot src="mirage/radar.png" f={f} dim={0.2} />
      {f >= v(84) && <div style={{position: 'absolute', left: 60, top: 300, display: 'flex', flexDirection: 'column', gap: 8, fontFamily: 'Montserrat', fontWeight: 900, fontSize: 34}}>
        {['РАШ Б!!!', 'ВСЕ НА Б', 'Б Б Б'].map((t, i) => f >= v(84) + i * 6 && <div key={i} style={{background: 'rgba(0,0,0,0.7)', padding: '8px 18px', borderRadius: 8, color: '#fff'}}><span style={{color: '#e8c24a'}}>[ВСЕМ] ???:</span> {t}</div>)}
      </div>}
      {f >= v(87) && <Big x={540} y={760} s={pop(f, v(87), fps, 320, 9)} size={100} color={RED}>НЕ ВЕРЬ</Big>}
      {f >= v(91) && <Chip x={540} y={930} s={pop(f, v(91), fps)} bg={GOLD} color="#111" size={44}>они идут на A</Chip>}
    </>
  );
};

const Last: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const trap = f >= v(107);
  return (
    <>
      <Bg glow={trap ? '#7a0a10' : '#2a0a10'} />
      <Rule n="последнее" at={S.last} />
      <svg width={1080} height={H} viewBox={`0 0 1080 ${H}`} style={{position: 'absolute', inset: 0}}>
        <g opacity={interpolate(f, [S.last, v(100)], [0, 1], clamp)} transform={`translate(540 ${700 + Math.sin(f / 12) * 6})`}>
          <path d="M-150 420 C -150 200, -90 120, 0 120 C 90 120, 150 200, 150 420 Z" fill="#050507" />
          <ellipse cx={0} cy={20} rx={95} ry={115} fill="#050507" />
          <circle cx={-32} cy={10} r={9} fill={RED} /><circle cx={32} cy={10} r={9} fill={RED} />
        </g>
      </svg>
      {f >= v(100) && <div style={{position: 'absolute', left: 540, top: 380, transform: `translate(-50%,-50%) scale(${pop(f, v(100), fps)})`, background: '#fff', color: '#111', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 40, padding: '16px 30px', borderRadius: 26, whiteSpace: 'nowrap'}}>«ещё одна катка, и спать…»</div>}
      {trap && <Big x={540} y={540} s={pop(f, v(107), fps, 380, 8)} size={110} color={RED}>ЛОВУШКА</Big>}
    </>
  );
};

const Wake: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const search = f >= v(116);
  return (
    <>
      <AbsoluteFill style={{height: H, background: '#05060a'}} />
      {!search ? (
        <div style={{position: 'absolute', left: 0, top: 380, width: 1080, height: 800, overflow: 'hidden'}}><Portrait f={f} bg="dorm" mood="shocked" sweat scale={1.15} y={520} light="#5a8acb" lightAmt={0.25} /></div>
      ) : (
        <div style={{position: 'absolute', left: 0, top: 240, width: 1080, height: 608, overflow: 'hidden', transform: `scale(${interpolate(f, [v(116), S.ask], [1, 1.1], clamp)})`}}>
          <Img src={staticFile('wake/search.png')} style={{width: 1080, height: 608, objectFit: 'cover'}} />
        </div>
      )}
      {f >= v(112) && !search && <Big x={540} y={250} s={pop(f, v(112), fps, 320, 9)} size={150} color={RED}>04:00</Big>}
      {search && <Chip x={540} y={950} s={pop(f, v(118), fps)} bg={GREEN} color="#06260f" size={44}>ПОИСК МАТЧА…</Chip>}
    </>
  );
};

const Ask: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <>
      <Bg glow="#3a1016" />
      <Big x={540} y={420} s={pop(f, S.ask, fps)} size={58} color="#fff">КАКОЕ ПРАВИЛО</Big>
      <Big x={540} y={520} s={pop(f, S.ask + 5, fps)} size={58} color={GOLD}>ДОБАВИЛ БЫ ТЫ?</Big>
      <div style={{position: 'absolute', left: 540, top: 720, transform: `translate(-50%,-50%) rotate(-3deg) scale(${pop(f, S.ask + 10, fps)})`, background: '#f3ead2', padding: '10px 38px', fontFamily: 'Caveat', fontWeight: 700, fontSize: 70, color: '#b01e26'}}>Правило №8 — ?</div>
    </>
  );
};

const End: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (f < S.end) return null;
  const m = pop(f, S.end, fps, 320, 9);
  return (
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, #5a1016, #05060a 70%)', alignItems: 'center', justifyContent: 'center', paddingBottom: 240, textAlign: 'center'}}>
      <div style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 60, color: '#fff', transform: `scale(${0.6 + 0.4 * m})`, lineHeight: 1.1}}>ПИШИ СВОЁ<br /><span style={{color: RED}}>ПРАВИЛО ВЫЖИВАНИЯ</span></div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- звук: голос + тревожный фон (тихо) + редкие эффекты
type Fx = [number, string, number];
const SFX: Fx[] = [
  [2, 'sfx2/whoosh.wav', 0.3], [v(7), 'sfx2/impact.wav', 0.4],
  ...[S.r1, S.r2, S.r3, S.r4, S.r5, S.r6, S.last].map((at): Fx => [at, 'sfx2/stamp.wav', 0.28]),
  [v(36), 'sfx2/shimmer.wav', 0.25], ...Array.from({length: 3}).map((_, i): Fx => [v(48) + i * 12, 'sfx2/tick.wav', 0.3]),
  [v(59), 'y2013/rewind.wav', 0.3], ...Array.from({length: 14}).map((_, i): Fx => [v(68) + Math.round(i * 18 * Math.pow(0.88, i)), 'sfx2/blip.wav', 0.2]), [v(74), 'sfx2/impact.wav', 0.35],
  [v(87), 'sfx2/error.wav', 0.3], [v(107), 'money/boom.wav', 0.4], [S.wake, 'sfx2/whip.wav', 0.35], [S.end, 'sfx2/ding.wav', 0.3],
];
const GAIN = 0.45;

const Sound: React.FC = () => (
  <>
    {VO.map((o) => (
      <Sequence key={o.src} from={fr(o.at)} durationInFrames={fr(o.dur) + 6}>
        <Audio src={staticFile(o.src)} volume={1} />
      </Sequence>
    ))}
    <Audio src={staticFile('wake/tension.mp3')} volume={(x) => (x >= S.wake && x < S.wake + 20 ? 0.02 : 0.16)} />
    {SFX.map(([at, src, vol], i) => (
      <Sequence key={i} from={Math.max(0, at)} durationInFrames={FPS * 2}>
        <Audio src={staticFile(src)} volume={vol * GAIN} />
      </Sequence>
    ))}
  </>
);

export const WakeVideo: React.FC = () => {
  loadFonts();
  loadCaveat();
  const order: [number, number, React.FC, boolean?][] = [
    [S.hook, S.r1, Hook], [S.r1, S.r2, R1, true], [S.r2, S.r3, R2, true], [S.r3, S.r4, R3, true], [S.r4, S.r5, R4, true], [S.r5, S.r6, R5, true],
    [S.r6, S.last, R6, true], [S.last, S.wake, Last, true], [S.wake, S.ask, Wake, true], [S.ask, S.end, Ask, true],
  ];
  return (
    <AbsoluteFill style={{background: '#05060a'}}>
      {order.map(([from, to, C, cut], i) => <Scene key={i} from={from} to={to} cut={cut}><C /></Scene>)}
      <Flash at={v(7)} len={10} />
      <Flash at={v(74)} len={10} />
      <Flash at={v(107)} len={14} />
      <Flash at={S.wake} len={10} color="rgba(255,255,255,0.6)" />
      <AbsoluteFill style={{top: H - 220, height: 220, background: 'linear-gradient(rgba(5,6,10,0), #05060a)'}} />
      <Captions cues={CUES} />
      <End />
      <Sound />
    </AbsoluteFill>
  );
};
