// Ролик «Тебе по ошибке прислали трейд» (9:16, ~64 с) в формате «286 зарплат»: шапка со временем/стоимостью/риском, «Урок 1-2-3», вопрос в конце.
// Исходники пользователя: скины (public/trade/*.png, фон вырезан), окно обмена (src/tradewin.jpg), кадры с AWP от первого лица (pov1/2.png).
// Значок «Защита обмена» нарисован по скрину пользователя. Ножи y2013/* и cases/butterfly.png — из прошлых роликов.
import React from 'react';
import {AbsoluteFill, Audio, Img, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {loadFonts} from '../theme';
import {FPS, fr} from '../tilt/script';
import {VO, TOTAL, CUES, v} from './script';
import {Captions, clamp, pop} from '../tilt/UI';
import {Scene, Cam, Flash, loadCaveat} from '../money/Money';
import {ramp} from '../tilt/Tilt';
import {H, RED} from '../money/Props';

export const TRADE_FRAMES = fr(TOTAL);

const S = {
  hook: 0, offer: v(6) - 4, accept: v(28) - 4, l1: v(42) - 4, sat: v(60) - 4, l2: v(68) - 4, sun: v(86) - 4,
  mon: v(99) - 4, l3: v(106) - 4, ask: v(115) - 4, end: fr(62.7),
};
const GOLD = '#ffd23f', GREEN = '#2bd96b', PROT = '#d9a520';
const GUNS = [{src: 'trade/dlore.png', name: 'AWP | Драгон Лор', c: '#e4ae39'}, {src: 'trade/gungnir.png', name: 'AWP | Гунгнир', c: '#eb4b4b'}, {src: 'trade/howl.png', name: 'M4A4 | Вой', c: '#e4ae39'}];
const KNIVES = ['trade/bf_doppler.png', 'trade/bf_ruby.png', 'y2013/k_fade.png', 'y2013/k_doppler.png', 'y2013/k_tiger.png', 'y2013/bf_emerald.png', 'y2013/k_crimson.png', 'cases/butterfly.png'];
const ALL = [...GUNS.map((g) => g.src), ...KNIVES];

const Bg: React.FC<{glow?: string}> = ({glow = '#2a4a8a'}) => (
  <AbsoluteFill style={{height: H, backgroundColor: '#0b0c12', backgroundImage: `radial-gradient(ellipse at 50% 40%, ${glow}55, #0b0c12 70%), radial-gradient(rgba(120,150,230,0.1) 2px, transparent 2px)`, backgroundSize: 'auto, 44px 44px'}} />
);
const Big: React.FC<{x: number; y: number; s: number; size: number; color?: string; children: React.ReactNode}> = ({x, y, s, size, color = '#fff', children}) => (
  <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%, -50%) scale(${s})`, opacity: Math.min(1, s * 2), fontFamily: 'Montserrat', fontWeight: 900, fontSize: size,
    color, whiteSpace: 'nowrap', textAlign: 'center', lineHeight: 1.05, textShadow: color === '#fff' ? '0 4px 0 rgba(0,0,0,0.6)' : `0 0 34px ${color}88, 0 4px 0 rgba(0,0,0,0.6)`}}>{children}</div>
);
const Chip: React.FC<{x: number; y: number; s: number; bg: string; color?: string; size?: number; children: React.ReactNode}> = ({x, y, s, bg, color = '#fff', size = 40, children}) => (
  <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%, -50%) scale(${s})`, opacity: Math.min(1, s * 2), background: bg, color, fontFamily: 'Montserrat', fontWeight: 900,
    fontSize: size, padding: '12px 30px', borderRadius: 50, whiteSpace: 'nowrap', boxShadow: `0 0 30px ${bg}88`}}>{children}</div>
);
// стикер «Урок N» (как в примере)
const Lesson: React.FC<{n: number; at: number; y?: number}> = ({n, at, y = 230}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = pop(f, at, fps, 300, 10);
  return (
    <div style={{position: 'absolute', left: 540, top: y, transform: `translate(-50%,-50%) rotate(-3deg) scale(${s})`, opacity: Math.min(1, s * 2), background: '#fff6e0', padding: '14px 40px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
      fontFamily: 'Caveat', fontWeight: 700, fontSize: 80, color: '#c22a2a'}}>Урок {n}</div>
  );
};
// значок «Защита обмена» (жёлтый щит с двумя стрелками)
const Shield: React.FC<{w?: number}> = ({w = 44}) => (
  <svg width={w} height={w * 1.15} viewBox="0 0 40 46">
    <path d="M20 2 L37 8 L35 28 C33 37 26 42 20 44 C14 42 7 37 5 28 L3 8 Z" fill={PROT} stroke="#7a5a08" strokeWidth={2} />
    <path d="M12 18 H26 L22 14 M28 28 H14 L18 32" stroke="#3a2a04" strokeWidth={3} fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
// ячейка предмета
const Cell: React.FC<{src: string; size: number; prot?: boolean; c?: string; ghost?: number}> = ({src, size, prot, c = '#e4ae39', ghost = 0}) => (
  <div style={{width: size, height: size * 0.75, background: 'linear-gradient(#2a2e38, #181b22)', borderBottom: `5px solid ${c}`, borderRadius: 6, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 1 - ghost}}>
    <Img src={staticFile(src)} style={{maxWidth: size * 0.9, maxHeight: size * 0.62, objectFit: 'contain'}} />
    {prot && <div style={{position: 'absolute', left: 4, bottom: 4}}><Shield w={size * 0.24} /></div>}
  </div>
);

// ---------------------------------------------------------------- шапка: время · в инвентаре · риск
const TIMES: [number, string][] = [[0, 'ПТ 23:31'], [v(28), 'ПТ 23:40'], [S.sat, 'СБ 12:15'], [S.sun, 'ВС 19:30'], [S.mon, 'ПН 09:00']];
const RISK: [number, number][] = [[0, 5], [S.l1, 35], [S.sat, 55], [S.sun, 75], [S.mon, 100]];
const value = (f: number) => {
  const up = interpolate(f, [v(11), v(24)], [0, 10400000], clamp);
  return f >= v(104) ? Math.round(up * (1 - Math.min(1, (f - v(104)) / 12))) : up;
};
const TopBar: React.FC = () => {
  const f = useCurrentFrame();
  if (f >= S.end) return null;
  const t = [...TIMES].reverse().find(([a]) => f >= a)![1];
  let r = RISK[0][1];
  for (let i = 0; i < RISK.length - 1; i++) if (f >= RISK[i][0]) r = interpolate(f, [RISK[i][0], RISK[i][0] + 15], [i ? RISK[i - 1][1] : RISK[0][1], RISK[i][1]], clamp);
  if (f >= RISK[RISK.length - 1][0]) r = interpolate(f, [S.mon, S.mon + 15], [75, 100], clamp);
  const val = Math.round(value(f) / 1000) * 1000;
  const col = (label: string, body: React.ReactNode) => (
    <div><div style={{fontSize: 15, color: '#8f98a0', fontWeight: 900, letterSpacing: 1}}>{label}</div><div style={{marginTop: 2}}>{body}</div></div>
  );
  return (
    <div style={{position: 'absolute', left: 40, right: 40, top: 26, display: 'flex', gap: 40, alignItems: 'flex-end', background: 'rgba(10,12,18,0.85)', border: '2px solid #2a3040', borderRadius: 14, padding: '10px 22px', fontFamily: 'Montserrat'}}>
      {col('ВРЕМЯ', <span style={{fontFamily: 'Russo One', fontSize: 30, color: '#fff'}}>{t}</span>)}
      {col('В ИНВЕНТАРЕ', <span style={{fontFamily: 'Russo One', fontSize: 30, color: val > 0 ? GREEN : '#8f98a0'}}>{val.toLocaleString('ru-RU')} ₽</span>)}
      <div style={{flex: 1}}>{col(`РИСК ${Math.round(r)}%`, <div style={{height: 14, borderRadius: 7, background: '#1c2030', overflow: 'hidden'}}><div style={{width: `${r}%`, height: 14, background: r > 60 ? RED : GOLD}} /></div>)}</div>
    </div>
  );
};

// ---------------------------------------------------------------- сцены
const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = pop(f, v(1), fps, 260, 12);
  return (
    <>
      <Bg glow="#1a3a6a" />
      <div style={{position: 'absolute', left: 540, top: 520, width: 900, transform: `translate(-50%,-50%) scale(${s})`, opacity: Math.min(1, s * 2), background: '#1b2838', border: '3px solid #66c0f4', borderRadius: 18, padding: 30,
        fontFamily: 'Montserrat', boxShadow: '0 0 60px rgba(102,192,244,0.35), 0 30px 60px rgba(0,0,0,0.6)'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 20}}>
          <div style={{width: 90, height: 90, borderRadius: 8, background: '#3d4450', color: '#8f98a0', fontSize: 54, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>?</div>
          <div><div style={{fontSize: 26, color: '#66c0f4', fontWeight: 900}}>НОВОЕ ПРЕДЛОЖЕНИЕ ОБМЕНА</div><div style={{fontSize: 40, color: '#fff', fontWeight: 900, marginTop: 6}}>от незнакомца</div></div>
        </div>
        <div style={{marginTop: 24, background: '#5c7e10', color: '#fff', textAlign: 'center', fontSize: 32, fontWeight: 900, padding: '14px 0', borderRadius: 8, transform: `scale(${f >= v(6) ? 1.05 : 1})`}}>Открыть</div>
      </div>
      {f >= v(8) && <Big x={540} y={900} s={pop(f, v(8), fps, 300, 10)} size={60} color={GOLD}>НЕ ВЕРИШЬ ГЛАЗАМ</Big>}
    </>
  );
};

const Offer: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const k = 1000 / 439;
  const heroIdx = f >= v(16) ? 2 : f >= v(14) ? 1 : f >= v(11) ? 0 : -1;
  const knives = f >= v(18);
  const shown = ALL.filter((_, i) => (i < 3 ? f >= [v(11), v(14), v(16)][i] : f >= v(19) + (i - 3) * 3));
  const empty = f >= v(25);
  return (
    <>
      <Bg />
      <div style={{position: 'absolute', left: 40, top: 130, width: 1000, height: 455 * k, opacity: 0.95}}>
        <Img src={staticFile('trade/src/tradewin.jpg')} style={{width: 1000, height: 455 * k}} />
        <div style={{position: 'absolute', left: 30 * k, top: 18 * k, width: 180 * k, height: 14 * k, background: '#1b2a3a'}} />
        <div style={{position: 'absolute', left: 30 * k, top: 18 * k, fontFamily: 'Montserrat', fontWeight: 900, fontSize: 22, color: '#fff'}}>Вы обмениваетесь с <span style={{color: '#66c0f4'}}>???</span></div>
        <div style={{position: 'absolute', left: 240 * k, top: 266 * k, width: 190 * k, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 4 * k}}>
          {shown.slice(0, 8).map((src, i) => <Cell key={src} src={src} size={44 * k} c={i < 3 ? GUNS[i].c : '#8847ff'} />)}
        </div>
        {empty && <div style={{position: 'absolute', left: 238 * k, top: 104 * k, width: 192 * k, height: 98 * k, border: `5px solid ${RED}`, borderRadius: 8, boxShadow: `0 0 30px ${RED}`}} />}
      </div>
      {heroIdx >= 0 && !knives && (
        <div style={{position: 'absolute', left: 540, top: 360, transform: `translate(-50%,-50%) scale(${pop(f, [v(11), v(14), v(16)][heroIdx], fps, 260, 12)})`, textAlign: 'center', filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.8))'}}>
          <Img src={staticFile(GUNS[heroIdx].src)} style={{width: 820}} />
          <div style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 52, color: GUNS[heroIdx].c, textShadow: '0 4px 0 #000'}}>{GUNS[heroIdx].name}</div>
        </div>
      )}
      {knives && f < v(25) && (
        <div style={{position: 'absolute', left: 0, top: 200, width: 1080, height: 400}}>
          {KNIVES.map((src, i) => {
            const s = pop(f, v(19) + i * 3, fps, 300, 12);
            return <div key={src} style={{position: 'absolute', left: 60 + (i % 4) * 240, top: Math.floor(i / 4) * 170, transform: `scale(${s}) rotate(${(i % 2 ? 8 : -8)}deg)`, opacity: Math.min(1, s * 2)}}><Img src={staticFile(src)} style={{width: 220}} /></div>;
          })}
        </div>
      )}
      {f >= v(21) && f < v(25) && <Big x={540} y={680} s={pop(f, v(21), fps, 320, 9)} size={90} color={GREEN}>10 000 000+ ₽</Big>}
      {empty && <Chip x={540} y={1080} s={pop(f, v(25), fps)} bg={RED} size={42}>ВЗАМЕН — НИЧЕГО</Chip>}
    </>
  );
};

