// TikTok-ролик «1000 ₽ за каждую смерть» (9:16, ≈54,5 с). Герой — Лёха v2.
// Исходники пользователя (public/death1k): таблица счёта по Tab (строка Лёхи переписана, чужие ники размыты),
// экран смерти CS2 (ник убийцы заменён на «Enemy», остальные ники размыты). Уведомления — зелёные «Сбер» (по просьбе пользователя).
import React from 'react';
import {AbsoluteFill, Audio, Img, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {loadFonts} from '../theme';
import {FPS, fr} from '../tilt/script';
import {VO, TOTAL, CUES, v} from './script';
import {Captions, clamp, pop} from '../tilt/UI';
import {ramp} from '../tilt/Tilt';
import {Scene, Cam, Flash} from '../money/Money';
import {Portrait, H, RED} from '../money/Props';
import {Facecam} from '../cases/Rig';

export const DEATH1K_FRAMES = fr(TOTAL);

const S = {
  hook: 0, agree: v(18) - 4, m1: v(22) - 4, after: v(31) - 4, m2: v(37) - 4, score: v(49) - 4, kick: v(54) - 4, m3: v(61) - 4,
  lesson: v(72) - 4, rule: v(81) - 4, rush: v(92) - 4, die: v(98) - 4, end: fr(50.2),
};
const GOLD = '#ffd23f', GREEN = '#2bd96b', SBER = '#21a038', CT = '#5d9cec', T = '#e8b23a';
const img = (p: string) => staticFile(p);

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

// пуш банка (зелёный «Сбер», без логотипа — просто значок и название)
const BankPush: React.FC<{y: number; a: number; text: string; sub?: string; plus?: boolean}> = ({y, a, text, sub, plus}) => (
  <div style={{position: 'absolute', left: 540, top: y, width: 920, transform: `translate(-50%, ${(1 - Math.min(1, a)) * -120}px) scale(${0.94 + 0.06 * Math.min(1, a)})`, opacity: Math.min(1, a * 2),
    background: 'rgba(242,245,248,0.97)', borderRadius: 30, padding: '20px 26px', display: 'flex', gap: 20, alignItems: 'center', boxSizing: 'border-box', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', fontFamily: 'Montserrat'}}>
    <div style={{width: 84, height: 84, borderRadius: 22, background: SBER, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: 24}}>Сбер</div>
    <div style={{flex: 1}}>
      <div style={{fontSize: 26, fontWeight: 900, color: '#555'}}>Сбер <span style={{fontWeight: 600, color: '#999'}}>· сейчас</span></div>
      <div style={{fontSize: 38, fontWeight: 900, color: plus ? SBER : '#d12a2a'}}>{text}</div>
      {sub && <div style={{fontSize: 26, fontWeight: 600, color: '#555'}}>{sub}</div>}
    </div>
  </div>
);

// экран смерти CS2 (реальный скрин), ник убийцы — «Enemy»
const DeathScreen: React.FC<{f: number; zoom?: number; y?: number}> = ({f, zoom = 1, y = 560}) => {
  const W0 = 1672, H0 = 940, s = 1.6 * zoom;
  const cx = 835, cy = 510;
  return (
    <div style={{position: 'absolute', left: 0, top: y - 360, width: 1080, height: 720, overflow: 'hidden', borderRadius: 20}}>
      <div style={{position: 'absolute', left: 540 - cx * s, top: 360 - cy * s, width: W0 * s, height: H0 * s}}>
        <Img src={img('death1k/death.png')} style={{width: '100%', height: '100%'}} />
        <div style={{position: 'absolute', left: 670 * s, top: 513 * s, transform: 'translateY(-50%)', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 19 * s, color: '#fff'}}>Enemy</div>
      </div>
      <div style={{position: 'absolute', inset: 0, background: `rgba(255,0,0,${0.08 + 0.05 * Math.sin(f / 5)})`}} />
    </div>
  );
};

// ---------------------------------------------------------------- сцены
const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const card = pop(f, 4, fps);
  return (
    <>
      <Cam s={interpolate(f, [0, S.agree], [1.0, 1.08], clamp)} y={800}>
        <Portrait f={f} bg="dorm" mood={f >= v(10) ? 'shocked' : 'neutral'} scale={1.3} y={1060} />
      </Cam>
      {/* банковская карта Лёхи */}
      <div style={{position: 'absolute', left: 540, top: 330, width: 620, height: 380, transform: `translate(-50%, -50%) rotate(-6deg) scale(${card})`, opacity: Math.min(1, card * 2), borderRadius: 30,
        background: `linear-gradient(135deg, #2bc35a, ${SBER} 55%, #0f6a2a)`, boxShadow: '0 30px 60px rgba(0,0,0,0.6)', fontFamily: 'Montserrat', color: '#fff', padding: 36, boxSizing: 'border-box'}}>
        <div style={{fontSize: 40, fontWeight: 900}}>Сбер</div>
        <div style={{width: 90, height: 66, borderRadius: 12, background: 'linear-gradient(135deg, #f2d27a, #c9a24a)', marginTop: 30}} />
        <div style={{fontSize: 40, fontWeight: 600, letterSpacing: 6, marginTop: 30}}>•••• 1000</div>
        <div style={{fontSize: 28, fontWeight: 900, marginTop: 10, opacity: 0.9}}>ЛЁХА</div>
      </div>
      {f >= v(4) && (
        <div style={{position: 'absolute', left: 540, top: 640, transform: `translate(-50%, -50%) scale(${pop(f, v(4), fps, 300, 10)})`, display: 'flex', alignItems: 'center', gap: 20}}>
          <svg width={110} height={110} viewBox="0 0 100 100"><path d="M50 8 C24 8 12 28 12 48 C12 62 20 70 28 74 L28 90 L72 90 L72 74 C80 70 88 62 88 48 C88 28 76 8 50 8 Z" fill="#fff" />
            <circle cx={35} cy={50} r={10} fill="#111" /><circle cx={65} cy={50} r={10} fill="#111" /><path d="M44 72 L50 64 L56 72 Z" fill="#111" /></svg>
          <span style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 84, color: RED, textShadow: `0 0 30px ${RED}88`, whiteSpace: 'nowrap'}}>= −1 000 ₽</span>
        </div>
      )}
    </>
  );
};

