// TikTok-ролик «Не спал всю ночь — и на FACEIT» (9:16, ≈57,5 с). Герой — Лёха v2.
// Без новых исходников: игра нарисована кодом (CSScreen), окна «Матч найден» FACEIT и кика — стилизованные.
// Факт: после суток без сна реакция сопоставима с лёгким опьянением (исследования усталости) — в ролике без цифр.
import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig, random} from 'remotion';
import {loadFonts} from '../theme';
import {FPS, fr} from '../tilt/script';
import {VO, TOTAL, CUES, v} from './script';
import {Captions, clamp, pop} from '../tilt/UI';
import {ramp} from '../tilt/Tilt';
import {Scene, Cam, Flash} from '../money/Money';
import {Portrait, H, RED} from '../money/Props';
import {Facecam} from '../cases/Rig';
import {CSScreen, GameProps, Kill} from '../tilt/CSScreen';

export const SLEEP_FRAMES = fr(TOTAL);

const S = {
  hook: 0, night: v(20) - 4, morning: v(29) - 4, nine: v(40) - 4, late: v(55) - 4, micro: v(74) - 4, fix: v(88) - 4, nod: v(103) - 4, kick: v(109) - 4, end: fr(54.1),
};
const GOLD = '#ffd23f', GREEN = '#2bd96b', ORANGE = '#ff5500';

