// Ролик про нож-бабочку, купленный за 80 000 и подешевевший после обновления (9:16, ~59 с). Герой — Лёха v2.
// Исходники пользователя: страница предмета (public/knife/market.png, цены убраны и нарисованы поверх),
// осмотр ножа в игре (inspect1.png, inspect2.png; плашка браузера закрыта куском второго кадра).
import React from 'react';
import {AbsoluteFill, Audio, Img, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {loadFonts} from '../theme';
import {FPS, fr} from '../tilt/script';
import {VO, TOTAL, CUES, v} from './script';
import {Captions, clamp, pop} from '../tilt/UI';
import {Scene, Cam, Flash} from '../money/Money';
import {ramp} from '../tilt/Tilt';
import {Portrait, H, RED} from '../money/Props';

export const KNIFE_FRAMES = fr(TOTAL);

const S = {
  hook: 0, buy: v(12) - 4, happy: v(24) - 4, update: v(36) - 4, drop: v(41) - 4, why: v(66) - 4,
  tips: v(94) - 4, last: v(122) - 4, end: fr(56.9),
};
const GOLD = '#ffd23f', GREEN = '#2bd96b';
const rub = (n: number) => `${Math.round(n).toLocaleString('ru-RU')} ₽`;

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

// страница ножа на Торговой площадке (скрин пользователя, старые цены стёрты)
const MarketPage: React.FC<{price: number; buy?: number; f: number}> = ({price, buy = 0, f}) => (
  <div style={{position: 'absolute', left: 40, top: 250, width: 1000, borderRadius: 14, overflow: 'hidden', boxShadow: '0 30px 70px rgba(0,0,0,0.6)', fontFamily: 'Montserrat'}}>
    <Img src={staticFile('knife/market.png')} style={{width: 1000, display: 'block'}} />
    <div style={{position: 'absolute', left: 247, width: 131, top: 368, textAlign: 'center', fontSize: 17, fontWeight: 900, color: '#fff'}}>{rub(price)}</div>
    <div style={{position: 'absolute', left: 560, top: 262, display: 'flex', flexDirection: 'column', gap: 12}}>
      <div style={{background: buy ? GREEN : '#5a7a1a', color: '#fff', fontSize: 34, fontWeight: 900, padding: '16px 40px', borderRadius: 8, transform: `scale(${1 + 0.06 * buy})`, boxShadow: buy ? `0 0 ${40 * buy}px ${GREEN}` : 'none'}}>Купить</div>
    </div>
  </div>
);

// осмотр ножа в игре (два кадра пользователя — чередуются, «вращение»)
const Inspect: React.FC<{f: number; dim?: number}> = ({f, dim = 0}) => (
  <div style={{position: 'absolute', inset: 0, overflow: 'hidden'}}>
    <Img src={staticFile(`knife/inspect${f % 12 < 6 ? 1 : 2}.png`)} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: '68% 50%'}} />
    {dim > 0 && <div style={{position: 'absolute', inset: 0, background: '#000', opacity: dim}} />}
  </div>
);

// ---------------------------------------------------------------- сцены
const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const month = Math.min(6, 1 + Math.floor(ramp(f, v(1), v(6)) * 6));
  const saved = Math.round(interpolate(f, [v(1), v(6)], [0, 80000], clamp) / 1000) * 1000;
  return (
    <>
      <Bg glow="#1a3a6a" />
      <div style={{position: 'absolute', left: 0, top: 560, width: 1080, height: 620, overflow: 'hidden'}}>
        <Portrait f={f} bg="dorm" mood="worried" look={0.2} scale={1.05} y={420} />
      </div>
      <Chip x={540} y={130} s={pop(f, 2, fps)} bg="#1c2030" size={40}>💰 ПОЛГОДА КОПИЛ НА НОЖ</Chip>
      <div style={{position: 'absolute', left: 540, top: 330, transform: 'translate(-50%,-50%)', textAlign: 'center', fontFamily: 'Montserrat'}}>
        <div style={{fontSize: 40, fontWeight: 900, color: GOLD}}>МЕСЯЦ {month} / 6</div>
        <div style={{fontFamily: 'Russo One', fontSize: 110, color: '#fff', textShadow: '0 4px 0 rgba(0,0,0,0.5)'}}>{rub(saved)}</div>
        <div style={{fontSize: 30, fontWeight: 600, color: '#8f98a0'}}>в кошельке Steam</div>
      </div>
      {f >= v(5) && <Chip x={540} y={560} s={pop(f, v(5), fps)} bg={RED} size={38}>НИ ОДНОГО КЕЙСА</Chip>}
    </>
  );
};