const Accept: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const clicked = f >= v(32);
  return (
    <>
      <Bg glow="#1a4a2a" />
      <div style={{position: 'absolute', left: 540, top: 420, transform: `translate(-50%,-50%) scale(${clicked ? 1.08 : 1})`, background: clicked ? GREEN : '#5c7e10', color: clicked ? '#06260f' : '#fff', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 58,
        padding: '30px 70px', borderRadius: 14, boxShadow: clicked ? `0 0 80px ${GREEN}` : '0 20px 40px rgba(0,0,0,0.5)'}}>ПРИНЯТЬ ОБМЕН</div>
      {f >= v(28) && !clicked && (
        <svg width={44} height={58} viewBox="0 0 20 26" style={{position: 'absolute', left: interpolate(f, [v(28), v(32)], [900, 620], clamp), top: interpolate(f, [v(28), v(32)], [800, 440], clamp)}}>
          <path d="M1 1 L1 21 L6 16 L10 25 L13 24 L9 15 L16 15 Z" fill="#fff" stroke="#000" strokeWidth={1.4} />
        </svg>
      )}
      {f >= v(34) && <Big x={540} y={680} s={pop(f, v(36), fps)} size={64} color="#fff">ЭТО ОШИБКА?</Big>}
      {f >= v(38) && <Big x={540} y={820} s={pop(f, v(38), fps, 320, 9)} size={80} color={GOLD}>ТЕПЕРЬ ЭТО МОЁ</Big>}
    </>
  );
};