const Agree: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const sign = ramp(f, v(20), v(21) + 12);
  return (
    <>
      <Bg glow="#1a4a2a" />
      <div style={{position: 'absolute', left: 540, top: 470, width: 780, transform: `translate(-50%, -50%) rotate(-2deg) scale(${pop(f, S.agree + 2, fps)})`, background: '#f1ead8', borderRadius: 8,
        padding: '40px 50px', boxSizing: 'border-box', fontFamily: 'Montserrat', boxShadow: '0 30px 60px rgba(0,0,0,0.6)'}}>
        <div style={{fontSize: 46, fontWeight: 900, color: '#1d1f2e'}}>ЭКСПЕРИМЕНТ</div>
        <div style={{fontSize: 34, fontWeight: 600, color: '#2a2d3a', marginTop: 20, lineHeight: 1.4}}>1 смерть в CS = <b style={{color: '#c4232d'}}>−1 000 ₽</b><br />Списание — автоматически<br />с карты Лёхи</div>
        <svg width={360} height={110} viewBox="0 0 360 110" style={{marginTop: 20}}>
          <line x1={0} y1={96} x2={360} y2={96} stroke="#8a8270" strokeWidth={3} />
          <path d="M10 80 C40 20 60 90 90 50 C110 20 120 80 150 60 C180 40 190 70 220 52 C250 34 270 70 340 40" fill="none" stroke="#23285a" strokeWidth={6} strokeLinecap="round"
            strokeDasharray={600} strokeDashoffset={600 * (1 - sign)} />
        </svg>
      </div>
      <Facecam x={540} y={920} r={150} mood="happy" ring={GREEN} />
    </>
  );
};

const M1: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const d2 = f >= v(27);
  return (
    <>
      <Bg glow="#5a1a22" />
      <Chip x={540} y={150} s={pop(f, S.m1 + 2, fps)} bg="#1c2030" size={40}>КАТКА 1</Chip>
      {f >= v(24) - 4 && <DeathScreen f={f} zoom={d2 ? 1 + ramp(f, v(27), v(27) + 8) * 0.06 : 1} y={600} />}
      <BankPush y={300} a={pop(f, v(25), fps)} text="Списано 1 000 ₽" sub="CS2 · смерть" />
      {d2 && <BankPush y={1010} a={pop(f, v(29), fps)} text="Списано 1 000 ₽" sub="Итого: −2 000 ₽" />}
    </>
  );
};