const Bg: React.FC<{glow?: string}> = ({glow = '#3a4a8a'}) => (
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

// электронные часы
const Clock: React.FC<{t: string; x?: number; y?: number; s?: number; color?: string}> = ({t, x = 540, y = 170, s = 1, color = RED}) => (
  <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%, -50%) scale(${s})`, background: '#050507', border: '6px solid #2a2d36', borderRadius: 18, padding: '6px 34px',
    fontFamily: 'Russo One', fontSize: 92, color, textShadow: `0 0 18px ${color}`, letterSpacing: 4}}>{t}</div>
);

// экран игры в мониторе (нарисованный CS2)
const Screen: React.FC<{game?: GameProps; mode?: 'game' | 'menu'; kick?: number; y?: number; dim?: number; children?: React.ReactNode}> = ({game, mode = 'game', kick = 0, y = 560, dim = 0, children}) => (
  <div style={{position: 'absolute', left: 30, top: y - 287, width: 1020, height: 574, background: '#0a0b0f', border: '8px solid #2a2d36', borderRadius: 22, overflow: 'hidden', boxShadow: '0 30px 60px rgba(0,0,0,0.6)'}}>
    <svg width={1004} height={558} viewBox="0 0 1600 900" style={{display: 'block', margin: 0}}>
      <CSScreen mode={mode} game={game} kick={kick} />
    </svg>
    {dim > 0 && <div style={{position: 'absolute', inset: 0, background: '#000', opacity: dim}} />}
    {children}
  </div>
);

// окно FACEIT «Матч найден» (стилизация)
const FaceitFound: React.FC<{a: number; f: number}> = ({a, f}) => {
  const t = Math.max(0, 15 - Math.floor(f / 20));
  return (
    <div style={{position: 'absolute', left: 540, top: 470, width: 860, transform: `translate(-50%, -50%) scale(${0.85 + 0.15 * a})`, opacity: Math.min(1, a * 2), background: '#1f1f1f',
      border: `4px solid ${ORANGE}`, borderRadius: 18, overflow: 'hidden', fontFamily: 'Montserrat', boxShadow: `0 0 60px ${ORANGE}55, 0 30px 60px rgba(0,0,0,0.6)`}}>
      <div style={{height: 76, background: ORANGE, display: 'flex', alignItems: 'center', padding: '0 28px', fontWeight: 900, fontSize: 36, color: '#fff', letterSpacing: 4}}>FACEIT</div>
      <div style={{padding: 34, textAlign: 'center'}}>
        <div style={{fontSize: 56, fontWeight: 900, color: '#fff'}}>МАТЧ НАЙДЕН</div>
        <div style={{fontSize: 28, fontWeight: 600, color: '#9a9a9a', marginTop: 6}}>5v5 · de_mirage · 09:00</div>
        <div style={{display: 'flex', gap: 16, justifyContent: 'center', margin: '26px 0'}}>
          {Array.from({length: 10}).map((_, i) => <div key={i} style={{width: 46, height: 46, borderRadius: 8, background: i < 3 + (f % 40 > 20 ? 1 : 0) ? ORANGE : '#3a3a3a'}} />)}
        </div>
        <div style={{display: 'inline-block', background: ORANGE, color: '#fff', fontWeight: 900, fontSize: 48, padding: '16px 70px', borderRadius: 10}}>ПРИНЯТЬ · 0:{String(t).padStart(2, '0')}</div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------- сцены
const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const spin = ramp(f, v(3), v(7));
  const hh = Math.round(3 + spin * 6);
  const found = pop(f, v(8), fps);
  return (
    <>
      <Cam s={interpolate(f, [0, S.night], [1.0, 1.08], clamp)} y={820}>
        <Portrait f={f} bg="dorm" mood={f >= v(16) ? 'shocked' : 'tired'} sweat={f >= v(16)} scale={1.3} y={1080} light="#6a8cff" lightAmt={0.12} />
      </Cam>
      <Clock t={`0${hh}:00`} y={170} />
      <FaceitFound a={found} f={f} />
      {f >= v(16) && <Chip x={540} y={760} s={pop(f, v(18), fps, 300, 9)} bg={RED} size={52}>ЭТО И ЕСТЬ ОШИБКА</Chip>}
    </>
  );
};

const Night: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const ks = [v(27) - 2, v(27) + 8, v(28) + 6];
  const kills: Kill[] = ks.filter((k) => f >= k).map((k, i) => ({killer: 'Лёха', victim: ['kirill', 'Max', 'zxc'][i], mine: true, hs: true, at: (f - k) / 6}));
  const last = ks.filter((k) => f >= k).pop() ?? -100;
  return (
    <>
      <Bg glow="#1a2a5a" />
      <Clock t="03:00" y={160} />
      <Screen game={{bob: f * 1.2, peek: 0.5, enemy: f - last < 6 ? 0 : 1, kills, score: [9, 4], timer: '1:12'}} y={590} />
      <div style={{position: 'absolute', left: 190, top: 1010, transform: `translate(-50%, -50%) scale(${pop(f, v(25), fps)})`}}>
        <svg width={170} height={170} viewBox="0 0 100 100">
          {[0, 1, 2].map((i) => <path key={i} d={`M${34 + i * 12} ${30 - ((f / 3 + i * 8) % 20)} q4 -6 0 -12`} stroke="#d8d4c8" strokeWidth={3} fill="none" opacity={0.7} />)}
          <path d="M18 34 H72 L66 90 H24 Z" fill="#f1ead8" stroke="#15131a" strokeWidth={5} />
          <path d="M72 44 Q92 46 88 62 Q84 74 68 72" fill="none" stroke="#15131a" strokeWidth={6} />
          <rect x={20} y={40} width={50} height={10} fill="#6b3a1a" />
        </svg>
        <div style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 34, color: '#fff', textAlign: 'center'}}>КОФЕ</div>
      </div>
      <Facecam x={880} y={1010} r={140} mood="happy" ring={GREEN} />
      {f >= v(26) && <Big x={540} y={1010} s={pop(f, v(28), fps, 300, 10)} size={56} color={GREEN}>АИМ ЛЕТИТ</Big>}
    </>
  );
};

const Morning: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const dawn = ramp(f, S.morning, S.morning + 30);
  const heavy = f >= v(35) ? 0.55 + 0.45 * Math.max(0, Math.sin((f - v(35)) / 7)) : 0.35;
  const cotton = pop(f, v(31), fps);
  return (
    <>
      <Cam s={interpolate(f, [S.morning, S.nine], [1.05, 1.15], clamp)} y={760}>
        <Portrait f={f} bg="dorm" mood="tired" blink={heavy} scale={1.4} y={1000} />
      </Cam>
      <AbsoluteFill style={{height: H, background: 'linear-gradient(rgba(255,160,90,0.45), rgba(255,160,90,0) 55%)', opacity: dawn, mixBlendMode: 'screen'}} />
      <Clock t="06:00" y={170} color="#ffb347" />
      {/* «голова как в вате» */}
      {cotton > 0 && (
        <svg width={1080} height={H} style={{position: 'absolute', inset: 0, opacity: cotton * 0.6}}>
          {Array.from({length: 9}).map((_, i) => {
            const a = (i / 9) * Math.PI * 2 + f / 40;
            return <circle key={i} cx={540 + Math.cos(a) * 340} cy={560 + Math.sin(a) * 110} r={38 + random(`c${i}`) * 26} fill="#f4f4f8" opacity={0.7} />;
          })}
        </svg>
      )}
      {f >= v(37) && <Chip x={540} y={1060} s={pop(f, v(37), fps)} bg="#1c2030" size={40}>НО ОН ДЕРЖИТСЯ</Chip>}
    </>
  );
};

const Nine: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const rest = ramp(f, v(47), v(47) + 12) * 0.35;
  const tired = ramp(f, v(48), v(50) + 14) * 0.85;
  return (
    <>
      <Bg glow="#5a3a1a" />
      <Clock t="09:00" y={170} color="#ffd27a" />
      <Chip x={540} y={330} s={pop(f, v(42), fps, 300, 10)} bg={RED} size={56}>24 ЧАСА БЕЗ СНА</Chip>
      <div style={{position: 'absolute', left: 90, top: 470, width: 900, fontFamily: 'Montserrat', fontWeight: 900, opacity: Math.min(1, pop(f, v(46), fps) * 2)}}>
        <div style={{fontSize: 40, color: '#8e9ab8', marginBottom: 20}}>ВРЕМЯ РЕАКЦИИ</div>
        {[['ВЫСПАЛСЯ', rest, GREEN], ['СУТКИ БЕЗ СНА', tired, RED]].map(([l, w, c]) => (
          <div key={l as string} style={{marginBottom: 30}}>
            <div style={{fontSize: 38, color: '#fff', marginBottom: 10}}>{l}</div>
            <div style={{height: 56, borderRadius: 28, background: '#141827', border: '4px solid #2c3350'}}>
              <div style={{height: '100%', width: `${(w as number) * 100}%`, background: c as string, borderRadius: 24, boxShadow: `0 0 26px ${c}`}} />
            </div>
          </div>
        ))}
      </div>
      {f >= v(51) && (
        <div style={{position: 'absolute', left: 540, top: 960, transform: `translate(-50%, -50%) scale(${pop(f, v(54), fps, 300, 10)})`, display: 'flex', alignItems: 'center', gap: 24}}>
          <svg width={110} height={150} viewBox="0 0 60 80"><path d="M10 4 H50 Q52 30 30 40 Q8 30 10 4 Z" fill="#c4232d" stroke="#fff" strokeWidth={3} /><path d="M30 40 V70 M16 74 H44" stroke="#fff" strokeWidth={4} /></svg>
          <div style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 54, color: '#fff', lineHeight: 1.1}}>КАК БУДТО<br /><span style={{color: RED}}>ВЫПИЛ</span></div>
        </div>
      )}
    </>
  );
};

const Late: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const peek = ramp(f, v(58) - 6, v(58) + 6);
  const deadAt = v(60) + 8;
  const dead = f >= deadAt ? pop(f, deadAt, fps, 200, 20) : 0;
  const miss = f >= v(57) && f < v(57) + 6;
  const kills: Kill[] = f >= deadAt ? [{killer: 'Enemy', victim: 'Лёха', mine: false, hs: true, at: (f - deadAt) / 6}] : [];
  const tl = pop(f, v(70), fps);
  const off = ramp(f, v(71), v(72) + 10);
  return (
    <>
      <Bg glow="#5a1a22" />
      <Screen game={{bob: f, peek, enemy: peek > 0.5 ? 1 : 0, muzzle: f >= deadAt - 4 && f < deadAt ? 1 : 0, dead, kills, score: [7, 9], timer: '0:41'}} y={440}>
        {miss && <svg width={1004} height={558} style={{position: 'absolute', inset: 0}}><line x1={502} y1={279} x2={760} y2={120} stroke="#ffe28a" strokeWidth={4} /></svg>}
      </Screen>
      {f >= v(57) && f < deadAt && <Chip x={540} y={800} s={pop(f, v(57), fps, 300, 10)} bg={RED} size={46}>МИМО</Chip>}
      {f >= v(60) && f < v(70) && <Chip x={540} y={800} s={pop(f, v(60), fps, 300, 10)} bg={RED} size={46}>ПОЗДНО</Chip>}
      {/* таймлайн реакции: все vs Лёха */}
      {tl > 0 && (
        <div style={{position: 'absolute', left: 90, top: 790, width: 900, opacity: Math.min(1, tl * 2), fontFamily: 'Montserrat', fontWeight: 900}}>
          {[['ВСЕ', 0, GREEN], ['ЛЁХА', off, RED]].map(([l, o, c]) => (
            <div key={l as string} style={{display: 'flex', alignItems: 'center', gap: 20, marginBottom: 18}}>
              <div style={{width: 130, fontSize: 36, color: '#fff'}}>{l}</div>
              <div style={{position: 'relative', flex: 1, height: 14, borderRadius: 7, background: '#2c3350'}}>
                <div style={{position: 'absolute', left: `${20 + (o as number) * 45}%`, top: -18, width: 50, height: 50, borderRadius: 25, background: c as string, boxShadow: `0 0 20px ${c}`}} />
              </div>
            </div>
          ))}
          <div style={{textAlign: 'right', fontSize: 44, color: RED, opacity: off}}>+0,5 СЕКУНДЫ</div>
        </div>
      )}
    </>
  );
};

const Micro: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const closing = ramp(f, v(76), v(78) + 6);
  const black = f >= v(79) && f < v(83) ? Math.min(1, (f - v(79)) / 4) : f >= v(83) ? Math.max(0, 1 - (f - v(83)) / 4) : 0;
  const after = f >= v(83);
  return (
    <>
      {!after && (
        <Cam s={interpolate(f, [S.micro, v(79)], [1.1, 1.3], clamp)} y={760}>
          <Portrait f={f} bg="dorm" mood="tired" blink={0.35 + closing * 0.65} scale={1.4} y={1000} light="#ffb36b" lightAmt={0.08} />
        </Cam>
      )}
      {after && (
        <>
          <Bg glow="#2a3a5a" />
          <Screen game={{bob: f, peek: 0.2, enemy: 0, score: [7, 10], timer: '1:55'}} y={520} />
          <Chip x={540} y={900} s={pop(f, v(85), fps, 300, 10)} bg={RED} size={50}>УЖЕ ДРУГОЙ РАУНД</Chip>
        </>
      )}
      <AbsoluteFill style={{height: H, background: '#000', opacity: black}} />
      {black > 0.5 && <Big x={540} y={560} s={pop(f, v(81), fps, 300, 10)} size={110} color={RED}>МИКРОСОН</Big>}
    </>
  );
};

const Fix: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const cfg = ['sensitivity "1.25"', 'cl_crosshairsize "2"', 'fps_max "400"', 'rate "786432"'];
  return (
    <>
      <Bg glow="#1a3a5a" />
      <Chip x={540} y={150} s={pop(f, v(88), fps)} bg="#1c2030" size={44}>ЧТО ДЕЛАТЬ?</Chip>
      {/* подушка и луна */}
      <div style={{position: 'absolute', left: 540, top: 400, transform: `translate(-50%, -50%) scale(${pop(f, v(90), fps)})`, textAlign: 'center'}}>
        <svg width={420} height={260} viewBox="0 0 200 120">
          <path d="M20 60 Q20 20 60 22 L150 22 Q186 20 184 60 Q186 100 150 98 L60 98 Q20 100 20 60 Z" fill="#e9eef8" stroke="#15131a" strokeWidth={5} />
          <path d="M150 10 A18 18 0 1 0 170 34 A14 14 0 1 1 150 10 Z" fill={GOLD} />
          <text x={100} y={74} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={34} fill="#2a2d3a">Zzz</text>
        </svg>
      </div>
      <Big x={300} y={720} s={pop(f, v(95), fps, 300, 10)} size={130} color={GREEN}>8 Ч</Big>
      <Big x={540} y={720} s={pop(f, v(99), fps)} size={110} color="#9aa4c0">&gt;</Big>
      <div style={{position: 'absolute', left: 790, top: 720, transform: `translate(-50%, -50%) scale(${pop(f, v(101), fps)})`, width: 380, background: '#0f1218', border: '3px solid #2c3350', borderRadius: 14,
        padding: '16px 18px', fontFamily: 'monospace', fontSize: 22, color: '#9fb3c8', lineHeight: 1.6, position: 'absolute'}}>
        <div style={{color: GOLD, fontFamily: 'Montserrat', fontWeight: 900, fontSize: 26, marginBottom: 6}}>config.cfg</div>
        {cfg.map((c) => <div key={c}>{c}</div>)}
      </div>
      <Big x={540} y={960} s={pop(f, v(101), fps)} size={46} color={GREEN}>СОН &gt; ЛЮБОЙ КОНФИГ</Big>
    </>
  );
};

const Nod: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const nod = f < v(105) ? Math.max(0, Math.sin((f - S.nod) / 4)) * 14 : 0;
  const shut = f >= v(105) ? 1 : 0;
  const black = f >= v(107) ? Math.min(0.7, (f - v(107)) / 10) : 0;
  return (
    <>
      <div style={{position: 'absolute', inset: 0, transform: `translateY(${nod}px)`}}>
        <Portrait f={f} bg="dorm" mood={shut ? 'neutral' : 'tired'} blink={shut ? 1 : 0.35} scale={1.4} y={1000} />
      </div>
      <AbsoluteFill style={{height: H, background: '#000', opacity: black}} />
      {f >= v(107) && [0, 1, 2].map((i) => {
        const t = ((f - v(107)) / 30 + i * 0.33) % 1;
        return <div key={i} style={{position: 'absolute', left: 640 + t * 160, top: 560 - t * 260, fontFamily: 'Montserrat', fontWeight: 900, fontSize: 60 + i * 20, color: '#cfe0ff', opacity: 1 - t}}>Z</div>;
      })}
      {f >= v(103) && f < v(105) && <Chip x={540} y={240} s={pop(f, v(104), fps)} bg="#1c2030" size={44}>👍 ЛЁХА КИВАЕТ</Chip>}
    </>
  );
};

const Kick: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const k = pop(f, v(112) - 2, fps, 220, 14);
  return (
    <>
      <Bg glow="#5a1a22" />
      <Screen mode="menu" kick={k} y={520} />
      <Facecam x={540} y={980} r={150} mood={f >= v(109) + 4 ? 'shocked' : 'tired'} sweat={f >= v(112)} ring={RED} blink={f < v(109) + 4 ? 1 : 0} />
    </>
  );
};

const End: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (f < S.end) return null;
  const a = pop(f, S.end + 2, fps), b = pop(f, S.end + 16, fps), c = pop(f, S.end + 34, fps);
  return (
    <AbsoluteFill style={{background: '#000', alignItems: 'center', justifyContent: 'center', paddingBottom: 280, textAlign: 'center'}}>
      <div style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 70, color: GREEN, opacity: a}}>8 Ч СНА &gt; КОНФИГ</div>
      <div style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 92, color: '#fff', lineHeight: 1.05, marginTop: 30, opacity: Math.min(1, b * 2), transform: `scale(${0.7 + 0.3 * b})`}}>
        А ТЫ СКОЛЬКО<br /><span style={{color: GOLD, textShadow: `0 0 40px ${GOLD}88`}}>НЕ СПАЛ РАДИ CS?</span>
      </div>
      <div style={{marginTop: 40, background: RED, color: '#fff', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 36, padding: '14px 36px', borderRadius: 50, opacity: c, transform: `scale(${0.6 + 0.4 * c})`}}>ПИШИ В КОММЕНТАРИЯХ</div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- звук (эффекты тише голоса)
type Fx = [number, string, number];
const SFX: Fx[] = [
  [0, 'tilt/heart.wav', 0.3], ...Array.from({length: 6}).map((_, i): Fx => [v(3) + Math.round((i / 6) * (v(7) - v(3))), 'sfx2/tick.wav', 0.55]), [v(8), 'tilt/accept.wav', 0.5], [v(16), 'money/boom.wav', 0.5], [v(18), 'sfx2/stamp.wav', 0.5],
  [S.night, 'sfx2/whoosh.wav', 0.3], [v(25), 'sfx2/pop.wav', 0.35], [v(27) - 4, 'tilt/shot.wav', 0.5], [v(27) - 2, 'tilt/hs.wav', 0.45], [v(27) + 6, 'tilt/shot.wav', 0.5], [v(27) + 8, 'tilt/hs.wav', 0.45],
  [v(28) + 4, 'tilt/shot.wav', 0.5], [v(28) + 6, 'tilt/hs.wav', 0.45],
  [S.morning, 'sfx2/shimmer.wav', 0.25], [v(31), 'sfx2/lag.wav', 0.3], [v(35), 'sfx2/deflate.wav', 0.3],
  [S.nine, 'sfx2/tick.wav', 0.6], [v(42), 'sfx2/stamp.wav', 0.5], [v(48), 'sfx2/deflate.wav', 0.4], [v(54), 'money/boom.wav', 0.45],
  [v(56), 'tilt/shot.wav', 0.5], [v(57), 'sfx2/error.wav', 0.35], [v(60) + 4, 'tilt/shot.wav', 0.55], [v(60) + 8, 'tilt/hs.wav', 0.5], [v(70), 'sfx2/blip.wav', 0.35], [v(71), 'sfx2/lag.wav', 0.35],
  [v(76), 'tilt/heart.wav', 0.4], [v(79), 'sfx2/deflate.wav', 0.5], [v(81), 'money/boom.wav', 0.45], [v(83), 'sfx2/glitch.wav', 0.4], [v(85), 'sfx2/stamp.wav', 0.45],
  [S.fix, 'sfx2/whoosh.wav', 0.3], [v(93), 'sfx2/shimmer.wav', 0.3], [v(95), 'sfx2/stamp.wav', 0.45], [v(101), 'sfx2/ding.wav', 0.35],
  [v(104), 'sfx2/pop.wav', 0.3], [v(107), 'sfx2/deflate.wav', 0.35],
  [v(109) + 4, 'sfx2/impact.wav', 0.45], [v(112) - 2, 'sfx2/error.wav', 0.5],
  [S.end, 'money/boom.wav', 0.45], [S.end + 16, 'sfx2/stamp.wav', 0.45], [S.end + 34, 'sfx2/pop.wav', 0.4],
];
const GAIN = 0.55;

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

export const Sleep: React.FC = () => {
  loadFonts();
  const order: [number, number, React.FC, boolean?][] = [
    [S.hook, S.night, Hook], [S.night, S.morning, Night, true], [S.morning, S.nine, Morning], [S.nine, S.late, Nine, true], [S.late, S.micro, Late, true],
    [S.micro, S.fix, Micro], [S.fix, S.nod, Fix], [S.nod, S.kick, Nod], [S.kick, S.end, Kick, true],
  ];
  return (
    <AbsoluteFill style={{background: '#07090f'}}>
      {order.map(([from, to, C, cut], i) => <Scene key={i} from={from} to={to} cut={cut}><C /></Scene>)}
      <Flash at={v(16)} len={12} />
      <Flash at={v(60) + 8} len={12} />
      <Flash at={v(112) - 2} len={14} />
      <AbsoluteFill style={{top: H - 220, height: 220, background: 'linear-gradient(rgba(7,9,15,0), #07090f)'}} />
      <Captions cues={CUES} />
      <End />
      <Sound />
    </AbsoluteFill>
  );
};