// инвентарь: все скины со значком защиты обмена
const InvGrid: React.FC<{f: number; prot: boolean; gone?: number; y?: number}> = ({f, prot, gone = 0, y = 400}) => (
  <div style={{position: 'absolute', left: 540, top: y, transform: 'translate(-50%,-50%)', width: 980, background: '#1b2838', borderRadius: 16, padding: 24, boxSizing: 'border-box', fontFamily: 'Montserrat', boxShadow: '0 30px 60px rgba(0,0,0,0.6)'}}>
    <div style={{fontSize: 28, color: '#fff', fontWeight: 900, marginBottom: 14}}>Инвентарь · Counter-Strike 2</div>
    <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12}}>
      {ALL.map((src, i) => <Cell key={src} src={src} size={220} prot={prot} c={i < 3 ? GUNS[i].c : '#8847ff'} ghost={Math.min(1, Math.max(0, gone * 12 - i))} />)}
    </div>
  </div>
);

const L1: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <>
      <Bg glow="#3a2a10" />
      <Lesson n={1} at={S.l1} y={180} />
      <InvGrid f={f} prot={f >= v(50)} y={650} />
      {f >= v(50) && <div style={{position: 'absolute', left: 540, top: 300, transform: `translate(-50%,-50%) scale(${pop(f, v(50), fps)})`, display: 'flex', alignItems: 'center', gap: 10, background: PROT, color: '#2a1e04', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 34, padding: '8px 22px', borderRadius: 10, whiteSpace: 'nowrap'}}><Shield w={34} />Защита обмена · 7 дней</div>}
      {f >= v(53) && <Chip x={210} y={1010} s={pop(f, v(53), fps)} bg="#3a3f4a" color="#8f98a0" size={40}><s>Продать</s></Chip>}
      {f >= v(57) && <Chip x={680} y={1010} s={pop(f, v(57), fps)} bg={RED} size={32}>⟲ обмен можно отменить</Chip>}
    </>
  );
};