const After: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const n = Math.min(6, Math.floor(ramp(f, v(31), v(34)) * 6));
  return (
    <>
      <Bg glow="#5a1a22" />
      <div style={{position: 'absolute', left: 540, top: 140, transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', gap: 12}}>
        {Array.from({length: n}).map((_, i) => (
          <div key={i} style={{transform: `scale(${1 - (n - 1 - i) * 0.03})`, opacity: 0.55 + (i / n) * 0.45}}>
            <div style={{width: 900, background: 'rgba(242,245,248,0.95)', borderRadius: 24, padding: '12px 22px', display: 'flex', gap: 16, alignItems: 'center', fontFamily: 'Montserrat'}}>
              <div style={{width: 56, height: 56, borderRadius: 14, background: SBER, color: '#fff', fontWeight: 900, fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>Сбер</div>
              <div style={{fontSize: 32, fontWeight: 900, color: '#d12a2a'}}>Списано 1 000 ₽</div>
              <div style={{marginLeft: 'auto', fontSize: 22, color: '#999', fontWeight: 600}}>CS2</div>
            </div>
          </div>
        ))}
      </div>
      {f >= v(34) && (
        <div style={{position: 'absolute', left: 540, top: 900, transform: `translate(-50%, -50%) scale(${pop(f, v(35), fps, 300, 9)})`, textAlign: 'center', background: 'rgba(7,9,15,0.85)', padding: '10px 30px', borderRadius: 30}}>
          <div style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 40, color: '#8e9ab8'}}>ЗА ОДНУ КАТКУ</div>
          <div style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 140, color: RED, textShadow: `0 0 40px ${RED}88`, whiteSpace: 'nowrap'}}>−17 000 ₽</div>
        </div>
      )}
    </>
  );
};

const M2: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const zoom = 1 + ramp(f, v(43), v(45) + 12) * 0.6;
  return (
    <>
      <Bg glow="#2a3a5a" />
      <Chip x={540} y={150} s={pop(f, S.m2 + 2, fps)} bg="#1c2030" size={40}>КАТКА 2</Chip>
      {/* кадр из игры: прижался в угол */}
      <div style={{position: 'absolute', left: 0, top: 260, width: 1080, height: 600, overflow: 'hidden', borderRadius: 18}}>
        <Img src={img('clutch/game.png')} style={{position: 'absolute', width: 1080 * zoom, height: 607 * zoom, left: -20 - (zoom - 1) * 200, top: -(zoom - 1) * 300, filter: `brightness(${1 - (zoom - 1) * 0.5})`}} />
        <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(circle at 30% 50%, transparent 30%, rgba(0,0,0,0.75))'}} />
      </div>
      <Chip x={540} y={560} s={pop(f, v(43), fps)} bg="#1c2030" size={44}>СИДИТ В УГЛУ</Chip>
      <Facecam x={830} y={960} r={140} mood="worried" sweat look={-0.7} ring={CT} />
      {f >= v(46) && <Big x={330} y={960} s={pop(f, v(46), fps)} size={52} color={GREEN}>СМЕРТЕЙ: 0</Big>}
      {f >= v(48) && <Big x={330} y={1030} s={pop(f, v(48), fps)} size={40} color="#9aa4c0">совсем</Big>}
    </>
  );
};

const Score: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const sc = 1040 / 960;
  const hl = f >= v(50) ? 0.5 + 0.5 * Math.sin((f - v(50)) / 4) : 0;
  const cell = (x: number, t: string, c = '#fff') => (
    <div style={{position: 'absolute', left: x * sc, top: 134 * sc, transform: 'translate(-50%, -50%)', fontFamily: 'Montserrat', fontWeight: 600, fontSize: 17 * sc, color: c}}>{t}</div>
  );
  return (
    <>
      <Bg />
      <div style={{position: 'absolute', left: 20, top: 220, width: 1040, height: 600 * sc, borderRadius: 14, overflow: 'hidden', boxShadow: '0 30px 60px rgba(0,0,0,0.6)', transform: `scale(${pop(f, S.score + 2, fps) * 0.1 + 0.9})`}}>
        <Img src={img('death1k/tab.png')} style={{width: 1040, height: 600 * sc}} />
        <div style={{position: 'absolute', left: 230 * sc, top: 134 * sc, transform: 'translateY(-50%)', fontFamily: 'Montserrat', fontWeight: 600, fontSize: 17 * sc, color: '#fff'}}>Лёха</div>
        {cell(653, '0')}{cell(703, '0')}{cell(753, '0.00', f >= v(50) ? RED : '#fff')}{cell(804, '0')}{cell(854, '0')}
        <div style={{position: 'absolute', left: 110 * sc, top: 122 * sc, width: 775 * sc, height: 25 * sc, border: `3px solid rgba(255,210,63,${hl})`, borderRadius: 4}} />
      </div>
      <div style={{position: 'absolute', left: 540, top: 1010, transform: 'translate(-50%, -50%)', display: 'flex', gap: 24}}>
        <div style={{transform: `scale(${pop(f, v(50), fps)})`}}><Chip x={0} y={0} s={1} bg="#1c2030" size={44}>УБИЙСТВ: <span style={{color: GOLD}}>0</span></Chip></div>
        <div style={{transform: `scale(${pop(f, v(52), fps)})`, marginLeft: 330}}><Chip x={0} y={0} s={1} bg="#1c2030" size={44}>СМЕРТЕЙ: <span style={{color: GOLD}}>0</span></Chip></div>
      </div>
    </>
  );
};

