// Ролик «Никита: 12 каток, 3 часа сна, 5 энергетиков» (9:16, ~58 с) в формате «Это Никита…»: хронология по неделям, счётчики.
// Предостерегающий ролик: гибель показана без подробностей (падение, кардиограмма → прямая линия, экран гаснет),
// в конце — карточка без голоса «персонаж выдуман, спи 7+ часов». Никита — тот же персонаж, что в «Первой игре Никиты».
// Исходник пользователя: окно «Your match is ready» CS2 (public/nik2/ready.png). Писк монитора и прямая линия — сгенерированы.
import React from 'react';
import {AbsoluteFill, Audio, Img, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {loadFonts} from '../theme';
import {FPS, fr} from '../tilt/script';
import {VO, TOTAL, CUES, v} from './script';
import {Captions, clamp, pop} from '../tilt/UI';
import {Scene, Cam, Flash} from '../money/Money';
import {H, RED} from '../money/Props';
import {LyokhaBust, Mood} from '../money/Lyokha';

export const NIK2_FRAMES = fr(TOTAL);

const S = {hook: 0, w1: v(28) - 4, w3: v(42) - 4, w5: v(62) - 4, w7: v(76) - 4, night: v(90) - 4, ready: v(107) - 4, card: fr(54.6)};
const GOLD = '#ffd23f', GREEN = '#2bd96b', NIK_HAIR = '#8a5a2b', NIK_HOOD = '#7a2630';

const Big: React.FC<{x: number; y: number; s: number; size: number; color?: string; children: React.ReactNode}> = ({x, y, s, size, color = '#fff', children}) => (
  <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%, -50%) scale(${s})`, opacity: Math.min(1, s * 2), fontFamily: 'Montserrat', fontWeight: 900, fontSize: size,
    color, whiteSpace: 'nowrap', textAlign: 'center', lineHeight: 1.05, textShadow: color === '#fff' ? '0 4px 0 rgba(0,0,0,0.6)' : `0 0 34px ${color}88, 0 4px 0 rgba(0,0,0,0.6)`}}>{children}</div>
);
const Chip: React.FC<{x: number; y: number; s: number; bg: string; color?: string; size?: number; children: React.ReactNode}> = ({x, y, s, bg, color = '#fff', size = 40, children}) => (
  <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%, -50%) scale(${s})`, opacity: Math.min(1, s * 2), background: bg, color, fontFamily: 'Montserrat', fontWeight: 900,
    fontSize: size, padding: '12px 30px', borderRadius: 50, whiteSpace: 'nowrap', boxShadow: `0 0 30px ${bg}88`}}>{children}</div>
);
const Kid: React.FC<{x?: number; y?: number; s?: number; mood?: Mood; blink?: number; sweat?: boolean; light?: string; lightAmt?: number; dx?: number}> = ({x = 540, y = 820, s = 1, dx = 0, ...p}) => (
  <svg width={1080} height={H} viewBox={`0 0 1080 ${H}`} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
    <g transform={`translate(${x + dx} ${y}) scale(${s})`}><LyokhaBust hair={NIK_HAIR} hood={NIK_HOOD} {...p} /></g>
  </svg>
);
// ночная комната: окно, стол, монитор светит
const Room: React.FC<{glow?: string; dark?: number}> = ({glow = '#5a8acb', dark = 0}) => (
  <>
    <svg width={1080} height={H} viewBox={`0 0 1080 ${H}`} style={{position: 'absolute', inset: 0}}>
      <rect width={1080} height={H} fill="#10131c" />
      <rect x={80} y={140} width={300} height={360} fill="#070b1a" stroke="#22283a" strokeWidth={14} />
      <line x1={230} y1={140} x2={230} y2={500} stroke="#22283a" strokeWidth={10} />
      {[[130, 200], [300, 240], [180, 400]].map(([a, b], i) => <circle key={i} cx={a} cy={b} r={3} fill="#fff" opacity={0.6} />)}
      <rect x={0} y={860} width={1080} height={320} fill="#160f0c" />
      <circle cx={540} cy={700} r={460} fill={glow} opacity={0.12} />
    </svg>
    {dark > 0 && <AbsoluteFill style={{height: H, background: '#000', opacity: dark}} />}
  </>
);
const Can: React.FC<{w?: number; open?: boolean}> = ({w = 90, open}) => (
  <svg width={w} height={w * 1.7} viewBox="0 0 60 102">
    <rect x={6} y={8} width={48} height={90} rx={8} fill="#141414" stroke="#3a3a3a" strokeWidth={3} />
    <rect x={8} y={30} width={44} height={44} fill={GREEN} />
    <path d="M30 36 L22 54 L31 54 L26 70 L39 48 L30 48 L35 36 Z" fill="#0b0c12" />
    <rect x={14} y={2} width={32} height={8} rx={3} fill="#666" />
    {open && <circle cx={34} cy={6} r={4} fill="#222" />}
  </svg>
);
// кардиограмма: удары, пропуски, прямая линия
const Ecg: React.FC<{f: number; gaps?: boolean; flat?: number; y?: number; color?: string}> = ({f, gaps, flat = 0, y = 600, color = GREEN}) => {
  const w = 1000, period = 110, off = (f * 6) % period;
  const pts: string[] = [];
  for (let x = 0; x <= w; x += 4) {
    const k = Math.floor((x + off) / period);
    const ph = ((x + off) % period) / period;
    const skip = gaps && k % 4 === 2;
    let yy = 0;
    if (!skip && x < w * (1 - flat)) yy = ph > 0.45 && ph < 0.5 ? -110 : ph >= 0.5 && ph < 0.55 ? 60 : ph >= 0.6 && ph < 0.7 ? -18 : 0;
    pts.push(`${x},${yy}`);
  }
  return (
    <svg width={1080} height={300} viewBox={`-40 -150 ${w + 80} 300`} style={{position: 'absolute', left: 0, top: y - 150}}>
      <polyline points={pts.join(' ')} fill="none" stroke={color} strokeWidth={6} strokeLinejoin="round" style={{filter: `drop-shadow(0 0 8px ${color})`}} />
    </svg>
  );
};

