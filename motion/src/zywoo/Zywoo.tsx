// TikTok-ролик «Никогда не оставляй ZywOo одного против четверых» (9:16, 60 с). Формат «легенда» по разбору ролика про симпла.
// Рисованная версия без геймплея: верхняя панель 12:12 · 1 v 4, Discord и чат, радар плента сверху (4 жёлтые точки и красная точка
// ZywOo), килфид, первое лицо «остался ты», дефьюз, «Победа спецназа», «gg», «МОНСТР / Часть 2». Игрок — силуэт, без фото и логотипов.
import React from 'react';
import {AbsoluteFill, Audio, Img, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {loadFonts} from '../theme';
import {FPS, fr} from '../tilt/script';
import {VO, TOTAL, CUES, v} from './script';
import {Captions, clamp, pop} from '../tilt/UI';
import {ramp} from '../tilt/Tilt';
import {Scene, Cam, Flash} from '../money/Money';
import {H, RED} from '../money/Props';
import {Voice} from '../clutch/Clutch';
import {CSScreen} from '../tilt/CSScreen';

export const ZYWOO_FRAMES = fr(TOTAL);

const S = {
  hook: 0, score: v(10) - 4, discord: v(23) - 4, mic: v(39) - 4, radar: v(52) - 4, alone: v(82) - 4, defuse: v(92) - 4, gg: v(101) - 4, end: fr(58.6),
};
const GOLD = '#ffd23f', CT = '#5d9cec', T = '#e8b23a', BLUE = '#3a7bff';
const KILLS = [v(68), v(74), v(80)];
const VICTIMS = ['Kirill', 'Dimon', 'Sanya'];

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

// силуэт игрока с AWP, жёлтый контровой свет
const Silhouette: React.FC<{w?: number; glow?: string}> = ({w = 620, glow = GOLD}) => (
  <svg width={w} height={w * 1.1} viewBox="0 0 400 440" style={{overflow: 'visible', filter: `drop-shadow(0 0 22px ${glow}88)`}}>
    <path d="M60 440 L70 300 Q80 230 150 214 L250 214 Q320 230 330 300 L340 440 Z" fill="#07080b" stroke={glow} strokeWidth={4} />
    <circle cx={200} cy={150} r={68} fill="#07080b" stroke={glow} strokeWidth={4} />
    <path d="M128 140 Q130 66 200 64 Q270 66 272 140" fill="none" stroke="#07080b" strokeWidth={20} />
    <path d="M128 140 Q130 66 200 64 Q270 66 272 140" fill="none" stroke={glow} strokeWidth={3} opacity={0.8} />
    <rect x={112} y={128} width={30} height={50} rx={12} fill="#07080b" stroke={glow} strokeWidth={3} />
    <rect x={258} y={128} width={30} height={50} rx={12} fill="#07080b" stroke={glow} strokeWidth={3} />
    {/* AWP */}
    <g transform="translate(0, 50) rotate(-10 200 300)">
      <rect x={20} y={286} width={380} height={18} rx={6} fill="#07080b" stroke={glow} strokeWidth={3} />
      <rect x={210} y={262} width={110} height={20} rx={8} fill="#07080b" stroke={glow} strokeWidth={3} />
      <circle cx={322} cy={272} r={7} fill={glow} />
    </g>
  </svg>
);

// маленькая аватарка (силуэт) для панели
const Ava: React.FC<{c: string; dead?: number; star?: boolean; size?: number}> = ({c, dead = 0, star, size = 96}) => (
  <div style={{width: size, height: size, border: `4px solid ${dead > 0.5 ? '#666' : c}`, background: dead > 0.5 ? '#3a3a3e' : '#1a1d26', position: 'relative', overflow: 'hidden', boxShadow: star && dead < 0.5 ? `0 0 24px ${c}` : 'none'}}>
    <svg width={size} height={size} viewBox="0 0 100 100" style={{opacity: 1 - dead * 0.6}}>
      <circle cx={50} cy={40} r={20} fill={star ? GOLD : '#4a5066'} />
      <path d="M14 100 Q20 66 50 64 Q80 66 86 100 Z" fill={star ? GOLD : '#4a5066'} />
    </svg>
    {dead > 0 && <div style={{position: 'absolute', inset: 0, background: `rgba(40,40,44,${0.6 * dead})`}} />}
  </div>
);

// верхняя панель CS2: 4 T живы, у CT жив один ZywOo
const TopHud: React.FC<{f: number; aliveT: number; y?: number; timer?: string}> = ({f, aliveT, y = 200, timer = '1:24'}) => (
  <div style={{position: 'absolute', left: 540, top: y, transform: 'translateX(-50%)', display: 'flex', alignItems: 'center', gap: 8}}>
    {[0, 1, 2, 3].map((i) => <Ava key={i} c={T} dead={i >= aliveT ? 1 : 0} size={78} />)}
    <div style={{width: 190, height: 100, background: 'rgba(30,34,44,0.95)', borderRadius: 8, margin: '0 6px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'Russo One'}}>
      <div style={{fontSize: 40, color: '#fff'}}>{timer}</div>
      <div style={{fontSize: 30}}><span style={{color: T}}>12</span><span style={{color: '#777'}}> : </span><span style={{color: CT}}>12</span></div>
    </div>
    {[0, 1, 2, 3].map((i) => <Ava key={i} c={CT} dead={1} size={78} />)}
    <Ava c={CT} star size={78} />
    <div style={{position: 'absolute', left: '50%', top: 118, transform: 'translateX(-50%) skewX(-12deg)', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 52, color: '#fff', textShadow: '0 3px 0 #000', whiteSpace: 'nowrap'}}>
      1 v {aliveT}
    </div>
  </div>
);

const AwpIcon: React.FC<{h?: number}> = ({h = 40}) => (
  <svg height={h} width={h * 3.6} viewBox="0 0 180 50"><path d="M2 22 H120 L126 16 H150 L156 22 H178 V30 H150 L140 44 H122 L118 30 H70 L60 40 H40 L44 30 H2 Z" fill="#fff" /><rect x={84} y={8} width={40} height={10} rx={4} fill="#fff" /></svg>
);
const KillRow: React.FC<{victim: string; awp?: boolean; a: number}> = ({victim, awp, a}) => (
  <div style={{display: 'flex', alignItems: 'center', gap: 14, background: 'rgba(14,18,30,0.88)', border: `3px solid ${a > 0 ? '#c8c8c8' : 'transparent'}`, borderRadius: 10, padding: '8px 18px',
    fontFamily: 'Montserrat', fontWeight: 900, fontSize: 34, opacity: Math.min(1, a * 3), transform: `translateX(${(1 - Math.min(1, a * 2)) * 60}px)`}}>
    <span style={{color: CT}}>ZywOo</span>
    {awp ? <AwpIcon h={30} /> : <Img src={staticFile('clutch/m4_w.png')} style={{height: 36}} />}
    <Img src={staticFile('clutch/hs.png')} style={{height: 34}} />
    <span style={{color: T}}>{victim}</span>
  </div>
);

// радар плента сверху
const DOTS: [number, number][] = [[360, 330], [600, 250], [470, 520], [690, 470]];
const Radar: React.FC<{f: number; zoom?: number; youGlow?: number; youDead?: number; defuse?: number}> = ({f, zoom = 1, youGlow = 0, youDead = 0, defuse = 0}) => {
  // путь красной точки: справа к первому, потом с другой стороны ко второму, издалека — третий, потом к бомбе
  const path: [number, number, number][] = [[v(65), 980, 380], [KILLS[0] - 2, 820, 330], [KILLS[1] - 8, 140, 200], [KILLS[1], 230, 230], [KILLS[2], 900, 640], [v(92), 560, 400], [v(96), 520, 400]];
  let zx = 980, zy = 380;
  for (let i = 0; i < path.length - 1; i++) {
    const [t0, x0, y0] = path[i], [t1, x1, y1] = path[i + 1];
    if (f >= t0) { const p = Math.min(1, (f - t0) / Math.max(1, t1 - t0)); zx = x0 + (x1 - x0) * p; zy = y0 + (y1 - y0) * p; }
  }
  const zVisible = f >= v(65) - 2;
  const deadAt = [KILLS[0], KILLS[1], KILLS[2], v(96)];
  return (
    <div style={{position: 'absolute', left: 540, top: 600, width: 1000, height: 760, transform: `translate(-50%, -50%) scale(${zoom})`, background: '#141823', border: '5px solid #2c3350', borderRadius: 24, overflow: 'hidden'}}>
      <svg width={1000} height={760}>
        {/* стены и проходы */}
        <rect x={60} y={60} width={880} height={640} fill="#1e2433" stroke="#3a4466" strokeWidth={6} />
        <rect x={250} y={170} width={560} height={420} fill="#2a3246" stroke="#4a5577" strokeWidth={4} />
        <rect x={0} y={330} width={70} height={110} fill="#1e2433" /><rect x={930} y={330} width={70} height={110} fill="#1e2433" />
        <rect x={120} y={0} width={110} height={70} fill="#1e2433" /><rect x={760} y={690} width={140} height={70} fill="#1e2433" />
        {[[300, 210, 90, 90], [700, 220, 70, 70], [560, 470, 110, 70], [330, 450, 70, 100]].map(([x, y, w, h], i) => <rect key={i} x={x} y={y} width={w} height={h} fill="#3a4258" stroke="#556089" strokeWidth={3} />)}
        <text x={530} y={420} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={150} fill="#ffffff" opacity={0.06}>B</text>
        {/* бомба */}
        {f >= v(56) && (
          <g transform="translate(520, 400)">
            <circle r={26 + (f % 30 < 15 ? 8 : 0)} fill="rgba(255,59,71,0.2)" />
            <rect x={-18} y={-12} width={36} height={24} rx={4} fill={RED} stroke="#fff" strokeWidth={3} />
            {defuse > 0 && <circle r={54} fill="none" stroke={CT} strokeWidth={10} strokeDasharray={`${339 * defuse} 400`} transform="rotate(-90)" />}
          </g>
        )}
        {/* ваши точки */}
        {DOTS.map(([x, y], i) => {
          const dead = f >= deadAt[i];
          const you = i === 3;
          return (
            <g key={i} transform={`translate(${x}, ${y})`}>
              {you && youGlow > 0 && !dead && <circle r={40 + Math.sin(f / 4) * 6} fill="none" stroke={GOLD} strokeWidth={4} opacity={youGlow} />}
              {dead ? <path d="M-16 -16 L16 16 M16 -16 L-16 16" stroke="#888" strokeWidth={8} strokeLinecap="round" /> : <circle r={18} fill={T} stroke="#fff" strokeWidth={4} />}
              {you && !dead && youGlow > 0 && <text y={-36} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={30} fill={GOLD}>ТЫ</text>}
            </g>
          );
        })}
        {/* шаги */}
        {f >= v(65) && f < KILLS[0] && [0, 1, 2].map((k) => {
          const p = ((f - v(65) + k * 10) % 30) / 30;
          return <circle key={k} cx={960} cy={385} r={20 + p * 90} fill="none" stroke={RED} strokeWidth={4} opacity={(1 - p) * 0.7} />;
        })}
        {/* ZywOo */}
        {zVisible && (
          <g transform={`translate(${zx}, ${zy})`}>
            <circle r={34 + Math.sin(f / 3) * 4} fill="rgba(255,40,60,0.25)" />
            <circle r={20} fill={RED} stroke="#fff" strokeWidth={4} />
          </g>
        )}
        {youDead > 0 && <rect width={1000} height={760} fill="#000" opacity={youDead * 0.4} />}
      </svg>
    </div>
  );
};

// ---------------------------------------------------------------- сцены
const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const never = f >= v(1);
  const shake = never && f < v(1) + 10 ? 1 - (f - v(1)) / 10 : f >= v(3) && f < v(3) + 10 ? 1 - (f - v(3)) / 10 : 0;
  return (
    <>
      <AbsoluteFill style={{height: H, background: 'radial-gradient(ellipse at 50% 55%, #5a0d14, #07080b 70%)'}} />
      <Cam s={interpolate(f, [0, S.score], [1.0, 1.15], clamp)} y={760} shake={shake}>
        <div style={{position: 'absolute', left: 540, top: 760, transform: 'translate(-50%, -50%)'}}><Silhouette w={640} /></div>
      </Cam>
      <Big x={540} y={190} s={pop(f, 2, fps)} size={64} color="#fff">ЗАПОМНИ</Big>
      {never && <Big x={540} y={320} s={pop(f, v(1), fps, 320, 9)} size={150} color={RED}>НИКОГДА</Big>}
      {f >= v(6) && <Chip x={540} y={470} s={pop(f, v(6), fps)} bg={GOLD} color="#111" size={46}>ZywOo</Chip>}
      {f >= v(8) && <Chip x={540} y={1080} s={pop(f, v(8), fps, 300, 10)} bg={RED} size={46}>1 ПРОТИВ 4</Chip>}
    </>
  );
};

const Score: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <>
      <Bg glow="#3a2a1a" />
      <TopHud f={f} aliveT={4} y={220} />
      <Chip x={540} y={520} s={pop(f, v(13), fps)} bg="#1c2030" size={48}>РЕШАЮЩИЙ РАУНД</Chip>
      {f >= v(15) && (
        <div style={{position: 'absolute', left: 300, top: 820, transform: `translate(-50%, -50%) scale(${pop(f, v(15), fps)})`, textAlign: 'center'}}>
          <div style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 40, color: CT}}>У НИХ</div>
          <div style={{display: 'flex', justifyContent: 'center', margin: '14px 0'}}><Ava c={CT} star size={150} /></div>
          <div style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 56, color: '#fff'}}>1</div>
        </div>
      )}
      {f >= v(20) && (
        <div style={{position: 'absolute', left: 780, top: 820, transform: `translate(-50%, -50%) scale(${pop(f, v(20), fps)})`, textAlign: 'center'}}>
          <div style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 40, color: T}}>У ВАС</div>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 76px)', gap: 8, justifyContent: 'center', margin: '14px 0'}}>{[0, 1, 2, 3].map((i) => <Ava key={i} c={T} size={76} />)}</div>
          <div style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 56, color: '#fff'}}>4</div>
        </div>
      )}
    </>
  );
};