const Kick: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const msgs: [number, string, string][] = [[v(56), 'Санёк', 'ты где вообще?'], [v(57) + 6, 'Димон', 'он афк?'], [v(58) + 8, 'kirill', 'кикаем']];
  const vote = pop(f, v(59) - 2, fps);
  const yes = Math.min(4, Math.floor(ramp(f, v(59), v(60) + 6) * 4));
  const kicked = f >= v(60) + 8;
  return (
    <>
      <Bg glow="#5a2a1a" />
      <div style={{position: 'absolute', left: 60, top: 220, width: 960, display: 'flex', flexDirection: 'column', gap: 10}}>
        {msgs.map(([at, n, t], i) => f >= at && (
          <div key={i} style={{background: 'rgba(6,8,14,0.82)', borderRadius: 14, padding: '12px 22px', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 40, borderLeft: `8px solid ${CT}`, opacity: Math.min(1, (f - at) / 5)}}>
            <span style={{color: '#9fb3c8'}}>(Команда) </span><span style={{color: CT}}>{n}: </span><span style={{color: '#fff'}}>{t}</span>
          </div>
        ))}
      </div>
      {vote > 0 && (
        <div style={{position: 'absolute', left: 540, top: 760, width: 820, transform: `translate(-50%, -50%) scale(${vote})`, background: 'rgba(16,20,28,0.96)', border: '4px solid #3a4a62', borderRadius: 16,
          padding: 30, boxSizing: 'border-box', fontFamily: 'Montserrat'}}>
          <div style={{fontSize: 30, fontWeight: 900, color: '#9fb3c8'}}>ГОЛОСОВАНИЕ</div>
          <div style={{fontSize: 44, fontWeight: 900, color: '#fff', marginTop: 8}}>Выгнать игрока <span style={{color: GOLD}}>Лёха</span>?</div>
          <div style={{display: 'flex', gap: 20, marginTop: 22}}>
            <div style={{flex: 1, background: '#2a6b33', borderRadius: 10, padding: '14px 20px', fontSize: 36, fontWeight: 900, color: '#fff'}}>F1 ДА · {yes}</div>
            <div style={{flex: 1, background: '#3a2a2a', borderRadius: 10, padding: '14px 20px', fontSize: 36, fontWeight: 900, color: '#c9a7ab'}}>F2 НЕТ · 0</div>
          </div>
          {kicked && <div style={{marginTop: 20, fontSize: 40, fontWeight: 900, color: RED}}>ИГРОК ВЫГНАН</div>}
        </div>
      )}
    </>
  );
};

const M3: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const fears: [number, string][] = [[v(65), 'СТРЕЛЯТЬ'], [v(67), 'ДВИГАТЬСЯ'], [v(69), 'ПОМОЧЬ']];
  const lost = pop(f, v(70), fps, 220, 14);
  return (
    <>
      <Portrait f={f} bg="basement" mood="worried" sweat look={-0.4} scale={1.3} y={1060} redness={0.2} />
      <AbsoluteFill style={{height: H, background: 'linear-gradient(rgba(7,9,15,0.85), rgba(7,9,15,0.15) 75%)'}} />
      <Chip x={540} y={150} s={pop(f, S.m3 + 2, fps)} bg="#1c2030" size={40}>КАТКА 3</Chip>
      {fears.map(([at, t], i) => (
        <div key={t} style={{position: 'absolute', left: 540, top: 290 + i * 110, transform: `translate(-50%, -50%) scale(${pop(f, at, fps)})`, display: 'flex', alignItems: 'center', gap: 16,
          fontFamily: 'Montserrat', fontWeight: 900, fontSize: 52, color: '#fff', whiteSpace: 'nowrap'}}>
          БОИТСЯ {t} <span style={{color: RED}}>✕</span>
        </div>
      ))}
      {lost > 0 && (
        <div style={{position: 'absolute', left: 540, top: 720, width: 900, height: 292, transform: `translate(-50%, -50%) scale(${0.6 + 0.4 * lost}) rotate(${(1 - lost) * 5}deg)`, opacity: Math.min(1, lost * 2),
          borderRadius: 20, overflow: 'hidden', border: `4px solid ${RED}`, boxShadow: '0 30px 60px rgba(0,0,0,0.6)'}}>
          <Img src={img('brain10/defeat.png')} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
        </div>
      )}
    </>
  );
};

