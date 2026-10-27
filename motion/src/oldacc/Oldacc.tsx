// TikTok-ролик «Старый аккаунт 2014» (9:16, ≈55 с). Герой — Лёха v2, формат «ностальгия + деньги».
// Исходники пользователя: инвентарь CS2 (public/oldacc/inv.png), график Торговой площадки (chart_ref.png — только референс),
// кейс (case.png) и перчатки (gloves.png). Ник, почта и цены — выдуманные, данные реального аккаунта не используются.
import React from 'react';
import {AbsoluteFill, Audio, Img, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {loadFonts} from '../theme';
import {FPS, fr} from '../tilt/script';
import {VO, TOTAL, CUES, v} from './script';
import {Captions, clamp, pop} from '../tilt/UI';
import {ramp} from '../tilt/Tilt';
import {Scene, Cam, Flash} from '../money/Money';
import {Portrait, H, RED} from '../money/Props';

export const OLDACC_FRAMES = fr(TOTAL);

const S = {
  hook: 0, mail: v(14) - 4, profile: v(31) - 4, inv: v(43) - 4, nokn: v(48) - 3, items: v(64) - 4, trash: v(81) - 4,
  today: v(91) - 4, price: v(109) - 4, didnt: v(121) - 4, moral: v(131) - 4, end: fr(53.3),
};
const GOLD = '#ffd23f', GREEN = '#2bd96b', STEAM = '#1b2838', BLUE = '#66c0f4';

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

// значок турнира (рисованный)
const Badge: React.FC<{w?: number}> = ({w = 120}) => (
  <svg width={w} height={w} viewBox="0 0 100 100">
    <circle cx={50} cy={50} r={46} fill="#c49a2a" stroke="#8a6a14" strokeWidth={3} />
    <circle cx={50} cy={50} r={38} fill="#e8c24a" />
    {Array.from({length: 24}).map((_, i) => <line key={i} x1={50} y1={50} x2={50 + 44 * Math.cos(i * Math.PI / 12)} y2={50 + 44 * Math.sin(i * Math.PI / 12)} stroke="#b88a1a" strokeWidth={1} opacity={0.4} />)}
    <path d="M50 24 L57 43 L78 43 L61 56 L68 76 L50 63 L32 76 L39 56 L22 43 L43 43 Z" fill="#6a4f10" />
    <text x={50} y={92} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={11} fill="#e8c24a">2014</text>
  </svg>
);

// ---------------------------------------------------------------- почта
const MailScene: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const open = f >= v(20);
  return (
    <>
      <Bg glow="#1a3a6a" />
      <Chip x={540} y={130} s={pop(f, v(14), fps)} bg="#1c2030" size={38}>📬 ЛЁХА ЧИСТИЛ ПОЧТУ</Chip>
      <div style={{position: 'absolute', left: 70, top: 260, width: 940, background: '#fff', borderRadius: 18, overflow: 'hidden', fontFamily: 'Montserrat', boxShadow: '0 30px 60px rgba(0,0,0,0.6)',
        transform: `scale(${open ? pop(f, v(20), fps, 240, 14) : 1})`, transformOrigin: 'center top'}}>
        <div style={{background: '#171a21', padding: '22px 30px', display: 'flex', alignItems: 'center', gap: 16}}>
          <div style={{width: 60, height: 60, borderRadius: 12, background: STEAM, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <svg width={40} height={40} viewBox="0 0 40 40"><circle cx={20} cy={20} r={18} fill="#fff" /><circle cx={26} cy={14} r={7} fill={STEAM} /><circle cx={26} cy={14} r={3} fill="#fff" /><circle cx={13} cy={26} r={5} fill={STEAM} /><line x1={13} y1={26} x2={24} y2={16} stroke={STEAM} strokeWidth={3} /></svg>
          </div>
          <div><div style={{fontSize: 30, fontWeight: 900, color: '#fff'}}>Steam</div><div style={{fontSize: 24, color: '#8f98a0'}}>noreply@steampowered.com</div></div>
          <div style={{marginLeft: 'auto', fontSize: 24, color: '#8f98a0'}}>окт. 2014</div>
        </div>
        <div style={{padding: '36px 40px'}}>
          <div style={{fontSize: 48, fontWeight: 900, color: '#171a21'}}>Добро пожаловать в Steam!</div>
          <div style={{fontSize: 30, color: '#4a4f57', marginTop: 20, lineHeight: 1.4}}>Спасибо за регистрацию. Ваш аккаунт создан.</div>
          <div style={{marginTop: 24, display: 'inline-block', background: STEAM, color: '#fff', fontSize: 28, fontWeight: 900, padding: '14px 30px', borderRadius: 8}}>Начать играть</div>
        </div>
      </div>
      {f >= v(24) && <Big x={540} y={920} s={pop(f, v(24), fps, 300, 9)} size={120} color={GOLD}>2014</Big>}
      {f >= v(26) && <Chip x={540} y={1070} s={pop(f, v(26), fps)} bg={RED} size={40}>АККАУНТ, ПРО КОТОРЫЙ ОН ЗАБЫЛ</Chip>}
    </>
  );
};

// ---------------------------------------------------------------- старый профиль
const ProfileScene: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <>
      <Bg glow="#1a2a4a" />
      <div style={{position: 'absolute', left: 40, top: 180, width: 1000, background: `linear-gradient(160deg, #2a3446, ${STEAM} 40%, #141a24)`, borderRadius: 18, padding: 40, boxSizing: 'border-box', fontFamily: 'Montserrat', boxShadow: '0 30px 70px rgba(0,0,0,0.6)'}}>
        <div style={{display: 'flex', gap: 28}}>
          <div style={{width: 180, height: 180, border: '4px solid #5a6a2a', background: 'linear-gradient(#3a4a6a, #1a2030)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
            <svg width={150} height={150} viewBox="0 0 100 100"><ellipse cx={50} cy={58} rx={30} ry={26} fill="#8a8f98" /><circle cx={50} cy={40} r={24} fill="#9aa0a8" /><path d="M30 26 L38 10 L44 28 M70 26 L62 10 L56 28" fill="#9aa0a8" /><circle cx={42} cy={40} r={4} fill="#1a1a1a" /><circle cx={58} cy={40} r={4} fill="#1a1a1a" /><path d="M46 48 L50 52 L54 48" stroke="#1a1a1a" strokeWidth={2} fill="none" /><path d="M36 46 L18 42 M36 50 L18 52 M64 46 L82 42 M64 50 L82 52" stroke="#6a6f78" strokeWidth={2} /></svg>
          </div>
          <div style={{flex: 1, paddingTop: 10}}>
            <div style={{fontSize: 52, color: '#fff', fontWeight: 600}}>xXx_lexa_2014</div>
            <div style={{fontSize: 26, color: '#8f98a0', marginTop: 12}}>Не в сети · с октября 2014</div>
            <div style={{display: 'flex', gap: 14, marginTop: 24}}>
              {['давно не в сети', 'давно не в сети', 'не в сети 8 лет'].map((t, i) => (
                <div key={i} style={{display: 'flex', alignItems: 'center', gap: 10, fontSize: 22, color: '#6a7078'}}>
                  <div style={{width: 40, height: 40, borderRadius: 4, background: '#2a3040'}} />{t}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {f >= v(31) && f < v(34) && <Chip x={540} y={760} s={pop(f, v(31), fps)} bg="#1c2030" size={40}>СТАРЫЙ НИК</Chip>}
      {f >= v(34) && f < v(37) && <Chip x={540} y={760} s={pop(f, v(34), fps)} bg="#1c2030" size={40}>🐱 АВАТАРКА С КОТОМ</Chip>}
      {f >= v(37) && <Chip x={540} y={760} s={pop(f, v(37), fps)} bg="#1c2030" size={40}>ДРУЗЬЯ ДАВНО НЕ В СЕТИ</Chip>}
    </>
  );
};

// ---------------------------------------------------------------- инвентарь (скрин пользователя)
const InvScene: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const z = interpolate(f, [S.inv, v(64)], [1, 1.1], clamp);
  return (
    <>
      <Bg />
      <Cam s={z}>
        <Img src={staticFile('oldacc/inv.png')} style={{position: 'absolute', left: 40, top: 200, width: 1000, borderRadius: 12, boxShadow: '0 30px 60px rgba(0,0,0,0.6)'}} />
      </Cam>
      {f >= v(48) && f < v(50) && <Chip x={540} y={150} s={pop(f, v(48), fps, 320, 9)} bg={RED} size={46}>НОЖА НЕТ</Chip>}
      {f >= v(50) && f < v(53) && <Chip x={540} y={150} s={pop(f, v(50), fps)} bg={RED} size={44}>ДОРОГИХ СКИНОВ НЕТ</Chip>}
      {f >= v(53) && <Chip x={540} y={150} s={pop(f, v(53), fps)} bg={GOLD} color="#111" size={40}>НО ЕСТЬ КОЕ-ЧТО…</Chip>}
    </>
  );
};

// ---------------------------------------------------------------- три предмета
const ItemCard: React.FC<{f: number; at: number; x: number; icon: React.ReactNode; name: string}> = ({f, at, x, icon, name}) => {
  const s = pop(f, at, fps0(f));
  return (
    <div style={{position: 'absolute', left: x, top: 560, width: 300, transform: `translate(-50%,-50%) scale(${0.8 + 0.2 * s})`, opacity: Math.min(1, s * 2), background: '#121722', border: `3px solid ${GOLD}`, borderRadius: 20,
      padding: 24, boxSizing: 'border-box', textAlign: 'center', fontFamily: 'Montserrat', boxShadow: `0 0 30px ${GOLD}55`}}>
      <div style={{height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{icon}</div>
      <div style={{fontSize: 26, fontWeight: 900, color: '#fff', marginTop: 10}}>{name}</div>
    </div>
  );
};
const fps0 = (_f: number) => 30;
const Items: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <>
      <Bg glow="#2a3a1a" />
      <Big x={540} y={160} s={pop(f, S.items, fps)} size={54} color={GOLD}>ТОГДА — КОПЕЙКИ</Big>
      <ItemCard f={f} at={v(64)} x={230} icon={<Img src={staticFile('oldacc/gloves.png')} style={{width: 220}} />} name="Перчатки операции" />
      <ItemCard f={f} at={v(68)} x={540} icon={<Badge w={150} />} name="Значок турнира" />
      <ItemCard f={f} at={v(74)} x={850} icon={<Img src={staticFile('oldacc/case.png')} style={{width: 200}} />} name="Старый кейс" />
      {f >= v(74) && <Chip x={540} y={840} s={pop(f, v(74), fps)} bg="#1c2030" size={34}>эти кейсы давно вывели из игры</Chip>}
    </>
  );
};

// ---------------------------------------------------------------- тогда мусор: продажа за 10₽
const Trash: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const sold = f >= v(88);
  return (
    <>
      <Bg glow="#3a2a1a" />
      <Big x={540} y={230} s={pop(f, S.trash, fps)} size={70} color="#fff">ТОГДА — МУСОР</Big>
      <div style={{position: 'absolute', left: 540, top: 560, transform: 'translate(-50%,-50%)', opacity: sold ? 0.4 : 1}}>
        <Img src={staticFile('oldacc/gloves.png')} style={{width: 320}} />
      </div>
      <div style={{position: 'absolute', left: 540, top: 820, transform: `translate(-50%,-50%) scale(${pop(f, v(85), fps)})`, display: 'flex', alignItems: 'center', gap: 20}}>
        <div style={{fontFamily: 'Russo One', fontSize: 90, color: '#8f98a0'}}>10 ₽</div>
        {sold && <div style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 40, color: RED, background: 'rgba(235,75,75,0.15)', border: `3px solid ${RED}`, padding: '12px 26px', borderRadius: 14, transform: `scale(${pop(f, v(88), fps, 320, 9)})`}}>ПРОДАНО</div>}
      </div>
    </>
  );
};

// ---------------------------------------------------------------- сегодня: график вверх, ×100
const PriceScene: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const grow = interpolate(f, [S.price, v(118)], [0, 1], clamp);
  const pts = Array.from({length: 40}).map((_, i) => {
    const t = i / 39;
    const base = t < 0.6 ? 0.12 + t * 0.1 : 0.18 + Math.pow((t - 0.6) / 0.4, 2) * 0.8;
    return [80 + t * 840, 680 - base * 560 * Math.min(1, grow * 1.4)];
  });
  const path = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(0)} ${p[1].toFixed(0)}`).join(' ');
  const mult = Math.round(interpolate(f, [v(118), v(120) + 10], [1, 100], clamp));
  return (
    <>
      <Bg glow="#1a3a2a" />
      <Chip x={540} y={130} s={pop(f, S.price, fps)} bg="#1c2030" size={40}>А СЕГОДНЯ…</Chip>
      <svg width={1000} height={720} viewBox="0 0 1000 720" style={{position: 'absolute', left: 40, top: 230}}>
        <rect x={40} y={60} width={920} height={640} rx={16} fill="rgba(10,14,22,0.7)" />
        {[0, 1, 2, 3, 4].map((i) => <line key={i} x1={80} y1={120 + i * 130} x2={920} y2={120 + i * 130} stroke="#2a3244" strokeWidth={2} />)}
        <path d={`${path} L 920 680 L 80 680 Z`} fill={`${GREEN}22`} />
        <path d={path} fill="none" stroke={GREEN} strokeWidth={6} style={{filter: `drop-shadow(0 0 10px ${GREEN})`}} />
        <circle cx={pts[39][0]} cy={pts[39][1]} r={12} fill={GREEN} style={{filter: `drop-shadow(0 0 14px ${GREEN})`}} />
      </svg>
      {f >= v(118) && <Big x={540} y={470} s={pop(f, v(118), fps, 300, 9)} size={150} color={GREEN}>×{mult}</Big>}
      {f >= v(118) && <Chip x={540} y={980} s={pop(f, v(118), fps)} bg={GREEN} color="#06260f" size={40}>В СОТНИ РАЗ ДОРОЖЕ</Chip>}
    </>
  );
};

const Didnt: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <>
      <Bg glow="#2a1a3a" />
      <div style={{position: 'absolute', left: 0, top: 540, width: 1080, height: 640, overflow: 'hidden'}}>
        <Portrait f={f} bg="dorm" mood="shocked" look={0.2} scale={1.05} y={420} />
      </div>
      <Big x={540} y={300} s={pop(f, S.didnt, fps)} size={60} color="#fff">10 ЛЕТ СИДЕЛ И…</Big>
      {f >= v(129) && <Big x={540} y={460} s={pop(f, v(129), fps, 320, 9)} size={110} color={RED}>НЕ ЗНАЛ</Big>}
    </>
  );
};

const Moral: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const card = (at: number, y: number, t: string, icon: string) => {
    const s = pop(f, at, fps);
    return (
      <div style={{position: 'absolute', left: 540, top: y, width: 940, transform: `translate(-50%,-50%) scale(${0.85 + 0.15 * s})`, opacity: Math.min(1, s * 2), display: 'flex', alignItems: 'center', gap: 26,
        background: '#121722', border: '3px solid #2a3244', borderRadius: 24, padding: '28px 34px', fontFamily: 'Montserrat'}}>
        <div style={{fontSize: 56, flexShrink: 0}}>{icon}</div>
        <div style={{fontSize: 40, fontWeight: 900, color: '#fff', lineHeight: 1.15}}>{t}</div>
      </div>
    );
  };
  return (
    <>
      <Bg glow="#1a3a4a" />
      <Big x={540} y={180} s={pop(f, S.moral, fps)} size={62} color="#fff">МОРАЛЬ</Big>
      {card(v(133), 470, 'Не продавай старое, пока не узнал цену сейчас', '💰')}
      {card(v(143), 720, 'Не теряй аккаунты, которым 10 лет', '🔑')}
    </>
  );
};

const End: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (f < S.end) return null;
  const m = pop(f, S.end, fps, 320, 9), p = pop(f, S.end + 8, fps);
  return (
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, #1a3a2a, #0b0c12 70%)', alignItems: 'center', justifyContent: 'center', paddingBottom: 240, textAlign: 'center'}}>
      <div style={{transform: `scale(${0.6 + 0.4 * m})`, opacity: Math.min(1, m * 2)}}><Badge w={220} /></div>
      <div style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 70, color: '#fff', marginTop: 30, opacity: p, lineHeight: 1.05}}>ПРОВЕРЬ<br />СВОЙ АККАУНТ</div>
      <div style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 38, color: GOLD, marginTop: 20, opacity: p}}>а что лежит у тебя?</div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- звук (несколько тихих эффектов, без фонового гула)
type Fx = [number, string, number];
const SFX: Fx[] = [
  [v(4), 'sfx2/impact.wav', 0.35], [v(20), 'money/flip.wav', 0.3], [v(24), 'sfx2/stamp.wav', 0.3],
  [v(46), 'sfx2/whoosh.wav', 0.3], [v(64), 'sfx2/blip.wav', 0.3], [v(68), 'sfx2/blip.wav', 0.3], [v(74), 'sfx2/blip.wav', 0.3],
  [v(88), 'sfx2/click.wav', 0.3], [v(118), 'sfx2/ding.wav', 0.35], [v(129), 'sfx2/impact.wav', 0.35],
  [S.end, 'sfx2/ding.wav', 0.4],
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

export const Oldacc: React.FC = () => {
  loadFonts();
  const order: [number, number, React.FC, boolean?][] = [
    [S.hook, S.mail, HookS], [S.mail, S.profile, MailScene, true], [S.profile, S.inv, ProfileScene, true], [S.inv, S.items, InvScene, true],
    [S.items, S.trash, Items, true], [S.trash, S.today, Trash, true], [S.today, S.price, Today, true], [S.price, S.didnt, PriceScene, true],
    [S.didnt, S.moral, Didnt, true], [S.moral, S.end, Moral, true],
  ];
  return (
    <AbsoluteFill style={{background: '#0b0c12'}}>
      {order.map(([from, to, C, cut], i) => <Scene key={i} from={from} to={to} cut={cut}><C /></Scene>)}
      <Flash at={v(4)} len={10} />
      <Flash at={v(118)} len={12} color="rgba(60,200,120,0.4)" />
      <AbsoluteFill style={{top: H - 220, height: 220, background: 'linear-gradient(rgba(11,12,18,0), #0b0c12)'}} />
      <Captions cues={CUES} />
      <End />
      <Sound />
    </AbsoluteFill>
  );
};

// хук
const HookS: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <>
      <Bg glow="#3a1a1a" />
      <Big x={540} y={300} s={pop(f, 2, fps)} size={60} color="#fff">САМАЯ ДОРОГАЯ</Big>
      <Big x={540} y={400} s={pop(f, 6, fps)} size={60} color="#fff">ОШИБКА В CS —</Big>
      {f >= v(5) && <div style={{position: 'absolute', left: 540, top: 600, transform: `translate(-50%,-50%) scale(${pop(f, v(5), fps)})`, textDecoration: 'line-through', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 56, color: '#8f98a0'}}>не слитая катка</div>}
      {f >= v(8) && <Big x={540} y={780} s={pop(f, v(8), fps, 320, 9)} size={70} color={RED}>СКИН ЗА 10 ₽</Big>}
      {f >= v(8) && <div style={{position: 'absolute', left: 540, top: 920, transform: 'translate(-50%,-50%)', opacity: Math.min(1, pop(f, v(8), fps) * 2)}}><Img src={staticFile('oldacc/gloves.png')} style={{width: 280}} /></div>}
    </>
  );
};

// «сегодня мусора почти не осталось»
const Today: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const gone = interpolate(f, [S.today, v(97)], [1, 0.15], clamp);
  return (
    <>
      <Bg glow="#2a1a1a" />
      <Big x={540} y={200} s={pop(f, S.today, fps)} size={58} color="#fff">А СЕГОДНЯ…</Big>
      <div style={{position: 'absolute', left: 0, top: 360, width: 1080, height: 500}}>
        {Array.from({length: 12}).map((_, i) => {
          const vis = i / 12 < gone;
          return <div key={i} style={{position: 'absolute', left: 120 + (i % 4) * 230, top: 60 + Math.floor(i / 4) * 160, opacity: vis ? 0.9 : 0.08}}><Img src={staticFile('oldacc/case.png')} style={{width: 150}} /></div>;
        })}
      </div>
      {f >= v(98) && <Chip x={540} y={980} s={pop(f, v(98), fps)} bg={RED} size={40}>почти всё потеряно или выкинуто</Chip>}
    </>
  );
};