// ---------------------------------------------------------------- шапка: неделя/время, каток, сон, банок, пульс
const STAMP: [number, string, number][] = [[S.w1, 'НЕДЕЛЯ 1 · 03:40', 85], [S.w3, 'НЕДЕЛЯ 3 · 03:10', 110], [S.w5, 'НЕДЕЛЯ 5 · 04:20', 118], [S.w7, 'НЕДЕЛЯ 7 · 03:55', 132], [S.night, 'НОЧЬ 61 · 04:00', 140]];
const TopBar: React.FC = () => {
  const f = useCurrentFrame();
  if (f < S.w1 || f >= v(104)) return null;
  const [, label, bpm] = [...STAMP].reverse().find(([a]) => f >= a)!;
  const col = (a: string, b: string, c = '#fff') => <div style={{textAlign: 'center'}}><div style={{fontSize: 14, color: '#8f98a0', fontWeight: 900}}>{a}</div><div style={{fontFamily: 'Russo One', fontSize: 28, color: c}}>{b}</div></div>;
  return (
    <div style={{position: 'absolute', left: 30, right: 30, top: 24, display: 'flex', alignItems: 'center', gap: 22, background: 'rgba(8,10,16,0.85)', border: '2px solid #2a3040', borderRadius: 14, padding: '8px 18px', fontFamily: 'Montserrat'}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 10, fontWeight: 900, fontSize: 22, color: '#fff'}}><span style={{width: 12, height: 12, borderRadius: 6, background: RED}} />{label}</div>
      <div style={{marginLeft: 'auto', display: 'flex', gap: 22}}>
        {col('КАТОК', '12')}{col('СОН', '3 ч', RED)}{col('БАНОК', '5', GREEN)}{col('ПУЛЬС', `${bpm + Math.round(Math.sin(f / 5) * 3)}`, bpm > 100 ? RED : '#fff')}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------- сцены
const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const icon = (at: number, x: number, content: React.ReactNode, label: string) => (
    <div style={{position: 'absolute', left: x, top: 470, transform: `translate(-50%,-50%) scale(${pop(f, at, fps, 320, 10)})`, opacity: f >= at ? 1 : 0, textAlign: 'center', fontFamily: 'Montserrat'}}>
      <div style={{height: 150, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{content}</div>
      <div style={{fontWeight: 900, fontSize: 34, color: '#fff', marginTop: 8}}>{label}</div>
    </div>
  );
  return (
    <>
      <Room />
      <Cam s={interpolate(f, [0, S.w1], [1.1, 1.0], clamp)}>
        <Kid y={900} s={1.05} mood="tired" light="#5a8acb" lightAmt={0.25} />
      </Cam>
      <Chip x={540} y={170} s={pop(f, 2, fps)} bg={GOLD} color="#111" size={44}>НИКИТА · 17 ЛЕТ</Chip>
      {icon(v(7), 200, <span style={{fontFamily: 'Russo One', fontSize: 110, color: '#fff'}}>12</span>, 'каток в день')}
      {icon(v(11), 540, <span style={{fontFamily: 'Russo One', fontSize: 110, color: RED}}>3 ч</span>, 'сна')}
      {icon(v(14), 880, <Can w={84} />, '5 энергетиков')}
      {f >= v(25) && <Big x={540} y={700} s={pop(f, v(25), fps, 380, 8)} size={62} color={RED}>ЧЕРЕЗ 2 МЕСЯЦА ЕГО НЕ СТАНЕТ</Big>}
    </>
  );
};

const W1: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const elo = Math.round(interpolate(f, [v(34), v(36) + 20], [1450, 1760], clamp) / 10) * 10;
  return (
    <>
      <Room />
      <Kid y={900} s={1.0} mood="happy" />
      <Chip x={540} y={170} s={pop(f, S.w1, fps)} bg={GREEN} color="#06260f" size={40}>НЕПОБЕДИМЫЙ 😎</Chip>
      {f >= v(34) && (
        <div style={{position: 'absolute', left: 540, top: 330, transform: `translate(-50%,-50%) scale(${pop(f, v(34), fps)})`, display: 'flex', alignItems: 'center', gap: 18}}>
          <Img src={staticFile(`x2/lvl${elo >= 1751 ? 9 : elo >= 1531 ? 8 : 7}.png`)} style={{width: 110}} />
          <span style={{fontFamily: 'Russo One', fontSize: 90, color: GREEN}}>{elo.toLocaleString('ru-RU')}</span>
        </div>
      )}
      {f >= v(36) && <div style={{position: 'absolute', left: 860, top: 520, transform: `rotate(12deg) scale(${pop(f, v(36), fps)})`}}><Can w={90} open /></div>}
      {f >= v(39) && <Chip x={540} y={520} s={pop(f, v(39), fps)} bg="#1c2030" size={40}>+5 каток</Chip>}
    </>
  );
};

const W3: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const fill = interpolate(f, [v(46), v(51)], [0, 1], clamp);
  const shake = f >= v(55) ? Math.sin(f * 2.3) * 5 : 0;
  return (
    <>
      <Room glow="#cb5a5a" />
      <Kid y={960} s={0.9} mood="worried" sweat dx={shake} />
      <div style={{position: 'absolute', left: 540, top: 250, transform: 'translate(-50%,-50%)', display: 'flex', gap: 16}}>
        {Array.from({length: 5}).map((_, i) => <div key={i} style={{transform: `scale(${pop(f, v(44) + i * 3, fps)})`}}><Can w={80} open /></div>)}
      </div>
      {f >= v(46) && (
        <div style={{position: 'absolute', left: 90, top: 460, width: 900, fontFamily: 'Montserrat'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', fontWeight: 900, fontSize: 28, color: '#fff'}}><span>КОФЕИН</span><span style={{color: fill > 0.5 ? RED : '#fff'}}>{fill > 0.5 ? '2× НОРМЫ' : 'норма'}</span></div>
          <div style={{position: 'relative', marginTop: 10, height: 40, borderRadius: 20, background: '#1c2030', overflow: 'hidden'}}>
            <div style={{width: `${fill * 100}%`, height: 40, background: fill > 0.5 ? RED : GREEN}} />
            <div style={{position: 'absolute', left: '50%', top: 0, width: 4, height: 40, background: '#fff'}} />
          </div>
        </div>
      )}
      {f >= v(55) && <Chip x={240} y={640} s={pop(f, v(55), fps)} bg={RED} size={34}>руки дрожат</Chip>}
      {f >= v(57) && <Chip x={800} y={640} s={pop(f, v(57), fps)} bg={RED} size={34}>❤ 110 уд/мин</Chip>}
    </>
  );
};

const W5: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const sleep = f >= v(65) && f < v(69) ? Math.min(1, (f - v(65)) / 10) : 0;
  return (
    <>
      <Room />
      <Kid y={900 + sleep * 40} s={1.0} mood="tired" blink={sleep} />
      {sleep > 0.5 && <Big x={760} y={460} s={1} size={60} color="#9fb4ff">z z z</Big>}
      {f >= v(69) && (
        <div style={{position: 'absolute', left: 60, top: 180, display: 'flex', flexDirection: 'column', gap: 10, fontFamily: 'Montserrat', fontWeight: 900, fontSize: 36}}>
          {['ТЫ СПИШЬ???', 'НИКИТА!!!', 'ПРОСНИСЬ'].map((t, i) => f >= v(69) + i * 6 && <div key={i} style={{background: 'rgba(40,8,12,0.85)', borderLeft: `6px solid ${RED}`, padding: '10px 18px', color: '#fff'}}><span style={{color: '#7ad46b'}}>Max:</span> {t}</div>)}
        </div>
      )}
      {f >= v(73) && <div style={{position: 'absolute', left: 860, top: 560, transform: `rotate(-8deg) scale(${pop(f, v(73), fps)})`}}><Can w={100} open /></div>}
      {f >= v(73) && <Chip x={760} y={500} s={pop(f, v(73), fps)} bg="#1c2030" size={34}>*пшшш*</Chip>}
    </>
  );
};

const W7: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const beat = 1 + 0.12 * Math.max(0, Math.sin(f / 3));
  return (
    <>
      <AbsoluteFill style={{height: H, background: 'radial-gradient(ellipse at 50% 45%, #3a0a10, #050507 70%)'}} />
      <div style={{position: 'absolute', left: 540, top: 300, transform: `translate(-50%,-50%) scale(${beat})`, fontSize: 170, filter: `drop-shadow(0 0 30px ${RED})`}}>❤️</div>
      <Ecg f={f} gaps y={620} color={RED} />
      {f >= v(78) && <Chip x={540} y={480} s={pop(f, v(78), fps)} bg={RED} size={36}>пропуски ударов</Chip>}
      {f >= v(81) && <Chip x={540} y={800} s={pop(f, v(81), fps)} bg="#1c2030" size={36}>колет в груди</Chip>}
      {f >= v(84) && <div style={{position: 'absolute', left: 540, top: 940, transform: `translate(-50%,-50%) scale(${pop(f, v(84), fps)})`, background: '#fff', color: '#111', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 38, padding: '14px 28px', borderRadius: 26}}>«отосплюсь потом…»</div>}
    </>
  );
};