const Lesson: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <>
      <Cam s={interpolate(f, [S.lesson, S.rule], [1.05, 1.15], clamp)} y={800}>
        <Portrait f={f} bg="dorm" mood="neutral" look={0.3} scale={1.35} y={1040} light="#6a8cff" lightAmt={0.1} />
      </Cam>
      <div style={{position: 'absolute', left: 540, top: 330, transform: `translate(-50%, -50%) scale(${pop(f, v(74), fps)})`, textAlign: 'center', background: 'rgba(10,11,16,0.85)', padding: '26px 40px', borderRadius: 28}}>
        <div style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 58, color: '#fff'}}>БОИШЬСЯ УМЕРЕТЬ</div>
        <div style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 70, color: '#9aa4c0', margin: '6px 0'}}>=</div>
        <div style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 64, color: GOLD, opacity: Math.min(1, pop(f, v(79), fps) * 2)}}>НЕ ИГРАЕШЬ</div>
      </div>
    </>
  );
};

const Rule: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <>
      <Cam s={interpolate(f, [S.rule, S.rush], [1.0, 1.1], clamp)} y={800}>
        <Portrait f={f} bg="dorm" mood={f >= v(89) ? 'happy' : 'neutral'} scale={1.35} y={1040} light={SBER} lightAmt={f >= v(84) ? 0.1 : 0} />
      </Cam>
      <BankPush y={300} a={pop(f, v(84), fps)} text="Новое правило" sub="За каждое убийство: +1 000 ₽" plus />
      {f >= v(90) && <Big x={540} y={520} s={pop(f, v(90), fps, 300, 9)} size={120} color={GREEN}>+1 000 ₽</Big>}
    </>
  );
};

const Rush: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = ramp(f, S.rush, S.die);
  return (
    <>
      <Bg glow="#1a4a2a" />
      <div style={{position: 'absolute', left: 0, top: 260, width: 1080, height: 600, overflow: 'hidden', borderRadius: 18}}>
        <Img src={img('clutch/game.png')} style={{position: 'absolute', width: 1080 * (1 + p * 0.3), height: 607 * (1 + p * 0.3), left: -p * 160, top: -p * 90, filter: `blur(${p * 3}px)`,
          transform: `translate(${Math.sin(f * 1.8) * 8}px, ${Math.abs(Math.sin(f * 0.9)) * 10}px)`}} />
        <div style={{position: 'absolute', inset: 0, background: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.05) 0 3px, transparent 3px 60px)', opacity: p}} />
      </div>
      <Chip x={540} y={940} s={pop(f, v(96), fps, 300, 10)} bg={GREEN} size={52}>ИДЁТ ПЕРВЫМ</Chip>
    </>
  );
};

const Die: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const kf = pop(f, v(99), fps);
  return (
    <>
      <Bg glow="#5a1a22" />
      <DeathScreen f={f} y={560} zoom={1 + ramp(f, v(99), v(102) + 10) * 0.08} />
      {kf > 0 && (
        <div style={{position: 'absolute', right: 40, top: 180, transform: `scale(${kf})`, transformOrigin: 'right', display: 'flex', alignItems: 'center', gap: 16, background: 'rgba(30,14,14,0.88)',
          border: `3px solid ${RED}`, borderRadius: 10, padding: '8px 20px', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 38}}>
          <span style={{color: T}}>Enemy</span>
          <Img src={img('clutch/m4_w.png')} style={{height: 40}} /><Img src={img('clutch/hs.png')} style={{height: 40}} />
          <span style={{color: CT}}>Лёха</span>
        </div>
      )}
      {f >= v(100) && <Big x={540} y={970} s={pop(f, v(100), fps, 300, 9)} size={90} color={RED}>0:02</Big>}
      <BankPush y={1010} a={pop(f, v(102), fps)} text="Списано 1 000 ₽" sub="CS2 · смерть" />
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
      <div style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 70, color: RED, opacity: a}}>1 СМЕРТЬ = −1 000 ₽</div>
      <div style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 100, color: '#fff', lineHeight: 1.05, marginTop: 30, opacity: Math.min(1, b * 2), transform: `scale(${0.7 + 0.3 * b})`}}>
        А ТЫ БЫ<br /><span style={{color: GOLD, textShadow: `0 0 40px ${GOLD}88`}}>СОГЛАСИЛСЯ?</span>
      </div>
      <div style={{marginTop: 40, background: RED, color: '#fff', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 36, padding: '14px 36px', borderRadius: 50, opacity: c, transform: `scale(${0.6 + 0.4 * c})`}}>ПИШИ В КОММЕНТАРИЯХ</div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- звук (эффекты тише голоса)