const Sat: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const a = Math.min(1, Math.max(0, (f - v(62)) / 6));
  return (
    <>
      <Bg glow="#1a3a5a" />
      <div style={{position: 'absolute', left: 540, top: 500, width: 900, transform: 'translate(-50%,-50%)', background: '#202127', borderRadius: 16, overflow: 'hidden', fontFamily: 'Montserrat', boxShadow: '0 30px 60px rgba(0,0,0,0.6)'}}>
        <div style={{background: '#3a3e46', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 14}}>
          <div style={{width: 50, height: 50, borderRadius: 6, background: '#3d4450', color: '#8f98a0', fontWeight: 900, fontSize: 30, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>?</div>
          <span style={{color: '#fff', fontSize: 30, fontWeight: 900}}>незнакомец</span>
        </div>
        <div style={{padding: 30, minHeight: 200}}>
          <div style={{opacity: a, transform: `translateY(${(1 - a) * 16}px)`, fontSize: 40, color: '#e8e8e8', fontWeight: 600}}>брат, я ошибся аккаунтом 😰</div>
          {f >= v(67) && <div style={{marginTop: 16, fontSize: 48, color: '#fff', fontWeight: 900}}>ВЕРНИ 🙏</div>}
        </div>
      </div>
    </>
  );
};

const L2: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const card = (at: number, y: number, t: string, ok: boolean) => {
    const s = pop(f, at, fps);
    return (
      <div style={{position: 'absolute', left: 540, top: y, width: 920, transform: `translate(-50%,-50%) scale(${0.85 + 0.15 * s})`, opacity: Math.min(1, s * 2), display: 'flex', alignItems: 'center', gap: 24, background: '#121722',
        border: `4px solid ${ok ? GREEN : RED}`, borderRadius: 22, padding: '26px 30px', fontFamily: 'Montserrat'}}>
        <div style={{fontSize: 60, color: ok ? GREEN : RED, fontWeight: 900}}>{ok ? '✓' : '✕'}</div>
        <div style={{fontSize: 38, fontWeight: 900, color: '#fff'}}>{t}</div>
      </div>
    );
  };
  return (
    <>
      <Bg glow="#2a1a2a" />
      <Lesson n={2} at={S.l2} y={180} />
      {card(v(70), 440, 'Переслать самому на другой аккаунт', false)}
      {card(v(74), 680, 'Владелец отменит обмен через Steam', true)}
      {f >= v(84) && <div style={{position: 'absolute', left: 540, top: 440, transform: `translate(-50%,-50%) rotate(-8deg) scale(${pop(f, v(84), fps, 320, 9)})`, border: `6px solid ${RED}`, color: RED, fontFamily: 'Montserrat', fontWeight: 900, fontSize: 70, padding: '4px 30px', borderRadius: 10, background: 'rgba(11,12,18,0.7)'}}>МОШЕННИКИ</div>}
    </>
  );
};