const Night: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const stand = interpolate(f, [v(97), v(100)], [0, -80], clamp);
  const fall = interpolate(f, [v(103), v(103) + 14], [0, 1], clamp);
  const flat = interpolate(f, [v(104), v(104) + 18], [0, 1], clamp);
  const dark = interpolate(f, [v(105), v(106) + 6], [0, 0.85], clamp);
  return (
    <>
      <Room dark={dark} />
      {fall < 1 && <Kid y={900 + stand + fall * 700} s={1.0} mood="tired" sweat />}
      {f >= v(93) && <Big x={540} y={230} s={pop(f, v(93), fps)} size={130} color={RED}>04:00</Big>}
      {f >= v(95) && f < v(103) && <Chip x={540} y={380} s={pop(f, v(95), fps)} bg="#1c2030" size={40}>КАТКА 12/12</Chip>}
      {f >= v(103) && <Ecg f={f} flat={flat} y={620} color={RED} />}
    </>
  );
};

const Ready: React.FC = () => {
  const f = useCurrentFrame();
  const t = Math.max(0, 18 - Math.floor((f - S.ready) / 30));
  return (
    <>
      <AbsoluteFill style={{height: H, background: '#030305'}} />
      <div style={{position: 'absolute', left: 540, top: 440, transform: 'translate(-50%,-50%)', boxShadow: `0 0 ${80 + 20 * Math.sin(f / 6)}px rgba(56,200,90,0.45)`}}>
        <div style={{position: 'relative', width: 955, height: 412}}>
          <Img src={staticFile('nik2/ready.png')} style={{width: 955, height: 412}} />
          <div style={{position: 'absolute', left: 430, top: 344, width: 100, height: 36, background: '#0f2a14'}} />
          <div style={{position: 'absolute', left: 0, right: 0, top: 344, textAlign: 'center', fontFamily: 'Russo One', fontSize: 30, color: '#6fe08a'}}>0:{String(t).padStart(2, '0')}</div>
        </div>
      </div>
      <svg width={1080} height={H} viewBox={`0 0 1080 ${H}`} style={{position: 'absolute', inset: 0}}>
        <path d="M400 1180 L420 860 Q540 800 660 860 L680 1180 Z" fill="#14161c" />
        <rect x={430} y={760} width={220} height={120} rx={30} fill="#1a1d24" />
      </svg>
    </>
  );
};