const Buy: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const bought = f >= v(23);
  return (
    <>
      <Bg glow="#1a4a3a" />
      <Cam s={interpolate(f, [S.buy, v(18), v(22)], [1.0, 1.0, 1.55], clamp)} x={420} y={460}>
        <MarketPage price={80000} buy={bought ? pop(f, v(23), fps, 320, 9) : 0} f={f} />
      </Cam>
      {f >= v(18) && <Big x={540} y={1040} s={pop(f, v(18), fps, 300, 9)} size={90} color={GOLD}>80 000 ₽</Big>}
      {bought && <Flash at={v(23)} len={10} color="rgba(255,210,63,0.4)" />}
    </>
  );
};

const Happy: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <>
      <Inspect f={f} />
      <Chip x={540} y={150} s={pop(f, S.happy, fps)} bg={GREEN} color="#06260f" size={40}>САМЫЙ СЧАСТЛИВЫЙ НА СЕРВЕРЕ</Chip>
      {f >= v(31) && <Chip x={540} y={1050} s={pop(f, v(31), fps)} bg="rgba(10,14,22,0.85)" size={38}>крутит нож в каждом раунде</Chip>}
    </>
  );
};

const Update: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const shake = f > v(39) ? Math.max(0, 1 - (f - v(39)) / 16) : 0;
  return (
    <>
      <Inspect f={f} dim={0.55} />
      <Cam s={1} shake={shake}>
        <div style={{position: 'absolute', left: 540, top: 560, width: 860, transform: `translate(-50%,-50%) scale(${pop(f, v(39), fps, 300, 10)})`, background: '#171a21', borderRadius: 18, overflow: 'hidden', fontFamily: 'Montserrat', boxShadow: '0 30px 60px rgba(0,0,0,0.7)', border: `3px solid ${RED}`}}>
          <div style={{background: RED, padding: '16px 26px', fontSize: 30, fontWeight: 900, color: '#fff', letterSpacing: 2}}>ОБНОВЛЕНИЕ</div>
          <div style={{padding: '28px 30px'}}>
            <div style={{fontSize: 42, fontWeight: 900, color: '#fff'}}>Counter-Strike 2</div>
            <div style={{fontSize: 30, color: '#c9cede', marginTop: 12}}>Добавлен новый набор. Доступны новые ножи.</div>
          </div>
        </div>
      </Cam>
    </>
  );
};