const Sun: React.FC = () => {
  const f = useCurrentFrame();
  const chat = [['Max', '+rep'], ['Denis', 'ОТКУДА DL???'], ['Alex', 'это реально?'], ['Kirill', 'дай посмотреть 😳']];
  return (
    <>
      <div style={{position: 'absolute', inset: 0, overflow: 'hidden'}}>
        <Img src={staticFile(`trade/pov${f % 40 < 20 ? 1 : 2}.png`)} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: '60% 50%'}} />
      </div>
      <div style={{position: 'absolute', left: 30, top: 180, display: 'flex', flexDirection: 'column', gap: 8, fontFamily: 'Montserrat', fontWeight: 900, fontSize: 32}}>
        {chat.map(([w, t], i) => f >= v(94) + i * 8 && (
          <div key={i} style={{background: 'rgba(0,0,0,0.6)', padding: '8px 16px', borderRadius: 8, color: '#fff', textShadow: '0 2px 2px #000'}}>[ВСЕМ] <span style={{color: '#7ad46b'}}>{w}:</span> {t}</div>
        ))}
      </div>
    </>
  );
};

const Mon: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const gone = ramp(f, v(102), v(104));
  return (
    <>
      <Bg glow="#3a1016" />
      <InvGrid f={f} prot gone={gone} y={600} />
      {f >= v(104) && (
        <div style={{position: 'absolute', left: 540, top: 250, width: 860, transform: `translate(-50%,-50%) scale(${pop(f, v(104), fps, 300, 10)})`, background: '#171a21', border: `3px solid ${RED}`, borderRadius: 16, padding: '22px 28px', fontFamily: 'Montserrat'}}>
          <div style={{fontSize: 26, color: RED, fontWeight: 900}}>STEAM</div>
          <div style={{fontSize: 44, color: '#fff', fontWeight: 900, marginTop: 6}}>Обмен отменён</div>
        </div>
      )}
    </>
  );
};

const L3: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <>
      <Bg glow="#2a2a3a" />
      <Lesson n={3} at={S.l3} y={260} />
      <Big x={540} y={520} s={pop(f, v(108), fps)} size={56} color="#fff">НЕЛЬЗЯ ПОТЕРЯТЬ ТО,</Big>
      <Big x={540} y={610} s={pop(f, v(111), fps)} size={56} color={GOLD}>ЧТО ТЕБЕ НЕ ПРИНАДЛЕЖАЛО</Big>
    </>
  );
};