// карточка без голоса: посыл ролика
const Card: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (f < S.card) return null;
  const a = pop(f, S.card, fps, 160, 16);
  return (
    <AbsoluteFill style={{background: '#000', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 80, paddingBottom: 300}}>
      <div style={{opacity: Math.min(1, a * 1.5), fontFamily: 'Montserrat', color: '#fff'}}>
        <div style={{fontSize: 34, fontWeight: 600, color: '#9aa3b2'}}>Никита — выдуманный персонаж.</div>
        <div style={{fontSize: 34, fontWeight: 600, color: '#9aa3b2', marginTop: 8}}>Но так бывает на самом деле.</div>
        <div style={{fontSize: 56, fontWeight: 900, marginTop: 40, lineHeight: 1.2}}>Спи 7+ часов.<br />Отложи энергетик.</div>
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- звук: голос + тихий дрон + сердцебиение + писк монитора
type Fx = [number, string, number];
const SFX: Fx[] = [
  [v(7), 'sfx2/pop.wav', 0.25], [v(11), 'sfx2/pop.wav', 0.25], [v(14), 'sfx2/pop.wav', 0.25], [v(25), 'sfx2/impact.wav', 0.35],
  [v(36), 'sfx2/pop.wav', 0.25], ...Array.from({length: 5}).map((_, i): Fx => [v(44) + i * 3, 'sfx2/click.wav', 0.2]),
  ...Array.from({length: 6}).map((_, i): Fx => [v(55) + i * 16, 'tilt/heart.wav', 0.35]), [v(69), 'tilt/notif.wav', 0.25], [v(73), 'sfx2/whoosh.wav', 0.2],
  ...Array.from({length: 8}).map((_, i): Fx => [S.w7 + i * 18 + (i % 4 === 2 ? 9 : 0), 'nik2/beep.mp3', i % 4 === 2 ? 0 : 0.5]),
  ...Array.from({length: 5}).map((_, i): Fx => [S.night + i * 14, 'tilt/heart.wav', 0.4]), [v(103), 'sfx2/hit.wav', 0.35],
];
const GAIN = 0.45;

const Sound: React.FC = () => (
  <>
    {VO.map((o) => (
      <Sequence key={o.src} from={fr(o.at)} durationInFrames={fr(o.dur) + 6}>
        <Audio src={staticFile(o.src)} volume={1} />
      </Sequence>
    ))}
    <Audio src={staticFile('wake/tension.mp3')} volume={(x) => (x >= v(104) ? 0 : 0.11)} />
    <Sequence from={v(104)} durationInFrames={FPS * 3}><Audio src={staticFile('nik2/flat.mp3')} volume={0.5} /></Sequence>
    {SFX.map(([at, src, vol], i) => (
      <Sequence key={i} from={Math.max(0, at)} durationInFrames={FPS * 2}>
        <Audio src={staticFile(src)} volume={vol * GAIN} />
      </Sequence>
    ))}
  </>
);

export const Nik2: React.FC = () => {
  loadFonts();
  const order: [number, number, React.FC, boolean?][] = [
    [S.hook, S.w1, Hook], [S.w1, S.w3, W1, true], [S.w3, S.w5, W3, true], [S.w5, S.w7, W5, true], [S.w7, S.night, W7, true],
    [S.night, S.ready, Night, true], [S.ready, S.card, Ready, true],
  ];
  return (
    <AbsoluteFill style={{background: '#050507'}}>
      {order.map(([from, to, C, cut], i) => <Scene key={i} from={from} to={to} cut={cut}><C /></Scene>)}
      <Flash at={v(25)} len={10} />
      <TopBar />
      <AbsoluteFill style={{top: H - 220, height: 220, background: 'linear-gradient(rgba(5,5,7,0), #050507)'}} />
      <Captions cues={CUES} />
      <Card />
      <Sound />
    </AbsoluteFill>
  );
};