type Fx = [number, string, number];
const SFX: Fx[] = [
  [4, 'sfx2/pop.wav', 0.4], [v(4), 'money/boom.wav', 0.45], [v(10), 'sfx2/stamp.wav', 0.45],
  [S.agree, 'money/paper.wav', 0.45], [v(20), 'sfx2/whoosh.wav', 0.25],
  [v(24) - 4, 'tilt/shot.wav', 0.55], [v(24) - 2, 'tilt/hs.wav', 0.4], [v(25), 'tilt/notif.wav', 0.5], [v(27) - 2, 'tilt/shot.wav', 0.55], [v(29), 'tilt/notif.wav', 0.5],
  ...Array.from({length: 7}).map((_, i): Fx => [Math.round(v(31) + (i / 7) * (v(34) - v(31))), 'tilt/notif.wav', 0.3]), [v(35), 'money/boom.wav', 0.55],
  [S.m2, 'sfx2/whoosh.wav', 0.3], [v(43), 'tilt/heart.wav', 0.4], [v(46), 'sfx2/ding.wav', 0.3],
  [S.score, 'sfx2/whip.wav', 0.3], [v(50), 'sfx2/blip.wav', 0.35], [v(52), 'sfx2/blip.wav', 0.35],
  [v(56), 'sfx2/blip.wav', 0.35], [v(57) + 6, 'sfx2/blip.wav', 0.35], [v(58) + 8, 'sfx2/blip.wav', 0.35], [v(59) - 2, 'sfx2/pop.wav', 0.4], [v(60) + 8, 'sfx2/error.wav', 0.5],
  [S.m3, 'sfx2/whoosh.wav', 0.3], [v(65), 'sfx2/error.wav', 0.3], [v(67), 'sfx2/error.wav', 0.3], [v(69), 'sfx2/error.wav', 0.3], [v(70), 'money/boom.wav', 0.5],
  [v(74), 'sfx2/shimmer.wav', 0.3], [v(79), 'sfx2/stamp.wav', 0.45],
  [v(84), 'tilt/notif.wav', 0.5], [v(90), 'money/win.wav', 0.45],
  [S.rush, 'sfx2/riser.wav', 0.35], [v(96), 'sfx2/whoosh.wav', 0.4],
  [v(99) - 2, 'tilt/shot.wav', 0.6], [v(99), 'tilt/hs.wav', 0.5], [v(100), 'sfx2/deflate.wav', 0.45], [v(102), 'tilt/notif.wav', 0.5],
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

export const Death1k: React.FC = () => {
  loadFonts();
  const order: [number, number, React.FC, boolean?][] = [
    [S.hook, S.agree, Hook], [S.agree, S.m1, Agree], [S.m1, S.after, M1, true], [S.after, S.m2, After, true], [S.m2, S.score, M2, true],
    [S.score, S.kick, Score, true], [S.kick, S.m3, Kick], [S.m3, S.lesson, M3, true], [S.lesson, S.rule, Lesson], [S.rule, S.rush, Rule],
    [S.rush, S.die, Rush, true], [S.die, S.end, Die, true],
  ];
  return (
    <AbsoluteFill style={{background: '#07090f'}}>
      {order.map(([from, to, C, cut], i) => <Scene key={i} from={from} to={to} cut={cut}><C /></Scene>)}
      <Flash at={v(24) - 2} len={10} />
      <Flash at={v(27) - 2} len={10} />
      <Flash at={v(35)} len={12} />
      <Flash at={v(99)} len={14} />
      <AbsoluteFill style={{top: H - 220, height: 220, background: 'linear-gradient(rgba(7,9,15,0), #07090f)'}} />
      <Captions cues={CUES} />
      <End />
      <Sound />
    </AbsoluteFill>
  );
};