const Discord: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const lines: [number, string, string, string][] = [[v(27), '(Команда) Санёк', 'изи, раунд наш', T], [v(36), '[ВСЕ] Kirill', 'один остался, гг', T]];
  return (
    <>
      <Bg glow="#2a3a6a" />
      <Voice f={f} mute={0} loud={1.7} y={180} />
      {[0, 1, 2].map((i) => f >= v(27) && (
        <div key={i} style={{position: 'absolute', left: 200 + i * 300, top: 600 - ((f - v(27) + i * 12) % 40) * 3, opacity: 1 - ((f - v(27) + i * 12) % 40) / 40, fontFamily: 'Montserrat', fontWeight: 900, fontSize: 54, color: GOLD}}>ХА-ХА</div>
      ))}
      <div style={{position: 'absolute', left: 60, top: 760, width: 960, display: 'flex', flexDirection: 'column', gap: 12}}>
        {lines.map(([at, n, t, c], i) => f >= at && (
          <div key={i} style={{background: 'rgba(6,8,14,0.85)', borderRadius: 14, padding: '14px 24px', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 40, borderLeft: `8px solid ${c}`,
            opacity: Math.min(1, (f - at) / 5), transform: `translateX(${(1 - Math.min(1, (f - at) / 6)) * -40}px)`}}>
            <span style={{color: c}}>{n}: </span><span style={{color: '#fff'}}>{t.slice(0, Math.ceil(Math.min(1, (f - at) / 14) * t.length))}</span>
          </div>
        ))}
      </div>
      {f >= v(30) && f < v(36) && <Chip x={540} y={700} s={pop(f, v(30), fps)} bg="#1c2030" size={36}>кто-то пишет в общий чат…</Chip>}
    </>
  );
};

