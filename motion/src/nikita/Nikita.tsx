// Ролик «Первая игра Никиты» (9:16, ~64 с) в формате «Это Никита, ему 14…»: хронология, счётчик часов и дата в углу.
// Никита и младший брат — голова Лёхи v2 с другими волосами и худи. Исходники пользователя: кадр матча с чатом
// (public/nikita/game.png, сообщения стёрты и нарисованы заново), окно «Вы исключены из матча» (kicked.png, друзья размыты),
// строка CS2 из профиля Steam (steam_row.png, часы стёрты и нарисованы).
import React from 'react';
import {AbsoluteFill, Audio, Img, Sequence, interpolate, random, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {loadFonts} from '../theme';
import {FPS, fr} from '../tilt/script';
import {VO, TOTAL, CUES, v} from './script';
import {Captions, clamp, pop} from '../tilt/UI';
import {Scene, Cam, Flash, loadCaveat} from '../money/Money';
import {ramp} from '../tilt/Tilt';
import {H, RED, Mom} from '../money/Props';
import {LyokhaBust, Mood} from '../money/Lyokha';

export const NIKITA_FRAMES = fr(TOTAL);

const S = {
  hook: 0, first: v(19) - 4, week: v(32) - 4, month: v(46) - 4, friends: v(63) - 4, winter: v(71) - 4, school: v(93) - 4,
  smash: v(101) - 4, silence: v(109) - 4, brother: v(116) - 4, close: v(128) - 4, moral: v(138) - 4, end: fr(62.6),
};
const GOLD = '#ffd23f', GREEN = '#2bd96b', NIK_HAIR = '#8a5a2b', NIK_HOOD = '#7a2630', BRO_HOOD = '#2f6a4a';

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
const Bubble: React.FC<{x: number; y: number; s: number; color?: string; text?: string; size?: number; children: React.ReactNode}> = ({x, y, s, color = '#fff', text = '#111', size = 40, children}) => (
  <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%, -50%) scale(${s})`, opacity: Math.min(1, s * 2), background: color, color: text, fontFamily: 'Montserrat', fontWeight: 900,
    fontSize: size, padding: '16px 28px', borderRadius: 26, whiteSpace: 'nowrap', boxShadow: '0 10px 30px rgba(0,0,0,0.5)'}}>{children}</div>
);

// Никита / брат — бюст Лёхи с другими волосами и худи
const Kid: React.FC<{x: number; y: number; s: number; mood?: Mood; bro?: boolean; look?: number; blink?: number; sweat?: boolean; tears?: number; light?: string; lightAmt?: number}> = ({x, y, s, bro, ...p}) => (
  <svg width={1080} height={H} viewBox={`0 0 1080 ${H}`} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
    <g transform={`translate(${x} ${y}) scale(${s})`}><LyokhaBust hair={NIK_HAIR} hood={bro ? BRO_HOOD : NIK_HOOD} {...p} /></g>
  </svg>
);

// комната: стена, окно, стол с монитором
const Room: React.FC<{night?: number; screen?: string; lamp?: number}> = ({night = 1, screen = '#5a8acb', lamp = 0}) => (
  <svg width={1080} height={H} viewBox={`0 0 1080 ${H}`} style={{position: 'absolute', inset: 0}}>
    <rect width={1080} height={H} fill={night > 0.5 ? '#141826' : '#3a3a4a'} />
    <rect x={80} y={120} width={300} height={360} fill={night > 0.5 ? '#0a1024' : '#9fd0ff'} stroke="#2a3040" strokeWidth={14} />
    <line x1={230} y1={120} x2={230} y2={480} stroke="#2a3040" strokeWidth={10} />
    {night > 0.5 && [[130, 180], [300, 220], [180, 380]].map(([a, b], i) => <circle key={i} cx={a} cy={b} r={3} fill="#fff" opacity={0.7} />)}
    <rect x={600} y={140} width={180} height={230} fill="#2a2030" stroke="#1a1420" strokeWidth={6} />
    <text x={690} y={270} textAnchor="middle" fontFamily="Russo One" fontSize={52} fill="#e38b1b">CS2</text>
    <rect x={0} y={860} width={1080} height={320} fill="#1a1410" />
    <rect x={0} y={850} width={1080} height={20} fill="#2a2018" />
    {lamp > 0 && <circle cx={540} cy={700} r={420} fill={screen} opacity={0.12 * lamp} />}
  </svg>
);

// ---------------------------------------------------------------- HUD: дата/время слева, счётчик часов справа (как в примере)
const STAMPS: [number, string, number][] = [
  [0, 'СЕНТЯБРЬ · 18:40', 0], [v(19), 'СЕНТЯБРЬ · 18:52', 1], [v(32), 'СЕНТЯБРЬ · 02:00', 30], [v(46), 'ОКТЯБРЬ · 23:10', 140],
  [v(63), 'ОКТЯБРЬ · 16:30', 180], [v(71), 'ДЕКАБРЬ · 01:20', 400], [v(76), 'ДЕКАБРЬ · 01:20', 1000], [v(93), 'ФЕВРАЛЬ · 06:40', 1500],
  [v(101), 'МАРТ · 03:00', 1820], [v(116), 'МАРТ · 03:05', 1820],
];
const Hud: React.FC = () => {
  const f = useCurrentFrame();
  if (f >= S.end) return null;
  let i = 0;
  while (i + 1 < STAMPS.length && f >= STAMPS[i + 1][0]) i++;
  const [a, label, h0] = STAMPS[i];
  const next = STAMPS[i + 1];
  const hours = next ? Math.round(interpolate(f, [a, next[0]], [h0, next[2]], clamp)) : h0;
  const hot = hours >= 1000;
  return (
    <>
      <div style={{position: 'absolute', left: 28, top: 26, display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(8,10,16,0.75)', borderRadius: 10, padding: '8px 16px', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 24, color: '#fff'}}>
        <span style={{width: 12, height: 12, borderRadius: 6, background: RED}} />{label}
      </div>
      <div style={{position: 'absolute', right: 28, top: 22, background: 'rgba(8,10,16,0.8)', border: `3px solid ${hot ? RED : '#3a4150'}`, borderRadius: 12, padding: '6px 16px', textAlign: 'center', fontFamily: 'Montserrat'}}>
        <div style={{fontSize: 15, fontWeight: 900, color: '#9aa3b2', letterSpacing: 1}}>ЧАСОВ В CS2</div>
        <div style={{fontFamily: 'Russo One', fontSize: 40, color: hot ? RED : '#fff', lineHeight: 1.1}}>{hours.toLocaleString('ru-RU')}</div>
      </div>
    </>
  );
};

// ---------------------------------------------------------------- сцены
const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const launched = f >= v(7);
  return (
    <>
      <Room night={0} lamp={launched ? 1 : 0} />
      <Kid x={540} y={760} s={1.05} mood={launched ? 'happy' : 'neutral'} look={0.2} />
      {f >= v(2) && <Chip x={540} y={330} s={pop(f, v(2), fps)} bg={GOLD} color="#111" size={44}>НИКИТА · 14 ЛЕТ</Chip>}
      {launched && (
        <div style={{position: 'absolute', left: 540, top: 520, width: 600, transform: `translate(-50%,-50%) scale(${pop(f, v(7), fps)})`, background: '#16191f', border: '3px solid #2c3140', borderRadius: 18, padding: 26, textAlign: 'center', fontFamily: 'Montserrat', boxShadow: '0 30px 60px rgba(0,0,0,0.6)'}}>
          <div style={{fontFamily: 'Russo One', fontSize: 70, color: '#fff'}}>CS2</div>
          <div style={{marginTop: 12, background: GREEN, color: '#06260f', fontWeight: 900, fontSize: 38, padding: '14px 0', borderRadius: 10}}>ИГРАТЬ</div>
        </div>
      )}
      {f >= v(14) && <Chip x={540} y={1060} s={pop(f, v(14), fps)} bg={RED} size={38}>он ещё не знает, к чему это приведёт</Chip>}
    </>
  );
};

type ChatLine = {who: string; c: string; t: string; at: number; all?: boolean};
const GameChat: React.FC<{f: number; lines: ChatLine[]}> = ({f, lines}) => (
  <div style={{position: 'absolute', left: 18 * 0.646, top: 298 * 0.646, width: 820 * 0.646, height: 512 * 0.646, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: 8, boxSizing: 'border-box', fontFamily: 'Montserrat', fontWeight: 600, fontSize: 19}}>
    {lines.filter((l) => f >= l.at).slice(-7).map((l, i) => (
      <div key={i} style={{color: '#fff', marginTop: 6, textShadow: '0 1px 2px #000'}}>• <span style={{color: '#ddd'}}>[{l.all ? 'ВСЕМ' : 'КОМАНДЕ'}]</span> <span style={{color: l.c}}>{l.who}:</span> {l.t}</div>
    ))}
  </div>
);
const First: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const dead = f >= v(22);
  return (
    <>
      <Bg />
      <div style={{position: 'absolute', left: 0, top: 120, width: 1080, height: 608, overflow: 'hidden'}}>
        <Img src={staticFile('nikita/game.png')} style={{width: 1080, height: 608, filter: dead ? 'grayscale(1) brightness(0.6)' : 'none'}} />
        <GameChat f={f} lines={[
          {who: 'Alex', c: '#5aa9e6', t: 'двое на А', at: S.first},
          {who: 'Max', c: '#7ad46b', t: 'слышу шаги', at: S.first + 6},
          {who: 'Nikita', c: '#e8c24a', t: 'иду мид', at: v(20)},
          {who: 'Denis', c: '#c27ae8', t: 'ты бот?', at: v(28)},
        ]} />
        {dead && <div style={{position: 'absolute', right: 20, top: 20, background: 'rgba(0,0,0,0.6)', border: `2px solid ${RED}`, borderRadius: 6, padding: '6px 12px', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 22, color: '#fff'}}>Enemy ⌖ <span style={{color: '#e8c24a'}}>Nikita</span></div>}
      </div>
      {dead && <Chip x={540} y={780} s={pop(f, v(22), fps, 320, 9)} bg={RED} size={44}>УМЕР ПЕРВЫМ</Chip>}
      {f >= v(30) && <Kid x={540} y={1060} s={0.55} mood="happy" />}
      {f >= v(30) && <Bubble x={780} y={900} s={pop(f, v(30), fps)} size={34}>ахахах 😂</Bubble>}
    </>
  );
};

const Week: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <>
      <Room night={1} lamp={1} />
      <Kid x={540} y={780} s={1.0} mood="tired" light="#5a8acb" lightAmt={0.25} />
      <Big x={540} y={300} s={pop(f, v(38), fps)} size={150} color={RED}>02:00</Big>
      {f >= v(42) && <Bubble x={540} y={480} s={pop(f, v(42), fps)} size={40}>«ещё одна — и спать»</Bubble>}
    </>
  );
};

const Month: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const throwT = ramp(f, v(52), v(52) + 10);
  const crack = f >= v(52) + 10;
  const mom = f >= v(56);
  return (
    <>
      <Room night={1} lamp={1} screen="#cb3a3a" />
      {!mom && (
        <div style={{position: 'absolute', left: 540, top: 330, width: 760, transform: `translate(-50%,-50%) scale(${pop(f, S.month, fps)})`, background: 'rgba(40,8,12,0.92)', border: `4px solid ${RED}`, borderRadius: 18, padding: '24px 0', textAlign: 'center', fontFamily: 'Montserrat'}}>
          <div style={{fontSize: 74, fontWeight: 900, color: RED}}>ПОРАЖЕНИЕ</div>
          {f >= v(50) && <div style={{fontSize: 40, fontWeight: 900, color: '#fff', marginTop: 8}}>5 ПОДРЯД</div>}
        </div>
      )}
      <Kid x={540} y={800} s={1.0} mood={f >= v(62) ? 'shocked' : 'worried'} sweat light="#cb3a3a" lightAmt={0.2} />
      {f >= v(52) && !crack && (
        <svg width={1080} height={H} viewBox={`0 0 1080 ${H}`} style={{position: 'absolute', inset: 0}}>
          <g transform={`translate(${interpolate(throwT, [0, 1], [640, 980])} ${interpolate(throwT, [0, 1], [820, 260]) - Math.sin(throwT * Math.PI) * 120}) rotate(${throwT * 540})`}>
            <rect x={-30} y={-46} width={60} height={92} rx={28} fill="#1d2129" stroke="#3a4250" strokeWidth={4} />
          </g>
        </svg>
      )}
      {crack && (
        <svg width={1080} height={H} viewBox={`0 0 1080 ${H}`} style={{position: 'absolute', inset: 0}}>
          <path d="M980 260 l-40 -30 m40 30 l-20 50 m20 -50 l50 -10 m-50 10 l-50 40 m50 -40 l30 60" stroke="#c9d1dc" strokeWidth={5} fill="none" />
          <rect x={950} y={300} width={50} height={80} rx={24} fill="#1d2129" stroke="#3a4250" strokeWidth={4} transform="rotate(70 975 340)" />
        </svg>
      )}
      {mom && (
        <div style={{position: 'absolute', left: -120, top: 120, width: 560, height: 620, overflow: 'hidden', transform: `translateX(${(1 - Math.min(1, (f - v(56)) / 8)) * -200}px)`}}>
          <div style={{transform: 'scale(0.55)', transformOrigin: '0 0', width: 1080, height: H}}><Mom tears={0} f={f} /></div>
        </div>
      )}
      {f >= v(60) && <Bubble x={300} y={170} s={pop(f, v(60), fps)} size={36}>Что случилось?</Bubble>}
      {f >= v(62) && <Bubble x={760} y={460} s={pop(f, v(62), fps, 320, 9)} color={RED} text="#fff" size={50}>НИЧЕГО!</Bubble>}
    </>
  );
};

const Friends: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const msg = (who: string, t: string, at: number, me = false) => {
    const a = Math.min(1, Math.max(0, (f - at) / 6));
    if (a <= 0) return null;
    return (
      <div style={{alignSelf: me ? 'flex-end' : 'flex-start', maxWidth: 520, background: me ? '#2b5278' : '#182533', color: '#fff', fontSize: 34, fontWeight: 600, padding: '14px 22px', borderRadius: 20, opacity: a, transform: `translateY(${(1 - a) * 16}px)`}}>
        {!me && <div style={{fontSize: 22, color: '#f0a24a', fontWeight: 900}}>{who}</div>}{t}
      </div>
    );
  };
  return (
    <>
      <Bg glow="#1a3a5a" />
      <div style={{position: 'absolute', left: 540, top: 560, width: 620, height: 900, transform: 'translate(-50%,-50%)', borderRadius: 60, background: '#0b0c11', border: '10px solid #2c2f38', overflow: 'hidden', fontFamily: 'Montserrat'}}>
        <div style={{height: 120, background: '#232e3c', display: 'flex', alignItems: 'center', gap: 16, padding: '30px 28px 0', boxSizing: 'border-box'}}>
          <div style={{width: 60, height: 60, borderRadius: 30, background: '#f0a24a', color: '#fff', fontWeight: 900, fontSize: 30, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>П</div>
          <div><div style={{fontSize: 30, color: '#fff', fontWeight: 900}}>Пацаны 🏀</div><div style={{fontSize: 20, color: '#6c7883'}}>Дэн, Макс, Тёма</div></div>
        </div>
        <div style={{position: 'absolute', left: 20, right: 20, bottom: 40, display: 'flex', flexDirection: 'column', gap: 14}}>
          {msg('Дэн', 'Никитос, гулять идёшь?', S.friends + 4)}
          {msg('Макс', 'все уже на площадке', S.friends + 22)}
          {msg('', 'не могу, у меня катка', v(66), true)}
        </div>
      </div>
    </>
  );
};

const Winter: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const hours = Math.round(interpolate(f, [S.winter, v(76)], [400, 1000], clamp));
  const phase = f < v(77) ? 0 : f < v(85) ? 1 : f < v(89) ? 2 : 3;
  return (
    <>
      <Bg glow={phase === 1 ? '#5a1016' : '#1a2a4a'} />
      {phase === 0 && (
        <div style={{position: 'absolute', left: 40, top: 300, width: 1000, borderRadius: 14, overflow: 'hidden', boxShadow: '0 30px 60px rgba(0,0,0,0.6)'}}>
          <Img src={staticFile('nikita/steam_row.png')} style={{width: 1000, display: 'block'}} />
          <div style={{position: 'absolute', right: 30, top: 175, fontFamily: 'Montserrat', fontWeight: 600, fontSize: 30, color: hours >= 1000 ? RED : '#c9cede'}}>{hours.toLocaleString('ru-RU')} ч. всего</div>
        </div>
      )}
      {phase === 0 && f >= v(75) && <Big x={540} y={800} s={pop(f, v(75), fps, 300, 9)} size={110} color={RED}>1 000 ЧАСОВ</Big>}
      {phase === 1 && (
        <>
          <Kid x={540} y={820} s={1.1} mood="shocked" sweat light="#cb3a3a" lightAmt={0.3} />
          <div style={{position: 'absolute', left: 40, top: 150, width: 1000, display: 'flex', flexDirection: 'column', gap: 10, fontFamily: 'Montserrat', fontWeight: 900, fontSize: 34}}>
            {['ВЫ ВСЕ НУБЫ!!!', 'КТО ТАК ИГРАЕТ???', 'ДАЙТЕ МНЕ ТИМУ НОРМАЛЬНУЮ'].map((t, i) => f >= v(77) + i * 12 && (
              <div key={i} style={{background: 'rgba(40,8,12,0.85)', borderLeft: `6px solid ${RED}`, padding: '10px 18px', color: '#fff'}}><span style={{color: '#e8c24a'}}>Nikita:</span> {t}</div>
            ))}
          </div>
        </>
      )}
      {phase === 2 && (
        <Cam s={interpolate(f, [v(85), v(89)], [1.0, 1.08], clamp)}>
          <div style={{position: 'absolute', left: 0, top: 260, width: 1080, height: 608, overflow: 'hidden'}}><Img src={staticFile('nikita/kicked.png')} style={{width: 1080, height: 608}} /></div>
        </Cam>
      )}
      {phase === 3 && (
        <>
          <div style={{position: 'absolute', left: 540, top: 450, width: 760, transform: `translate(-50%,-50%) scale(${pop(f, v(89), fps)})`, background: '#16191f', border: '3px solid #2c3140', borderRadius: 18, padding: 30, fontFamily: 'Montserrat', textAlign: 'center'}}>
            <div style={{fontSize: 30, color: '#8f98a0', fontWeight: 600}}>Создание аккаунта Steam</div>
            <div style={{fontSize: 52, color: '#fff', fontWeight: 900, marginTop: 14}}>nikita_smurf2</div>
            <div style={{marginTop: 18, background: GREEN, color: '#06260f', fontSize: 32, fontWeight: 900, padding: '12px 0', borderRadius: 10}}>Создать</div>
          </div>
          <Chip x={540} y={780} s={pop(f, v(90), fps)} bg={RED} size={40}>ВТОРОЙ АККАУНТ</Chip>
        </>
      )}
    </>
  );
};

const School: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <>
      <Bg glow="#2a2a3a" />
      <div style={{position: 'absolute', left: 300, top: 470, width: 480, transform: `translate(-50%,-50%) rotate(-4deg) scale(${pop(f, S.school, fps)})`, background: '#f3efe2', borderRadius: 10, padding: 30, fontFamily: 'Caveat', boxShadow: '0 20px 50px rgba(0,0,0,0.6)'}}>
        <div style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 30, color: '#23285a'}}>ДНЕВНИК</div>
        {['Алгебра', 'Физика', 'Русский', 'История'].map((s, i) => (
          <div key={s} style={{display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #c9c2b0', padding: '8px 0', fontFamily: 'Montserrat', fontSize: 28, color: '#23285a'}}>
            <span>{s}</span>{f >= S.school + 6 + i * 5 && <span style={{color: RED, fontFamily: 'Caveat', fontWeight: 700, fontSize: 48, lineHeight: 0.8}}>2</span>}
          </div>
        ))}
      </div>
      {f >= v(95) && (
        <div style={{position: 'absolute', left: 800, top: 330, transform: `translate(-50%,-50%) scale(${pop(f, v(95), fps)})`, textAlign: 'center', fontFamily: 'Montserrat'}}>
          <div style={{fontSize: 30, fontWeight: 900, color: '#9aa3b2'}}>СОН</div>
          <div style={{fontFamily: 'Russo One', fontSize: 110, color: RED}}>4 ч</div>
        </div>
      )}
      {f >= v(98) && (
        <svg width={200} height={320} viewBox="0 0 100 160" style={{position: 'absolute', left: 700, top: 520, transform: `scale(${pop(f, v(98), fps)})`}}>
          <rect x={20} y={10} width={60} height={140} rx={10} fill="#1a1a1a" stroke="#3a3a3a" strokeWidth={3} />
          <rect x={22} y={40} width={56} height={70} fill="#2bd96b" />
          <path d="M50 50 L40 75 L52 75 L46 100 L62 68 L50 68 L56 50 Z" fill="#0b0c12" />
        </svg>
      )}
    </>
  );
};

const Smash: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const hit = f >= v(107);
  const t = hit ? Math.min(1, (f - v(107)) / 16) : 0;
  const shake = hit ? Math.max(0, 1 - (f - v(107)) / 14) : 0;
  return (
    <>
      <Bg glow="#5a1016" />
      <AbsoluteFill style={{height: H, background: `rgba(255,43,54,${0.08 + 0.05 * Math.sin(f / 3)})`}} />
      {!hit && <Big x={540} y={240} s={pop(f, S.smash, fps)} size={60} color={RED}>РЕШАЮЩАЯ КАТКА</Big>}
      {!hit && <Big x={540} y={330} s={pop(f, S.smash + 6, fps)} size={60} color="#fff">ПРОИГРАНА</Big>}
      <Cam s={1} shake={shake}>
        <svg width={1080} height={H} viewBox={`0 0 1080 ${H}`} style={{position: 'absolute', inset: 0}}>
          <g transform="translate(140 560)">
            <rect x={0} y={0} width={800} height={240} rx={20} fill="#16181e" stroke="#2c3140" strokeWidth={6} transform={hit ? 'rotate(3 400 120)' : ''} />
            {Array.from({length: 40}).map((_, i) => {
              const cx = 30 + (i % 10) * 76, cy = 24 + Math.floor(i / 10) * 52;
              const r1 = random(`k${i}`), r2 = random(`kk${i}`);
              const fly = hit && r1 < 0.6;
              const dx = fly ? (r1 - 0.3) * 900 * t : 0, dy = fly ? (-300 + r2 * 200) * t + 600 * t * t : 0;
              return <rect key={i} x={cx + dx} y={cy + dy} width={62} height={40} rx={6} fill="#262a33" stroke="#3a4150" strokeWidth={3} transform={fly ? `rotate(${r2 * 360 * t} ${cx + dx + 31} ${cy + dy + 20})` : ''} />;
            })}
          </g>
        </svg>
      </Cam>
      {hit && <Big x={540} y={340} s={pop(f, v(107), fps, 320, 9)} size={96} color={RED}>ХРЯСЬ</Big>}
    </>
  );
};

const Silence: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <>
      <Room night={1} lamp={0.4} />
      <AbsoluteFill style={{height: H, background: 'rgba(0,0,0,0.45)'}} />
      <Kid x={540} y={800} s={1.0} mood="tired" tears={interpolate(f, [v(109), v(115)], [0, 0.6], clamp)} />
      <svg width={1080} height={H} viewBox={`0 0 1080 ${H}`} style={{position: 'absolute', inset: 0}}>
        {Array.from({length: 14}).map((_, i) => <rect key={i} x={120 + random(`s${i}`) * 840} y={900 + random(`t${i}`) * 200} width={50} height={32} rx={5} fill="#262a33" stroke="#3a4150" strokeWidth={3} transform={`rotate(${random(`r${i}`) * 80 - 40} ${145 + random(`s${i}`) * 840} ${916 + random(`t${i}`) * 200})`} />)}
      </svg>
      {f >= v(109) && <Chip x={540} y={260} s={pop(f, v(109), fps)} bg="rgba(10,14,22,0.85)" size={40}>тишина…</Chip>}
    </>
  );
};

const Brother: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const open = ramp(f, S.brother, v(119) + 6);
  return (
    <>
      <Room night={1} lamp={0.4} />
      <AbsoluteFill style={{height: H, background: 'rgba(0,0,0,0.35)'}} />
      <svg width={1080} height={H} viewBox={`0 0 1080 ${H}`} style={{position: 'absolute', inset: 0}}>
        <rect x={620} y={200} width={340} height={660} fill="#0a0b10" />
        <rect x={620} y={200} width={340 * open} height={660} fill="#ffd9a0" opacity={0.85} />
        <rect x={620 + 340 * open} y={200} width={340 * (1 - open) + 12} height={660} fill="#4a3424" stroke="#2a1c12" strokeWidth={6} />
      </svg>
      {open > 0.6 && <Kid x={790} y={720} s={0.62} bro mood="happy" look={-0.4} />}
      <Kid x={320} y={820} s={0.95} mood="tired" look={0.5} />
      {f >= v(123) && <Bubble x={720} y={330} s={pop(f, v(123), fps)} size={36}>Никит, а научишь меня играть?</Bubble>}
    </>
  );
};

const Close: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const closed = f >= v(136) + 4;
  return (
    <>
      <Room night={0} lamp={closed ? 0 : 1} />
      <Kid x={540} y={800} s={1.0} mood={closed ? 'neutral' : 'tired'} look={closed ? 0 : 0.2} />
      {!closed && (
        <div style={{position: 'absolute', left: 540, top: 300, width: 620, transform: 'translate(-50%,-50%)', background: '#16191f', border: '3px solid #2c3140', borderRadius: 14, overflow: 'hidden', fontFamily: 'Montserrat', boxShadow: '0 30px 60px rgba(0,0,0,0.6)'}}>
          <div style={{display: 'flex', alignItems: 'center', background: '#22262f', padding: '10px 16px'}}>
            <span style={{fontFamily: 'Russo One', fontSize: 30, color: '#fff'}}>CS2</span>
            <span style={{marginLeft: 'auto', width: 46, height: 40, borderRadius: 6, background: f >= v(136) ? RED : '#3a3f4a', color: '#fff', fontWeight: 900, fontSize: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${f >= v(136) ? 1.2 : 1})`}}>✕</span>
          </div>
          <div style={{height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8f98a0', fontSize: 30, fontWeight: 600}}>Поиск матча…</div>
        </div>
      )}
      {closed && <Chip x={540} y={280} s={pop(f, v(136) + 4, fps)} bg={GREEN} color="#06260f" size={42}>ИГРА ЗАКРЫТА</Chip>}
    </>
  );
};