const Drop: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const price = Math.round(interpolate(f, [S.drop, v(50), v(52), v(53)], [80000, 60000, 50000, 50000], clamp) / 1000) * 1000;
  const chart = interpolate(f, [S.drop, v(55)], [0, 1], clamp);
  const pts = Array.from({length: 40}).map((_, i) => {
    const t = i / 39;
    const y = t < 0.5 ? 0.15 : 0.15 + Math.pow((t - 0.5) / 0.5, 1.4) * 0.72;
    return [80 + t * 840, 120 + y * 520 * Math.min(1, chart * 1.2)];
  });
  const path = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(0)} ${p[1].toFixed(0)}`).join(' ');
  return (
    <>
      <Bg glow="#3a1016" />
      <Chip x={540} y={100} s={pop(f, S.drop, fps)} bg="#1c2030" size={38}>УТРОМ — ТОРГОВАЯ ПЛОЩАДКА</Chip>
      <svg width={1000} height={700} viewBox="0 0 1000 700" style={{position: 'absolute', left: 40, top: 300}}>
        <rect x={40} y={60} width={920} height={620} rx={16} fill="rgba(10,14,22,0.7)" />
        {[0, 1, 2, 3].map((i) => <line key={i} x1={80} y1={160 + i * 150} x2={920} y2={160 + i * 150} stroke="#2a3244" strokeWidth={2} />)}
        <path d={`${path} L 920 660 L 80 660 Z`} fill={`${RED}22`} />
        <path d={path} fill="none" stroke={RED} strokeWidth={6} style={{filter: `drop-shadow(0 0 10px ${RED})`}} />
        <circle cx={pts[39][0]} cy={pts[39][1]} r={12} fill={RED} style={{filter: `drop-shadow(0 0 14px ${RED})`}} />
      </svg>
      <div style={{position: 'absolute', left: 540, top: 240, transform: 'translate(-50%,-50%)', fontFamily: 'Russo One', fontSize: 120, color: '#fff', whiteSpace: 'nowrap'}}>{rub(price)}</div>
      {f >= v(53) && <Big x={540} y={1070} s={pop(f, v(53), fps, 320, 9)} size={120} color={RED}>−30 000 ₽</Big>}
    </>
  );
};

const Why: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <>
      <Bg glow="#1a2a4a" />
      <Big x={540} y={160} s={pop(f, S.why, fps)} size={60} color="#fff">ПОЧЕМУ?</Big>
      {f >= v(68) && (
        <div style={{position: 'absolute', left: 540, top: 380, transform: `translate(-50%,-50%) scale(${pop(f, v(68), fps)})`, textAlign: 'center', fontFamily: 'Montserrat'}}>
          <div style={{fontSize: 52, fontWeight: 900, color: '#fff'}}>Скины — <span style={{color: RED, textDecoration: 'line-through'}}>деньги</span></div>
          <div style={{fontSize: 70, fontWeight: 900, color: GOLD, marginTop: 10}}>это ТОВАР</div>
        </div>
      )}
      {f >= v(74) && (
        <div style={{position: 'absolute', left: 540, top: 720, transform: `translate(-50%,-50%) scale(${pop(f, v(74), fps)})`, display: 'flex', gap: 24, alignItems: 'center', fontFamily: 'Montserrat'}}>
          <div style={{background: '#1c2030', color: '#fff', fontWeight: 900, fontSize: 36, padding: '20px 34px', borderRadius: 16}}>РЫНОК</div>
          <div style={{fontSize: 40, color: '#8f98a0'}}>+</div>
          <div style={{background: '#1c2030', color: '#fff', fontWeight: 900, fontSize: 36, padding: '20px 34px', borderRadius: 16}}>VALVE</div>
          <div style={{fontSize: 40, color: '#8f98a0'}}>решают цену</div>
        </div>
      )}
      {f >= v(82) && <Chip x={540} y={1000} s={pop(f, v(82), fps)} bg={RED} size={38}>обновление → цена падает</Chip>}
    </>
  );
};

const Tips: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const tip = (at: number, y: number, n: string, t: string, icon: string) => {
    const s = pop(f, at, fps);
    return (
      <div style={{position: 'absolute', left: 540, top: y, width: 940, transform: `translate(-50%,-50%) scale(${0.85 + 0.15 * s})`, opacity: Math.min(1, s * 2), display: 'flex', alignItems: 'center', gap: 26,
        background: '#121722', border: '3px solid #2a3244', borderRadius: 24, padding: '26px 32px', fontFamily: 'Montserrat'}}>
        <div style={{fontSize: 54, flexShrink: 0}}>{icon}</div>
        <div><div style={{fontSize: 26, fontWeight: 900, color: GOLD}}>{n}</div><div style={{fontSize: 36, fontWeight: 900, color: '#fff', lineHeight: 1.15, marginTop: 6}}>{t}</div></div>
      </div>
    );
  };
  return (
    <>
      <Bg glow="#1a3a3a" />
      <Big x={540} y={160} s={pop(f, S.tips, fps)} size={60} color="#fff">ЧТО ДЕЛАТЬ?</Big>
      {tip(v(97), 400, 'ПЕРВОЕ', 'Покупай, только если готов не продавать', '🔪')}
      {tip(v(106), 650, 'ВТОРОЕ', 'Не вкладывай последние деньги', '💸')}
      {tip(v(113), 900, 'ТРЕТЬЕ', 'Смотри график цены хотя бы за год', '📉')}
    </>
  );
};

const Last: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <>
      <Inspect f={f} />
      <Chip x={540} y={150} s={pop(f, S.last, fps)} bg="rgba(10,14,22,0.85)" size={40}>А ЛЁХА ВСЁ РАВНО КРУТИТ НОЖ</Chip>
      {f >= v(129) && <Big x={540} y={1050} s={pop(f, v(129), fps, 320, 9)} size={80} color={GOLD}>ОН ЖЕ КРАСИВЫЙ</Big>}
    </>
  );
};

const End: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (f < S.end) return null;
  const m = pop(f, S.end, fps, 320, 9), p = pop(f, S.end + 8, fps);
  return (
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, #1a2a4a, #0b0c12 70%)', alignItems: 'center', justifyContent: 'center', paddingBottom: 220, textAlign: 'center'}}>
      <div style={{fontFamily: 'Russo One', fontSize: 150, color: RED, transform: `scale(${0.6 + 0.4 * m})`, opacity: Math.min(1, m * 2), textShadow: `0 0 50px ${RED}`}}>−30k</div>
      <div style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 64, color: '#fff', marginTop: 20, opacity: p, lineHeight: 1.05}}>А У ТЕБЯ ПАДАЛ<br />СКИН?</div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- звук (несколько тихих эффектов, без фонового гула)
type Fx = [number, string, number];
const SFX: Fx[] = [
  [2, 'sfx2/pop.wav', 0.3], [v(18), 'sfx2/impact.wav', 0.35], [v(23), 'money/cash.wav', 0.3],
  [v(39), 'sfx2/glitch.wav', 0.4], [v(39), 'sfx2/impact.wav', 0.35],
  [v(50), 'sfx2/blip_low.wav', 0.3], [v(52), 'sfx2/blip_low.wav', 0.3], [v(53), 'money/boom.wav', 0.4],
  [S.why, 'sfx2/whoosh.wav', 0.3], [v(68), 'sfx2/stamp.wav', 0.3], [v(82), 'sfx2/error.wav', 0.25],
  [v(97), 'sfx2/blip.wav', 0.3], [v(106), 'sfx2/blip.wav', 0.3], [v(113), 'sfx2/blip.wav', 0.3],
  [S.end, 'sfx2/deflate.wav', 0.4],
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

export const Knife: React.FC = () => {
  loadFonts();
  const order: [number, number, React.FC, boolean?][] = [
    [S.hook, S.buy, Hook], [S.buy, S.happy, Buy, true], [S.happy, S.update, Happy, true], [S.update, S.drop, Update, true],
    [S.drop, S.why, Drop, true], [S.why, S.tips, Why, true], [S.tips, S.last, Tips, true], [S.last, S.end, Last, true],
  ];
  return (
    <AbsoluteFill style={{background: '#0b0c12'}}>
      {order.map(([from, to, C, cut], i) => <Scene key={i} from={from} to={to} cut={cut}><C /></Scene>)}
      <Flash at={v(39)} len={12} />
      <Flash at={v(53)} len={12} />
      <AbsoluteFill style={{top: H - 220, height: 220, background: 'linear-gradient(rgba(11,12,18,0), #0b0c12)'}} />
      <Captions cues={CUES} />
      <End />
      <Sound />
    </AbsoluteFill>
  );
};