const Mic: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const off = ramp(f, v(44), v(44) + 8);
  const mute = ramp(f, v(48), v(51) + 6);
  const showVoice = f >= v(48) - 4;
  return (
    <>
      <Bg glow={off > 0.5 ? '#1a2a6a' : '#3a2a1a'} />
      {!showVoice && (
        <div style={{position: 'absolute', left: 540, top: 560, transform: `translate(-50%, -50%) scale(${pop(f, S.mic + 2, fps) * (1 + off * 0.05)})`, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 30}}>
          <div style={{position: 'relative'}}>
            <Ava c={CT} star size={300} />
            <div style={{position: 'absolute', right: -50, bottom: -50, width: 150, height: 150, borderRadius: 75, background: off > 0.5 ? RED : '#23a55a', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '6px solid #0b0c12'}}>
              <svg width={84} height={84} viewBox="0 0 24 24"><path d="M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3zM5 11a7 7 0 0 0 14 0M12 18v3" stroke="#fff" strokeWidth={2.4} fill="none" strokeLinecap="round" />
                {off > 0 && <path d="M3 3l18 18" stroke="#fff" strokeWidth={2.6} strokeLinecap="round" strokeDasharray={26} strokeDashoffset={26 * (1 - off)} />}</svg>
            </div>
          </div>
          <div style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 60, color: '#fff'}}>ZywOo</div>
          {off > 0 && <div style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 44, color: RED, opacity: off}}>ВЫКЛЮЧИЛ ЗВУК</div>}
        </div>
      )}
      {showVoice && <Voice f={f} mute={mute} y={260} />}
      {showVoice && mute > 0.5 && <Big x={540} y={820} s={pop(f, v(51), fps, 300, 10)} size={110} color="#9fb3ee">ТИШИНА</Big>}
      <AbsoluteFill style={{height: H, background: `rgba(30,60,160,${0.18 * off})`, mixBlendMode: 'screen'}} />
    </>
  );
};