const Moral: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <>
      <Room night={0} />
      <AbsoluteFill style={{height: H, background: 'rgba(10,12,20,0.55)'}} />
      <Kid x={380} y={840} s={0.85} mood="happy" />
      <Kid x={720} y={900} s={0.6} bro mood="happy" look={-0.3} />
      <Big x={540} y={260} s={pop(f, S.moral, fps)} size={58} color="#fff">ВСЁ НАЧАЛОСЬ</Big>
      <Big x={540} y={340} s={pop(f, S.moral + 6, fps)} size={58} color={GOLD}>С ОДНОЙ КАТКИ</Big>
    </>
  );
};

const End: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (f < S.end) return null;
  const m = pop(f, S.end, fps, 320, 9);
  return (
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, #2a1a3a, #0b0c12 70%)', alignItems: 'center', justifyContent: 'center', paddingBottom: 240, textAlign: 'center'}}>
      <div style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 64, color: '#fff', transform: `scale(${0.6 + 0.4 * m})`, opacity: Math.min(1, m * 2), lineHeight: 1.1}}>А ТЫ ПОМНИШЬ<br />СВОЮ ПЕРВУЮ<br /><span style={{color: GOLD}}>КАТКУ?</span></div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- звук (тихие эффекты, без фонового гула)
type Fx = [number, string, number];
const SFX: Fx[] = [
  [v(2), 'sfx2/pop.wav', 0.3], [v(7), 'sfx2/click.wav', 0.35], [v(22), 'tilt/hs.wav', 0.35], [v(28), 'sfx2/blip.wav', 0.3],
  [v(38), 'tilt/heart.wav', 0.25], [S.month, 'sfx2/error.wav', 0.3], [v(52) + 10, 'sfx2/hit.wav', 0.4],
  [v(62), 'sfx2/impact.wav', 0.35], [v(66), 'tilt/notif.wav', 0.25], [v(75), 'sfx2/stamp.wav', 0.3],
  [v(85), 'sfx2/error.wav', 0.3], [v(98), 'sfx2/pop.wav', 0.25], [v(107), 'money/boom.wav', 0.45], [v(107), 'sfx2/impact.wav', 0.4],
  [S.brother, 'money/creak.wav', 0.3], [v(136), 'sfx2/click.wav', 0.4], [S.end, 'sfx2/ding.wav', 0.35],
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

export const Nikita: React.FC = () => {
  loadFonts();
  loadCaveat();
  const order: [number, number, React.FC, boolean?][] = [
    [S.hook, S.first, Hook], [S.first, S.week, First, true], [S.week, S.month, Week, true], [S.month, S.friends, Month, true],
    [S.friends, S.winter, Friends, true], [S.winter, S.school, Winter, true], [S.school, S.smash, School, true], [S.smash, S.silence, Smash, true],
    [S.silence, S.brother, Silence, true], [S.brother, S.close, Brother, true], [S.close, S.moral, Close, true], [S.moral, S.end, Moral, true],
  ];
  return (
    <AbsoluteFill style={{background: '#0b0c12'}}>
      {order.map(([from, to, C, cut], i) => <Scene key={i} from={from} to={to} cut={cut}><C /></Scene>)}
      <Flash at={v(52) + 10} len={8} color="rgba(255,255,255,0.25)" />
      <Flash at={v(107)} len={14} />
      <Hud />
      <AbsoluteFill style={{top: H - 220, height: 220, background: 'linear-gradient(rgba(11,12,18,0), #0b0c12)'}} />
      <Captions cues={CUES} />
      <End />
      <Sound />
    </AbsoluteFill>
  );
};