const Ask: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const btn = (at: number, y: number, t: string, bg: string) => (
    <div style={{position: 'absolute', left: 540, top: y, transform: `translate(-50%,-50%) scale(${pop(f, at, fps)})`, background: bg, color: '#fff', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 46, padding: '26px 50px', borderRadius: 16, whiteSpace: 'nowrap', boxShadow: `0 0 40px ${bg}88`}}>{t}</div>
  );
  return (
    <>
      <Bg glow="#1a2a4a" />
      <Big x={540} y={250} s={pop(f, S.ask, fps)} size={60} color="#fff">А ТЫ БЫ ЧТО СДЕЛАЛ?</Big>
      {btn(v(120), 480, '↩ ВЕРНУЛ СРАЗУ', '#2a6a4a')}
      <div style={{position: 'absolute', left: 540, top: 600, transform: 'translate(-50%,-50%)', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 40, color: '#8f98a0', opacity: f >= v(122) ? 1 : 0}}>или</div>
      {btn(v(123), 720, '🎯 СЫГРАЛ 1 КАТКУ С DL', '#a82828')}
      {f >= v(124) && <div style={{position: 'absolute', left: 540, top: 900, transform: 'translate(-50%,-50%)'}}><Img src={staticFile('trade/dlore.png')} style={{width: 600, transform: `rotate(-6deg) scale(${pop(f, v(124), fps)})`}} /></div>}
    </>
  );
};

const End: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (f < S.end) return null;
  const m = pop(f, S.end, fps, 320, 9);
  return (
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, #3a2a10, #0b0c12 70%)', alignItems: 'center', justifyContent: 'center', paddingBottom: 240, textAlign: 'center'}}>
      <div style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 30, color: '#fff', background: RED, padding: '6px 18px', borderRadius: 8, opacity: Math.min(1, m * 2)}}>ПИШИ В КОММЕНТАХ</div>
      <div style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 66, color: '#fff', marginTop: 20, transform: `scale(${0.6 + 0.4 * m})`, lineHeight: 1.1}}>ВЕРНУЛ<br />ИЛИ <span style={{color: GOLD}}>СЫГРАЛ?</span></div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- звук (тихие эффекты, без фонового гула)
type Fx = [number, string, number];
const SFX: Fx[] = [
  [v(1), 'tilt/notif.wav', 0.3], [v(6), 'sfx2/click.wav', 0.3],
  [v(11), 'sfx2/impact.wav', 0.35], [v(14), 'sfx2/impact.wav', 0.35], [v(16), 'sfx2/impact.wav', 0.35],
  ...KNIVES.map((_, i): Fx => [v(19) + i * 3, 'sfx2/pop.wav', 0.22]), [v(21), 'sfx2/ding.wav', 0.3], [v(25), 'sfx2/error.wav', 0.25],
  [v(32), 'sfx2/click.wav', 0.4], [v(32) + 2, 'sfx2/shimmer.wav', 0.3], [v(38), 'sfx2/stamp.wav', 0.3],
  [S.l1, 'sfx2/whoosh.wav', 0.3], [v(50), 'sfx2/blip.wav', 0.3], [v(57), 'sfx2/error.wav', 0.25],
  [v(62), 'tilt/notif.wav', 0.3], [S.l2, 'sfx2/whoosh.wav', 0.3], [v(84), 'sfx2/stamp.wav', 0.35],
  [v(104), 'sfx2/deflate.wav', 0.4], [S.l3, 'sfx2/whoosh.wav', 0.3], [S.end, 'sfx2/ding.wav', 0.35],
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

export const Trade: React.FC = () => {
  loadFonts();
  loadCaveat();
  const order: [number, number, React.FC, boolean?][] = [
    [S.hook, S.offer, Hook], [S.offer, S.accept, Offer, true], [S.accept, S.l1, Accept, true], [S.l1, S.sat, L1, true], [S.sat, S.l2, Sat, true],
    [S.l2, S.sun, L2, true], [S.sun, S.mon, Sun, true], [S.mon, S.l3, Mon, true], [S.l3, S.ask, L3, true], [S.ask, S.end, Ask, true],
  ];
  return (
    <AbsoluteFill style={{background: '#0b0c12'}}>
      {order.map(([from, to, C, cut], i) => <Scene key={i} from={from} to={to} cut={cut}><C /></Scene>)}
      <Flash at={v(32)} len={12} color="rgba(43,217,107,0.35)" />
      <Flash at={v(104)} len={12} />
      <TopBar />
      <AbsoluteFill style={{top: H - 220, height: 220, background: 'linear-gradient(rgba(11,12,18,0), #0b0c12)'}} />
      <Captions cues={CUES} />
      <End />
      <Sound />
    </AbsoluteFill>
  );
};