const RadarScene: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = Math.max(0, 30 - Math.floor((f - v(58)) / FPS));
  const aliveT = 4 - KILLS.filter((k) => f >= k).length;
  return (
    <>
      <Bg glow="#1a2a5a" />
      <TopHud f={f} aliveT={aliveT} y={60} timer={f >= v(58) ? `0:${String(t).padStart(2, '0')}` : '0:40'} />
      <Radar f={f} youGlow={f >= v(80) ? 1 : 0} />
      <div style={{position: 'absolute', right: 40, top: 270, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10}}>
        {KILLS.map((k, i) => (f >= k ? <KillRow key={i} victim={VICTIMS[i]} awp={i === 2} a={(f - k) / 8} /> : null))}
      </div>
      {f >= v(56) && f < v(65) && <Chip x={540} y={1060} s={pop(f, v(56), fps)} bg={RED} size={44}>БОМБА СТОИТ · 0:30</Chip>}
      {f >= v(65) && f < KILLS[0] && <Chip x={540} y={1060} s={pop(f, v(65), fps, 300, 10)} bg="#1c2030" size={44}>ШАГИ…</Chip>}
      {KILLS.map((k, i) => (f >= k && f < k + 24 ? <Big key={i} x={540} y={1060} s={pop(f, k, fps, 300, 9)} size={80} color={RED}>−{i + 1}</Big> : null))}
      <AbsoluteFill style={{height: H, background: 'rgba(30,60,160,0.12)', mixBlendMode: 'screen'}} />
    </>
  );
};

const Alone: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const breath = 0.5 + 0.5 * Math.sin((f - S.alone) / 14);
  return (
    <>
      <AbsoluteFill style={{height: H, background: '#07080b'}} />
      <div style={{position: 'absolute', left: 30, top: 240, width: 1020, height: 574, border: '8px solid #2a2d36', borderRadius: 22, overflow: 'hidden', transform: `scale(${1 + breath * 0.015})`}}>
        <svg width={1004} height={558} viewBox="0 0 1600 900"><CSScreen mode="game" game={{bob: f * 0.5, peek: 0, enemy: 0, score: [12, 12], timer: '0:14'}} tint={0.9} /></svg>
        <div style={{position: 'absolute', inset: 0, background: `radial-gradient(circle at 50% 50%, transparent 35%, rgba(60,0,0,${0.6 + breath * 0.2}))`}} />
      </div>
      <Chip x={540} y={170} s={pop(f, v(82), fps)} bg={RED} size={48}>ОСТАЛСЯ ТЫ</Chip>
      {f >= v(84) && <Big x={540} y={900} s={pop(f, v(84), fps, 300, 10)} size={120} color="#fff">1 v 1</Big>}
      {f >= v(87) && (
        <svg width={1080} height={200} style={{position: 'absolute', left: 0, top: 960}}>
          <ellipse cx={540} cy={100} rx={120 + breath * 80} ry={30 + breath * 20} fill="#cfd8ff" opacity={0.12 + breath * 0.15} />
        </svg>
      )}
    </>
  );
};

const Defuse: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const dp = ramp(f, v(92), v(96));
  const cnt = f < v(93) ? '' : f < v(95) ? '5' : f < v(96) ? '4' : '';
  const win = pop(f, v(99), fps, 220, 14);
  return (
    <>
      <Bg glow={f >= v(99) ? '#1a3a8a' : '#5a1a22'} />
      <Radar f={f} zoom={1 + ramp(f, v(92), v(96)) * 0.25} defuse={dp} youGlow={f < v(96) ? 1 : 0} youDead={f >= v(96) ? 1 : 0} />
      {cnt && <Big x={540} y={600} s={pop(f, cnt === '5' ? v(93) : v(95), fps, 300, 9)} size={240} color={CT}>{cnt}</Big>}
      {f >= v(92) && f < v(96) && <Chip x={540} y={170} s={pop(f, v(92), fps)} bg={CT} size={46}>ДЕФЬЮЗ</Chip>}
      {win > 0 && (
        <div style={{position: 'absolute', left: 540, top: 600, transform: `translate(-50%, -50%) scale(${0.8 + 0.2 * win})`, opacity: Math.min(1, win * 2), width: 1080, padding: '30px 0',
          background: 'linear-gradient(90deg, transparent, rgba(30,70,170,0.92) 20%, rgba(30,70,170,0.92) 80%, transparent)', textAlign: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 84, color: '#fff', letterSpacing: 4}}>
          ПОБЕДА СПЕЦНАЗА
        </div>
      )}
    </>
  );
};

const Gg: React.FC = () => {
  const f = useCurrentFrame();
  const a = Math.min(1, Math.max(0, (f - v(109)) / 6));
  return (
    <>
      <AbsoluteFill style={{height: H, background: '#000'}} />
      <div style={{position: 'absolute', left: 60, top: 560, width: 960, background: 'rgba(14,16,22,0.9)', border: '3px solid #2c3350', borderRadius: 16, padding: '24px 30px', boxSizing: 'border-box', fontFamily: 'Montserrat', fontWeight: 900}}>
        <div style={{fontSize: 30, color: '#6c7590', marginBottom: 12}}>ОБЩИЙ ЧАТ</div>
        <div style={{fontSize: 52, opacity: a}}><span style={{color: '#9fb3c8'}}>[ВСЕ] </span><span style={{color: CT}}>ZywOo: </span><span style={{color: '#fff'}}>gg</span></div>
        {a === 0 && <div style={{fontSize: 52, color: '#fff', opacity: f % 30 < 15 ? 0.8 : 0}}>|</div>}
      </div>
    </>
  );
};

const End: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (f < S.end) return null;
  const m = pop(f, S.end, fps, 320, 9), p = pop(f, S.end + 10, fps);
  return (
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, #6a0d16, #07080b 70%)', alignItems: 'center', justifyContent: 'center', paddingBottom: 260, textAlign: 'center'}}>
      <div style={{position: 'absolute', left: 540, top: 900, transform: 'translate(-50%, -50%)', opacity: 0.35}}><Silhouette w={520} glow={RED} /></div>
      <div style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 30, color: '#fff', background: RED, padding: '6px 18px', borderRadius: 8, opacity: p, letterSpacing: 3}}>ЧАСТЬ 2</div>
      <div style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 70, color: '#fff', marginTop: 16, opacity: p, lineHeight: 1.05}}>ОН ВКЛЮЧИЛ<br />МИКРОФОН</div>
      <div style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 130, color: RED, transform: `scale(${0.6 + 0.4 * m})`, opacity: Math.min(1, m * 2), textShadow: `0 0 50px ${RED}`, marginTop: 10}}>МОНСТР</div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- звук (эффекты тише голоса; после «выключил звук» фон почти исчезает)
type Fx = [number, string, number];
const SFX: Fx[] = [
  [0, 'money/boom.wav', 0.45], [v(1), 'sfx2/impact.wav', 0.5], [v(3), 'sfx2/impact.wav', 0.5], [v(6), 'sfx2/pop.wav', 0.35], [v(8), 'sfx2/stamp.wav', 0.45],
  [S.score, 'sfx2/whoosh.wav', 0.3], [v(13), 'sfx2/stamp.wav', 0.4], [v(15), 'sfx2/pop.wav', 0.35], [v(20), 'sfx2/pop.wav', 0.35],
  [v(27), 'sfx2/blip.wav', 0.35], [v(36), 'sfx2/blip.wav', 0.35], [v(38), 'sfx2/blip.wav', 0.3],
  [v(44), 'sfx2/deflate.wav', 0.5], [v(44) + 4, 'money/boom.wav', 0.4], [v(51), 'tilt/heart.wav', 0.35],
  [v(56), 'sfx2/stamp.wav', 0.4], ...Array.from({length: 16}).map((_, i): Fx => [v(58) + i * 30, 'sfx2/tick.wav', 0.45]),
  ...Array.from({length: 6}).map((_, i): Fx => [v(65) + i * 6, 'sfx2/tick.wav', 0.3]),
  ...KILLS.flatMap((k, i): Fx[] => [[k - 2, 'tilt/shot.wav', i === 2 ? 0.7 : 0.55], [k, 'tilt/hs.wav', 0.45]]),
  ...Array.from({length: 6}).map((_, i): Fx => [v(82) + i * 18, 'tilt/heart.wav', 0.5]),
  [v(92), 'sfx2/riser.wav', 0.35], ...Array.from({length: 10}).map((_, i): Fx => [v(92) + i * 9, 'sfx2/tick.wav', 0.5]), [v(96), 'sfx2/deflate.wav', 0.4],
  [v(99), 'money/win.wav', 0.45], [v(109), 'sfx2/blip.wav', 0.45],
  [S.end, 'money/boom.wav', 0.6], [S.end, 'sfx2/impact.wav', 0.5],
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
        <Audio src={staticFile('tilt/pad.wav')} volume={(x) => {
          const g = i * 11.5 * FPS + x;
          return g >= v(44) && g < v(82) ? 0.03 : 0.11;
        }} />
      </Sequence>
    ))}
    {SFX.map(([at, src, vol], i) => (
      <Sequence key={i} from={Math.max(0, at)} durationInFrames={FPS * 2}>
        <Audio src={staticFile(src)} volume={vol * GAIN} />
      </Sequence>
    ))}
  </>
);

export const Zywoo: React.FC = () => {
  loadFonts();
  const order: [number, number, React.FC, boolean?][] = [
    [S.hook, S.score, Hook], [S.score, S.discord, Score, true], [S.discord, S.mic, Discord, true], [S.mic, S.radar, Mic],
    [S.radar, S.alone, RadarScene], [S.alone, S.defuse, Alone, true], [S.defuse, S.gg, Defuse, true], [S.gg, S.end, Gg, true],
  ];
  return (
    <AbsoluteFill style={{background: '#07090f'}}>
      {order.map(([from, to, C, cut], i) => <Scene key={i} from={from} to={to} cut={cut}><C /></Scene>)}
      <Flash at={v(1)} len={10} />
      {KILLS.map((k, i) => <Flash key={i} at={k} len={8} color="rgba(255,255,255,0.3)" />)}
      <Flash at={v(82)} len={14} />
      <Flash at={v(99)} len={14} color="rgba(60,120,255,0.45)" />
      <AbsoluteFill style={{top: H - 220, height: 220, background: 'linear-gradient(rgba(7,9,15,0), #07090f)'}} />
      <Captions cues={CUES} />
      <End />
      <Sound />
    </AbsoluteFill>
  );
};
